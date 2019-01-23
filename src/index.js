import { Chest } from './class/Maze/Chest';
import { Grid } from './class/Maze/Grid';
import { Population } from './class/GeneticAlgo/Population';
import { Wall } from './class/Maze/Wall';
import CONFIG from './config'

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

        this.walls = []

        let nbWall = CONFIG.NB_WALL
        let lengthWallToPlace = this.grid.width / (nbWall + 1);
        let wallWidth = 2
        let wallHeight = Math.round(this.grid.height / 2) + 2

        for (let i = 1; i < nbWall + 1; i++) {
            if (i % 2)
                this.walls[i] = new Wall(i * lengthWallToPlace, 0, wallWidth, wallHeight, this.ctx, this.grid)
            else
                this.walls[i] = new Wall(i * lengthWallToPlace, this.grid.height - wallHeight, wallWidth, wallHeight, this.ctx, this.grid)
        }

        this.population = new Population(CONFIG.NB_POPULATION, this.ctx)
    }

    mainDraw(showOnlyTheBest) {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        this.grid.draw(this.ctx)
        this.walls.forEach((wall) => wall.draw())

        this.goal.draw()

        this.population.adventurers.forEach((adventurer) => {
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
            this.population.adventurers.forEach((adventurer) => {
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
function setNewFPS(fps) {
    if (fps < 10 || fps > 300) return;

    $("#ActualFPS").val(fps);

    if (timer) {
        clearInterval(timer);
        timer = null;
        timer = setInterval(step, 1000 / fps)
    }
}

$("#pause").on('click', (e) => {
    if (timer) {
        clearInterval(timer);
        timer = null
    } else {
        let fps = parseInt($("#ActualFPS").val())
        timer = setInterval(step, 1000 / fps)
    }
})

$("#restart").on('click', (e) => {
    window.location.reload();
})

$("#ActualFPS").on("change", (e) => {
    let fps = parseInt($("#ActualFPS").val())

    if (fps < 10 || fps > 300) { $("#ActualFPS").val(60) }

    setNewFPS(fps)
})

$("#showTheBest").on('click', (e) => {
    showOnlyTheBest = !showOnlyTheBest
})