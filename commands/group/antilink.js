const database = require('../../database');

module.exports = {
  name: 'antilink',
  aliases: ['al', 'linkguard', 'antilink-saqib'],
  category: 'group',
  description: '🔗 Advanced Anti-Link System by Muhammad Saqib - Automatically removes links from groups',
  usage: `.antilink <on/off/status/action/whitelist/settings>`,
  groupOnly: true,
  adminOnly: true,

  async execute(sock, msg, args, extra) {
    try {
      const { from, reply, react, isAdmin, isOwner, sender } = extra;
      const sub = (args[0] || '').toLowerCase();
      let settings = database.getGroupSettings(from);

      // Developer Info
      const DEVELOPER = {
        name: 'Muhammad Saqib',
        role: 'Creative Visual Artist & Developer',
        age: '17 Years',
        location: 'Faisalabad, Pakistan',
        contact: '0347-8936242'
      };

      if (!sub || sub === 'help' || sub === 'info') {
        return reply(
          `╭━━━❰🔗 ANTI-LINK SYSTEM ❱━━━╮\n` +
          `┃\n` +
          `┃ 👨‍💻 *Developer:* ${DEVELOPER.name}\n` +
          `┃ 🎨 *Role:* ${DEVELOPER.role}\n` +
          `┃ 📍 *Location:* ${DEVELOPER.location}\n` +
          `┃ 📞 *Contact:* ${DEVELOPER.contact}\n` +
          `┃\n` +
          `┃ ━━━━━━━━━━━━━━━━━━\n` +
          `┃\n` +
          `┃ 📋 *Commands:*\n` +
          `┃\n` +
          `┃ 🔘 .antilink on/off\n` +
          `┃    → Enable/disable link protection\n` +
          `┃\n` +
          `┃ 🔘 .antilink status\n` +
          `┃    → Check current settings\n` +
          `┃\n` +
          `┃ 🔘 .antilink action delete|kick|warn\n` +
          `┃    → Set punishment for links\n` +
          `┃\n` +
          `┃ 🔘 .antilink whitelist add <domain>\n` +
          `┃    → Allow specific websites\n` +
          `┃\n` +
          `┃ 🔘 .antilink whitelist del <domain>\n` +
          `┃    → Remove from allowed list\n` +
          `┃\n` +
          `┃ 🔘 .antilink whitelist list\n` +
          `┃    → Show allowed domains\n` +
          `┃\n` +
          `┃ 🔘 .antilink whitelist clear\n` +
          `┃    → Clear all allowed domains\n` +
          `┃\n` +
          `┃ 🔘 .antilink settings\n` +
          `┃    → Show detailed settings\n` +
          `┃\n` +
          `┃ ━━━━━━━━━━━━━━━━━━\n` +
          `┃\n` +
          `┃ ⚡ *Powered by Muhammad Saqib*\n` +
          `┃ 🚀 *Anti-Link System v2.0*\n` +
          `╰━━━━━━━━━━━━━━━━━━━━━╯`
        );
      }

      await react('⏳');

      // ON/OFF
      if (sub === 'on' || sub === 'enable') {
        database.updateGroupSettings(from, { antilink: true });
        await reply(
          `✅ *Anti-Link System ENABLED!*\n\n` +
          `🔗 All links will be blocked in this group.\n` +
          `👨‍💻 *Developer:* Muhammad Saqib\n` +
          `⚡ Use .antilink action to change punishment.`
        );
        await react('✅');
      } 
      else if (sub === 'off' || sub === 'disable') {
        database.updateGroupSettings(from, { antilink: false });
        await reply(
          `❌ *Anti-Link System DISABLED!*\n\n` +
          `🔗 Links are now allowed in this group.\n` +
          `👨‍💻 *Developer:* Muhammad Saqib`
        );
        await react('✅');
      } 
      
      // STATUS
      else if (sub === 'status') {
        const wl = Array.isArray(settings.antilinkWhitelist) ? settings.antilinkWhitelist : [];
        const action = settings.antilinkAction || 'delete';
        
        let actionEmoji = '🗑️';
        if (action === 'kick') actionEmoji = '👢';
        if (action === 'warn') actionEmoji = '⚠️';
        
        await reply(
          `╭━━━❰🔗 ANTI-LINK STATUS ❱━━━╮\n` +
          `┃\n` +
          `┃ 📊 *Status:* ${settings.antilink ? '✅ ACTIVE' : '❌ INACTIVE'}\n` +
          `┃ ⚔️ *Action:* ${actionEmoji} ${action.toUpperCase()}\n` +
          `┃ 📋 *Whitelist:* ${wl.length ? wl.length + ' domains' : 'None'}\n` +
          `┃\n` +
          `┃ ━━━━━━━━━━━━━━━━━━\n` +
          `┃\n` +
          `┃ 👨‍💻 *Developer:* Muhammad Saqib\n` +
          `┃ 🎨 *Creative Visual Artist & Developer*\n` +
          `┃ 📍 *Faisalabad, Pakistan*\n` +
          `┃\n` +
          `┃ 🔧 *Next Steps:*\n` +
          `┃ • Change action: .antilink action kick\n` +
          `┃ • Add whitelist: .antilink whitelist add youtube.com\n` +
          `╰━━━━━━━━━━━━━━━━━━━━━╯`
        );
      } 
      
      // ACTION SETTING
      else if (sub === 'action') {
        const action = (args[1] || '').toLowerCase();
        if (!['delete', 'kick', 'warn'].includes(action)) {
          return reply(
            `❌ *Invalid Action!*\n\n` +
            `Available actions:\n` +
            `🗑️ delete - Remove the link message\n` +
            `👢 kick - Remove member from group\n` +
            `⚠️ warn - Send warning message\n\n` +
            `Usage: .antilink action delete|kick|warn\n\n` +
            `👨‍💻 *Developer:* Muhammad Saqib`
          );
        }
        database.updateGroupSettings(from, { antilinkAction: action });
        
        let actionMsg = '';
        if (action === 'delete') actionMsg = 'Messages with links will be DELETED';
        if (action === 'kick') actionMsg = 'Members sending links will be KICKED';
        if (action === 'warn') actionMsg = 'Warnings will be sent for links';
        
        await reply(
          `✅ *Anti-Link Action Updated!*\n\n` +
          `⚔️ New Action: ${action.toUpperCase()}\n` +
          `📝 ${actionMsg}\n\n` +
          `👨‍💻 *Developer:* Muhammad Saqib\n` +
          `⚡ *System by Saqib Developer*`
        );
      } 
      
      // WHITELIST MANAGEMENT
      else if (sub === 'whitelist') {
        const op = (args[1] || '').toLowerCase();
        const current = Array.isArray(settings.antilinkWhitelist) ? settings.antilinkWhitelist : [];

        // LIST WHITELIST
        if (op === 'list') {
          if (!current.length) {
            return reply(
              `📋 *Whitelist is EMPTY*\n\n` +
              `No domains are currently whitelisted.\n` +
              `Add domains using: .antilink whitelist add <domain>\n\n` +
              `Example: .antilink whitelist add youtube.com\n\n` +
              `👨‍💻 *Saqib Developer*`
            );
          }
          return reply(
            `╭━━━❰✅ WHITELISTED DOMAINS ❱━━━╮\n` +
            `┃\n` +
            current.map((d, i) => `┃ ${i+1}. ${d}`).join('\n') +
            `\n┃\n` +
            `┃ ━━━━━━━━━━━━━━━━━━\n` +
            `┃ 📊 Total: ${current.length} domains\n` +
            `┃\n` +
            `┃ 👨‍💻 *Saqib Developer*\n` +
            `╰━━━━━━━━━━━━━━━━━━━━━╯`
          );
        }
        
        // CLEAR WHITELIST
        if (op === 'clear') {
          database.updateGroupSettings(from, { antilinkWhitelist: [] });
          return reply(
            `✅ *Whitelist CLEARED!*\n\n` +
            `All ${current.length} domains have been removed from whitelist.\n\n` +
            `👨‍💻 *Muhammad Saqib*\n` +
            `⚡ Anti-Link System`
          );
        }

        const domain = (args[2] || '').trim().toLowerCase().replace(/^https?:\/\//, '').split('/')[0];
        if (!domain || !domain.includes('.')) {
          return reply(
            `❌ *Invalid Domain!*\n\n` +
            `Usage: .antilink whitelist add <domain>\n` +
            `Example: .antilink whitelist add youtube.com\n` +
            `Example: .antilink whitelist add google.com\n\n` +
            `👨‍💻 *Saqib Developer*`
          );
        }

        // ADD TO WHITELIST
        if (op === 'add') {
          if (current.includes(domain)) {
            return reply(`⚠️ *${domain}* is already in whitelist!`);
          }
          const next = Array.from(new Set([...current, domain]));
          database.updateGroupSettings(from, { antilinkWhitelist: next });
          return reply(
            `✅ *Added to Whitelist!*\n\n` +
            `🌐 Domain: ${domain}\n` +
            `📊 Total whitelisted: ${next.length}\n\n` +
            `🔗 Links from ${domain} will now be ALLOWED.\n\n` +
            `👨‍💻 *Muhammad Saqib - Developer*`
          );
        }
        
        // REMOVE FROM WHITELIST
        if (op === 'del' || op === 'remove') {
          if (!current.includes(domain)) {
            return reply(`❌ *${domain}* is not in whitelist!`);
          }
          const next = current.filter(d => String(d).toLowerCase() !== domain);
          database.updateGroupSettings(from, { antilinkWhitelist: next });
          return reply(
            `✅ *Removed from Whitelist!*\n\n` +
            `🌐 Domain: ${domain}\n` +
            `📊 Remaining: ${next.length}\n\n` +
            `🔗 Links from ${domain} will now be BLOCKED.\n\n` +
            `👨‍💻 *Muhammad Saqib*`
          );
        }

        return reply(
          `❌ *Invalid Whitelist Command!*\n\n` +
          `Available:\n` +
          `• .antilink whitelist add <domain>\n` +
          `• .antilink whitelist del <domain>\n` +
          `• .antilink whitelist list\n` +
          `• .antilink whitelist clear\n\n` +
          `👨‍💻 *Saqib Developer*`
        );
      }
      
      // DETAILED SETTINGS
      else if (sub === 'settings') {
        const wl = Array.isArray(settings.antilinkWhitelist) ? settings.antilinkWhitelist : [];
        const action = settings.antilinkAction || 'delete';
        
        await reply(
          `╭━━━❰⚙️ ANTI-LINK SETTINGS ❱━━━╮\n` +
          `┃\n` +
          `┃ 🔗 *Link Protection:* ${settings.antilink ? '🟢 ON' : '🔴 OFF'}\n` +
          `┃ ⚔️ *Punishment:* ${action.toUpperCase()}\n` +
          `┃ 📋 *Whitelisted:* ${wl.length} domain(s)\n` +
          `┃\n` +
          `┃ ━━━━━━━━━━━━━━━━━━\n` +
          `┃\n` +
          `┃ 👨‍💻 *Developer Information*\n` +
          `┃\n` +
          `┃ 📛 Name: Muhammad Saqib\n` +
          `┃ 🎨 Role: Creative Visual Artist & Developer\n` +
          `┃ 📅 Age: 17 Years\n` +
          `┃ 📍 Location: Faisalabad, Pakistan\n` +
          `┃ 📞 Contact: 0347-8936242\n` +
          `┃\n` +
          `┃ ━━━━━━━━━━━━━━━━━━\n` +
          `┃\n` +
          `┃ 🛡️ *Protected by Saqib Security System*\n` +
          `┃ ⚡ *Version 2.0*\n` +
          `╰━━━━━━━━━━━━━━━━━━━━━╯`
        );
      }
      
      else {
        await reply(
          `❌ *Unknown Command!*\n\n` +
          `Type .antilink help to see all commands.\n\n` +
          `👨‍💻 *Muhammad Saqib - Developer*`
        );
      }

      await react('✅');
      
    } catch (e) {
      await extra.reply(
        `❌ *Error!*\n\n` +
        `${e.message}\n\n` +
        `👨‍💻 Report to: Muhammad Saqib\n` +
        `📞 Contact: 0347-8936242`
      );
      await extra.react('❌');
    }
  },

  // Auto-detect and remove links from messages
  async handleMessage(sock, msg, extra) {
    try {
      const { from, isGroup, sender, isAdmin, isOwner, database } = extra;
      
      // Only work in groups
      if (!isGroup) return;
      
      // Get group settings
      const settings = database.getGroupSettings(from);
      if (!settings.antilink) return;
      
      // Get message text
      const msgBody = msg.message?.conversation || 
                      msg.message?.extendedTextMessage?.text || 
                      msg.message?.imageMessage?.caption || 
                      msg.message?.videoMessage?.caption || '';
      
      if (!msgBody) return;
      
      // Check for links
      const linkPattern = /(https?:\/\/)?([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}(\/[^\s]*)?/i;
      const match = msgBody.match(linkPattern);
      
      if (!match) return;
      
      // Check whitelist
      const whitelist = Array.isArray(settings.antilinkWhitelist) ? settings.antilinkWhitelist : [];
      if (whitelist.length > 0) {
        try {
          let urlLike = match[0];
          const normalized = urlLike.startsWith('http') ? urlLike : `https://${urlLike}`;
          const hostname = new URL(normalized).hostname.toLowerCase();
          
          const isWhitelisted = whitelist.some(domain => 
            hostname === domain.toLowerCase() || 
            hostname.endsWith(`.${domain.toLowerCase()}`)
          );
          
          if (isWhitelisted) return;
        } catch (e) {
          // Invalid URL, continue with blocking
        }
      }
      
      // Check if sender is admin or owner
      const senderIsAdmin = await extra.isAdmin;
      const senderIsOwner = extra.isOwner;
      
      if (senderIsAdmin || senderIsOwner) return;
      
      // Take action
      const action = settings.antilinkAction || 'delete';
      const botIsAdmin = extra.isBotAdmin;
      
      const warningMsg = 
        `╭━━━❰🔗 ANTI-LINK ALERT ❱━━━╮\n` +
        `┃\n` +
        `┃ ⚠️ *Link Detected!*\n` +
        `┃\n` +
        `┃ 🔗 *URL:* ${match[0]}\n` +
        `┃ 👤 *Sender:* @${sender.split('@')[0]}\n` +
        `┃\n` +
        `┃ ━━━━━━━━━━━━━━━━━━\n` +
        `┃\n` +
        `┃ 🛡️ *Protected by Muhammad Saqib*\n` +
        `┃ 👨‍💻 *Anti-Link Security System*\n` +
        `┃\n` +
        `┃ ⚡ *Action Taken:* ${action.toUpperCase()}\n` +
        `╰━━━━━━━━━━━━━━━━━━━━━╯`;
      
      // Delete the message first
      try {
        await sock.sendMessage(from, { delete: msg.key });
      } catch (err) {
        console.log('Could not delete message:', err);
      }
      
      // Take action based on setting
      if (action === 'kick' && botIsAdmin) {
        await sock.groupParticipantsUpdate(from, [sender], 'remove');
        await sock.sendMessage(from, {
          text: warningMsg + `\n\n👢 *User has been KICKED for sending links!*`,
          mentions: [sender]
        });
      } 
      else if (action === 'warn') {
        // Get or create warning system
        let warnCount = database.getWarningCount?.(from, sender) || 0;
        warnCount++;
        if (database.setWarningCount) {
          database.setWarningCount(from, sender, warnCount);
        }
        
        const maxWarnings = 3;
        if (warnCount >= maxWarnings && botIsAdmin) {
          await sock.groupParticipantsUpdate(from, [sender], 'remove');
          await sock.sendMessage(from, {
            text: warningMsg + `\n\n⚠️ *User has been KICKED after ${warnCount} warnings!*`,
            mentions: [sender]
          });
        } else {
          await sock.sendMessage(from, {
            text: warningMsg + `\n\n⚠️ *Warning ${warnCount}/${maxWarnings}*\n📝 Send links again to be kicked!`,
            mentions: [sender]
          });
        }
      }
      else {
        // Default: delete only
        await sock.sendMessage(from, {
          text: warningMsg + `\n\n🗑️ *Link message has been DELETED!*`,
          mentions: [sender]
        });
      }
      
    } catch (error) {
      console.error('Anti-link handler error:', error);
    }
  }
};
