import { DotGoal } from './class/DotGoal';
import { Grid } from './class/Grid';
import { Population } from './class/Population';
import { Wall } from './class/Wall';


class Game {
    constructor() {
        this.ctx = $("canvas").get(0).getContext("2d")
        this.ctx.canvas.width = this.ctx.canvas.clientWidth
        this.ctx.canvas.height = this.ctx.canvas.clientHeight

        this.grid = new Grid(this.ctx)

        this.dotGoal = new DotGoal(this.ctx, this.grid)

        this.walls = [
            new Wall(10, 0, 2, 20, this.ctx, this.grid),
            new Wall(20, this.grid.height-20, 2, 20, this.ctx, this.grid),
            //new Wall(500, 0, 70, 700, this.ctx),
            //new Wall(500,this.ctx.canvas.height/2-250, 35, 500, this.ctx)
        ]

        this.population = new Population(1000, this.ctx)
        //this.dotsArray = [new Dot(this.ctx.canvas.width / 2, this.ctx.canvas.height -20, 'red')]
        
    }

    mainDraw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        this.grid.draw(this.ctx)
        this.walls.forEach((wall) => wall.draw())

        this.dotGoal.draw()

        this.population.dotsPopulation.forEach((dot) => {
            dot.draw(this.grid)
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
                dot.checkCollision(this.walls, this.grid)
                dot.checkTouchGoal(this.dotGoal)
                dot.move(deltaT, this.grid)
            })
        }
    }
}

let lastTimestamp = window.performance.now();
let game = new Game()


const step = () => {

    let now = window.performance.now();
    let deltaT = now - lastTimestamp;
    lastTimestamp = now;

    game.mainDraw()
    
    game.update(deltaT)

}

let timer = setInterval(step, 1000 / 60)