const PI = Math.PI;

class Calc {
    constructor(R) {
        this.R = R
    }

    calcCollision(A, B, colVector) {
        const alfa = this.calcAlfa(A.gain, colVector);
        this.calcGainForStateBalls(alfa, A, B)
        // console.log(alfa * 180 / PI)
        // Object.assign(B.gain, A.gain);
        // Object.assign(A.gain, {x: 0, y: 0})

    }

    calcGainForStateBalls(alfa, V1, V2) {
        const gain = Math.abs(V1.gain.x) + Math.abs(V1.gain.y);
        let alfa_grad = alfa * 180/PI;
        if (alfa_grad > 90 || alfa_grad < -90) {
            alfa_grad = (90 - (Math.abs(alfa_grad) - 90)) * (Math.abs(alfa_grad)/alfa_grad);
        }
        const alfa2_y = (alfa_grad / 90).toFixed(2) - 0;
        const alfa2_x = (1 - alfa2_y).toFixed(2) - 0;

        const alfa_grad_1 = 90 - alfa_grad;

        const alfa1_y = (alfa_grad_1 / 90).toFixed(2) - 0;
        const alfa1_x = (1 - alfa1_y).toFixed(2) - 0;

        const gain_1 = gain * alfa2_y;
        const gain_2 = gain * alfa2_x;



        const gain_1to2 = Object.assign({}, V1.gain);

        gain_1to2.x *= -1;
        gain_1to2.y *= -1;


        V2.gain.x = (V1.gain.x * Math.cos(alfa2_x) - V1.gain.y * Math.sin(alfa2_x)) * alfa2_x * V1.route.x;
        V2.gain.y = (-V1.gain.x * Math.sin(alfa2_y) + V1.gain.y * Math.cos(alfa2_y)) * alfa2_y * V1.route.y;
        console.log(alfa_grad, alfa_grad_1, alfa*180/PI)
        Object.assign(V2.route, V1.route);
        // V1.gain.x = -(V1.gain.x * Math.cos(alfa1_x) - V1.gain.y * Math.sin(alfa1_x)) * alfa1_x;
        // V1.gain.y = (-V1.gain.x * Math.sin(alfa1_y) + V1.gain.y * Math.cos(alfa1_y)) * alfa1_y;
    }



    kiyEvent(event, ball, R) {
        const Ball = { x: 3 * R, y: 0 }
        const Kiy = { x: event.x - ball.x, y: event.y - ball.y };
        const alfa = this.calcAlfa(Ball, Kiy);
        const x = Ball.x * Math.cos(alfa) - Ball.y * Math.sin(alfa) + ball.x;
        const y = -Ball.x * Math.sin(alfa) + Ball.y * Math.cos(alfa) + ball.y;
        return ({ x, y, alfa });
    }

    calcGain(alfa, V1, V2, gain = 0) {
        // console.log(V1, V2)
        let alfa_grad = Math.abs(alfa * 180 / PI);
        if (alfa_grad > 90) {
            alfa_grad = 90 - Math.abs(alfa_grad - 90);
        }
        const alfa_y = (alfa_grad / 90).toFixed(2) - 0;
        const alfa_x = (1 - alfa_y).toFixed(2) - 0;

        if (V1.x > V2.x) {
            V2.route.x = 1
        }
        if (V1.x < V2.x) {
            V2.route.x = -1
        }
        if (V1.y > V2.y) {
            V2.route.y = 1
        }
        if (V1.y < V2.y) {
            V2.route.y = -1
        }
        // console.log(alfa_1, alfa_2, gain)
        V2.gain.x = V2.route.x * (gain * alfa_x).toFixed(2) - 0;
        V2.gain.y = V2.route.y * (gain * alfa_y).toFixed(2) - 0;
    }

    calcAlfa(V1, V2) {
        const modul_V1 = this.modulVector(V1);
        const modul_V2 = this.modulVector(V2);
        // console.log(modul_V1, modul_V2)
        const scalar = this.calcScalar(V1, V2);
        let check = 1;
        if (V2.y > V1.y) {
            check = -1;
        }
        const alfa = check * Math.acos(scalar / (modul_V1 * modul_V2));
        return alfa;
    }

    calcVector(Point_1, Point_2) {
        const x = (Point_2.x - Point_1.x).toFixed(2) - 0;
        const y = (Point_2.y - Point_1.y).toFixed(2) - 0
        // console.log(x, y)
        return { x, y }
    }

    calcScalar(V1, V2) {
        const res = V1.x * V2.x + V1.y * V2.y
        return res
    }

    modulVector(V) {
        // console.log(V)
        const res = Math.sqrt(Math.pow(V.x, 2) + Math.pow(V.y, 2));
        return res
    }


}

/*
    calcCollision(B, A) {
        const ball_1 = Object.assign({}, A.gain);
        const ball_2 = Object.assign({}, B.gain);
        const route_1 = Object.assign({}, A.route);
        const route_2 = Object.assign({}, B.route);
        const colVector = this.calcVector(A, B);
        // console.log(colVector)
        const alfa = this.calcAlfa(A, colVector);
        // console.log(alfa)
        console.log(A, B)
        Object.assign(A.route, route_2);
        Object.assign(A.gain, ball_2);
        // console.log(colVector.x * Math.sin(alfa))
        Object.assign(B.gain, {
            x: ball_1.x * Math.cos(alfa) - ball_1.y * Math.sin(alfa),
            y: ball_1.x * Math.sin(alfa) + ball_1.y * Math.cos(alfa)
        })
        // console.log(A.gain)
        Object.assign(B.route, route_1);

        // B.gain.x = ball_1.x * Math.sin(alfa);
        // B.gain.y = ball_1.y * Math.cos(alfa);
    }
*/
