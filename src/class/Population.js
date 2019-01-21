import { Adventurer } from './Adventurer'
import { MyMath } from './MyMath'

export class Population {

    constructor(size, ctx) {
        this.dotsPopulation = []
        this.fitnessSum
        this.gen = 1
        this.bestDot = 0    //the index of the best dot in the dots[]
        this.minStep = 10000

        for (let i = 0; i < size; i++) {
            this.dotsPopulation.push(new Adventurer(10, ctx.canvas.height / 2, 'white', ctx))
        }

    }

    checkPopulation() {
        this.dotsPopulation.forEach((dot) => {
            //if the dot has already taken more steps than the best dot has taken to reach the goal
            if (dot.brain.step > this.minStep) {
                dot.isDead = true
            }
        })
    }

    calculateAllDotFitness(dotGoal) {
        this.dotsPopulation.forEach((dot) => {
            dot.calculateFitness(dotGoal)
        })
    }

    isAllDotsDead() {
        let allDead = true

        this.dotsPopulation.forEach((dot) => {
            if (!dot.isDead && !dot.reachedGoal) {
                allDead = false
                return
            }
        })

        return allDead
    }

    naturalSelection() {
        let newDotsPopulation = new Array(this.dotsPopulation.length)
        this.setBestDot()
        this.calculateFitnessSum()

        // the champion lives on
        newDotsPopulation[0] = this.dotsPopulation[this.bestDot].makeABaby()
        newDotsPopulation[0].isBest = true
        newDotsPopulation[0].color = 'green'
        newDotsPopulation[0].RADIUS = newDotsPopulation[0].RADIUS * 3

        for (let i = 1; i < newDotsPopulation.length; i++) {
            let parent = this.selectParent()
            newDotsPopulation[i] = parent.makeABaby()
        }

        this.dotsPopulation = newDotsPopulation.slice()
        this.gen++
    }

    calculateFitnessSum() {
        this.fitnessSum = 0

        for (let i = 0; i < this.dotsPopulation.length; i++) {
            this.fitnessSum += this.dotsPopulation[i].fitness;

        }
    }

    /**
     * chooses dot from the population to return randomly(considering fitness)
     * this function works by randomly choosing a value between 0 and the sum of all the fitnesses
     * then go through all the dots and add their fitness to a running sum and if that sum is greater than the random value generated that dot is chosen
     * since dots with a higher fitness function add more to the running sum then they have a higher chance of being chosen
     */
    selectParent() {
        let rand = MyMath.random(this.fitnessSum)

        let runningSum = 0

        for (let i = 0; i < this.dotsPopulation.length; i++) {
            runningSum += this.dotsPopulation[i].fitness

            if (runningSum > rand) {
                return this.dotsPopulation[i]
            }

        }

        return null
    }

    mutateBabies() {
        for (let i = 0; i < this.dotsPopulation.length; i++) {
            this.dotsPopulation[i].brain.mutate()
        }
    }

    setBestDot() {
        let max = 0
        let maxIndex = 0

        for (let i = 0; i < this.dotsPopulation.length; i++) {
            if (this.dotsPopulation[i].fitness > max) {
                max = this.dotsPopulation[i].fitness
                maxIndex = i
            }

        }

        this.bestDot = maxIndex

        if (this.dotsPopulation[this.bestDot].reachedGoal) {
            this.minStep = this.dotsPopulation[this.bestDot].brain.step
            console.log("step :", this.minStep)
        }
    }
}
