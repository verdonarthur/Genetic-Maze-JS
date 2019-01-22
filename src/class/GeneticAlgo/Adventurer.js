import { BrainOfDot } from './BrainOfDot'
import { MyMath } from '../MyMath'
import { GridObject } from '../GridObject';

/**
 * 
 */
export class Adventurer extends GridObject {
    constructor(x, y, ctx, grid) {
        super(x, y, 1, 1, 'white', ctx, grid)

        this.SPEED = 1
        this.START_X = x
        this.START_Y = y

        this.isBest = false
        this.fitness = 0
        this.reachedGoal = false
        this.isDead = false
        this.direction = 0
        this.brain = new BrainOfDot(1000)
    }

    /**
     * move the adventurer trough the grid
     * @param {*} deltaT 
     * @param {*} grid 
     */
    move(deltaT, grid = this.grid) {
        if (this.isDead || this.reachedGoal) {
            return
        }

        if (this.brain.directions.length > this.brain.step) {
            this.direction = this.brain.directions[this.brain.step]
            this.brain.step++
        } else {
            this.isDead = true
            return
        }

        let specAngle = (Math.PI / 4)
        this.direction = Math.round(this.direction / specAngle) * specAngle

        this.x += Math.round(this.SPEED * Math.cos(this.direction))
        this.y += Math.round(this.SPEED * Math.sin(this.direction))

    }

    /**
     * Check if the adventurer is touching a wall or the side of the grid
     * @param {*} walls 
     * @param {*} grid 
     */
    checkCollision(walls, grid) {
        if (this.isDead || this.reachedGoal)
            return

        if ((this.x < 1 || this.x >= grid.width - 1)
            || (this.y < 1 || this.y >= grid.height - 1)) {
            this.isDead = true
            return
        }

        walls.forEach(wall => {
            if (wall.isAdventurerColliding(this))
                this.isDead = true
        });
    }

    /**
     * Check if the adventurer touch the goal
     * @param {*} dotGoal 
     */
    checkTouchGoal(dotGoal) {
        if (this.isDead || this.reachedGoal)
            return

        if (
            ((this.x >= dotGoal.x && this.x < dotGoal.x + dotGoal.width)
                && (this.y >= dotGoal.y && this.y < dotGoal.y + dotGoal.height))
            || (this.x == dotGoal.x && this.y == dotGoal.y)
        ) {
            this.reachedGoal = true
        }
    }

    /**
     * Calculate the ability of the adventurer to pass his gen
     * @param {*} dotGoal 
     */
    calculateFitness(dotGoal) {

        if (this.reachedGoal) {
            this.fitness = 1.0 / 16.0 + 10000.0 / (this.brain.step * this.brain.step)
        } else {
            let distanceToGoal = Math.round(MyMath.distBetweenTwoPoints(this.x, this.y, dotGoal.x, dotGoal.y))

            this.fitness = 1.0 / (distanceToGoal != 0 ? (distanceToGoal * distanceToGoal) : 1)
        }
    }

    /**
     * #straightforward
     */
    makeABaby() {
        let baby = new Adventurer(this.START_X, this.START_Y, this.ctx)
        baby.brain = this.brain.clone()
        return baby
    }
}