import { GridObject } from "../GridObject";

export class Wall extends GridObject {
    constructor(x, y, width, height, ctx, grid) {
        super(x, y, width, height, 'brown', ctx, grid)
    }

    isColliding(posX, posY) {
        return (posX >= this.x && posX < this.x + this.width) 
        && (posY >= this.y && posY < this.y + this.height)
    }
}