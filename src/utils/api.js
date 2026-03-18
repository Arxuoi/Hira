const axios = require('axios');
const config = require('../config/config');

class API {
    constructor() {
        this.apikey = config.api.key;
    }

    async deepseekAI(query) {
        try {
            const response = await axios.get(`${config.urls.ai}`, {
                params: {
                    query: query,
                    apikey: this.apikey
                },
                timeout: 60000
            });
            return response.data;
        } catch (error) {
            throw new Error(`AI Error: ${error.message}`);
        }
    }

    async spotifyDownload(url) {
        try {
            const response = await axios.get(`${config.urls.spotify}`, {
                params: {
                    url: url,
                    apikey: this.apikey
                },
                timeout: 30000
            });
            return response.data;
        } catch (error) {
            throw new Error(`Spotify Error: ${error.message}`);
        }
    }

    async searchSticker(query) {
        try {
            const response = await axios.get(`${config.urls.sticker}`, {
                params: {
                    query: query,
                    apikey: this.apikey
                },
                timeout: 30000
            });
            return response.data;
        } catch (error) {
            throw new Error(`Sticker Error: ${error.message}`);
        }
    }
}

module.exports = new API();
