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
        this.brain = new BrainOfDot(500)
    }

    /**
     * move the adventurer trough the grid
     * @param {*} deltaT 
     * @param {*} grid 
     */
    move(walls, grid = this.grid, chest) {
        if (this.isDead || this.reachedGoal) {
            return
        }

        if (this.checkTouchGoal(chest))
            return

        if (this.brain.directions.length > this.brain.step) {
            this.direction = this.brain.directions[this.brain.step]
            this.brain.step++
        } else {
            this.isDead = true
            return
        }

        let specAngle = (Math.PI / 4)
        this.direction = Math.round(this.direction / specAngle) * specAngle

        let newPosX = Math.round(this.SPEED * Math.cos(this.direction))
        let newPosY = Math.round(this.SPEED * Math.sin(this.direction))

        if (this.checkCollision(walls, grid, newPosX, newPosY))
            return


        this.x += newPosX
        this.y += newPosY

    }

    /**
     * Check if the adventurer is touching a wall or the side of the grid
     * @param {*} walls 
     * @param {*} grid 
     */
    checkCollision(walls, grid, newPosX, newPosY) {
        if (this.isDead || this.reachedGoal)
            return true

        if ((this.x + newPosX < 0 || this.x + newPosX >= grid.width)
            || (this.y + newPosY < 0 || this.y + newPosY >= grid.height)) {

            return true
        }

        let hasCollide = false
        walls.forEach(wall => {
            if (wall.isColliding(this.x + newPosX, this.y + newPosY)) {
                hasCollide = true
            }
        });

        return hasCollide
    }

    /**
     * Check if the adventurer touch the goal
     * @param {*} dotGoal 
     */
    checkTouchGoal(dotGoal) {
        if (
            ((this.x >= dotGoal.x && this.x < dotGoal.x + dotGoal.width)
                && (this.y >= dotGoal.y && this.y < dotGoal.y + dotGoal.height))
            || (this.x == dotGoal.x && this.y == dotGoal.y)
        ) {
            this.reachedGoal = true
            return true
        }

        return false
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