/**
 * Tag All Command - Mention all group members
 * Enhanced with Muhammad Saqib Developer Image
 */

const axios = require('axios');
const config = require('../../config');

module.exports = {
    name: 'tagall',
    aliases: ['mentionall', 'everyone', 'all', 'everybody'],
    category: 'group',
    description: '🎯 Advanced TagAll System by Muhammad Saqib - Mention all group members at once',
    usage: '.tagall <message>',
    groupOnly: true,
    adminOnly: true,
    botAdminNeeded: true,
    
    async execute(sock, msg, args, extra) {
      try {
        const message = args.join(' ') || 'Attention everyone!';
        
        // Developer Info
        const DEVELOPER = {
          name: 'Muhammad Saqib',
          role: 'Creative Visual Artist & Developer',
          age: '17 Years',
          location: 'Faisalabad, Pakistan',
          contact: '0347-8936242',
          bot: 'ProBoy-MD',
          imageUrl: 'https://ik.imagekit.io/shaban/SHABAN-1768573425069_nIPVZQOaT.jpg'
        };
        
        const participants = extra.groupMetadata.participants.map(p => p.id);
        const groupName = extra.groupMetadata.subject || 'the group';
        const memberCount = participants.length;
        const adminName = extra.sender.split('@')[0];
        
        // Get current time and date
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        });
        const dateString = now.toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
        
        // Create beautiful message
        let text = `╭━━━❰📢 GROUP ANNOUNCEMENT ❱━━━╮\n`;
        text += `┃\n`;
        text += `┃ 👑 *From:* @${adminName}\n`;
        text += `┃ 📍 *Group:* ${groupName}\n`;
        text += `┃ 👥 *Members:* ${memberCount}\n`;
        text += `┃ 🕐 *Time:* ${timeString}\n`;
        text += `┃ 📅 *Date:* ${dateString}\n`;
        text += `┃\n`;
        text += `┃ ━━━━━━━━━━━━━━━━━━\n`;
        text += `┃\n`;
        text += `┃ 📝 *Message:*\n`;
        text += `┃ ${message}\n`;
        text += `┃\n`;
        text += `┃ ━━━━━━━━━━━━━━━━━━\n`;
        text += `┃\n`;
        text += `┃ 👥 *Tagged Members:*\n`;
        text += `┃\n`;
        
        // Add members in columns (10 per line for better readability)
        const mentions = [];
        const memberLines = [];
        let line = '';
        
        participants.forEach((participant, index) => {
          const mention = `@${participant.split('@')[0]}`;
          mentions.push(participant);
          
          if (line.length + mention.length + 2 < 40) {
            line += (line ? ' · ' : '') + mention;
          } else {
            if (line) memberLines.push(`┃ ${line}`);
            line = mention;
          }
        });
        if (line) memberLines.push(`┃ ${line}`);
        
        memberLines.forEach(line => {
          text += `${line}\n`;
        });
        
        text += `┃\n`;
        text += `┃ ━━━━━━━━━━━━━━━━━━\n`;
        text += `┃\n`;
        text += `┃ 👨‍💻 *Developer:* ${DEVELOPER.name}\n`;
        text += `┃ 🎨 *Role:* ${DEVELOPER.role}\n`;
        text += `┃ 📍 *Location:* ${DEVELOPER.location}\n`;
        text += `┃ 🤖 *Bot:* ${DEVELOPER.bot}\n`;
        text += `┃\n`;
        text += `┃ ⚡ *Powered by Muhammad Saqib*\n`;
        text += `╰━━━━━━━━━━━━━━━━━━━━━╯\n\n`;
        text += `> 🛡️ *ProBoy-MD Security System* | *TagAll v2.0*`;
        
        // Try to send with Saqib's image
        let imageBuffer = null;
        try {
          const imageResponse = await axios.get(DEVELOPER.imageUrl, { 
            responseType: 'arraybuffer',
            timeout: 10000
          });
          imageBuffer = Buffer.from(imageResponse.data);
        } catch (err) {
          console.log('Could not load developer image, sending text only');
        }
        
        // Send message with image if available
        if (imageBuffer) {
          await sock.sendMessage(extra.from, {
            image: imageBuffer,
            caption: text,
            mentions: mentions
          }, { quoted: msg });
        } else {
          await sock.sendMessage(extra.from, {
            text: text,
            mentions: mentions
          }, { quoted: msg });
        }
        
        // Send a quick reaction
        await extra.react('📢');
        
      } catch (error) {
        console.error('TagAll error:', error);
        await extra.reply(
          `╭━━━❰❌ TAGALL ERROR ❱━━━╮\n` +
          `┃\n` +
          `┃ ❌ *Failed to tag members*\n` +
          `┃\n` +
          `┃ 📝 *Error:* ${error.message}\n` +
          `┃\n` +
          `┃ 💡 Make sure:\n` +
          `┃ • Bot is admin\n` +
          `┃ • Group has members\n` +
          `┃\n` +
          `┃ 👨‍💻 *Muhammad Saqib - Developer*\n` +
          `╰━━━━━━━━━━━━━━━━━━━━━╯`
        );
      }
    }
};
