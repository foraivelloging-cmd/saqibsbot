const axios = require('axios');
const fs = require('fs');
const path = require('path');

// CONSTANT SAQIB DETAILS
const SAQIB = {
  name: 'Muhammad Saqib',
  age: '17 Years',
  profession: 'Creative Visual Artist and Developer',
  location: 'Faisalabad (FSD), Pakistan',
  phone: '0347-8936242',
  imageUrl: 'https://ik.imagekit.io/shaban/SHABAN-1768573425069_nIPVZQOaT.jpg'
};

// Welcome GIF URLs (you can change these)
const WELCOME_GIFS = [
  'https://media.tenor.com/2fT6rQ8k9aYAAAAi/welcome-welcome-gif.gif',
  'https://media.tenor.com/5iR8qK9aY8cAAAAi/welcome-handshake.gif'
];

module.exports = {
  name: 'welcomesaqib',
  aliases: ['wsaqib', 'saqibwelcome'],
  category: 'group',
  description: 'Send animated welcome message with Muhammad Saqib details',
  usage: '.welcomesaqib enable/disable',
  groupOnly: true,
  adminOnly: true,

  async execute(sock, msg, args, extra) {
    const groupId = extra.from;
    let settings = await extra.database.getGroupSettings(groupId);
    
    if (!args.length) {
      const status = settings.welcomeSaqib ? '✅ ENABLED' : '❌ DISABLED';
      return extra.reply(`📋 *Muhammad Saqib Welcome System*\n\nStatus: ${status}\n\n👤 *Fixed Details:*\n• Name: ${SAQIB.name}\n• Age: ${SAQIB.age}\n• Profession: ${SAQIB.profession}\n• Location: ${SAQIB.location}\n• Phone: ${SAQIB.phone}\n\nCommands:\n.welcomesaqib enable\n.welcomesaqib disable`);
    }
    
    if (args[0] === 'enable') {
      await extra.database.updateGroupSettings(groupId, { welcomeSaqib: true });
      await extra.reply(`✅ *Welcome system ENABLED!*\n\nNow whenever someone joins, they will see Muhammad Saqib's introduction.\n\n📌 *Note:* The name will always show as "${SAQIB.name}" regardless of who joins.`);
      await extra.react('✅');
    } else if (args[0] === 'disable') {
      await extra.database.updateGroupSettings(groupId, { welcomeSaqib: false });
      await extra.reply('❌ Welcome system DISABLED!');
      await extra.react('❌');
    } else {
      await extra.reply('❌ Usage: .welcomesaqib enable/disable');
    }
  },

  async handleMessage(sock, msg, extra) {
    try {
      if (!extra.isGroup) return;
      
      const protocolMsg = msg.message?.protocolMessage;
      if (!protocolMsg?.addedParticipants?.length) return;
      
      const groupSettings = await extra.database.getGroupSettings(extra.from);
      if (!groupSettings.welcomeSaqib) return;
      
      const newMembers = protocolMsg.addedParticipants;
      
      for (const member of newMembers) {
        const randomGif = WELCOME_GIFS[Math.floor(Math.random() * WELCOME_GIFS.length)];
        
        // Download Saqib's image
        let saqibImg = null;
        try {
          const imgRes = await axios.get(SAQIB.imageUrl, { responseType: 'arraybuffer' });
          saqibImg = Buffer.from(imgRes.data);
        } catch (err) {
          console.log('Image download failed');
        }
        
        // Beautiful formatted message
        const msgText = `╭━━━❰✨ WELCOME ✨❱━━━╮
┃
┃ 🎉 *New Member Joined!*
┃
┃ ━━━━━━━━━━━━━━━━━━
┃
┃ 👤 *Name:* ${SAQIB.name}
┃ 📅 *Age:* ${SAQIB.age}
┃ 💼 *Profession:* ${SAQIB.profession}
┃ 📍 *Location:* ${SAQIB.location}
┃ 📞 *Phone:* ${SAQIB.phone}
┃
┃ ━━━━━━━━━━━━━━━━━━
┃
┃ ✨ *About Muhammad Saqib:*
┃ • Creative Visual Artist
┃ • Professional Developer
┃ • Based in Faisalabad
┃
┃ ━━━━━━━━━━━━━━━━━━
┃
┃ 👋 Welcome @${member.jid.split('@')[0]}
┃
╰━━━━━━━━━━━━━━━━━╯

🌟 Enjoy your stay in *${extra.groupMetadata?.subject || 'the group'}*!`;

        // Send GIF first (optional)
        try {
          await sock.sendMessage(extra.from, {
            video: { url: randomGif },
            gifPlayback: true,
            caption: '🎉 New Member Alert! 🎉'
          });
        } catch (err) {
          console.log('GIF send failed');
        }
        
        // Send main message with image
        if (saqibImg) {
          await sock.sendMessage(extra.from, {
            image: saqibImg,
            caption: msgText,
            mentions: [member.jid]
          });
        } else {
          await sock.sendMessage(extra.from, {
            text: msgText,
            mentions: [member.jid]
          });
        }
      }
      
    } catch (error) {
      console.error('Error:', error);
    }
  }
};
