import axios from 'axios'
import { PROXY, SEARCH_URL, KEY } from '../config'

export default class Search {
    constructor(query) {
        this.query = query
    }

    async getResults() {   
        try{
            const res = await axios(`${PROXY}${SEARCH_URL}?key=${KEY}&q=${this.query}`)
            this.result = res.data.recipes
            
            // console.log(this.result)
        } catch (e) {
            console.log(e)
        }
    }
}






