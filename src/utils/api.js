const axios = require('axios');
const config = require('../config/config');

class API {
    constructor() {
        this.apikey = config.api.key;
    }

    async deepseekAI(query) {
        try {
            const response = await axios.get(`https://api.naze.biz.id/ai/chat`, {
                params: {
                    query: query,  // ← GANTI DARI messages JADI query
                    apikey: this.apikey
                },
                timeout: 120000
            });
            
            if (response.data && response.data.result) {
                return response.data;
            } else {
                throw new Error(response.data?.error || 'Format response tidak valid');
            }
            
        } catch (error) {
            if (error.response) {
                throw new Error(`Server error: ${error.response.status}`);
            } else if (error.code === 'ECONNABORTED') {
                throw new Error('Request timeout');
            } else {
                throw new Error(`Error: ${error.message}`);
            }
        }
    }

    async spotifyDownload(url) {
        try {
            const response = await axios.get(`${config.urls.spotify}`, {
                params: {
                    url: url,
                    apikey: this.apikey
                },
                timeout: 60000
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
                    q: query,
                    apikey: this.apikey
                },
                timeout: 60000
            });
            return response.data;
        } catch (error) {
            throw new Error(`Sticker Error: ${error.message}`);
        }
    }
}

module.exports = new API();
