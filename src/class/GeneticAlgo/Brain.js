import {MyMath} from '../MyMath'

export class Brain {

    constructor(size) {
        this.directions = []
        
        for(let i=0;i < size;i++){
            this.directions[i] = 0
        }
        
        this.step = 0
        this.randomize()
    }


    /**
     * sets all the vectors in directions to a random vector with length 1
     */
    randomize() {
        for (let i = 0; i < this.directions.length; i++) {
            let randomAngle = MyMath.random(2 * Math.PI)
            this.directions[i] = randomAngle
        }
    }

    /**
     * returns a perfect copy of this brain object 
     */
    clone() {
        let clone = new Brain(this.directions.length)
        for (let i = 0; i < this.directions.length; i++) {
            clone.directions[i] = this.directions[i]
        }

        return clone
    }

    /**
     * mutates the brain by setting some of the directions to random vectors
     */
    mutate() {
        //chance that any vector in directions gets changed
        let mutationRate = 0.01

        for (let i = 0; i < this.directions.length; i++) {
            let rand = MyMath.random(1)
            if (rand < mutationRate) {
                
                //set this direction as a random direction 
                let randomAngle = MyMath.random(2 * Math.PI)
                this.directions[i] = randomAngle
            }
        }
    }
}