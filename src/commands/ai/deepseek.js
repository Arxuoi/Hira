const api = require('../../utils/api');

module.exports = {
    name: 'ai',
    aliases: ['deepseek', 'ask', 'hira'],
    description: 'Chat dengan AI Deepseek',
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
            
            if (result && result.result) {
                await sock.sendMessage(msg.key.remoteJid, {
                    text: `🤖 *Hira AI*\n\n${result.result}\n\n_Powered by Deepseek R1_`
                });
            } else {
                throw new Error('Respon tidak valid');
            }
        } catch (error) {
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ *Error:* ${error.message}`
            });
        }
    }
};
