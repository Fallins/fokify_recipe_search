import Search from './models/Search'
import * as searchView from './views/searchView'
import { elements, renderLoader, clearLoader } from './views/base'

// this is global state of the app
//  - Search Object
//  - Current recipe Object
//  - Shopping list Object
//  - Liked recipes
const state = {}

const controlSearch = async () => {
    // 1. get query from view
    const query = searchView.getInput

    if(query) {
        // 2. new search object and add to state
        state.search = new Search(query)
        console.log(state.search)

        // 3. prepare UI for results
        searchView.clearInput()
        searchView.clearResults()
        renderLoader(elements.searchRes)

        // 4.search for recipes
        await state.search.getResults()

        // 5. render results on UI
        clearLoader()
        searchView.renderResults(state.search.result)
        // console.log(state.search.result)
        
    }
}
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
        searchView.renderResults(goToPage)
    }
})