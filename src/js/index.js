import Search from './models/Search'
import Recipe from './models/Recipe'
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import { elements, renderLoader, clearLoader } from './views/base'

// this is global state of the app
//  - Search Object
//  - Current recipe Object
//  - Shopping list Object
//  - Liked recipes
const state = {}


/* Search controller */
const controlSearch = async () => {
    // 1. get query from view
    const query = searchView.getInput()
    console.log(query)

    if(query) {
        // 2. new search object and add to state
        state.search = new Search(query)
        console.log(state.search)

         // 3. prepare UI for results
         searchView.clearInput()
         searchView.clearResults()
         renderLoader(elements.searchRes)

        try {
            // 4.search for recipes
            await state.search.getResults()

            // 5. render results on UI
            clearLoader()
            searchView.renderResults(state.search.result)
            // console.log(state.search.result)
        } catch(e) {
            clearLoader()
            console.log(e)
        }        
    }
}

/* Recipe controller */
const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '')
    console.log(id)  //#345684

    if(id) {
        // Prepare UI for changes
        recipeView.clearRecipe()
        renderLoader(elements.recipe)

        // Highlight selected search item
        if(state.search) searchView.highlightSelected(id)

        //Create new recipe object
        state.recipe = new Recipe(id)        

        try {
            //Get recipe data and parse ingredients
            await state.recipe.getRecipe()
            state.recipe.parseIngredients()

            window.r = state.recipe //testing purpose

            //calculate servings and time
            state.recipe.calcTime()
            state.recipe.calcServings()

            // Render recipe
            clearLoader()
            recipeView.renderRecipe(state.recipe)
            // console.log(state.recipe)
        } catch (e) {
            console.log(e)
        }
        
    }
}


// eventListener
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault()
    controlSearch()
})

elements.searchResPages.addEventListener('click', e => {
    //closest 取得最接近 .btn-inline 的祖先元素
    const btn = e.target.closest('.btn-inline')
    console.log(btn)

    if(btn) {
        const goToPage = btn.dataset.goto
        searchView.clearResults()
        searchView.renderResults(state.search.result, goToPage)
    }
})


// window.addEventListener('hashchange', controlRecipe)
// window.addEventListener('load', controlRecipe)
const events = ['hashchange', 'load']
events.forEach( (ev) => {
    console.log(ev)
    window.addEventListener(ev, controlRecipe)
})

// handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        if(state.recipe.servings > 1) {
            state.recipe.updateServings('dec')
            recipeView.updateServingsIngredients(state.recipe)
        }           
    } else if(e.target.matches('.btn-increase, .btn-increase *')){        
        state.recipe.updateServings('inc')
        recipeView.updateServingsIngredients(state.recipe)
    }
})