const api = require('../../Utils/api');

module.exports = {
    name: 'ai',
    aliases: ['deepseek', 'ask', 'hira'],
    description: 'Chat dengan AI',
    category: 'AI',
    usage: '!ai <pertanyaan>',
    
    async execute(sock, msg, args) {
        if (!args.length) {
            return await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ *Format salah!*\n\nContoh: !ai apa itu javascript?'
            });
        }

        const query = args.join(' ');
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: '⏳ *Hira sedang berpikir...*'
        });

        try {
            const result = await api.deepseekAI(query);
            
            // Cek struktur response dan ambil text yang benar
            let responseText = '';
            
            if (typeof result === 'string') {
                responseText = result;
            } else if (result.result) {
                // Kalau result.result adalah object, convert ke string
                if (typeof result.result === 'object') {
                    responseText = JSON.stringify(result.result, null, 2);
                } else {
                    responseText = result.result;
                }
            } else if (result.data) {
                responseText = typeof result.data === 'object' ? JSON.stringify(result.data, null, 2) : result.data;
            } else if (result.message) {
                responseText = result.message;
            } else {
                // Fallback: stringify seluruh object
                responseText = JSON.stringify(result, null, 2);
            }

            await sock.sendMessage(msg.key.remoteJid, {
                text: `🤖 *Hira AI*\n\n${responseText}\n\n_Powered by AI_`
            });
            
        } catch (error) {
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ *Error:* ${error.message}`
            });
        }
    }
};
