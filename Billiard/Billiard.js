window.onload = () => {
    const canvas = new Canvas;
    const btn = document.getElementById('push');
    btn.addEventListener('click', () => {
        canvas.checkGain = true;
        canvas.push();
    })
    canvas.render()
}