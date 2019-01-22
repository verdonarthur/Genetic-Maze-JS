import { GridObject } from "../GridObject";

export class Chest extends GridObject {
    constructor(ctx, grid) {
        super(grid.width - 4, grid.height - 4, 3, 3, 'yellow', ctx, grid)
    }

}