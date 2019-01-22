import { GridObject } from "../GridObject";

export class Wall extends GridObject {
    constructor(x, y, width, height, ctx, grid) {
        super(x, y, width, height, 'brown', ctx, grid)
    }

    isAdventurerColliding(adventurer) {
        return (adventurer.x >= this.x && adventurer.x < this.x + this.width) 
        && (adventurer.y >= this.y && adventurer.y < this.y + this.height)
    }
}