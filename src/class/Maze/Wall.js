import { GridObject } from "../GridObject";
import CONFIG from '../../config'

export class Wall extends GridObject {
    constructor(x, y, width, height, ctx, grid) {
        super(x, y, width, height, CONFIG.WALL_COLOR, ctx, grid)
    }

    isColliding(posX, posY) {
        return (posX >= this.x && posX < this.x + this.width) 
        && (posY >= this.y && posY < this.y + this.height)
    }
}