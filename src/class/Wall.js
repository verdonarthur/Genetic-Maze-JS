export class Wall {
    constructor(x, y, width, height, ctx) {
        this.x = x
        this.y = y
        this.ctx = ctx
        this.width = width
        this.height = height
    }

    draw() {
        this.ctx.beginPath();

        this.ctx.fillStyle = 'brown'

        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        
        this.ctx.closePath();
    }

    isAdventurerColliding(adventurer) {
        return (adventurer.x > this.x && adventurer.x < this.x + this.width) && (adventurer.y > this.y && adventurer.y < this.y + this.height)
    }
}