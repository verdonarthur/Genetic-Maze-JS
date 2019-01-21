import { Adventurer } from './Adventurer'

export class DotGoal {
    constructor(ctx) {
        this.x = ctx.canvas.width - 100
        this.y = ctx.canvas.height/2 - 50
        this.ctx = ctx
        this.width = 100
        this.height = 100
    }

    draw() {
        this.ctx.beginPath();

        this.ctx.fillStyle = 'blue'

        this.ctx.fillRect(this.x, this.y, this.width, this.height);

        this.ctx.closePath();
    }

}