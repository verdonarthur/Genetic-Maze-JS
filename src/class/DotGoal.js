
export class DotGoal {
    constructor(ctx,grid) {
        this.ctx = ctx
        this.grid = grid
        this.width = 1
        this.height = 1
        
        this.x = Math.round(grid.width-2)
        this.y = Math.round(grid.height/2 - 1)
    }

    draw(grid = this.grid) {
        this.ctx.beginPath();

        this.ctx.fillStyle = 'blue'

        this.ctx.fillRect(this.x*grid.tileSize, this.y*grid.tileSize, this.width*grid.tileSize, this.height*grid.tileSize);

        this.ctx.closePath();
    }

}