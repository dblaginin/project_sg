class Player {
    constructor(number, name) {
        this.number = number;
        this.name = name;
        this.score = 0;
        this.round = 0;
        this.hole = 0;
        this.rounds = [{'score':0, 'par':0}, {'score':0, 'par':0}, {'score':0, 'par':0}, {'score':0, 'par':0}];
        this.holes = [];
        this.projection;
        this.currentProjection;

        this.rating = 18;
        this.age = 47;
        this.tourWins = 43;
        this.majorWins = 5;

        this.position = 2;
        this.finalPosition = 2;
        this.odds = "200:1";
        
        this.tournaments;
        this.averageRound;
        this.bestRound;
        this.madeCut;
        this.averageFinish;
        this.bestFinish;
        this.stats = new Stats();
    }

    addShot(par, projection, score, drive, hitFairway, hitGreen, putts) {
        this.stats.addShot(par, projection, par + score, drive, hitFairway, hitGreen, putts);
    }

    addHole(score, round, hole, par, courseHole) {
        this.score += score;
        this.round = Math.max(this.round, round);
        this.hole = Math.max(this.hole, hole);
        var r = this.rounds[round - 1];
        r.score += score;
        r.par += par;
        this.holes.push({'round':round, 'hole':hole, 'score':score, 'par':par, 'courseHole':courseHole});
    }

    getInitialProjection() {
        return Math.round((this.score - this.projection) * 100) / 100;
    }

    getFinalProjectionScore() {
        return Math.round((this.currentProjection) * 10) / 10;
    }

    getFinalProjection() {
        return Math.round(this.currentProjection) + 284 + " (" + this.getFinalProjectionScore() + ")";
    }

    getCurrentScore() {
        return this.rounds[0].par + this.rounds[1].par + this.rounds[2].par + this.rounds[3].par + this.score + " (" + this.score + ")";
    }

    currentRoundScore() {
        return this.rounds[this.round - 1].score == 0 ? 'E' : this.rounds[this.round - 1].score;
    }

    roundScore(round) {
        var r = this.rounds[round - 1];
        return r.par > 0 ? r.par + ' (' + (r.score > 0 ? '+' : (r.score == 0 ? '&plusmn;' : '')) + r.score + ')' : '-';
    }

    getHoles() {
        this.holes.sort(function(h1, h2) { return h1.round < h2.round ? -1 : h1.round > h2.round ? 1 : h1.hole < h2.hole; });
        var cumulative = 0;
        for (var i = 0; i < this.holes.length; i++) {
            this.holes[i].previous = cumulative;
            cumulative += this.holes[i].score;
            this.holes[i].current = cumulative;
        }
        return this.holes;
    }

    getBestHoles(holes) {
        var bestHoles = [];
        for (var i = 0; i < this.holes.length; i++) {
            var difference = Math.round((this.holes[i].par + this.holes[i].score - holes[this.holes[i].courseHole].stats.getAverageScore()) * 100) / 100;
            bestHoles.push({'round':this.holes[i].round, 'hole':this.holes[i].hole, 'difference':difference});
        }
        return bestHoles.sort(function(h1, h2) { return h1.difference > h2.difference });
    }

    getLastHoles(count) {
        var total = 0;
        for (var i = 1 ; i <= count; i++)
            if (this.holes[this.holes.length - i].score) total += this.holes[this.holes.length - i].score;
        return total;
    }
}