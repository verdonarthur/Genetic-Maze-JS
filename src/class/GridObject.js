export class GridObject {
    constructor(x, y, width, height,color, ctx, grid) {
        this.ctx = ctx
        this.grid = grid
        this.width = width
        this.height = height
        this.color = color

        this.x = Math.round(x)
        this.y = Math.round(y)
    }

    draw(grid = this.grid, ctx = this.ctx) {
        this.ctx.beginPath();

        this.ctx.fillStyle = this.color

        this.ctx.fillRect(this.x * grid.tileSize, this.y * grid.tileSize, this.width * grid.tileSize, this.height * grid.tileSize);

        this.ctx.closePath();
    }
}