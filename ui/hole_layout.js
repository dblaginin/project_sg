var parterms = {3: {1:"Ace",2:"Birdie",3:"Par",4:"Bogey",5:"Double Bogey+",6:"Triple Bogey",7:"Quad"},
                4: {1:"Albatross",2:"Eagle",3:"Birdie",4:"Par",5:"Bogey",6:"Double Bogey",7:"Triple Bogey",8:"Quad"},
                5: {1:"Impossible",2:"Albatross",3:"Eagle",4:"Birdie",5:"Par",6:"Bogey",7:"Double Bogey",8:"Triple Bogey",9:"Quad"}}
            
var parcolors = {3: {1:"#ff0066",2:"#ff0066",3:"#666699",4:"#3333ff",5:"#000000",6:"#000000"},
                4: {1:"Albatross",2:"#ff0066",3:"#ff0066",4:"#666699",5:"#3333ff",6:"#000000",7:"#000000"},
                5: {1:"Impossible",2:"#ff0066",3:"#ff0066",4:"#ff0066",5:"#666699",6:"#3333ff",7:"#000000",8:"#000000",9:"#000000"}}

var xtee = {1:555,2:175,3:620,4:400,5:630,6:85,7:565,8:90,9:90,10:565,11:610,12:420,13:600,14:75,15:75,16:145,17:125,18:340}
var ytee = {1:650,2:75,3:375,4:610,5:125,6:240,7:540,8:190,9:340,10:100,11:450,12:100,13:530,14:125,15:400,16:460,17:450,18:660}
var xflag = {1:220,2:550,3:120,4:300,5:150,6:665,7:200,8:600,9:640,10:175,11:115,12:210,13:125,14:575,15:615,16:535,17:600,18:360}
var yflag = {1:100,2:565,3:300,4:150,5:575,6:425,7:175,8:450,9:325,10:575,11:250,12:540,13:175,14:540,15:320,16:335,17:325,18:70}

var xdomain = {1:[11300,11800],2:[11000,11625],3:[9800,11500],4:[9550,9750],5:[8500,9700],6:[8100,9300],
               7:[9050,9600],8:[9100,10200],9:[9600,11550],10:[11125,12125],11:[9800,10800],12:[9200,9450],
               13:[7900,9000],14:[7150,8650],15:[8300,10325],16:[10300,10825],17:[10200,11850],18:[11800,12800]}
            
var ydomain = {1:[9800,11100],2:[10000,11200],3:[10200,10700],4:[10600,11025],5:[10550,11300],6:[9950,10500],
               7:[10200,10550],8:[9950,10950],9:[9875,9950],10:[8900,9600],11:[9100,9850],12:[9365,9750],
               13:[9600,10700],14:[9450,10420],15:[8900,9300],16:[8700,8900],17:[8400,8750],18:[8300,9700]}

function updateHoleShots(hole_data, holenum, roundnum, playerNumber="All") {
    var data = hole_data.filter(function(row) { return row[" Hole"] == holenum && row[" Round"] == roundnum && (playerNumber == "All" || row[" Player #"] == playerNumber); });
    var par = (data == null || data.length == 0) ? 0 : data[0][" Par Value"];
    
    var width = 750,
        height = 750,
        padding = 75;

    // create svg element, add hole image, create teebox and flag locations
    d3.select("svg.shots").remove();
    var svg = d3.select("#hole_shots")
            .append("svg")
            .attr("class","shots")
            .attr("width", width)
            .attr("height", height);
            
    var g = svg.append("g");

    var img = g.append("svg:image")
        .attr("xlink:href", "holes/Hole_"+holenum+".png")
        .attr("width", width-padding)
        .attr("height", height-padding)
        .attr("x", padding/2)
        .attr("y",padding/2);

    var flagsize = 150,
        sticklen = 40;
                
    var tee = svg.append("rect")
        .attr("class","rect")
        .attr("x",xtee[holenum])
        .attr("y",ytee[holenum])
        .attr("width",40)
        .attr("height", 25)
        .attr("rx",10)
        .attr("ry",10)
        .style("fill","#ffa500")
        .style("stroke","black")
        .style("stroke-width","3px");
        
    // Create the x, y scales. 
    // Domain comes from the shot-level data, (x,y) = (0,0) is always the flag location
    // Domain for teebox (x,y) must be deduced from the shot-level data
    // Range is set by the variables above (xtee,ytee) and (xflag,yflag)
    var xscale = d3.scale.linear()
    var yscale = d3.scale.linear()
    

    if (xflag[holenum] < xtee[holenum]) xscale.domain(xdomain[holenum]).range([xflag[holenum],xtee[holenum]]);
    else xscale.domain(xdomain[holenum]).range([xtee[holenum],xflag[holenum]]);
    
    if (yflag[holenum] > ytee[holenum]) yscale.domain(ydomain[holenum]).range([yflag[holenum],ytee[holenum]]);
    else yscale.domain(ydomain[holenum]).range([ytee[holenum],yflag[holenum]]);

    if (holenum==18) {
        xscale.domain(xdomain[holenum]).range([150,600]);
        yscale.domain(ydomain[holenum]).range([600,100]);
    }
    if (data == null || data.length == 0) return;
    
    // create the hole score color scale: eagle, birdie, par, bogey, etc.
    var scores = d3.map(data,function(d){return +d[" Hole Score"]}).keys();
    scores = scores.map(function(d){return parseInt(d,10)});
    var uniquescores = scores.length
    
    var scorecolors = ['#ff0066','#666699','#3333ff ','#000000 ','#000000 ','#000000 ','#000000 ']
    var colors = scorecolors.slice(0,uniquescores)
    var scorescale = d3.scale.quantile().domain(d3.extent(scores)).range(colors);
        
    var shots = d3.map(data,function(d){return +d["  Shot"]}).keys();
    shots = shots.map(function(d){return parseInt(d,10)});	

    shots.reverse().forEach(function(d) { drawshots(d); });

    function drawshots(shot) {
        var shotdrawing = svg.selectAll("shot")
            .data(data)
            .enter()
            .append("circle")
            .filter(function(d){return +d["  Shot"]==shot})
            .attr("cx",function(d){return xscale(+d[" X Coordinate"].replace(',','')) })
            .attr("cy",function(d){return yscale(+d[" Y Coordinate"].replace(',','')) })
            .attr("r", 5)
            .style("stroke",function(d){return scorescale(d[" Hole Score"])})
            //.style("fill", function(d){return scorescale(d[" Hole Score"])})
            .style("fill","none")
            .style("stroke-width", "2px");				
    };
    
    // draw the flagstick after the shots are drawn
    var flag = svg.append("path")
        .attr("transform", function(d) { return "translate(" + xflag[holenum] + "," + yflag[holenum] + ") rotate(90)"; })
        .attr("d", d3.svg.symbol().type("triangle-up").size(flagsize))
        .attr("fill", "red");
        
    var stick = svg.append("line")
        .attr("x1", xflag[holenum]-flagsize/25)
        .attr("y1", yflag[holenum]-5)
        .attr("x2", xflag[holenum]-flagsize/25)
        .attr("y2", yflag[holenum]+sticklen)
        .attr("stroke-width", 3)
        .attr("stroke", "red");	
        
    var shotsbyplayer = d3.nest().key(function(d){return d[" Player #"]})
                        .rollup(function(v){return v.length})
                        .entries(data)
                        
    var holemean = d3.mean(shotsbyplayer,function(d){return d.values}),
        holestd = d3.deviation(shotsbyplayer,function(d){return d.values})
    
    var holescores = [];
        
    data.map(function(d) {
        if (d["  Shot"] == 1) holescores.push(d[" Hole Score"]);
    });
    
    holescores = holescores.map(function(d) { return +d});
    
    // add frequency of each score
    counts = {}
    holescores.forEach(function(d) {
        if (!counts[d])  counts[d]=0;
        counts[d]++;
    })
    
    var barscale = d3.scale.linear().domain([d3.min(Object.values(counts)),d3.max(Object.values(counts))]).range([10,100]);
    var scorefreq = Object.values(counts).map(function(d) {return +d});
    var uniquescores = Object.keys(counts).map(function(d){return +d});
    var bardata = [[],[]];
    
    uniquescores.forEach(function(d,i){
        bardata[i] = [uniquescores[i],scorefreq[i]]})

    var minscore = uniquescores[0]
    var maxscore = uniquescores[uniquescores.length-1]
        
    var scorecolors = Object.values(parcolors[par]).slice(minscore-1,maxscore)
    var scorescale = d3.scale.quantile().domain(d3.extent(uniquescores)).range(scorecolors);

    var scoresbar = svg.selectAll("scoresbar")
        .data(bardata)
        .enter()
        .append("g")
        .attr("class","scoresbar")
    
    scoresbar.append("rect")
    .attr("x", function(d){return width-165-barscale(d[1])})
    .attr("y", function(d,i){return padding/2-7.5+i*17.5})
    .attr("width", function(d){return barscale(d[1])})
    .attr("height", 15)
    .style("fill",function(d){return scorescale(d[0])})

    // add legend
    var legendtext = Object.values(parterms[par]).slice(minscore-1,maxscore)
    
    var legendscores = svg.selectAll("legendscores")
        .data(uniquescores)
        .enter()
        .append("g")
        .attr("class","legendscores")

    legendscores.append("circle")
        .attr("cx",width-2*padding)
        .attr("cy",function(d,i){return padding/2+i*17.5})
        .attr("r",5)
        .style("stroke",function(d){return scorescale(d)})
        .style("fill","white")
        .style("stroke-width", "2px");	

    var legendtext = svg.selectAll("legendtext")
        .data(legendtext)
        .enter()
        .append("g")
        .attr("class","legendtext")

    legendtext.append("text")
        .attr("x", width-2*padding+10)
        .attr("y", function(d,i){return padding/2+i*17.5})
        .text(function(d){return d})
        .attr("text-anchor", "start")
        .style("dominant-baseline","middle")
        .style("font-size","14px")
}