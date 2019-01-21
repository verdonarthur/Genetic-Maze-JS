import { DotGoal } from './class/DotGoal';
import { Population } from './class/Population';
import { Wall } from './class/Wall';


class Game {
    constructor() {
        this.ctx = $("canvas").get(0).getContext("2d")
        this.ctx.canvas.width = this.ctx.canvas.clientWidth
        this.ctx.canvas.height = this.ctx.canvas.clientHeight

        this.dotGoal = new DotGoal(this.ctx)

        this.walls = [
            //new Wall(470, this.ctx.canvas.height-500, 70, 500, this.ctx),
            new Wall(500,this.ctx.canvas.height/2-250, 70, 500, this.ctx)
        ]

        this.population = new Population(1000, this.ctx)
        //this.dotsArray = [new Dot(this.ctx.canvas.width / 2, this.ctx.canvas.height -20, 'red')]
    }

    mainDraw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        this.walls.forEach((wall) => wall.draw())

        this.dotGoal.draw()

        this.population.dotsPopulation.forEach((dot) => {
            dot.draw()
        })
    }

    update(deltaT) {
        if (this.population.isAllDotsDead()) {
            // genetic algo
            this.population.calculateAllDotFitness(this.dotGoal)
            this.population.naturalSelection()
            this.population.mutateBabies()
            $("#nbGen").text(this.population.gen)
        } else {
            this.population.checkPopulation()
            this.population.dotsPopulation.forEach((dot) => {
                dot.checkCollision(this.walls)
                dot.checkTouchGoal(this.dotGoal)
                dot.move(deltaT)
            })
        }
    }
}

let lastTimestamp = 0
let game = new Game()

const step = (now, lastTime, ctx) => {
    requestAnimationFrame(time => step(time, now))
    let deltaT = now - lastTime;

    game.mainDraw()
    game.update(deltaT)
}

requestAnimationFrame(now => step(now, now))