class Hole {
    constructor(number, par, distance) {
        this.number = number;
        this.par = par;
        this.distance = distance;
        this.stats = new Stats();
    }

    addShot(projection, score, drive, hitFairway, hitGreen, putts) {
        this.stats.addShot(this.par, projection, this.par + score, drive, hitFairway, hitGreen, putts);
    }
}