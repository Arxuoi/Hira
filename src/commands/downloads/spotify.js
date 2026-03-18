const api = require('../../utils/api');
const helper = require('../../utils/helper');

module.exports = {
    name: 'spotify',
    aliases: ['spdl', 'spotifysong'],
    description: 'Download lagu dari Spotify',
    category: 'Downloader',
    usage: '!spotify <url_spotify>',
    
    async execute(sock, msg, args) {
        if (!args.length) {
            return await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ *Format salah!*\n\nContoh: !spotify https://open.spotify.com/track/...'
            });
        }

        const url = args[0];
        
        if (!helper.isUrl(url) || !url.includes('spotify.com')) {
            return await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ *URL Spotify tidak valid!*'
            });
        }

        await sock.sendMessage(msg.key.remoteJid, {
            text: '⏳ *Mendownload lagu dari Spotify...*'
        });

        try {
            const result = await api.spotifyDownload(url);
            
            if (result && result.result) {
                const data = result.result;
                
                const caption = `🎵 *Spotify Download*\n\n` +
                              `*Judul:* ${data.title}\n` +
                              `*Artis:* ${data.artists}\n` +
                              `*Album:* ${data.album}\n` +
                              `*Durasi:* ${data.duration}\n\n` +
                              `⬇️ *Mengirim audio...*`;

                await sock.sendMessage(msg.key.remoteJid, {
                    image: { url: data.thumbnail },
                    caption: caption
                });

                // Kirim audio
                await sock.sendMessage(msg.key.remoteJid, {
                    audio: { url: data.url },
                    mimetype: 'audio/mpeg',
                    fileName: `${data.title}.mp3`
                });
            } else {
                throw new Error('Gagal mendownload');
            }
        } catch (error) {
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ *Error:* ${error.message}`
            });
        }
    }
};
