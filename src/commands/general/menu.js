const config = require('../../config/config');

module.exports = {
    name: 'menu',
    aliases: ['help', 'start', 'hira'],
    description: 'Menampilkan menu utama',
    category: 'General',
    usage: '!menu',
    
    async execute(sock, msg, args, commands) {
        const menuText = `
╭━━━「 *${config.botName.toUpperCase()}* 」━━━╮
┃
┃ 🤖 *Bot WhatsApp Multifungsi*
┃ 👤 Owner: ${config.ownerName}
┃ ⚡ Prefix: ${config.prefix}
┃
┣━━━「 *AI Features* 」━━━┫
┃
┃ ▶️ !ai <pertanyaan>
┃    Chat dengan Deepseek AI
┃
┣━━━「 *Downloader* 」━━━┫
┃
┃ ▶️ !spotify <url>
┃    Download lagu Spotify
┃
┣━━━「 *Search* 」━━━┫
┃
┃ ▶️ !stickersearch <query>
┃    Cari sticker pack
┃
┣━━━「 *General* 」━━━┫
┃
┃ ▶️ !menu
┃    Tampilkan menu ini
┃ ▶️ !ping
┃    Cek status bot
┃
╰━━━━━━━━━━━━━━━━━━━━╯

💡 *Tips:* Gunakan prefix ${config.prefix} sebelum command
        `.trim();

        await sock.sendMessage(msg.key.remoteJid, { text: menuText });
    }
};
