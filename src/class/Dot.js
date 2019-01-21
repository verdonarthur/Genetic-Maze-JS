import { BrainOfDot } from './BrainOfDot'
import {MyMath} from './MyMath'

export class Dot {
    constructor(x, y, color, ctx) {
        this.x = x
        this.y = y
        this.color = color
        this.ctx = ctx

        this.isBest = false
        this.fitness = 0
        this.reachedGoal = false
        this.radius = 3
        this.speed = 5
        this.isDead = false
        this.direction = 0
        this.brain = new BrainOfDot(1000)
    }

    draw() {
        this.ctx.beginPath();
        
        if(this.isBest){
            this.ctx.fillStyle = 'green'
        }else{            
            this.ctx.fillStyle = this.color;
        }

        this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        this.ctx.closePath();
        this.ctx.fill();
    }

    move(deltaT) {
        if (this.isDead) {
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

        let distX = this.speed * deltaT * Math.cos(this.direction);
        let distY = this.speed * deltaT * Math.sin(this.direction);
        this.x += distX;
        this.y += distY;
    }

    checkCollision() {
        if ((this.x < 0 || this.x > this.ctx.canvas.width)
            || (this.y < 0 || this.y > this.ctx.canvas.height)) {
            this.isDead = true
        }
    }

    checkTouchGoal(dotGoal) {
        if ((this.x > dotGoal.x && this.x < dotGoal.x + dotGoal.radius)
            && (this.y > dotGoal.y && this.y < dotGoal.y + dotGoal.radius)) {
            this.isDead = true
            this.reachedGoal = true
        }
    }

    calculateFitness(dotGoal) {
        //if the dot reached the goal then the fitness is based on the amount of steps it took to get there
        if (this.reachedGoal) {
            this.fitness = 1.0 / 16.0 + 10000.0 / (this.brain.step * this.brain.step);
        }
        //if the dot didn't reach the goal then the fitness is based on how close it is to the goal
        else {
            let distanceToGoal = MyMath.distBetweenTwoPoints(this.x, this.y, dotGoal.x, dotGoal.y);
            this.fitness = 1.0 / (distanceToGoal * distanceToGoal);
        }
    }

    makeABaby() {
        let baby = new Dot(20, 20, this.color, this.ctx)
        baby.brain = this.brain.clone()
        return baby
    }
}