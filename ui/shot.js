class Shot {
    constructor(d) {
      this.number = d[" Player #"];
      this.name = d[" Player Last Name"] + ", " + d[" Player First Name"];
      this.round = parseInt(d[" Round"]);
      this.hole = parseInt(d[" Hole"]);
      this.par = parseInt(d[" Par Value"]);
      this.score = parseInt(d[" Hole Score"]);
      this.shot = parseInt(d["  Shot"]);
      this.distance = parseInt(d[" Distance"]);
      this.putt = d["1st Putt Flag"];
      this.lie = d[" To Location(Scorer)"];
      this.date = Date.parse(d[" Date"]);
      this.time = parseInt(d[" Time"]);
      this.impact = Math.round(parseFloat(d["Shot Impact"]) * 100) / 100;
      this.description = ["Double Eagle","Eagle","Birdie","Par","Bogey","Double Bogey","Triple Bogey"];
    }

    getRoundHole() {
        return "R" + this.round + " H" + this.hole;
    }

    getDistance() {
        return this.distance < 12 ? this.distance + " in" : (this.distance < 360 ? Math.round(this.distance / 12 * 100) / 100 + " ft" : Math.round(this.distance / 36 * 100) / 100 + " yd");
    }

    getResult() {
        var diff = this.score - this.par;
        return diff > -4 && diff < 4 ? this.description[diff + 3] : "Other";
    }

    getImpact() {
        return 20 + (this.impact + 2.5) / 5 * 80;
    }

    compare(another) {
        return this.date < another.date ? 1 : this.date > another.date ? -1 : this.time < another.time ? 1 : this.time > another.time ? -1 : this.shot < another.shot ? 1 : -1;
    }
}