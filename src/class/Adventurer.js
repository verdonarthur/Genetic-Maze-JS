import { BrainOfDot } from './BrainOfDot'
import { MyMath } from './MyMath'

export class Adventurer {
    constructor(x, y, color, ctx) {
        this.x = x
        this.y = y
        this.color = color
        this.ctx = ctx


        this.RADIUS = 5
        this.SPEED = this.RADIUS / 2

        this.isBest = false
        this.fitness = 0
        this.reachedGoal = false
        this.isDead = false
        this.direction = 0
        this.brain = new BrainOfDot(2000)
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.fillStyle = this.color
        this.ctx.arc(this.x, this.y, this.RADIUS, 0, 2 * Math.PI);
        this.ctx.closePath();
        this.ctx.fill();
    }

    move(deltaT) {
        if (this.isDead || this.reachedGoal) {
            return
        }

        //if there are still directions left then set the acceleration as the next PVector in the direcitons array
        if (this.brain.directions.length > this.brain.step) {
            this.direction = this.brain.directions[this.brain.step];
            this.brain.step++;

        }
        //if at the end of the directions array then the dot is dead
        else {
            this.isDead = true;
            return
        }

        let distX = this.SPEED * deltaT * Math.cos(this.direction);
        let distY = this.SPEED * deltaT * Math.sin(this.direction);
        this.x += distX;
        this.y += distY;
    }

    checkCollision(walls) {
        if (this.isDead || this.reachedGoal)
            return

        if ((this.x < 0 || this.x > this.ctx.canvas.width)
            || (this.y < 0 || this.y > this.ctx.canvas.height)) {
            this.isDead = true
            return
        }

        walls.forEach(wall => {
            if (wall.isAdventurerColliding(this))
                this.isDead = true
        });
    }

    checkTouchGoal(dotGoal) {
        if (this.isDead || this.reachedGoal)
            return

        if ((this.x > dotGoal.x && this.x < dotGoal.x + dotGoal.width)
            && (this.y > dotGoal.y && this.y < dotGoal.y + dotGoal.height)) {
            this.reachedGoal = true
        }
    }

    calculateFitness(dotGoal) {
        //if the dot reached the goal then the fitness is based on the amount of steps it took to get there
        if (this.reachedGoal) {
            this.fitness = 1.0 / 16.0 + 10000.0 / (this.brain.step * this.brain.step)
        }
        //if the dot didn't reach the goal then the fitness is based on how close it is to the goal
        else {
            let distanceToGoal = MyMath.distBetweenTwoPoints(this.x, this.y, dotGoal.x, dotGoal.y)
            this.fitness = 1.0 / (distanceToGoal * distanceToGoal)
        }
    }

    makeABaby() {
        let baby = new Adventurer(20, 20, 'white', this.ctx)
        baby.brain = this.brain.clone()
        return baby
    }
}