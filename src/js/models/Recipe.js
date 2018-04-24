import axios from 'axios'
import { PROXY, GET_URL, KEY } from '../config'

export default class Recipe {
    constructor(id){
        this.id = id
    }

    async getRecipe() {
        try {
            const res = await axios(`${PROXY}${GET_URL}?key=${KEY}&rId=${this.id}`)

            this.title = res.data.recipe.title
            this.author = res.data.recipe.publisher
            this.img = res.data.recipe.image_url
            this.url = res.data.recipe.source_url
            this.ingredients = res.data.recipe.ingredients
            console.log(res)
        } catch(e) {
            console.log(e)
        }
    }

    //假設每三種食材花費15分鐘
    calcTime() {
        const numIng = this.ingredients.length
        const periods = Math.ceil(numIng / 3)
        this.time = periods * 15        
    }
    
    calcServings() {
        this.servings = 4
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds']
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound']
        const units = [...unitsShort, 'kg', 'g']

        const newIngredients = this.ingredients.map( el => {
            // 1. uniform units
            let ingredient = el.toLowerCase()
            unitsLong.forEach( (unit, idx) => {
                ingredient = ingredient.replace(unit, unitsShort[idx])
            })

            // 2. remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ')

            // 3. parse Ingerdients into count, unit and ingerdients
            const arrIng = ingredient.split(' ')
            const unitIndex = arrIng.findIndex(el2 => unitsShort.includes(el2)) 

            let objIng
            if(unitIndex > -1) {
                //there is a unit
                //ex. 4 1/2 cups, arrCount is [4, 1/2]
                //ex. 4 cups, arrCount is [4]
                const arrCount = arrIng.slice(0, unitIndex) 
                
                let count
                if(arrCount.length == 1){
                    count = eval(arrIng[0].replace('-', '+'))
                }else{
                    count = eval(arrIng.slice(0, unitIndex).join('+'))
                }

                objIng = {
                    count, 
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }

            } else if(parseInt(arrIng[0], 10)) {
                //there is no unit, but 1st element is number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if(unitIndex == -1) {
                //there is no unit and no number in 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }

            return objIng
        })
        this.ingredients = newIngredients
    }

    updateServings(type) {
        // Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1

        // Ingredients
        this.ingredients.forEach( ing => {
            ing.count *= (newServings / this.servings)
        })

        this.servings = newServings
    }
}