/**
 * AntiViewOnce - AUTO SAVE ON ANY REPLY
 * By Muhammad Saqib
 */

const { downloadMediaMessage } = require('@whiskeysockets/baileys');

const DEVELOPER = {
    name: 'Muhammad Saqib',
    bot: 'ProBoy-MD'
};

const getBotJid = (sock) => {
  const id = sock.user?.id ? sock.user.id.split(':')[0] : null;
  return id ? `${id}@s.whatsapp.net` : null;
};

module.exports = {
  name: 'antiviewonce',
  aliases: ['avo', 'savevo'],
  category: 'group',
  description: '📸 Auto-save viewonce media on ANY reply',
  usage: 'Reply to any viewonce message with ANY text (hello, hi, save, etc.)',
  groupOnly: true,
  adminOnly: true,

  async execute(sock, msg, args, extra) {
    try {
      const { from, reply, react } = extra;
      const sub = (args[0] || '').toLowerCase();
      const s = database.getChatSettings(from);

      // ==================== ANY REPLY TO VIEWONCE ====================
      const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const isReplyingToViewOnce = !!(quotedMsg?.viewOnceMessageV2 || quotedMsg?.viewOnceMessage);
      
      // ✅ KISI BHI REPLY PAR SAVE HOGA (chahe "hello" likho ya "hi" ya kuch bhi!)
      if (isReplyingToViewOnce) {
        await react('📸');
        
        try {
          // Extract viewonce content
          let viewOnceContent = quotedMsg.viewOnceMessageV2 || quotedMsg.viewOnceMessage;
          if (viewOnceContent?.message) viewOnceContent = viewOnceContent.message;
          
          const type = Object.keys(viewOnceContent)[0];
          const inner = viewOnceContent[type];
          
          if (!inner) {
            return reply('❌ Could not extract media!');
          }
          
          const botJid = getBotJid(sock);
          if (!botJid) return reply('❌ Bot JID not found!');
          
          const quotedSender = msg.message?.extendedTextMessage?.contextInfo?.participant || extra.sender;
          const senderName = quotedSender?.split('@')[0] || 'unknown';
          
          const now = new Date();
          const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
          
          const header = 
            `╭━━━❰📸 VIEWONCE SAVED ❱━━━╮\n` +
            `┃\n` +
            `┃ 👤 *Sender:* @${senderName}\n` +
            `┃ 🕐 *Time:* ${timeString}\n` +
            `┃ 📝 *Reply was:* "${args.join(' ') || 'empty'}"\n` +
            `┃\n` +
            `┃ 🛡️ *${DEVELOPER.name}*\n` +
            `╰━━━━━━━━━━━━━━━━━━━━━╯`;
          
          const fakeMsg = { message: viewOnceContent };
          const buffer = await downloadMediaMessage(fakeMsg, 'buffer', {});
          
          if (!buffer) return reply('❌ Download failed!');
          
          if (type === 'imageMessage') {
            await sock.sendMessage(botJid, { image: buffer, caption: header.trim() });
          } else if (type === 'videoMessage') {
            await sock.sendMessage(botJid, { video: buffer, caption: header.trim() });
          } else if (type === 'audioMessage') {
            await sock.sendMessage(botJid, { text: header.trim() });
            await sock.sendMessage(botJid, { audio: buffer });
          }
          
          await reply(`✅ ViewOnce media saved! (You replied with: "${args.join(' ') || 'empty reply'}")`);
          await react('✅');
          
        } catch (err) {
          await reply(`❌ Error: ${err.message}`);
          await react('❌');
        }
        return;
      }

      // ==================== NORMAL COMMANDS ====================
      if (sub === 'on') {
        database.updateChatSettings(from, { antiviewonce: true });
        await reply('✅ Auto-save ENABLED');
      } else if (sub === 'off') {
        database.updateChatSettings(from, { antiviewonce: false });
        await reply('❌ Auto-save DISABLED');
      } else if (sub === 'status') {
        await reply(`Status: ${s.antiviewonce ? 'ON' : 'OFF'}\n\n💡 Tip: Reply to ANY viewonce message with ANY text to save!`);
      } else {
        await reply(
          `📸 *AntiViewOnce*\n\n` +
          `• .antiviewonce on - Enable\n` +
          `• .antiviewonce off - Disable\n` +
          `• .antiviewonce status - Check\n\n` +
          `✨ *NEW:* Reply to ANY viewonce message with ANY text (even "hello") to save!`
        );
      }
      
    } catch (e) {
      await extra.reply(`❌ ${e.message}`);
    }
  }
};
