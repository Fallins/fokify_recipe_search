import Search from './models/Search'
import Recipe from './models/Recipe'
import List from './models/List'
import Likes from './models/Likes'
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import * as listView from './views/listView'
import * as likesView from './views/likesView'
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
    // console.log(query)

    if(query) {
        // 2. new search object and add to state
        state.search = new Search(query)
        // console.log(state.search)

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
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            )
            // console.log(state.recipe)
        } catch (e) {
            console.log(e)
        }
        
    }
}

/* List controller */
const controlList = () => {
    //Create a new list If there in none yet
    if(!state.list) state.list = new List()

    //Add each ingredient to the list
    state.recipe.ingredients.forEach( el => {
        console.log(el)
        const item = state.list.addItem(el.count, el.unit, el.ingredient)
        listView.renderItem(item)
    })
}

/* Likes controller */
const controlLike = () => {
    //Create a new likes If there in none yet
    if(!state.likes) state.likes = new Likes()

    const currentID = state.recipe.id

    // User has NOT yet liked current recipe
    if(!state.likes.isLiked(currentID)) {
        //Add like to the state
        const newLike = state.likes.addLike(
            currentID, 
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        )

        // Toggle the like button
        likesView.toggleLikeBtn(true)

        //Add like to UI list
        likesView.renderLike(newLike)
        // console.log(state.likes)
    }else{
        state.likes.deleteLike(currentID)

        likesView.toggleLikeBtn(false)

        likesView.deleteLike(currentID)
        // console.log(state.likes)
    }
    
    likesView.toggleLikeMenu(state.likes.getNumLikes())
}



//  ============ all eventListener ============
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault()
    controlSearch()
})

elements.searchResPages.addEventListener('click', e => {
    //closest 取得最接近 .btn-inline 的祖先元素
    const btn = e.target.closest('.btn-inline')
    // console.log(btn)

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
    // console.log(ev)
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
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredient to shopping list
        controlList()
    } else if(e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike()
    }
})

//handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid
    // console.log(id)

    // handle the delete button
    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        // delete from state
        state.list.deleteItem(id)

        // delete from UI
        listView.deleteItem(id)
    }else if (e.target.matches('.shopping__count-value')){
        const val = +e.target.value
        state.list.updateCount(id, val)
    }
})

// restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes()
    state.likes.readStorage()
    likesView.toggleLikeMenu(state.likes.getNumLikes())   
    
    state.likes.likes.forEach(like => likesView.renderLike(like))
})