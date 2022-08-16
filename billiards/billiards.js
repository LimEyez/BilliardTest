class Billiards {

    /**************переменные для бильярда**************/
    //главный шар
    ball0 = (new Figure).balls(
        20, 1.5, new Point(0, -12, 0), "#000000"
    );

    //остальные шары
    ball1 = (new Figure).balls(
        20, 1.5, new Point(0, 9, 0), "#ffff00"
    );
    ball2 = (new Figure).balls(
        20, 1.5, new Point(-1.7, 12, 0), "#ff0000"
    );
    ball3 = (new Figure).balls(
        20, 1.5, new Point(1.7, 12, 0), "#ff0000",
    );
    ball4 = (new Figure).balls(
        20, 1.5, new Point(-3.4, 15, 0), "#ffff00"
    );
    ball5 = (new Figure).balls(
        20, 1.5, new Point(0, 15, 0), "#ffff00"
    );
    ball6 = (new Figure).balls(
        20, 1.5, new Point(3.4, 15, 0), "#ffff00"
    );
    ball7 = (new Figure).balls(
        20, 1.5, new Point(-5.1, 18.2, 0), "#ffff00"
    );
    ball8 = (new Figure).balls(
        20, 1.5, new Point(-1.7, 18.2, 0), "#ffff00"
    );
    ball9 = (new Figure).balls(
        20, 1.5, new Point(1.7, 18.2, 0), "#ffff00"
    );
    ball10 = (new Figure).balls(
        20, 1.5, new Point(5.1, 18.2, 0), "#ffff00"
    );

    //игральный стол
    table1 = (new Figure).table("#8b4513", 15, 1, 1, new Point(-1, 25, 2));
    table2 = (new Figure).table("#8b4513", 15, 1, 1, new Point(1, -25, 2));
    table3 = (new Figure).table("#8b4513", 1, 25, 1, new Point(15, 1, 2));
    table4 = (new Figure).table("#8b4513", 1, 25, 1, new Point(-15, -1, 2));
    table5 = (new Figure).table("#98fb98", 14, 24, 0.01, new Point(0, 0, 2));

    //лузы
    pockets1 = (new Figure).table("#006400", 1.6, 1.6, 1, new Point(-15, 25, 2));
    pockets2 = (new Figure).table("#006400", 1.6, 1.6, 1, new Point(15, 25, 2));
    pockets3 = (new Figure).table("#006400", 1.6, 1.6, 1, new Point(-15, -25, 2));
    pockets4 = (new Figure).table("#006400", 1.6, 1.6, 1, new Point(15, -25, 2));
    pockets5 = (new Figure).table("#006400", 1.6, 1.6, 1, new Point(-15, 0, 2));
    pockets6 = (new Figure).table("#006400", 1.6, 1.6, 1, new Point(15, 0, 2));

    /************************************************************/

    //заполнение массива шаров
    balls = [
        this.ball0,
        this.ball1,
        this.ball2,
        this.ball3,
        this.ball4,
        this.ball5,
        this.ball6,
        this.ball7,
        this.ball8,
        this.ball9,
        this.ball10
    ];

    //заполнение массива бортиков
    table = [
        this.table1, //верхняя грань
        this.table2, //нижняя грань
        this.table3, //правая грань
        this.table4, //левая грань
        this.table5 //поверхность стола
    ];

    //заполнение массива луз
    pockets = [
        this.pockets1,
        this.pockets2,
        this.pockets3,
        this.pockets4,
        this.pockets5,
        this.pockets6
    ];
}