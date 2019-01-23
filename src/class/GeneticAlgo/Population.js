import { Adventurer } from './Adventurer'
import { MyMath } from '../MyMath'
import CONFIG from '../../config'

export class Population {

    constructor(size, ctx) {
        this.adventurers = []
        this.fitnessSum
        this.gen = 1
        this.bestAdventurer = 0
        this.minStep = CONFIG.MIN_STEP

        for (let i = 0; i < size; i++) {
            this.adventurers.push(new Adventurer(2, 5, ctx))
        }

    }

    /**
     * Check if all the population is alive
     */
    checkPopulation() {
        this.adventurers.forEach((adventurer) => {
            if (adventurer.brain.step > this.minStep) {
                adventurer.isDead = true
            }
        })
    }

    /**
     * Calculate for all the adventurer their ability to mate
     * @param {*} chest 
     */
    calculateAllAdventurerFitness(chest) {
        this.adventurers.forEach((adventurer) => {
            adventurer.calculateFitness(chest)
        })
    }

    /**
     * Return if all adventurer are dead (or have reach the goal)
     */
    isAllAdventurerDead() {
        let allDead = true

        this.adventurers.forEach((adventurer) => {
            if (!adventurer.isDead && !adventurer.reachedGoal) {
                allDead = false
                return
            }
        })

        return allDead
    }

    /**
     * Do the natural selection of the Adventurer
     * 
     * it will select the best adventurers of the population and create
     * a new generation with them
     */
    naturalSelection() {
        this.adventurers = []
        // TODO
    }

    /**
     * Sum all the adventurers ability to reproduce
     */
    calculateFitnessSum() {
        this.fitnessSum = 0

        for (let i = 0; i < this.adventurers.length; i++) {
            this.fitnessSum += this.adventurers[i].fitness;

        }
    }

    /**
     * chooses adventurer from the population to return randomly(considering fitness)
     * 
     * this function works by randomly choosing a value between 0 and the sum of all the fitnesses
     * then go through all the adventurers and add their fitness to a running sum and if that sum is greater 
     * than the random value generated that adventurer is chosen since adventurers with a higher fitness function 
     * add more to the running sum then they have a higher chance of being chosen
     */
    selectParent() {
        let rand = MyMath.random(this.fitnessSum)
        let runningSum = 0

        for (let i = 0; i < this.adventurers.length; i++) {
            runningSum += this.adventurers[i].fitness

            if (runningSum > rand) {
                return this.adventurers[i]
            }

        }

        debugger;
        return null
    }

    /**
     * Will add random movement to the newborn adventurers
     */
    mutateBabies() {
        for (let i = 0; i < this.adventurers.length; i++) {
            this.adventurers[i].brain.mutate()
        }
    }

    /**
     * Select the best adventurer amongst all
     */
    setBestAdventurer() {
        let max = 0
        let maxIndex = 0

        for (let i = 0; i < this.adventurers.length; i++) {
            if (this.adventurers[i].fitness > max) {
                max = this.adventurers[i].fitness
                maxIndex = i
            }
        }
        
        this.bestAdventurer = maxIndex

        if (this.adventurers[this.bestAdventurer].reachedGoal) {
            this.minStep = this.adventurers[this.bestAdventurer].brain.step
            
            $("#nbStep").text(this.minStep)
        }
    }
}
