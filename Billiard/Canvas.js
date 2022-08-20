class Canvas {
    constructor(props) {
        this.canvas = document.getElementById('canvas');
        this.canvas.width = 500;
        this.canvas.height = 500;
        this.ctx = this.canvas.getContext('2d');
        //Made objects
        this.R = 20;
        this.balls = new Balls;
        this.calc = new Calc(this.R);
        this.kiy = new Kiy;
        //Check-boxes
        this.checkGain = false;
        this.fixedKiy = true;
        //Window functions
        this.canvas.addEventListener('click', () => { this.fixedKiy = false });
        this.canvas.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            this.calcVectorKiy(event);
            this.fixedKiy = true
        });
        this.canvas.addEventListener('mousemove', (event) => {
            if (this.fixedKiy) {
                this.calcVectorKiy(event)
            }
        });
        this.numbers()

    }

    //Предварительная нумерация шаров 
    numbers() {
        let i = 0;
        this.balls.balls.forEach(ball => {
            ball.num = i;
            i++
        })
    }

    //Вычисление координат Кия
    calcVectorKiy(event) {
        const params = this.calc.kiyEvent({ x: event.clientX, y: event.clientY }, this.balls.balls[0], this.R);
        this.render(params)
    }

    //Задание силы удара и активация анимации
    push() {
        this.calc.calcGain(this.kiy.alfa, this.kiy, this.balls.balls[0], 20)
        this.startPush();

    }

    //Запуск шара с анимацией
    startPush() {
        const a = () => {
            // console.log(1)
            if (this.checkGain) {
                this.balls.balls.forEach(ball => {
                    // console.log(ball)
                    // const ball = this.balls.balls[0];
                    this.checkRouter(ball);
                    if (Math.abs(ball.gain.x) >= 0.1 || Math.abs(ball.gain.y) >= 0.1) {
                        ball.gain.x -= ball.gain.x * 0.02
                        ball.gain.y -= ball.gain.y * 0.02
                    }
                    this.checkGoBalls();
                    // else{
                    //     this.fixedKiy = true;
                    // }
                })
                this.collision();
                this.swapParamsForBalls();
                this.render();
                window.requestAnimationFrame(a);
            }
        }
        a();
    }

    //Проверка на общее движение
    checkGoBalls() {
        let bool = true;
        this.balls.balls.some(ball => {
            if (Math.abs(ball.gain.x) >= 0.1 || Math.abs(ball.gain.y) >= 0.1) {
                // console.log(ball.num)
                bool = false;
                return;
            }
        })
        if (bool) {
            this.balls.balls.forEach(ball => {
                ball.data = { touch: [], colVector: [] };
                ball.gain = { x: 0, y: 0 };
            })
            // console.log(this.fixedKiy)
            this.checkGain = false;
            this.fixedKiy = true;
        }
    }

    //Проверка на столкновения с шарами
    collision() {
        this.balls.balls.forEach(ball_1 => {
            const R = this.R;
            this.balls.balls.forEach(ball_2 => {
                if (ball_1.num != ball_2.num && !ball_2.data.touch.includes(ball_1.num)) {
                    const colVector = this.calc.calcVector(ball_1, ball_2);
                    if (this.calc.modulVector(colVector) <= 2 * R) {
                        ball_1.data.touch.push(ball_2.num);
                        ball_1.data.colVector.push(colVector);
                        // console.log(this.balls.balls[0].data.touch, this.balls.balls[1].data.touch, ball_1.num, ball_2.num)
                    }
                }
            })
        })
    }

    swapParamsForBalls() {
        this.balls.balls.forEach(ball_1 => {
            const data = ball_1.data;
            for (let i = 0; i < data.touch.length; i++) {
                // console.log(data.touch ,ball_1.num)
                const ball_2 = this.balls.balls[data.touch[i]];
                this.calc.calcCollision(ball_1, ball_2, data.colVector[i]);
            }
        })
    }

    //Проверка на столкновение со столом
    checkRouter(ball) {
        const R = this.R;
        // const ball = this.balls.balls[0];
        const x = ball.x;
        const y = ball.y;
        if (Math.abs(ball.gain.x) >= 0.1 || Math.abs(ball.gain.y) >= 0.1) {
            if ((x - R <= 0) && (ball.route.x == -1)) {
                ball.route.x = 1;
                ball.gain.x *= -ball.route.x;
            }
            if ((x + R >= this.canvas.width) && (ball.route.x == 1)) {
                ball.route.x = -1;
                ball.gain.x *= ball.route.x;
            }
            if ((y - R <= 0) && (ball.route.y == -1)) {
                ball.route.y = 1;
                ball.gain.y *= -ball.route.y;
            }
            if ((y + R >= this.canvas.height) && (ball.route.y == 1)) {
                ball.route.y = -1;
                ball.gain.y *= ball.route.y;

            }
            ball.x += ball.gain.x;
            ball.y += ball.gain.y;
        }
    }

    //Отрисовка шара
    drawBall() {
        this.balls.balls.forEach(ball => {
            ball.data = { touch: [], colVector: [] };
            this.ctx.beginPath();
            this.ctx.fillStyle = 'white';
            this.ctx.arc(ball.x, ball.y, this.R, 0, 2 * Math.PI);
            this.ctx.fill();
            if (ball.num != 0) {
                this.ctx.strokeStyle = 'black'
            }
            this.ctx.stroke();
        })
        // bool
        // console.log(bool)
    }
    //Отчистка холста
    clear() {
        this.ctx.beginPath();
        this.ctx.fillStyle = 'green';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }


    //Отрисовка Кия
    drawKiy(params) {
        if (params) {
            const ball = this.balls.balls[0];
            this.ctx.beginPath();
            this.ctx.strokeStyle = 'red';
            this.ctx.moveTo(ball.x, ball.y);
            this.ctx.lineTo(params.x, params.y);
            this.ctx.stroke();
            //Фиксация координат наконечника Кия
            this.kiy.x = params.x;
            this.kiy.y = params.y;
            this.kiy.alfa = params.alfa
        }
    }

    render(params) {
        this.clear();
        this.drawBall();
        if (this.fixedKiy) {
            this.drawKiy(params);
        }
    }
}