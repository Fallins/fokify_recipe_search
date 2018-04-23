import axios from 'axios'

const PROXY = 'https://cors-anywhere.herokuapp.com/'
const SEARCH_URL = 'http://food2fork.com/api/search'
const KEY = 'f7eabbde5ccf27bcf1174a1e2fa38652'

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






