Figure.prototype.balls = (
    count = 40,
    R = 15,
    point = new Point(0, 0, 0),
    color = "#ff0000",
    collision = {
        contact: [],
        power: 0,
        corner: new Point(0, 0, 0),
        cornerBase: 0
    }) => {

    const points = [];
    const polygons = [];

    //точки
    const dt = Math.PI * 2 / count;
    for (let i = 0; i <= Math.PI; i += dt) {
        for (let j = 0; j < Math.PI * 2; j += dt) {
            const x = point.x + R * Math.cos(j) * Math.sin(i);
            const y = point.y + R * Math.sin(j) * Math.sin(i);
            const z = point.z + R * Math.cos(i);
            points.push(new Point(x, y, z));
        }
    }

    //полигоны
    for (let i = 0; i < points.length; i++) {
        if (i + 1 + count < points.length && (i + 1) % count !== 0) {
            polygons.push(new Polygon([i, i + 1, i + 1 + count, i + count]));
        } else if (i + count < points.length && (i + 1) % count === 0) {
            polygons.push(new Polygon([i, i + 1 - count, i + 1, i + count]))
        }
    }

    polygons.forEach(poly => {
        poly.color = poly.hexToRgb(color);

    });

    return new Subject(points, [], polygons, [], point, R, collision);
}