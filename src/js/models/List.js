import uniqid from 'uniqid'

export default class List {
    constructor() {
        this.items = []
    }

    addItem (count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count, unit, ingredient
        }

        this.items.push(item)
        return item
    }

    deleteItem(id) {
        // splice will mutated original array
        // [2, 4, 8] splice(1, 2) -> returns [4, 8], original arr is [2]

        // slice will return a new array
        // [2, 4, 8] slice(1, 2) -> returns [4], original array is [2, 4, 8]

        const index = this.items.findIndex(el => el.id === id)
        return this.items.splice(index, 1)
    }

    updateCount(id, newCount){        
        if(newCount > 0)
            this.items.find( el => el.id === id).count = newCount        
    }
}