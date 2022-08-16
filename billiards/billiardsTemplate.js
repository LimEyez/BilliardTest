Template.prototype.billiardsTemplate = () => `
    <canvas id="canvasBilliards"></canvas>
    <div class="billiards">
        <input class="power" type="range" min="0.1" max="5.1" step="0.5" value="1" id="power">
            <br><label for="power"> сила удара</label>
        </input> 
        <br> 
        <input class="corner" type="range" min="0" max="360" step="1" value="0" id="corner">
            <br><label for="corner"> угол удара</label>
        </input>
    </div>
    <div>  
    <button class="btn btn-three" id="play"> play</button>
    </div>
`;