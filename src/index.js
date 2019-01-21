import { Dot } from './class/Dot'
import { DotGoal } from './class/DotGoal'
import { Population } from './class/Population';

class Game {
    constructor() {
        this.ctx = $("canvas").get(0).getContext("2d")
        this.ctx.canvas.width = this.ctx.canvas.clientWidth
        this.ctx.canvas.height = this.ctx.canvas.clientHeight

        this.dotGoal = new DotGoal(this.ctx)

        this.population = new Population(500, this.ctx)
        //this.dotsArray = [new Dot(this.ctx.canvas.width / 2, this.ctx.canvas.height -20, 'red')]
    }

    mainDraw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        this.population.dotsPopulation.forEach((dot) => {
            dot.draw()
        })

        this.dotGoal.draw()
    }

    update(deltaT) {
        if(this.population.isAllDotsDead()){
            // genetic algo
            this.population.calculateAllDotFitness(this.dotGoal)
            this.population.naturalSelection()
            this.population.mutateBabies()
        }else{
            this.population.checkPopulation()
        this.population.dotsPopulation.forEach((dot) => {
            dot.checkCollision()
            dot.checkTouchGoal(this.dotGoal)
            dot.move(deltaT)
        })
        }       
    }
}

let lastTimestamp = 0
let game = new Game()

const step = (timestamp) => {
    let deltaT = timestamp - lastTimestamp

    game.mainDraw()
    game.update(deltaT)

    lastTimestamp = timestamp
    
    requestAnimationFrame(step)
}

requestAnimationFrame(step)