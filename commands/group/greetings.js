const database = require('../../database');
const config = require('../../config');

module.exports = {
  name: 'welcome',
  aliases: ['goodbye', 'setwelcome', 'setgoodbye', 'welcomemsg', 'goodbyemsg'],
  category: 'group',
  description: '🎉 Advanced Welcome/Goodbye System by Muhammad Saqib - Auto messages when members join/leave',
  usage: '.welcome on/off | .setwelcome <text> | .goodbye on/off | .setgoodbye <text>',
  groupOnly: true,
  adminOnly: true,

  async execute(sock, msg, args, extra) {
    try {
      const { from, reply, react, isAdmin, isOwner } = extra;
      const invoked = (extra.commandName || '').toLowerCase();
      const s = database.getGroupSettings(from);

      // Developer Info
      const DEVELOPER = {
        name: 'Muhammad Saqib',
        role: 'Creative Visual Artist & Developer',
        age: '17 Years',
        location: 'Faisalabad, Pakistan',
        contact: '0347-8936242',
        bot: 'ProBoy-MD'
      };

      await react('⏳');

      // HELP MENU
      if (args[0] === 'help' || (args.length === 0 && !['welcome', 'goodbye', 'setwelcome', 'setgoodbye'].includes(invoked))) {
        return reply(
          `╭━━━❰🎉 WELCOME/GOODBYE SYSTEM ❱━━━╮\n` +
          `┃\n` +
          `┃ 👨‍💻 *Developer:* ${DEVELOPER.name}\n` +
          `┃ 🎨 *Role:* ${DEVELOPER.role}\n` +
          `┃ 📍 *Location:* ${DEVELOPER.location}\n` +
          `┃ 🤖 *Bot:* ${DEVELOPER.bot}\n` +
          `┃\n` +
          `┃ ━━━━━━━━━━━━━━━━━━\n` +
          `┃\n` +
          `┃ 📋 *Commands:*\n` +
          `┃\n` +
          `┃ 🔘 *.welcome on/off*\n` +
          `┃    → Enable/disable welcome messages\n` +
          `┃\n` +
          `┃ 🔘 *.goodbye on/off*\n` +
          `┃    → Enable/disable goodbye messages\n` +
          `┃\n` +
          `┃ 🔘 *.setwelcome <text>*\n` +
          `┃    → Set custom welcome message\n` +
          `┃\n` +
          `┃ 🔘 *.setgoodbye <text>*\n` +
          `┃    → Set custom goodbye message\n` +
          `┃\n` +
          `┃ 🔘 *.welcome status*\n` +
          `┃    → Check current settings\n` +
          `┃\n` +
          `┃ ━━━━━━━━━━━━━━━━━━\n` +
          `┃\n` +
          `┃ 📝 *Variables you can use:*\n` +
          `┃\n` +
          `┃ • @user - Member's name\n` +
          `┃ • @group - Group name\n` +
          `┃ • #memberCount - Total members\n` +
          `┃ • #time - Current time\n` +
          `┃ • #date - Current date\n` +
          `┃ • #botName - ProBoy-MD\n` +
          `┃ • #developer - Muhammad Saqib\n` +
          `┃\n` +
          `┃ ━━━━━━━━━━━━━━━━━━\n` +
          `┃\n` +
          `┃ 📝 *Examples:*\n` +
          `┃ .setwelcome Welcome @user to @group! 🎉\n` +
          `┃ .setgoodbye Goodbye @user 👋 See you later!\n` +
          `┃\n` +
          `┃ ⚡ *Powered by Muhammad Saqib*\n` +
          `┃ 🎉 *ProBoy-MD Welcome System v2.0*\n` +
          `╰━━━━━━━━━━━━━━━━━━━━━╯`
        );
      }

      // WELCOME COMMAND
      if (invoked === 'welcome') {
        const sub = (args[0] || '').toLowerCase();
        
        if (!sub || sub === 'status') {
          const status = s.welcome ? '🟢 ENABLED' : '🔴 DISABLED';
          const currentMsg = s.welcomeMessage || config.defaultGroupSettings.welcomeMessage;
          
          return reply(
            `╭━━━❰🎉 WELCOME SYSTEM ❱━━━╮\n` +
            `┃\n` +
            `┃ 📊 *Status:* ${status}\n` +
            `┃\n` +
            `┃ ━━━━━━━━━━━━━━━━━━\n` +
            `┃\n` +
            `┃ 📝 *Current Message:*\n` +
            `┃ ${currentMsg.substring(0, 100)}${currentMsg.length > 100 ? '...' : ''}\n` +
            `┃\n` +
            `┃ ━━━━━━━━━━━━━━━━━━\n` +
            `┃\n` +
            `┃ 🔧 *Commands:*\n` +
            `┃ • .welcome on - Enable\n` +
            `┃ • .welcome off - Disable\n` +
            `┃ • .setwelcome <text> - Custom message\n` +
            `┃\n` +
            `┃ 👨‍💻 *Muhammad Saqib - Developer*\n` +
            `╰━━━━━━━━━━━━━━━━━━━━━╯`
          );
        }
        
        if (sub === 'on') {
          database.updateGroupSettings(from, { welcome: true });
          await reply(
            `✅ *Welcome System ENABLED!*\n\n` +
            `🎉 Members will now receive a welcome message when they join.\n` +
            `📝 Use .setwelcome to customize the message.\n\n` +
            `👨‍💻 *Muhammad Saqib - Developer*`
          );
        } 
        else if (sub === 'off') {
          database.updateGroupSettings(from, { welcome: false });
          await reply(
            `❌ *Welcome System DISABLED!*\n\n` +
            `🚫 Members will no longer receive welcome messages.\n\n` +
            `👨‍💻 *Muhammad Saqib - Developer*`
          );
        }
        else {
          return reply(`❌ Invalid option! Use .welcome on/off/status`);
        }
        
        await react('✅');
        return;
      }

      // GOODBYE COMMAND
      if (invoked === 'goodbye') {
        const sub = (args[0] || '').toLowerCase();
        
        if (!sub || sub === 'status') {
          const status = s.goodbye ? '🟢 ENABLED' : '🔴 DISABLED';
          const currentMsg = s.goodbyeMessage || config.defaultGroupSettings.goodbyeMessage;
          
          return reply(
            `╭━━━❰👋 GOODBYE SYSTEM ❱━━━╮\n` +
            `┃\n` +
            `┃ 📊 *Status:* ${status}\n` +
            `┃\n` +
            `┃ ━━━━━━━━━━━━━━━━━━\n` +
            `┃\n` +
            `┃ 📝 *Current Message:*\n` +
            `┃ ${currentMsg.substring(0, 100)}${currentMsg.length > 100 ? '...' : ''}\n` +
            `┃\n` +
            `┃ ━━━━━━━━━━━━━━━━━━\n` +
            `┃\n` +
            `┃ 🔧 *Commands:*\n` +
            `┃ • .goodbye on - Enable\n` +
            `┃ • .goodbye off - Disable\n` +
            `┃ • .setgoodbye <text> - Custom message\n` +
            `┃\n` +
            `┃ 👨‍💻 *Muhammad Saqib - Developer*\n` +
            `╰━━━━━━━━━━━━━━━━━━━━━╯`
          );
        }
        
        if (sub === 'on') {
          database.updateGroupSettings(from, { goodbye: true });
          await reply(
            `✅ *Goodbye System ENABLED!*\n\n` +
            `👋 Members will now receive a goodbye message when they leave.\n` +
            `📝 Use .setgoodbye to customize the message.\n\n` +
            `👨‍💻 *Muhammad Saqib - Developer*`
          );
        } 
        else if (sub === 'off') {
          database.updateGroupSettings(from, { goodbye: false });
          await reply(
            `❌ *Goodbye System DISABLED!*\n\n` +
            `🚫 Members will no longer receive goodbye messages.\n\n` +
            `👨‍💻 *Muhammad Saqib - Developer*`
          );
        }
        else {
          return reply(`❌ Invalid option! Use .goodbye on/off/status`);
        }
        
        await react('✅');
        return;
      }

      // SET WELCOME MESSAGE
      if (invoked === 'setwelcome') {
        const text = args.join(' ').trim();
        
        if (!text) {
          return reply(
            `❌ *No message provided!*\n\n` +
            `Usage: .setwelcome <message>\n\n` +
            `📝 *Available Variables:*\n` +
            `• @user - Member's name/number\n` +
            `• @group - Group name\n` +
            `• #memberCount - Total members\n` +
            `• #time - Current time\n` +
            `• #date - Current date\n` +
            `• #botName - ProBoy-MD\n` +
            `• #developer - Muhammad Saqib\n\n` +
            `📝 *Example:*\n` +
            `.setwelcome 🎉 Welcome @user to @group! We now have #memberCount members.\n\n` +
            `👨‍💻 *Muhammad Saqib - Developer*`
          );
        }
        
        database.updateGroupSettings(from, { welcomeMessage: text });
        
        await reply(
          `✅ *Welcome Message UPDATED!*\n\n` +
          `📝 *New Message:*\n${text}\n\n` +
          `🎉 When a new member joins, this message will be sent.\n\n` +
          `👨‍💻 *Muhammad Saqib - Developer*\n` +
          `🤖 *ProBoy-MD*`
        );
        await react('✅');
        return;
      }

      // SET GOODBYE MESSAGE
      if (invoked === 'setgoodbye') {
        const text = args.join(' ').trim();
        
        if (!text) {
          return reply(
            `❌ *No message provided!*\n\n` +
            `Usage: .setgoodbye <message>\n\n` +
            `📝 *Available Variables:*\n` +
            `• @user - Member's name/number\n` +
            `• @group - Group name\n` +
            `• #memberCount - Total members\n` +
            `• #time - Current time\n` +
            `• #date - Current date\n` +
            `• #botName - ProBoy-MD\n` +
            `• #developer - Muhammad Saqib\n\n` +
            `📝 *Example:*\n` +
            `.setgoodbye 👋 Goodbye @user! We will miss you.\n\n` +
            `👨‍💻 *Muhammad Saqib - Developer*`
          );
        }
        
        database.updateGroupSettings(from, { goodbyeMessage: text });
        
        await reply(
          `✅ *Goodbye Message UPDATED!*\n\n` +
          `📝 *New Message:*\n${text}\n\n` +
          `👋 When a member leaves, this message will be sent.\n\n` +
          `👨‍💻 *Muhammad Saqib - Developer*\n` +
          `🤖 *ProBoy-MD*`
        );
        await react('✅');
        return;
      }

      await reply(
        `❌ *Unknown Command!*\n\n` +
        `Available commands:\n` +
        `• .welcome on/off/status\n` +
        `• .goodbye on/off/status\n` +
        `• .setwelcome <text>\n` +
        `• .setgoodbye <text>\n\n` +
        `👨‍💻 *Muhammad Saqib - Developer*`
      );
      await react('❌');
      
    } catch (e) {
      await extra.reply(
        `❌ *Error!*\n\n` +
        `${e.message}\n\n` +
        `👨‍💻 Report to: Muhammad Saqib\n` +
        `📞 Contact: 0347-8936242`
      );
      await extra.react('❌');
    }
  }
};
