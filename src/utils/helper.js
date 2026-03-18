const fs = require('fs-extra');
const path = require('path');

class Helper {
    constructor() {
        this.tempDir = path.join(__dirname, '../../temp');
    }

    async downloadFile(url, filename) {
        const axios = require('axios');
        const filePath = path.join(this.tempDir, filename);
        
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => resolve(filePath));
            writer.on('error', reject);
        });
    }

    formatUptime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        return `${hours}j ${minutes}m ${secs}d`;
    }

    isUrl(str) {
        const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
        return urlPattern.test(str);
    }
}

module.exports = new Helper();
