const {
    default: makeWASocket,
    DisconnectReason,
    useMultiFileAuthState
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const qrcode = require('qrcode-terminal');
const MessageHandler = require('./Handlers/messageHandler');
const config = require('./config/config');

console.log(`
╭━━━━━━━━━━━━━━━━━━━━━━╮
┃   🤖 ${config.botName} BOT 🤖   ┃
┃   WhatsApp Multi Device  ┃
╰━━━━━━━━━━━━━━━━━━━━━━╯
`);

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    
    const sock = makeWASocket({
        printQRInTerminal: true,
        auth: state,
        logger: pino({ level: 'silent' }),
        browser: ['Hira Bot', 'Chrome', '1.0.0']
    });

    const messageHandler = new MessageHandler(sock);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log('📱 Scan QR code di atas untuk login');
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut);
            console.log('⚠️ Koneksi terputus, reconnecting...', shouldReconnect);
            
            if (shouldReconnect) {
                connectToWhatsApp();
            }
        } else if (connection === 'open') {
            console.log('✅ Berhasil terhubung ke WhatsApp!');
            console.log(`🤖 Bot ${config.botName} siap digunakan!`);
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.key.fromMe && m.type === 'notify') {
            await messageHandler.handle(msg);
        }
    });
}

connectToWhatsApp().catch(err => {
    console.error('Fatal Error:', err);
    process.exit(1);
});
