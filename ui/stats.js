class Stats {
    constructor() {
        this.pcount = 0;
        this.projection = 0;
        this.scount = 0;
        this.score = 0;
        this.dcount = 0;
        this.drive = 0;
        this.fcount = 0
        this.fairway = 0;
        this.green = 0;
        this.putts = 0;
        this.parOrBetter = 0;
    }

    addShot(par, projection, score, drive, hitFairway, hitGreen, putts) {
        if (projection != null) this.pcount++;
        this.projection += projection;
        if (score != null) this.scount++;
        this.score += score;
        if (drive > 0) this.dcount++;
        this.drive += drive;
        if (par > 3) this.fcount++;
        if (hitFairway > 0) this.fairway++;
        if (hitGreen > 0) this.green++;
        this.putts += putts;
        if (score <= par) this.parOrBetter++;
    }

    getProjectionScore() {
        return Math.round(this.projection / this.pcount * 100) / 100;
    }

    getAverageScore() {
        return Math.round(this.score / this.scount * 100) / 100;
    }

    getAverageDrive() {
        return this.dcount > 0 ? Math.round(this.drive / this.dcount) + " yds" : "---";
    }

    getHitFairway() {
        return this.fcount > 0 ? this.fairway + " (" + Math.round(this.fairway / this.fcount * 100) + "%)" : "---";
    }

    getOnInRegulation() {
        return this.green + " (" + Math.round(this.green / this.scount * 100) + "%)";
    }

    getAveragePutts() {
        return Math.round(this.putts / this.scount * 100) / 100;
    }

    getParOrBetter() {
        return this.parOrBetter + " (" + Math.round(this.parOrBetter / this.scount * 100) + "%)";
    }
}