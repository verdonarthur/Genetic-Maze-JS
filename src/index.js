import { Chest } from './class/Maze/Chest';
import { Grid } from './class/Maze/Grid';
import { Population } from './class/GeneticAlgo/Population';
import { Wall } from './class/Maze/Wall';

/**
 * Class used to set up the environment
 */
class Game {
    constructor() {
        this.ctx = $("canvas").get(0).getContext("2d")
        this.ctx.canvas.width = this.ctx.canvas.clientWidth
        this.ctx.canvas.height = this.ctx.canvas.clientHeight

        this.grid = new Grid(this.ctx)

        this.goal = new Chest(this.ctx, this.grid)

        this.walls = [
            new Wall(5, 0, 2, Math.round(this.grid.height / 2), this.ctx, this.grid),
            new Wall(10, this.grid.height - Math.round(this.grid.height / 2), 2, Math.round(this.grid.height / 2), this.ctx, this.grid),
            new Wall(15, 0, 2, Math.round(this.grid.height / 2), this.ctx, this.grid),
            new Wall(20, this.grid.height - Math.round(this.grid.height / 2), 2, Math.round(this.grid.height / 2), this.ctx, this.grid),
        ]

        this.population = new Population(250, this.ctx)
    }

    mainDraw(showOnlyTheBest) {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        this.grid.draw(this.ctx)
        this.walls.forEach((wall) => wall.draw())

        this.goal.draw()

        this.population.Adventurers.forEach((adventurer) => {
            if (showOnlyTheBest) {
                if (adventurer.isBest) {
                    adventurer.draw(this.grid)
                }
            } else {
                adventurer.draw(this.grid)
            }
        })
    }

    update(deltaT) {
        if (this.population.isAllAdventurerDead()) {
            this.population.calculateAllAdventurerFitness(this.goal)
            this.population.naturalSelection()
            this.population.mutateBabies()
            $("#nbGen").text(this.population.gen)
        } else {
            this.population.checkPopulation()
            this.population.Adventurers.forEach((adventurer) => {


                adventurer.move(this.walls, this.grid, this.goal)
            })
        }
    }
}

let lastTimestamp = window.performance.now();
let game = new Game()
let showOnlyTheBest = false

/*
--------------- LAUNCH GAME LOOP
*/

const step = () => {

    let now = window.performance.now();
    let deltaT = now - lastTimestamp;
    lastTimestamp = now;

    game.mainDraw(showOnlyTheBest)

    game.update(deltaT)

}

let timer = setInterval(step, 1000 / 60)


/*
-------------- CONTROL MANAGEMENT
*/
function setNewFPS(FPS) {
    if (FPS < 10 || FPS > 300) return;

    $("#ActualFPS").val(FPS);

    if (timer) {
        clearInterval(timer);
        timer = null;
        timer = setInterval(step, 1000 / FPS)
    }
}

$("#FPSUp").on('click', (e) => {
    let fps = parseInt($("#ActualFPS").val())
    fps += 5


    setNewFPS(fps)
})

$("#FPSDown").on('click', (e) => {
    let fps = parseInt($("#ActualFPS").val())
    fps -= 5


    setNewFPS(fps)
})

$("#ActualFPS").on("change", (e) => {
    let fps = parseInt($("#ActualFPS").val())

    if (fps < 10 || fps > 300) { $("#ActualFPS").val(60) }

    setNewFPS(fps)
})

$("#showTheBest").on('click', (e) => {
    showOnlyTheBest = !showOnlyTheBest
})