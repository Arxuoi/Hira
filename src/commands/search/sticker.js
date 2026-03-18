const api = require('../../utils/api');

module.exports = {
    name: 'stickersearch',
    aliases: ['stikers', 'caristicker', 'ssearch'],
    description: 'Cari sticker pack',
    category: 'Search',
    usage: '!stickersearch <kata kunci>',
    
    async execute(sock, msg, args) {
        if (!args.length) {
            return await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ *Format salah!*\n\nContoh: !stickersearch kucing lucu'
            });
        }

        const query = args.join(' ');
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: '🔍 *Mencari sticker...*'
        });

        try {
            const result = await api.searchSticker(query);
            
            if (result && result.result && result.result.length > 0) {
                const stickers = result.result.slice(0, 5); // Ambil 5 hasil pertama
                
                let caption = `🎯 *Hasil Pencarian Sticker: "${query}"*\n\n`;
                
                stickers.forEach((item, index) => {
                    caption += `${index + 1}. ${item.name}\n`;
                    if (item.author) caption += `   👤 ${item.author}\n`;
                    caption += `   🔗 ${item.url}\n\n`;
                });

                await sock.sendMessage(msg.key.remoteJid, { text: caption });
            } else {
                await sock.sendMessage(msg.key.remoteJid, {
                    text: '❌ *Sticker tidak ditemukan*'
                });
            }
        } catch (error) {
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ *Error:* ${error.message}`
            });
        }
    }
};
