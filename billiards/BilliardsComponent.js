class BilliardsComponent extends Component {
    constructor(options) {
        super(options);
        this.WIN = {
            LEFT: -10,
            BOTTOM: -10,
            WIDTH: 20,
            HEIGHT: 20,
            CAMERA: new Point(0, 0, -50),
            DISPLAY: new Point(0, 0, -30),
            P1: new Point(-10, 10, -30), //левый верхний угол
            P2: new Point(-10, -10, -30), //левый нижний угол
            P3: new Point(10, -10, -30) //правый нижний угол
        };

        this.canvas = new Canvas({
            WIN: this.WIN,
            id: 'canvasBilliards',
            callbacks: {
                wheel: (event) => this.wheel(event),
                mouseMove: (event) => this.mouseMove(event),
                mouseUp: () => this.mouseUp(),
                mouseDown: () => this.mouseDown()
            }
        });

        this.graph3D = new Graph3D({
            WIN: this.WIN
        });


        this.billiard = new Billiards();

        //говно переменные
        this.point1 = 0;
        this.point2 = 0;
        this.click = 0;
        
        this.buttonPush = document.getElementById('play');

        //массив фигур
        this.figures = this.billiard.table.concat(this.billiard.pockets, this.billiard.balls);

        //массив шариков
        this.balls = this.billiard.balls;

        //индекс шариков
        this.balls.forEach(ball => {
            ball.index = this.balls.indexOf(ball);
        });

        //флажки
        this.canMove = false;
        this.drawPolygons = true;
        this.checkGoAnimation = false;
        this.viewKiy = true;

        this.GO = { x: 1, y: 1 }
        // console.log(this.balls)
        //Дефолтные значения кия
        this.balls[0].collisions.corner.x = Math.sin((corner.value - 0) / 180 * Math.PI);
        this.balls[0].collisions.corner.y = Math.cos((corner.value - 0) / 180 * Math.PI);
        this.balls[0].collisions.power = this.timePower;

        //переменные для FPS
        let FPS = 0;
        this.FPS = 0;
        let lastTimestamp = Date.now();

        const animLoop = () => {
            //calc fps
            FPS++;
            const timestamp = Date.now();
            if (timestamp - lastTimestamp >= 1000) {
                this.FPS = FPS;
                FPS = 0;
                lastTimestamp = timestamp;
            }
            //print scene
            this.graph3D.calcPlaneEquation(this.WIN.CAMERA, this.WIN.DISPLAY); //плоскость экрана
            this.graph3D.calcWinVectors(); //векторы экрана
            this.goBilliards();
            this.render();
            requestAnimFrame(animLoop);
        }
        animLoop();
    }

    //действия пользователя
    _addEventListeners() {
        document.addEventListener('keydown', event => this.keyDownHandler(event));

        const power = document.getElementById('power');
        power.addEventListener(
            'mousemove',
            () => {
                this.timePower = power.value - 0; //импульс
            }
        );

        const corner = document.getElementById('corner');
        corner.addEventListener(
            'mousemove',
            () => {
                this.cornerBase = {
                    x: Math.sin((corner.value - 0) / 180 * Math.PI),
                    y: Math.cos((corner.value - 0) / 180 * Math.PI),
                    z: 0
                }
            }
        );
        //////////////////////////////////////////////////////
        this.timePower = power.value - 0;
        this.cornerBase = {
            x: Math.sin((corner.value - 0) / 180 * Math.PI),
            y: Math.cos((corner.value - 0) / 180 * Math.PI),
            z: 0
        }

        document.getElementById('play').addEventListener(
            "click",
            () => {
                const figure = this.balls[0].collisions;
                this.checkGoAnimation = true;
                figure.power = JSON.parse(JSON.stringify(this.timePower));
                figure.corner = JSON.parse(JSON.stringify(this.cornerBase));
            }
        );
    }

    //перенос фигур и света
    keyDownHandler(event) {
        switch (event.keyCode) {
            case 65: // key a
                return this.transformScene(this.graph3D.rotateOy(-Math.PI / 180));
            case 68: // key d
                return this.transformScene(this.graph3D.rotateOy(Math.PI / 180));
            case 83: // key s
                return this.transformScene(this.graph3D.rotateOx(Math.PI / 180));
            case 87: // key w
                return this.transformScene(this.graph3D.rotateOx(-Math.PI / 180));
            case 81: // key q
                return this.transformScene(this.graph3D.rotateOz(-Math.PI / 180));
            case 69: // key e
                return this.transformScene(this.graph3D.rotateOz(Math.PI / 180));
        }
    }

    //зум
    wheel(event) {
        event.preventDefault();
        const delta = (event.wheelDelta > 0) ? -0.2 : 0.2;
        this.transformScene(this.graph3D.move(
            this.WIN.CAMERA.x * delta,
            this.WIN.CAMERA.y * delta,
            this.WIN.CAMERA.z * delta
        ));
    }

    /**************вращения**************/
    mouseMove(event) {
        const gradus = Math.PI / 180 / 4; {
            const matrix = this.graph3D.rotateOz((this.dx - event.offsetX) * gradus);
            if (this.canMove) {
                this.transformScene(matrix);
            }
        }
        const matrix = this.graph3D.rotateOx((this.dy - event.offsetY) * gradus);
        if (this.canMove) {
            this.transformScene(matrix);
        }
        this.dx = event.offsetX;
        this.dy = event.offsetY;
    }

    mouseUp() {
        this.canMove = false;
    }

    mouseDown() {
        this.canMove = true;
    }

    /************************************/

    //изменение сцены
    transformScene(matrix) {
        this.graph3D.transform(matrix, this.WIN.CAMERA);
        this.graph3D.transform(matrix, this.WIN.DISPLAY);
        this.graph3D.transform(matrix, this.WIN.P1);
        this.graph3D.transform(matrix, this.WIN.P2);
        this.graph3D.transform(matrix, this.WIN.P3);
    }


    //запуск бильярда
    goBilliards() {
        this.balls.forEach(ball => { ball.collisions.contact = [] })
        if (this.checkGoAnimation) {
            this.buttonPush.disabled = true;
            this.viewKiy = false;
            this.buttonPush.setAttribute('class', "disablePush disablePush-three");
            this.balls.forEach(ball => {
                this.moveBall(ball);
                this.checkCollisionsWithBorders(ball);
                //this.checkCollisionsWithPockets();
                this.checkCollisionsWithBalls(ball);
            });
        }
        const figurePower = this.balls[0].collisions.power;
        // console.log(Math.abs(figure.x), Math.abs(figure.y))
        if (Math.abs(figurePower) <= 0.01) {
            this.buttonPush.disabled = false;
            this.viewKiy = true;
            this.buttonPush.setAttribute('class', "btn btn-three");
            // figurePower = 0;
        }
    }

    //ход шариков
    moveBall(ball) {
        const anim = ball.collisions;
        let speed = {
            x: anim.power * anim.corner.x,
            y: anim.power * anim.corner.y
        }
        ball.points.forEach(point => {
            point.x += speed.x;
            point.y += speed.y;
        });
        ball.center.x += speed.x;
        ball.center.y += speed.y;
        anim.power -= anim.power * 0.01;
    }


    //столкновение со столом
    checkCollisionsWithBorders(ball) {
        const center = ball.center;
        const collision = ball.collisions;
        const speedX = collision.power * collision.corner.x;
        const speedY = collision.power * collision.corner.y;
        const modulSpeedX = Math.abs(speedX);
        const modulSpeedY = Math.abs(speedY);
        if (modulSpeedX > 0.01 || modulSpeedY > 0.01) {
            const table = this.billiard.table;
            //====================== POWER X ======================
            if ((center.x < table[3].center.x + 2 * ball.R &&
                speedX / modulSpeedX == -1) ||
                (center.x > table[2].center.x - 2 * ball.R &&
                    speedX / modulSpeedX == 1)) {
                // collision.power = -collision.power;
                collision.corner.x = -collision.corner.x
            }
            //====================== POWER Y ======================
            if ((center.y > table[0].center.y - 2 * ball.R &&
                speedY / modulSpeedY == 1) ||
                (center.y < table[1].center.y + 2 * ball.R &&
                    speedY / modulSpeedY == -1)) {
                // collision.power = -collision.power;
                collision.corner.y = -collision.corner.y
            }
            // console.log(collision.power)
        }
    }

    //попадание в лунку
    checkCollisionsWithPockets() {

    }




    //столкновение с шариками
    checkCollisionsWithBalls(ball) {
        const anim = ball.collisions;
        this.balls.forEach(ball2 => {

            const even = (element) => element == ball2.index;

            const anim2 = ball2.collisions;
            const vectorCenters = this.graph3D.calcVector(ball.center, ball2.center);
            const checkLen = Math.sqrt(vectorCenters.x * vectorCenters.x + vectorCenters.y * vectorCenters.y);
            if (ball != ball2 && (anim.contact.some(even)) === false) {
                if (checkLen <= ball.R + ball2.R) {

                    const pVector = new Point(1, -vectorCenters.x / vectorCenters.y, 0); //перпендикулярный вектор

                    let kY = 1;
                    let kX = 1;
                    if (ball.center.x > ball2.center.x) kX = -1;
                    if (ball.center.y > ball2.center.y) kY = -1;


                    const goVector = {
                        x: anim.power * anim.corner.x,
                        y: anim.power * anim.corner.y,
                        z: 0
                    }
                    anim2.contact.push(ball.index)
                    let power = anim.power;

                    // anim2.power = anim.power
                    // anim.power = power

                    anim.corner.x = Math.sin(Math.PI/180) - Math.sin((this.graph3D.calcCorner(goVector, pVector)) * Math.PI / 180);
                    anim.corner.y = Math.cos(Math.PI/180) - Math.cos((this.graph3D.calcCorner(goVector, pVector)) * Math.PI / 180);
                    // console.log(ball.index);
                    anim2.corner.x = ((kX * Math.sin((this.graph3D.calcCorner(goVector, vectorCenters))* Math.PI / 180)))
                    // .toFixed(1);
                    anim2.corner.y = ((kY * Math.cos((this.graph3D.calcCorner(goVector, vectorCenters))* Math.PI / 180)))
                    // .toFixed(1);

                    anim.power = anim.power - (anim.power * (this.graph3D.calcCorner(goVector, pVector))) + (anim2.power * this.graph3D.calcCorner(goVector, vectorCenters)) ;
                    anim2.power = (anim2.power * (this.graph3D.calcCorner(goVector, vectorCenters))) + (power * this.graph3D.calcCorner(goVector, pVector));

                    // console.log(Math.cos((this.graph3D.calcCorner(goVector, vectorCenters) * Math.PI) / 180), (this.graph3D.calcCorner(goVector, vectorCenters)))
                    console.log( anim2.power);
                    // console.log(Math.sin((this.graph3D.calcCorner(goVector, pVector) * Math.PI) / 180))
                }
            }
            else if ((anim.contact.some(even)) === true) { console.log('Совпали') }
        }
        )
        // console.log(this.balls)
    }



    //угол удара шара (кий)
    printCue() {
        const figure = this.balls[0];
        const point1 = this.graph3D.getProection(figure.center);
        const point2 = this.graph3D.getProection(
            this.graph3D.sumVectors(
                this.graph3D.multVectors(
                    new Point(this.timePower, this.timePower, 0), this.cornerBase), figure.center
            )
        );
        this.canvas.line3D(point1.x, point1.y, point2.x, point2.y, 'blue', 3, true)
    }

    /*********************************************************************/

    //вывод
    render() {

        //очистка экрана
        this.canvas.clear();

        //print polygons
        if (this.drawPolygons) {
            const polygons = [];
            this.figures.forEach((figure, index) => {
                this.graph3D.calcDistance(figure, this.WIN.CAMERA, 'distance');
                figure.polygons.forEach(polygon => {
                    polygon.figureIndex = index;
                    polygons.push(polygon);
                });
            });
            this.graph3D.sortByArtistAlgoritm(polygons);
            polygons.forEach(polygon => {
                if (polygon.visibility) {
                    const figure = this.figures[polygon.figureIndex];
                    const points = polygon.points.map(point => {
                        return {
                            x: this.graph3D.getProection(figure.points[point]).x,
                            y: this.graph3D.getProection(figure.points[point]).y
                        }
                    });
                    let { r, g, b } = polygon.color;
                    let lumen = polygon.lumen;
                    r = Math.round(r * lumen);
                    g = Math.round(g * lumen);
                    b = Math.round(b * lumen);
                    this.canvas.polygon3D(points, polygon.rgbToHex(r, g, b));
                }
            });
        }

        //вывод кия и очков
        if (this.viewKiy) this.printCue();
        //this.canvas.text3D(`Счет: ${this.point1} : ${this.point2}`, -9.6, -9.6, 'black');

        //вывод FPS
        this.canvas.text(`FPS: ${this.FPS}`, -9.6, 9, '#50fc01');
    }
}




//столкновение с шариками
/*checkCollisionsWithBalls(ball) {
    const anim = ball.collisions;

    let speed = {
        x: 0,
        y: 0
    };
    let sum = 0;
    this.balls.forEach(ball2 => {
        if ((ball != ball2)) {
            const dx = ball.center.x - ball2.center.x;
            const dy = ball.center.y - ball2.center.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d <= ball.R + ball2.R) {
                sum++;
            }
        }
    });

    this.balls.forEach(ball2 => {
        if ((ball != ball2)) {

            const k = 0.94;
            const anim2 = ball2.collisions;
            const dt2 = this.graph3D.calcVector(ball.center, ball2.center);
            const touchLine1 = { x: dt2.x / 2, y: dt2.y / 2, z: 0 };
            const touchLine2 = { x: dt2.x / 2 + 10, y: dt2.y / 2 + 10, z: 0 };
            const touchLine = this.graph3D.calcVector(touchLine1, touchLine2)
            let pVector = new Point(1, -dt2.x / dt2.y, 0); //перпендикулярный ему вектор
            // console.log(touchLine1, touchLine2)
            const d = Math.sqrt(dt2.x * dt2.x + dt2.y * dt2.y);

            let speed2 = { x: 0, y: 0 }
            if (d <= ball.R + ball2.R) {
                const corner = this.graph3D.calcCorner(dt2, pVector);
                console.log(corner);
                speed.x = anim.speed.x;
                speed.y = anim.speed.y;
                const power = anim.power;
                const cornerBall2 = anim.corner2;
                
                // console.log(cornerBall2)

                anim.speed.x = ((2 * anim2.power * Math.cos(anim2.corner.x - corner))/2) * Math.cos(corner) + power * Math.sin(anim.corner2 - corner) * Math.cos(corner + Math.PI/2);
                anim.speed.y = ((2 * anim2.power * Math.cos(anim2.corner.y - corner))/2) * Math.sin(corner) + power * Math.sin(anim.corner2 - corner) * Math.sin(corner + Math.PI/2);
                anim.power = anim2.power;

                anim2.speed.x = ((2 * power * Math.cos(cornerBall2 - corner))/2) * Math.cos(corner) + anim2.power * Math.sin(anim2.corner2 - corner) * Math.cos(corner + Math.PI/2);
                anim2.speed.y = ((2 * power * Math.cos(cornerBall2 - corner))/2) * Math.sin(corner) + anim2.power * Math.sin(anim2.corner2 - corner) * Math.sin(corner + Math.PI/2);
                anim2.power = power;
                anim.power -= anim.power* 0.01;
                anim2.power -= anim2.power* 0.01 
                // anim2.speed.x -= (1 + k)/2*(anim2.speed.x - anim.speed.x);
                // anim2.speed.y -= (1 + k)/2*(anim2.speed.y - anim.speed.y);
                // anim.speed.x = (1 + k)/2*(anim2.speed.x - speed.x);
                // anim.speed.y = (1 + k)/2*(anim2.speed.y - speed.y);
            }
        }
    });
    // if (sum != 0) {
    //     anim.speed.x = (anim.speed.x + speed.x) / sum;
    //     anim.speed.y = (anim.speed.y + speed.y) / sum;
    // }
}
*/



/*
1)  Проверка растояния центров шариков
2)  Записывать индекс соприкасаемго шарика

['index соприкасаемого шарика', 'сила', 'угол']

3)  





*/



/**************************говно код для бильярда*************************/
/*
//проверка шаров на расположение
        checkCollisionBall(figure, index) {
            const anim = figure.animations;
            //попадание в лузу
            let point = 0;
            if ((anim.center.x > this.graph3D.getProection(this.WIN.p3).x &&
                    anim.center.y > this.graph3D.getProection(this.WIN.p1).y) ||

                (anim.center.x > this.graph3D.getProection(this.WIN.p3).x &&
                    anim.center.y < this.graph3D.getProection(this.WIN.p3).y) ||

                (anim.center.x < this.graph3D.getProection(this.WIN.p1).x &&
                    anim.center.y < this.graph3D.getProection(this.WIN.p3).y) ||

                (anim.center.x < this.graph3D.getProection(this.WIN.p1).x &&
                    anim.center.y > this.graph3D.getProection(this.WIN.p1).y) ||

                (anim.center.y < 1 && anim.center.y > -1 &&
                    anim.center.x < this.graph3D.getProection(this.WIN.p1).x) ||

                (anim.center.y < 1 && anim.center.y > -1 &&
                    anim.center.x > this.graph3D.getProection(this.WIN.p3).x)) {
                this.figures.splice(index, 1);
                point++;
            }
            //запись очков
            if (this.click % 2 === 0) {
                this.point1 += point;
            } else this.point2 += point;

            //столкновения со стенками
            if ((anim.center.x > this.graph3D.getProection(this.WIN.p3).x &&
                    anim.xSpeed / Math.abs(anim.xSpeed) === 1) ||
                (anim.center.x < this.graph3D.getProection(this.WIN.p1).x &&
                    anim.xSpeed / Math.abs(anim.xSpeed) === -1)) {
                anim.xSpeed = -anim.xSpeed;
            }
            if ((anim.center.y > this.graph3D.getProection(this.WIN.p1).y &&
                    anim.ySpeed / Math.abs(anim.ySpeed) === 1) ||
                (anim.center.y < this.graph3D.getProection(this.WIN.p3).y &&
                    anim.ySpeed / Math.abs(anim.ySpeed) === -1)) {
                anim.ySpeed = -anim.ySpeed;
            }

            //столкновения с другими шарами
            let Speed = {
                x: 0,
                y: 0
            };
            let sum = 0;
            this.figures.forEach(figure2 => {
                if (figure != figure2) {
                    const anim2 = figure2.animations;
                    const dx = anim.center.x - anim2.center.x;
                    const dy = anim.center.y - anim2.center.y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    const dt = this.graph3D.calcVectorModule(this.graph3D.calcVector(anim.center, anim2.center));
                    if (d <= figure.R + figure2.R || dt <= figure.R + figure2.R) {
                        sum++;
                        const a = anim2.xSpeed;
                        const b = anim2.ySpeed;
                        anim2.xSpeed = anim.xSpeed;
                        anim2.ySpeed = anim.ySpeed;
                        Speed.x += a;
                        Speed.y += b;
                    }
                }
            });
            if (sum != 0) {
                anim.xSpeed = Speed.x / sum;
                anim.ySpeed = Speed.y / sum;
            }
        }
*/
