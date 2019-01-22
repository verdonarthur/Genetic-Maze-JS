export class Grid {

    constructor(ctx, tileSize = 30, gridColor = "lightgrey") {
        
        this.tileSize = tileSize;
        this.gridColor = gridColor;
        
        let canWidth = Math.round(ctx.canvas.width / this.tileSize)
        let canHeight = Math.round(ctx.canvas.height / this.tileSize)

        
        this.width = canWidth
        this.height = canHeight

        this.init()
    }

    init() {
        this.grid = [];
        for (let x = 0; x < this.width; x++) {
            this.grid[x] = [];
            for (let y = 0; y < this.height; y++) {
                this.grid[x][y] = {
                    wall: true
                }
            }
        }
    }

    draw(ctx) {
        ctx.strokeStyle = this.gridColor;
        for (let x = 0; x < this.grid.length; x++) {
            for (let y = 0; y < this.grid[x].length; y++) {
                ctx.strokeRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
            }
        }
    }

}