Figure.prototype.table = (
    color = "#ff0000",
    a = 10,
    b = 5,
    c = 1,
    point = new Point(0, 0, 0)) => {

    const points = [
        new Point(point.x + a, point.y + b, point.z + c),
        new Point(point.x + -a, point.y + b, point.z + c),
        new Point(point.x + -a, point.y + -b, point.z + c),
        new Point(point.x + a, point.y + -b, point.z + c),
        new Point(point.x + a, point.y + b, point.z + -c),
        new Point(point.x + -a, point.y + b, point.z + -c),
        new Point(point.x + -a, point.y + -b, point.z + -c),
        new Point(point.x + a, point.y + -b, point.z + -c),
    ];

    const polygons = [
        new Polygon([0, 3, 2, 1]),
        new Polygon([4, 5, 6, 7]),
        new Polygon([1, 2, 6, 5]),
        new Polygon([4, 7, 3, 0]),
        new Polygon([0, 1, 5, 4]),
        new Polygon([2, 3, 7, 6])
    ];

    polygons.forEach(poly => {
        poly.color = poly.hexToRgb(color);
    });

    return new Subject(points, [], polygons, [], point);
}