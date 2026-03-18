const {
    default: makeWASocket,
    DisconnectReason,
    useMultiFileAuthState,
    fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const qrcode = require('qrcode-terminal');
const MessageHandler = require('./Handlers/messagehandlers');
const config = require('./config/config');

console.log(`
╭━━━━━━━━━━━━━━━━━━━━━━╮
┃   🤖 ${config.botName.toUpperCase()} BOT 🤖   ┃
┃   WhatsApp Multi Device  ┃
╰━━━━━━━━━━━━━━━━━━━━━━╯
`);

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    const { version } = await fetchLatestBaileysVersion();
    
    const sock = makeWASocket({
        version,
        auth: state,
        logger: pino({ level: 'silent' }),
        browser: ['Hira Bot', 'Chrome', '1.0.0'],
        printQRInTerminal: false
    });

    const messageHandler = new MessageHandler(sock);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log('\n📱 SCAN QR CODE INI:\n');
            qrcode.generate(qr, { small: true });
            console.log('\n');
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

    // PENTING: Event messages.upsert
    sock.ev.on('messages.upsert', async (m) => {
        console.log('📩 Pesan masuk:', JSON.stringify(m, null, 2)); // DEBUG LOG
        
        const msg = m.messages[0];
        if (!msg.key.fromMe && m.type === 'notify') {
            console.log('📨 Memproses pesan...'); // DEBUG LOG
            await messageHandler.handle(msg);
        }
    });
}

connectToWhatsApp().catch(err => {
    console.error('Fatal Error:', err);
    process.exit(1);
});
