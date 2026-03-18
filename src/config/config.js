require('dotenv').config();

module.exports = {
    botName: process.env.BOT_NAME || 'Hira',
    ownerName: process.env.OWNER_NAME || 'Owner',
    ownerNumber: process.env.OWNER_NUMBER || '',
    prefix: process.env.PREFIX || '!',
    mode: process.env.MODE || 'public',
    api: {
        key: process.env.API_KEY || 'nz-55d9381817',
        baseUrl: process.env.API_BASE_URL || 'https://api.naze.biz.id'
    },
    urls: {
        ai: 'https://api.naze.biz.id/ai/deepseek-r1',
        spotify: 'https://api.naze.biz.id/download/spotify',
        sticker: 'https://api.naze.biz.id/search/sticker'
    }
};
