import { BrainOfDot } from './BrainOfDot'
import { MyMath } from './MyMath'

class CAUSE_OF_DEATH { constructor() { this.WALL = false; this.SIDE = false } }

export class Adventurer {
    constructor(x, y, color, ctx, grid) {
        this.x = x
        this.y = y
        this.color = color
        this.ctx = ctx


        this.RADIUS = 10
        this.SPEED = 1

        this.causeOfDeath = new CAUSE_OF_DEATH
        this.isBest = false
        this.fitness = 0
        this.reachedGoal = false
        this.isDead = false
        this.direction = 0
        this.brain = new BrainOfDot(1000)
    }

    draw(grid) {
        let tileSize = grid.tileSize
        this.ctx.fillStyle = this.color
        this.ctx.fillRect(this.x * tileSize, this.y * tileSize, tileSize, tileSize)
    }

    move(deltaT, grid) {
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

    checkCollision(walls, grid) {
        if (this.isDead || this.reachedGoal)
            return

        if ((this.x < 1 || this.x >= grid.width - 1)
            || (this.y < 1 || this.y >= grid.height - 1)) {
            this.causeOfDeath.SIDE = true;
            this.isDead = true
            return
        }

        walls.forEach(wall => {
            if (wall.isAdventurerColliding(this))
                this.isDead = true
            this.causeOfDeath.WALL = true;
        });
    }

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

    calculateFitness(dotGoal) {

        if (this.reachedGoal) {
            this.fitness = 1.0 / 16.0 + 10000.0 / (this.brain.step * this.brain.step)

        } else {
            let distanceToGoal = Math.round(MyMath.distBetweenTwoPoints(this.x, this.y, dotGoal.x, dotGoal.y))

            if (this.causeOfDeath.SIDE) {
                //distanceToGoal *= 0.7
            }

            if (this.causeOfDeath.WALL) {
                //distanceToGoal *= 0.3
            }

            this.fitness = 1.0 / (distanceToGoal != 0 ? (distanceToGoal * distanceToGoal) : 1)
        }
    }

    makeABaby() {
        let baby = new Adventurer(2, 5, 'white', this.ctx)
        baby.brain = this.brain.clone()
        return baby
    }
}