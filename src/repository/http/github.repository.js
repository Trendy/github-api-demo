class GithubRepository {
    constructor() {
        this.GITHUB_API_URL = process.env.GITHUB_API_URL;
        this.GITHUB_TOKEN = process.env.GITHUB_TOKEN;

        this.USER_SEARCH_CACHE = {};
        this.USER_INFO_CACHE = {};

        this.GET_OPTIONS = {
            method: 'GET',
            headers: {
                Authorization: `token ${this.GITHUB_TOKEN}`
            }
        };

    }

    async searchForUser(searchTerm, page = 1, pageSize = 25) {
        if(!searchTerm) throw new Error('Search Term Must Not Be Empty');
        const params = new URLSearchParams({
            q: searchTerm,
            page,
            per_page: pageSize
        });
        const URL = `${this.GITHUB_API_URL}/search/users?` + params;

        if(this.USER_SEARCH_CACHE[URL]){
            return this.USER_SEARCH_CACHE[URL];
        }

        let response = await fetch(URL + params, this.GET_OPTIONS);
        response = await response.json();
        this.cacheResponse('USER_SEARCH_CACHE', URL, response);

        return response;
    }

    async getUserInfo(URL) {
        if(!URL) throw new Error('User Name Must Not Be Empty');

        if(this.USER_INFO_CACHE[URL]){
            return this.USER_INFO_CACHE[URL];
        }

        let response = await fetch(URL, this.GET_OPTIONS);
        response = await response.json();
        this.cacheResponse('USER_INFO_CACHE', URL, response);
 
        return response;
    }

    // Quick and dirty server-side catching
    cacheResponse(cacheName, URL, response) {
        if(!this[cacheName]) return;

        const cacheLength = Object.keys(this[cacheName]).length;

        if(cacheLength > 10000) {
            // Not practicle to keep them all in memory
            // let's purge them if we have too many
            this[cacheName] = {};
        }

        this[cacheName][URL] = response;
    }

}

module.exports = new GithubRepository();