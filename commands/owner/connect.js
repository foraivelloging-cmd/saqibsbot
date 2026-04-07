/**
 * Newsletter Command - Manage WhatsApp Newsletter/Channel
 * Enhanced with Muhammad Saqib Developer
 */

const config = require('../../config');

module.exports = {
  name: 'newsletter',
  aliases: ['channel', 'nletter', 'broadcastchannel'],
  category: 'owner',
  description: '📢 Newsletter Manager by Muhammad Saqib - Send messages to your WhatsApp channel',
  usage: '.newsletter <message>\n.newsletter set <jid>\n.newsletter status',
  ownerOnly: true,

  async execute(sock, msg, args, extra) {
    const { reply, react, from } = extra;
    const sub = (args[0] || '').toLowerCase();

    // Developer Info
    const DEVELOPER = {
      name: 'Muhammad Saqib',
      role: 'Creative Visual Artist & Developer',
      age: '17 Years',
      location: 'Faisalabad, Pakistan',
      contact: '0347-8936242',
      bot: 'ProBoy-MD',
      newsletterJid: '120363407057906982@newsletter' // Your extracted JID
    };

    // HELP MENU
    if (!sub || sub === 'help') {
      return reply(
        `╭━━━❰📢 NEWSLETTER MANAGER ❱━━━╮\n` +
        `┃\n` +
        `┃ 👨‍💻 *Developer:* ${DEVELOPER.name}\n` +
        `┃ 🎨 *Role:* ${DEVELOPER.role}\n` +
        `┃ 📍 *Location:* ${DEVELOPER.location}\n` +
        `┃ 🤖 *Bot:* ${DEVELOPER.bot}\n` +
        `┃\n` +
        `┃ ━━━━━━━━━━━━━━━━━━\n` +
        `┃\n` +
        `┃ 📋 *What is Newsletter?*\n` +
        `┃ WhatsApp Channel/Broadcast system\n` +
        `┃ Send updates to all subscribers\n` +
        `┃\n` +
        `┃ ━━━━━━━━━━━━━━━━━━\n` +
        `┃\n` +
        `┃ 📝 *Commands:*\n` +
        `┃\n` +
        `┃ 🔘 *.newsletter <message>*\n` +
        `┃    → Send message to channel\n` +
        `┃\n` +
        `┃ 🔘 *.newsletter set <jid>*\n` +
        `┃    → Set channel JID\n` +
        `┃\n` +
        `┃ 🔘 *.newsletter status*\n` +
        `┃    → Check channel info\n` +
        `┃\n` +
        `┃ 🔘 *.newsletter info*\n` +
        `┃    → Show developer info\n` +
        `┃\n` +
        `┃ ━━━━━━━━━━━━━━━━━━\n` +
        `┃\n` +
        `┃ 📝 *Current Channel JID:*\n` +
        `┃ ${DEVELOPER.newsletterJid}\n` +
        `┃\n` +
        `┃ ⚡ *Powered by Muhammad Saqib*\n` +
        `┃ 📢 *ProBoy-MD Newsletter System v2.0*\n` +
        `╰━━━━━━━━━━━━━━━━━━━━━╯`
      );
    }

    // STATUS COMMAND
    if (sub === 'status') {
      const currentJid = config.newsletterJid || DEVELOPER.newsletterJid;
      
      return reply(
        `╭━━━❰📊 NEWSLETTER STATUS ❱━━━╮\n` +
        `┃\n` +
        `┃ 👨‍💻 *Owner:* Muhammad Saqib\n` +
        `┃ 🎨 *Role:* Creative Visual Artist\n` +
        `┃ 🤖 *Bot:* ProBoy-MD\n` +
        `┃\n` +
        `┃ ━━━━━━━━━━━━━━━━━━\n` +
        `┃\n` +
        `┃ 📢 *Channel JID:*\n` +
        `┃ ${currentJid}\n` +
        `┃\n` +
        `┃ ✅ *Status:* ACTIVE\n` +
        `┃\n` +
        `┃ ━━━━━━━━━━━━━━━━━━\n` +
        `┃\n` +
        `┃ 📝 *How to get JID:*\n` +
        `┃ 1. Open WhatsApp Web\n` +
        `┃ 2. Open your channel\n` +
        `┃ 3. Inspect element\n` +
        `┃ 4. Look for @newsletter in data-id\n` +
        `┃\n` +
        `┃ 👨‍💻 *Muhammad Saqib - Developer*\n` +
        `╰━━━━━━━━━━━━━━━━━━━━━╯`
      );
    }

    // SET NEWSLETTER JID
    if (sub === 'set') {
      const jid = args[1] || '';
      
      if (!jid || !jid.includes('@newsletter')) {
        return reply(
          `╭━━━❰❌ INVALID JID ❱━━━╮\n` +
          `┃\n` +
          `┃ ❌ *Invalid Newsletter JID!*\n` +
          `┃\n` +
          `┃ 📝 *Format:* xxxxxxxxxx@newsletter\n` +
          `┃\n` +
          `┃ 📝 *Example:* .newsletter set 120363407057906982@newsletter\n` +
          `┃\n` +
          `┃ 👨‍💻 *Muhammad Saqib - Developer*\n` +
          `╰━━━━━━━━━━━━━━━━━━━━━╯`
        );
      }
      
      // Update config
      config.newsletterJid = jid;
      
      return reply(
        `╭━━━❰✅ NEWSLETTER UPDATED ❱━━━╮\n` +
        `┃\n` +
        `┃ ✅ *Channel JID set successfully!*\n` +
        `┃\n` +
        `┃ 📢 *New JID:* ${jid}\n` +
        `┃\n` +
        `┃ 👨‍💻 *Muhammad Saqib - Developer*\n` +
        `┃ 🤖 *ProBoy-MD*\n` +
        `╰━━━━━━━━━━━━━━━━━━━━━╯`
      );
    }

    // INFO COMMAND
    if (sub === 'info') {
      return reply(
        `╭━━━❰👨‍💻 DEVELOPER INFO ❱━━━╮\n` +
        `┃\n` +
        `┃ 📛 *Name:* Muhammad Saqib\n` +
        `┃ 🎨 *Profession:* Creative Visual Artist & Developer\n` +
        `┃ 📅 *Age:* 17 Years\n` +
        `┃ 📍 *Location:* Faisalabad (FSD), Pakistan\n` +
        `┃ 📞 *Phone:* 0347-8936242\n` +
        `┃ 🤖 *Bot:* ProBoy-MD\n` +
        `┃\n` +
        `┃ ━━━━━━━━━━━━━━━━━━\n` +
        `┃\n` +
        `┃ 📢 *Channel:*\n` +
        `┃ ${config.newsletterJid || 'Not set'}\n` +
        `┃\n` +
        `┃ 🌐 *Social:*\n` +
        `┃ • GitHub: github.com/techai242\n` +
        `┃ • Instagram: @mrsaqib242\n` +
        `┃ • TikTok: @mrsaqib242\n` +
        `┃\n` +
        `┃ ⚡ *Powered by Muhammad Saqib*\n` +
        `╰━━━━━━━━━━━━━━━━━━━━━╯`
      );
    }

    // SEND MESSAGE TO NEWSLETTER
    const message = args.join(' ');
    
    if (!message) {
      return reply(
        `╭━━━❰❌ NO MESSAGE ❱━━━╮\n` +
        `┃\n` +
        `┃ ❌ *Message cannot be empty!*\n` +
        `┃\n` +
        `┃ 📝 *Usage:* .newsletter Your message here\n` +
        `┃\n` +
        `┃ 👨‍💻 *Muhammad Saqib - Developer*\n` +
        `╰━━━━━━━━━━━━━━━━━━━━━╯`
      );
    }

    await react('📢');

    const newsletterJid = config.newsletterJid || '120363407057906982@newsletter';
    
    // Create beautiful message with Saqib's branding
    const newsletterMessage = 
      `╭━━━❰📢 MUHAMMAD SAQIB ❱━━━╮\n` +
      `┃\n` +
      `┃ 👨‍💻 *From:* Muhammad Saqib\n` +
      `┃ 🎨 *Role:* Creative Visual Artist & Developer\n` +
      `┃ 🤖 *Bot:* BraveBoy-MD\n` +
      `┃ 📍 *Location:* Faisalabad, Pakistan\n` +
      `┃\n` +
      `┃ ━━━━━━━━━━━━━━━━━━\n` +
      `┃\n` +
      `┃ 📝 *Message:*\n` +
      `┃ ${message}\n` +
      `┃\n` +
      `┃ ━━━━━━━━━━━━━━━━━━\n` +
      `┃\n` +
      `┃ 📞 *Contact:* 0347-8936242\n` +
      `┃\n` +
      `┃ ⚡ *Powered by Muhammad Saqib*\n` +
      `┃ 🛡️ *ProBoy-MD Security System*\n` +
      `╰━━━━━━━━━━━━━━━━━━━━━╯\n\n` +
      `> _Follow for more updates! 🚀_`;

    try {
      await sock.sendMessage(newsletterJid, { text: newsletterMessage });
      
      await reply(
        `╭━━━❰✅ MESSAGE SENT ❱━━━╮\n` +
        `┃\n` +
        `┃ ✅ *Message sent to newsletter!*\n` +
        `┃\n` +
        `┃ 📢 *Channel:* ${newsletterJid}\n` +
        `┃ 📝 *Message:* ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}\n` +
        `┃\n` +
        `┃ 👨‍💻 *Muhammad Saqib - Developer*\n` +
        `╰━━━━━━━━━━━━━━━━━━━━━╯`
      );
      await react('✅');
      
    } catch (error) {
      await reply(
        `╭━━━❰❌ SEND FAILED ❱━━━╮\n` +
        `┃\n` +
        `┃ ❌ *Failed to send message!*\n` +
        `┃\n` +
        `┃ 📝 *Error:* ${error.message}\n` +
        `┃\n` +
        `┃ 💡 *Make sure:*\n` +
        `┃ • Newsletter JID is correct\n` +
        `┃ • Bot is in the channel\n` +
        `┃\n` +
        `┃ 👨‍💻 *Muhammad Saqib - Developer*\n` +
        `╰━━━━━━━━━━━━━━━━━━━━━╯`
      );
      await react('❌');
    }
  }
};
