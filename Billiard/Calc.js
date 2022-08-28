const PI = Math.PI;

class Calc {
    constructor(R) {
        this.R = R;
        this.base = { x: 3 * R, y: 0 }

    }

    calcCollision(A, B, colVector) {
        // console.log(A.num, B.num)
        const a_push = Math.abs(this.calcAlfa(this.base, A.gain));
        const a_gave = Math.abs(this.calcAlfa(this.base, colVector));
        let a_pushGrad = Math.abs(a_push * 180 / PI);
        let a_gaveGrad = Math.abs(a_gave * 180 / PI);
        let a_pushGradGain = 1;
        let a_gaveGradGain = 1;
        // console.log(a_pushGrad, a_gaveGrad)
        // if (a_pushGrad > 90 || a_pushGrad < -90) {
        //     a_pushGradGain = 90 - Math.abs(a_pushGrad - 90);
        // };
        // if (a_gaveGrad > 90 || a_gaveGrad < -90) {
        //     a_gaveGradGain = 90 - Math.abs(a_gaveGrad - 90);
        // }

        const gradGainCol = Math.abs(this.calcAlfa(A.gain, colVector) * 180/PI);

        const Gain_1 = {
            x: (Math.abs(A.gain.x) + Math.abs(A.gain.y)) * (gradGainCol / 90),
            y: 0
        };

        const Gain_2 = {
            x: (Math.abs(A.gain.x) + Math.abs(A.gain.y)) * ((90 - gradGainCol) / 90),
            y: 0
        };

        // console.log(gradGainCol/90, (90 - gradGainCol)/90)

        if (A.y < B.y) {//Если ведущий шар находится выше
            B.route.y = 1;
            A.route.y = 1;
            if (A.x <= B.x) {   //Если ведущий шар находится левее
                B.route.x = 1;
                B.gain.x = Gain_2.x * Math.sin(a_gaveGrad) * B.route.x;
                B.gain.y = -Gain_2.x * Math.cos(a_gaveGrad) * B.route.y;

                A.route.x = -1;
                A.gain.x = Gain_1.x * Math.sin(a_gaveGrad + 90) * A.route.x;
                A.gain.y = -Gain_1.x * Math.cos(a_gaveGrad + 90) * A.route.y;
                // console.log(Math.sin(a_gaveGrad),Gain_2.x,  B.gain)
            }
            else {              //Если ведущий шар находится праее
                B.route.x = -1;
                B.gain.x = Gain_2.x * Math.sin(a_gaveGrad) * B.route.x;
                B.gain.y = -Gain_2.x * Math.cos(a_gaveGrad) * B.route.y;

                A.route.x = 1;
                A.gain.x = Gain_1.x * Math.sin(a_gaveGrad - 90) * A.route.x;
                A.gain.y = -Gain_1.x * Math.cos(a_gaveGrad - 90) * A.route.y;
            }
        }
        else {          //Если ведущий шар находится ниже
            B.route.y = -1;
            A.route.y = -1;
            if (A.x <= B.x) {   //Если ведущий шар находится левее
                B.route.x = 1;
                B.gain.x = Gain_2.x * Math.sin(a_gaveGrad) * B.route.x;
                B.gain.y = -Gain_2.x * Math.cos(a_gaveGrad) * B.route.y;

                A.route.x = -1;
                A.gain.x = Gain_1.x * Math.sin(a_gaveGrad + 90) * A.route.x;
                A.gain.y = -Gain_1.x * Math.cos(a_gaveGrad + 90) * A.route.y;
                // console.log(Gain_1, Gain_2)
            }
            else {              //Если ведущий шар находится праее
                B.route.x = -1;
                B.gain.x = Gain_2.x * Math.sin(a_gaveGrad) * B.route.x;
                B.gain.y = -Gain_2.x * Math.cos(a_gaveGrad) * B.route.y;

                A.route.x = 1;
                A.gain.x = Gain_1.x * Math.sin(a_gaveGrad - 90) * A.route.x;
                A.gain.y = -Gain_1.x * Math.cos(a_gaveGrad - 90) * A.route.y;
            }
        }


        /*
                if (A.y > B.y) {
        
                    B.route.y = -1;
                    B.gain.y = -Gain_2.x * Math.cos(a_gaveGrad) * B.route.y;
                    console.log('y = -1')
                }
                else {
                    B.route.y = 1;
                    B.gain.y = -Gain_2.x * Math.cos(-(180 - a_gaveGrad)) * B.route.y;
                    console.log('y = 1')
                }
                if (A.x > B.x) {
                    B.route.x = -1;
                    B.gain.x = Gain_2.x * Math.sin(a_gave) * B.route.x;
                    console.log('x = -1')
                }
                else {
                    B.route.x = 1;
                    B.gain.x = Gain_2.x * Math.sin(a_gave) * B.route.x;
                    console.log('x = 1')
                } 
                */

        //СОХРАНИТЬ
        // B.gain.x = Gain_2.x * Math.sin(a_gave) * A.route.x;
        // B.gain.y = -Gain_2.x * Math.cos(a_gave) * A.route.y;

        // console.log(B.gain)

        // A.route = { x: 1, y: 1 }
        // A.gain.x = Gain_1.x * Math.sin((a_gaveGrad - 90) * PI / 180) * A.route.x;
        // A.gain.y = -Gain_1.x * Math.cos((a_gaveGrad - 90) * PI / 180) * A.route.y;

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
