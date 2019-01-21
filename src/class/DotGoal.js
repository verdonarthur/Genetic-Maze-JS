import { Dot } from './Dot'

export class DotGoal extends Dot {
    constructor(ctx) {
        super(ctx.canvas.width - 100, ctx.canvas.height - 100, 'red', ctx)
        this.radius = 50
    }
    
}