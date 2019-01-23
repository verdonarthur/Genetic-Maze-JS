import { GridObject } from "../GridObject";
import CONFIG from '../../config'

export class Chest extends GridObject {
    constructor(ctx, grid) {
        super(grid.width - 4, grid.height - 4, 3, 3, CONFIG.CHEST_COLOR, ctx, grid)
    }

}