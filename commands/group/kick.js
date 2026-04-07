/**
 * Kick Command
 * Remove mentioned or replied users from the group
 * Includes robust self-kick prevention for PN/LID IDs
 * Supports: .kick @user OR reply "niklo" / "nikal" to a message
 */

const config = require('../../config');
const handler = require('../../handler');

module.exports = {
  name: 'kick',
  aliases: ['remove', 'nikal', 'niklo', 'hatao', 'bahar'],
  category: 'group',
  description: 'Kick mentioned/replied members from the group (Reply "niklo" to kick)',
  usage: '.kick @user\nOR reply "niklo" to any message',
  groupOnly: true,
  adminOnly: true,
  botAdminNeeded: true,
  
  async execute(sock, msg, args, extra) {
    try {
      const chatId = extra.from;
      const messageText = msg.message?.conversation || 
                          msg.message?.extendedTextMessage?.text || 
                          '';
      
      const ctx = msg.message?.extendedTextMessage?.contextInfo;
      const mentioned = ctx?.mentionedJid || [];
      let usersToKick = [];
      
      // Check for reply-based kick commands (niklo / nikal)
      const kickKeywords = ['niklo', 'nikal', 'hatao', 'bahar', 'kick', 'remove'];
      const isKickKeyword = kickKeywords.some(keyword => 
        messageText.toLowerCase().trim() === keyword || 
        messageText.toLowerCase().trim().startsWith(keyword + ' ')
      );
      
      // If message contains kick keyword and has quoted message
      if (isKickKeyword && ctx?.participant && ctx.stanzaId && ctx.quotedMessage) {
        usersToKick = [ctx.participant];
      }
      // If mentioned users exist
      else if (mentioned && mentioned.length > 0) {
        usersToKick = mentioned;
      } 
      // If replied to a message (without keyword)
      else if (ctx?.participant && ctx.stanzaId && ctx.quotedMessage) {
        // Check if message has .kick command or just reply
        if (messageText.toLowerCase().startsWith('.kick') || 
            messageText.toLowerCase().startsWith('.remove')) {
          usersToKick = [ctx.participant];
        }
      }
      
      if (usersToKick.length === 0) {
        return extra.reply(
          `╭━━━❰👢 KICK COMMAND ❱━━━╮\n` +
          `┃\n` +
          `┃ 📋 *How to use:*\n` +
          `┃\n` +
          `┃ 1️⃣ Reply to a message with:\n` +
          `┃    • "niklo"\n` +
          `┃    • "nikal"\n` +
          `┃    • "hatao"\n` +
          `┃    • "bahar"\n` +
          `┃\n` +
          `┃ 2️⃣ Or mention user:\n` +
          `┃    .kick @user\n` +
          `┃\n` +
          `┃ 3️⃣ Or reply to message:\n` +
          `┃    .kick\n` +
          `┃\n` +
          `┃ 👨‍💻 *Muhammad Saqib - Developer*\n` +
          `┃ 🤖 *ProBoy-MD Bot*\n` +
          `╰━━━━━━━━━━━━━━━━━━━━━╯`
        );
      }
      
      const botId = sock.user?.id || '';
      const botLid = sock.user?.lid || '';
      const botPhoneNumber = botId.includes(':') ? botId.split(':')[0] : (botId.includes('@') ? botId.split('@')[0] : botId);
      const botIdFormatted = botPhoneNumber + '@s.whatsapp.net';
      const botLidNumeric = botLid.includes(':') ? botLid.split(':')[0] : (botLid.includes('@') ? botLid.split('@')[0] : botLid);
      const botLidWithoutSuffix = botLid.includes('@') ? botLid.split('@')[0] : botLid;
      
      const metadata = await sock.groupMetadata(chatId);
      const participants = metadata.participants || [];
      
      const isTryingToKickBot = usersToKick.some((userId) => {
        const userPhoneNumber = userId.includes(':') ? userId.split(':')[0] : (userId.includes('@') ? userId.split('@')[0] : userId);
        const userLidNumeric = userId.includes('@lid') ? userId.split('@')[0].split(':')[0] : '';
        
        const directMatch = (
          userId === botId ||
          userId === botLid ||
          userId === botIdFormatted ||
          userPhoneNumber === botPhoneNumber ||
          (userLidNumeric && botLidNumeric && userLidNumeric === botLidNumeric)
        );
        
        if (directMatch) return true;
        
        const participantMatch = participants.some((p) => {
          const pPhoneNumber = p.phoneNumber ? p.phoneNumber.split('@')[0] : '';
          const pId = p.id ? p.id.split('@')[0] : '';
          const pLid = p.lid ? p.lid.split('@')[0] : '';
          const pFullId = p.id || '';
          const pFullLid = p.lid || '';
          const pLidNumeric = pLid.includes(':') ? pLid.split(':')[0] : pLid;
          
          const isThisParticipantBot = (
            pFullId === botId ||
            pFullLid === botLid ||
            pLidNumeric === botLidNumeric ||
            pPhoneNumber === botPhoneNumber ||
            pId === botPhoneNumber ||
            p.phoneNumber === botIdFormatted ||
            (botLid && pLid && botLidWithoutSuffix === pLid)
          );
          
          if (!isThisParticipantBot) return false;
          
          return (
            userId === pFullId ||
            userId === pFullLid ||
            userPhoneNumber === pPhoneNumber ||
            userPhoneNumber === pId ||
            userId === p.phoneNumber ||
            (pLid && userLidNumeric && userLidNumeric === pLidNumeric) ||
            (userLidNumeric && pLidNumeric && userLidNumeric === pLidNumeric)
          );
        });
        
        return participantMatch;
      });
      
      if (isTryingToKickBot) {
        await extra.reply(
          `╭━━━❰❌ CANNOT KICK BOT ❱━━━╮\n` +
          `┃\n` +
          `┃ 🤖 *I cannot kick myself!*\n` +
          `┃\n` +
          `┃ 👨‍💻 *Muhammad Saqib - Developer*\n` +
          `╰━━━━━━━━━━━━━━━━━━━━━╯`
        );
        return;
      }
      
      await sock.groupParticipantsUpdate(chatId, usersToKick, 'remove');
      
      const usernames = usersToKick.map((jid) => `@${jid.split('@')[0]}`);
      
      const kickMessage = 
        `╭━━━❰👢 KICKED SUCCESSFULLY ❱━━━╮\n` +
        `┃\n` +
        `┃ ✅ *User has been kicked!*\n` +
        `┃\n` +
        `┃ 👤 *User:* ${usernames.join(', ')}\n` +
        `┃ 📝 *Action:* REMOVED\n` +
        `┃\n` +
        `┃ ━━━━━━━━━━━━━━━━━━\n` +
        `┃\n` +
        `┃ 🛡️ *Action by:* @${extra.sender.split('@')[0]}\n` +
        `┃ 👨‍💻 *System:* Muhammad Saqib\n` +
        `┃ 🤖 *Bot:* ProBoy-MD\n` +
        `╰━━━━━━━━━━━━━━━━━━━━━╯`;
      
      await sock.sendMessage(extra.from, { 
        text: kickMessage, 
        mentions: [...usersToKick, extra.sender] 
      }, { quoted: msg });
      
    } catch (error) {
      console.error('Kick command error:', error);
      await extra.reply(
        `╭━━━❰❌ KICK FAILED ❱━━━╮\n` +
        `┃\n` +
        `┃ ❌ *Failed to kick user(s)*\n` +
        `┃\n` +
        `┃ 📝 *Error:* ${error.message}\n` +
        `┃\n` +
        `┃ 💡 Make sure:\n` +
        `┃ • Bot is admin\n` +
        `┃ • User is in the group\n` +
        `┃\n` +
        `┃ 👨‍💻 *Muhammad Saqib - Developer*\n` +
        `╰━━━━━━━━━━━━━━━━━━━━━╯`
      );
    }
  },
};
