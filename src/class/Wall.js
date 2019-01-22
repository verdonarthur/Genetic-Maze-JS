export class Wall {
    constructor(x, y, width, height, ctx, grid) {
        this.ctx = ctx
        this.grid = grid
        this.width = width
        this.height = height

        this.x = Math.round(x)
        this.y = Math.round(y)
    }

    draw(grid = this.grid) {
        this.ctx.beginPath();

        this.ctx.fillStyle = 'brown'

        this.ctx.fillRect(this.x * grid.tileSize, this.y * grid.tileSize, this.width * grid.tileSize, this.height * grid.tileSize);

        this.ctx.closePath();
    }

    isAdventurerColliding(adventurer) {
        return (adventurer.x >= this.x && adventurer.x < this.x + this.width) && (adventurer.y > this.y && adventurer.y < this.y + this.height)
    }
}