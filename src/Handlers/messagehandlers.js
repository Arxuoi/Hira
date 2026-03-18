const config = require('../config/config');
const commandHandler = require('./commandhandlers');

class MessageHandler {
    constructor(sock) {
        this.sock = sock;
        this.startTime = Date.now();
    }

    async handle(msg) {
        try {
            if (!msg.message) return;

            const messageType = Object.keys(msg.message)[0];
            const text = msg.message.conversation || 
                        msg.message.extendedTextMessage?.text || 
                        msg.message.imageMessage?.caption || 
                        msg.message.videoMessage?.caption || '';

            if (!text.startsWith(config.prefix)) return;

            const args = text.slice(config.prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();

            // Command khusus ping
            if (commandName === 'ping') {
                const uptime = (Date.now() - this.startTime) / 1000;
                const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
                
                return await this.sock.sendMessage(msg.key.remoteJid, {
                    text: `🏓 *Pong!*\n\n⏱️ Uptime: ${Math.floor(uptime)}s\n💾 RAM: ${ram} MB`
                });
            }

            const command = commandHandler.getCommand(commandName);

            if (command) {
                await command.execute(this.sock, msg, args, commandHandler.getAllCommands());
            } else {
                await this.sock.sendMessage(msg.key.remoteJid, {
                    text: `❌ Command *${commandName}* tidak ditemukan!\nKetik ${config.prefix}menu untuk melihat daftar command.`
                });
            }

        } catch (error) {
            console.error('Message Handler Error:', error);
        }
    }
}

module.exports = MessageHandler;
