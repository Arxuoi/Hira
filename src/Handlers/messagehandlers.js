const config = require('../config/config');
const commandhandlers = require('./commandhandlers');

class MessageHandler {
    constructor(sock) {
        this.sock = sock;
        this.startTime = Date.now();
    }

    async handle(msg) {
        try {
            console.log('🔧 Handler dijalankan...'); // DEBUG
            
            if (!msg.message) {
                console.log('❌ Tidak ada message');
                return;
            }

            const messageType = Object.keys(msg.message)[0];
            console.log('📋 Message type:', messageType); // DEBUG

            const text = msg.message.conversation || 
                        msg.message.extendedTextMessage?.text || 
                        msg.message.imageMessage?.caption || 
                        msg.message.videoMessage?.caption || '';

            console.log('📝 Text:', text); // DEBUG

            if (!text) {
                console.log('❌ Text kosong');
                return;
            }

            // Cek prefix
            let args;
            let commandName;

            if (text.startsWith(config.prefix)) {
                args = text.slice(config.prefix.length).trim().split(/ +/);
                commandName = args.shift().toLowerCase();
                console.log('✅ Dengan prefix:', commandName); // DEBUG
            } else {
                console.log('❌ Tanpa prefix, diabaikan');
                return; // Hapus ini kalau mau global prefix
            }

            // Command ping
            if (commandName === 'ping') {
                const uptime = (Date.now() - this.startTime) / 1000;
                const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
                
                console.log('🏓 Mengirim ping...'); // DEBUG
                
                await this.sock.sendMessage(msg.key.remoteJid, {
                    text: `🏓 Pong!\n\n⏱️ Uptime: ${Math.floor(uptime)}s\n💾 RAM: ${ram} MB`
                });
                
                console.log('✅ Ping terkirim'); // DEBUG
                return;
            }

            // Cek command
            console.log('🔍 Mencari command:', commandName); // DEBUG
            const command = commandhandlers.getCommand(commandName);

            if (command) {
                console.log('✅ Command ditemukan:', command.name); // DEBUG
                await command.execute(this.sock, msg, args);
                console.log('✅ Command selesai'); // DEBUG
            } else {
                console.log('❌ Command tidak ditemukan'); // DEBUG
                await this.sock.sendMessage(msg.key.remoteJid, {
                    text: `❌ Command *${commandName}* tidak ditemukan!\nKetik ${config.prefix}menu untuk bantuan.`
                });
            }

        } catch (error) {
            console.error('❌ ERROR di handler:', error);
            await this.sock.sendMessage(msg.key.remoteJid, {
                text: `❌ Error: ${error.message}`
            });
        }
    }
}

module.exports = MessageHandler;
