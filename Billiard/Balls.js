class Balls {
    constructor(props) {
        this.balls = Array(new Ball, new Ball(250, 100));
    }
}

class Ball {
    constructor(x = 250, y=250) {
        this.x = x;
        this.y = y;
        this.route = { x: 1, y: 1 };
        this.gain = { x: 0, y: 0 };
        this.num;
        // this.touch = [];
        // this.colVector;
        this.data = {touch: [], colVector: []}
    }
}

class Kiy {
    constructor(){
        this.x;
        this.y;
        this.alfa;
    }
}