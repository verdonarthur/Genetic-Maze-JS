import { Adventurer } from './Adventurer'
import { MyMath } from '../MyMath'
import CONFIG from '../../config'

export class Population {

    constructor(size, ctx) {
        this.Adventurers = []
        this.fitnessSum
        this.gen = 1
        this.bestAdventurer = 0
        this.minStep = CONFIG.MIN_STEP

        for (let i = 0; i < size; i++) {
            this.Adventurers.push(new Adventurer(2, 5, ctx))
        }

    }

    /**
     * Check if all the population is alive
     */
    checkPopulation() {
        this.Adventurers.forEach((adventurer) => {
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
        this.Adventurers.forEach((adventurer) => {
            adventurer.calculateFitness(chest)
        })
    }

    /**
     * Return if all adventurer are dead (or have reach the goal)
     */
    isAllAdventurerDead() {
        let allDead = true

        this.Adventurers.forEach((adventurer) => {
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
        let newAdventurers = new Array(this.Adventurers.length)
        this.setBestAdventurer()
        this.calculateFitnessSum()

        // the champion lives on
        newAdventurers[0] = this.Adventurers[this.bestAdventurer].makeABaby()
        newAdventurers[0].isBest = true
        newAdventurers[0].color = CONFIG.BEST_ADVENTURER_COLOR

        for (let i = 1; i < newAdventurers.length; i++) {
            let parent = this.selectParent()
            newAdventurers[i] = parent.makeABaby()
        }

        this.Adventurers = newAdventurers.slice()
        this.gen++
    }

    /**
     * Sum all the adventurers ability to reproduce
     */
    calculateFitnessSum() {
        this.fitnessSum = 0

        for (let i = 0; i < this.Adventurers.length; i++) {
            this.fitnessSum += this.Adventurers[i].fitness;

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

        for (let i = 0; i < this.Adventurers.length; i++) {
            runningSum += this.Adventurers[i].fitness

            if (runningSum > rand) {
                return this.Adventurers[i]
            }

        }

        debugger;
        return null
    }

    /**
     * Will add random movement to the newborn adventurers
     */
    mutateBabies() {
        for (let i = 0; i < this.Adventurers.length; i++) {
            this.Adventurers[i].brain.mutate()
        }
    }

    /**
     * Select the best adventurer amongst all
     */
    setBestAdventurer() {
        let max = 0
        let maxIndex = 0

        for (let i = 0; i < this.Adventurers.length; i++) {
            if (this.Adventurers[i].fitness > max) {
                max = this.Adventurers[i].fitness
                maxIndex = i
            }
        }
        
        this.bestAdventurer = maxIndex

        if (this.Adventurers[this.bestAdventurer].reachedGoal) {
            this.minStep = this.Adventurers[this.bestAdventurer].brain.step
            
            $("#nbStep").text(this.minStep)
        }
    }
}
