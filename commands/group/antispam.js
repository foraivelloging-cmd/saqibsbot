const database = require('../../database');
const config = require('../../config');

const tracker = new Map(); // key -> timestamps[]

const now = () => Date.now();

module.exports = {
  name: 'antispam',
  aliases: ['aspam', 'spamguard', 'slowmode'],
  category: 'group',
  description: '🛡️ Advanced AntiSpam System by Muhammad Saqib - Prevents message flooding',
  usage: '.antispam <on/off/status/set/action/help>',
  groupOnly: true,
  adminOnly: true,

  async execute(sock, msg, args, extra) {
    try {
      const { from, reply, react, isAdmin, isOwner } = extra;
      const sub = (args[0] || '').toLowerCase();
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

      if (!sub || sub === 'help') {
        return reply(
          `╭━━━❰🛡️ ANTI-SPAM SYSTEM ❱━━━╮\n` +
          `┃\n` +
          `┃ 👨‍💻 *Developer:* ${DEVELOPER.name}\n` +
          `┃ 🎨 *Role:* ${DEVELOPER.role}\n` +
          `┃ 📍 *Location:* ${DEVELOPER.location}\n` +
          `┃ 🤖 *Bot:* ${DEVELOPER.bot}\n` +
          `┃\n` +
          `┃ ━━━━━━━━━━━━━━━━━━\n` +
          `┃\n` +
          `┃ 📋 *What is AntiSpam?*\n` +
          `┃ Prevents members from sending too many\n` +
          `┃ messages too quickly (flooding)\n` +
          `┃\n` +
          `┃ ━━━━━━━━━━━━━━━━━━\n` +
          `┃\n` +
          `┃ 🔘 *.antispam on* - Enable protection\n` +
          `┃ 🔘 *.antispam off* - Disable protection\n` +
          `┃ 🔘 *.antispam status* - Check settings\n` +
          `┃ 🔘 *.antispam set <limit> <seconds>* - Configure\n` +
          `┃ 🔘 *.antispam action warn|delete* - Set punishment\n` +
          `┃\n` +
          `┃ ━━━━━━━━━━━━━━━━━━\n` +
          `┃\n` +
          `┃ 📝 *Examples:*\n` +
          `┃ .antispam set 6 8 (6 msgs in 8 secs)\n` +
          `┃ .antispam set 5 10 (5 msgs in 10 secs)\n` +
          `┃ .antispam action warn (Send warning)\n` +
          `┃ .antispam action delete (Delete spam)\n` +
          `┃\n` +
          `┃ ━━━━━━━━━━━━━━━━━━\n` +
          `┃\n` +
          `┃ ⚡ *Powered by Muhammad Saqib*\n` +
          `┃ 🛡️ *AntiSpam Security System v2.0*\n` +
          `╰━━━━━━━━━━━━━━━━━━━━━╯`
        );
      }

      await react('⏳');

      // ON
      if (sub === 'on' || sub === 'enable') {
        database.updateGroupSettings(from, { antiSpam: true });
        await reply(
          `✅ *AntiSpam System ENABLED!*\n\n` +
          `🛡️ Spam protection is now ACTIVE.\n` +
          `📝 Current limit: ${s.antiSpamLimit || 6} messages in ${s.antiSpamWindowSec || 8} seconds.\n` +
          `⚡ Action: ${(s.antiSpamAction || 'warn').toUpperCase()}\n\n` +
          `👨‍💻 *Developer:* Muhammad Saqib\n` +
          `🤖 *Bot:* ProBoy-MD`
        );
        await react('✅');
      } 
      
      // OFF
      else if (sub === 'off' || sub === 'disable') {
        database.updateGroupSettings(from, { antiSpam: false });
        await reply(
          `❌ *AntiSpam System DISABLED!*\n\n` +
          `💬 Members can now send messages without rate limits.\n\n` +
          `👨‍💻 *Muhammad Saqib - Developer*`
        );
        await react('✅');
      } 
      
      // STATUS
      else if (sub === 'status') {
        const status = s.antiSpam ? '🟢 ACTIVE' : '🔴 INACTIVE';
        const limit = s.antiSpamLimit || 6;
        const windowSec = s.antiSpamWindowSec || 8;
        const action = s.antiSpamAction || 'warn';
        
        let actionEmoji = '⚠️';
        if (action === 'delete') actionEmoji = '🗑️';
        
        // Calculate rate per minute
        const ratePerMin = Math.round((limit / windowSec) * 60);
        
        await reply(
          `╭━━━❰🛡️ ANTI-SPAM STATUS ❱━━━╮\n` +
          `┃\n` +
          `┃ 📊 *System Status:* ${status}\n` +
          `┃\n` +
          `┃ ━━━━━━━━━━━━━━━━━━\n` +
          `┃\n` +
          `┃ ⚙️ *Current Settings:*\n` +
          `┃\n` +
          `┃ 📨 *Message Limit:* ${limit} messages\n` +
          `┃ ⏱️ *Time Window:* ${windowSec} seconds\n` +
          `┃ 📊 *Rate:* ${ratePerMin} messages/minute\n` +
          `┃ ${actionEmoji} *Action:* ${action.toUpperCase()}\n` +
          `┃\n` +
          `┃ ━━━━━━━━━━━━━━━━━━\n` +
          `┃\n` +
          `┃ 👨‍💻 *Developer:* Muhammad Saqib\n` +
          `┃ 🎨 *Role:* Creative Visual Artist & Developer\n` +
          `┃ 📍 *Location:* Faisalabad, Pakistan\n` +
          `┃ 🤖 *Bot:* ProBoy-MD\n` +
          `┃\n` +
          `┃ 📝 *To change:* .antispam set 5 10\n` +
          `╰━━━━━━━━━━━━━━━━━━━━━╯`
        );
      } 
      
      // SET LIMIT & WINDOW
      else if (sub === 'set') {
        const limit = parseInt(args[1], 10);
        const windowSec = parseInt(args[2], 10);
        
        if (!Number.isFinite(limit) || limit < 2 || limit > 30) {
          return reply(
            `❌ *Invalid Limit!*\n\n` +
            `Limit must be between 2 and 30 messages.\n` +
            `Example: .antispam set 6 8\n\n` +
            `👨‍💻 *Muhammad Saqib - Developer*`
          );
        }
        
        if (!Number.isFinite(windowSec) || windowSec < 2 || windowSec > 60) {
          return reply(
            `❌ *Invalid Time Window!*\n\n` +
            `Window must be between 2 and 60 seconds.\n` +
            `Example: .antispam set 6 8\n\n` +
            `👨‍💻 *Muhammad Saqib - Developer*`
          );
        }
        
        database.updateGroupSettings(from, { 
          antiSpamLimit: limit, 
          antiSpamWindowSec: windowSec 
        });
        
        const ratePerMin = Math.round((limit / windowSec) * 60);
        
        await reply(
          `✅ *AntiSpam Settings UPDATED!*\n\n` +
          `📨 *New Limit:* ${limit} messages\n` +
          `⏱️ *Time Window:* ${windowSec} seconds\n` +
          `📊 *Max Rate:* ${ratePerMin} messages/minute\n\n` +
          `🛡️ Members will be limited to ${limit} messages every ${windowSec} seconds.\n\n` +
          `👨‍💻 *Muhammad Saqib - Developer*\n` +
          `🤖 *ProBoy-MD Security System*`
        );
        await react('✅');
      } 
      
      // SET ACTION
      else if (sub === 'action') {
        const action = (args[1] || '').toLowerCase();
        
        if (!['warn', 'delete'].includes(action)) {
          return reply(
            `❌ *Invalid Action!*\n\n` +
            `Available actions:\n` +
            `⚠️ warn - Send warning message\n` +
            `🗑️ delete - Delete spam messages\n\n` +
            `Usage: .antispam action warn\n` +
            `.antispam action delete\n\n` +
            `👨‍💻 *Muhammad Saqib - Developer*`
          );
        }
        
        database.updateGroupSettings(from, { antiSpamAction: action });
        
        const actionMsg = action === 'warn' 
          ? 'Members will receive WARNINGS for spamming. After 3 warnings, they will be KICKED.'
          : 'Spam messages will be automatically DELETED.';
        
        await reply(
          `✅ *AntiSpam Action UPDATED!*\n\n` +
          `⚡ *New Action:* ${action.toUpperCase()}\n` +
          `📝 ${actionMsg}\n\n` +
          `👨‍💻 *Muhammad Saqib - Developer*\n` +
          `🤖 *ProBoy-MD*`
        );
        await react('✅');
      }
      
      // RESET TRACKER (admin command to clear spam records)
      else if (sub === 'reset' || sub === 'clear') {
        // Clear all spam trackers for this group
        for (const [key, value] of tracker.entries()) {
          if (key.startsWith(`${from}|`)) {
            tracker.delete(key);
          }
        }
        await reply(
          `✅ *Spam Tracker RESET!*\n\n` +
          `All spam records for this group have been cleared.\n\n` +
          `👨‍💻 *Muhammad Saqib - Developer*`
        );
        await react('✅');
      }
      
      else {
        await reply(
          `❌ *Unknown Command!*\n\n` +
          `Available commands:\n` +
          `• .antispam on - Enable protection\n` +
          `• .antispam off - Disable protection\n` +
          `• .antispam status - Check settings\n` +
          `• .antispam set 6 8 - Configure limits\n` +
          `• .antispam action warn - Set punishment\n` +
          `• .antispam reset - Clear spam records\n\n` +
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

  async handleMessage(sock, msg, extra) {
    try {
      if (!extra.isGroup) return;
      
      const from = extra.from;
      const sender = extra.sender;
      const s = database.getGroupSettings(from);
      
      if (!s.antiSpam) return;
      if (!sender || msg.key.fromMe) return;

      // Skip command messages (messages starting with prefix)
      const content = extra.utils?.getMessageContent ? extra.utils.getMessageContent(msg) : msg.message;
      const text =
        content?.conversation ||
        content?.extendedTextMessage?.text ||
        content?.imageMessage?.caption ||
        content?.videoMessage?.caption ||
        '';
      
      if (text && text.trim().startsWith(config.prefix || '.')) return;

      const limit = s.antiSpamLimit || 6;
      const windowMs = (s.antiSpamWindowSec || 8) * 1000;
      const key = `${from}|${sender}`;

      // Track message timestamps
      const ts = tracker.get(key) || [];
      const t = now();
      const filtered = ts.filter(x => t - x < windowMs);
      filtered.push(t);
      tracker.set(key, filtered);

      // Clean up old entries every minute
      if (Math.random() < 0.01) {
        for (const [k, timestamps] of tracker.entries()) {
          const recent = timestamps.filter(ts => now() - ts < 60000);
          if (recent.length === 0) {
            tracker.delete(k);
          } else if (recent.length !== timestamps.length) {
            tracker.set(k, recent);
          }
        }
      }

      // Not spamming yet
      if (filtered.length < limit) return;

      // SPAM DETECTED! Take action
      const action = (s.antiSpamAction || 'warn').toLowerCase();
      
      // Always delete the spam message if possible
      try {
        await sock.sendMessage(from, { delete: msg.key });
      } catch (err) {
        console.log('Could not delete spam message:', err);
      }

      if (action === 'warn') {
        // Get or create warning system
        let warnData = { count: 0 };
        try {
          warnData = database.addWarning(from, sender, 'Spam');
        } catch (err) {
          console.log('Warning system error:', err);
        }
        
        const maxWarnings = config.maxWarnings || 3;
        const botIsAdmin = extra.isBotAdmin;
        const warningCount = warnData?.count || 1;
        
        // Send warning message
        await sock.sendMessage(from, {
          text: `╭━━━❰⚠️ SPAM WARNING ❱━━━╮\n` +
                `┃\n` +
                `┃ 🚫 *Spam Detected!*\n` +
                `┃\n` +
                `┃ 👤 *User:* @${sender.split('@')[0]}\n` +
                `┃ 📊 *Warning:* ${warningCount}/${maxWarnings}\n` +
                `┃ 📝 *Reason:* Sending too many messages\n` +
                `┃\n` +
                `┃ ━━━━━━━━━━━━━━━━━━\n` +
                `┃\n` +
                `┃ 🛡️ *Protected by Muhammad Saqib*\n` +
                `┃ 👨‍💻 *AntiSpam Security System*\n` +
                `┃\n` +
                `┃ ⚡ *Please slow down!*\n` +
                `╰━━━━━━━━━━━━━━━━━━━━━╯`,
          mentions: [sender]
        });
        
        // Kick if max warnings reached
        if (warningCount >= maxWarnings && botIsAdmin) {
          try {
            await sock.groupParticipantsUpdate(from, [sender], 'remove');
            await sock.sendMessage(from, {
              text: `╭━━━❰👢 AUTO-KICK ❱━━━╮\n` +
                    `┃\n` +
                    `┃ ⚠️ *User Kicked for Spamming!*\n` +
                    `┃\n` +
                    `┃ 👤 @${sender.split('@')[0]}\n` +
                    `┃ 📊 *Warnings:* ${warningCount}/${maxWarnings}\n` +
                    `┃\n` +
                    `┃ 🛡️ *Muhammad Saqib - Security System*\n` +
                    `╰━━━━━━━━━━━━━━━━━━━━━╯`,
              mentions: [sender]
            });
          } catch (err) {
            console.log('Failed to kick spammer:', err);
          }
        }
        
        // Reset tracker for this user
        tracker.delete(key);
        
      } else if (action === 'delete') {
        // Just delete - no warning
        await sock.sendMessage(from, {
          text: `╭━━━❰🗑️ SPAM DELETED ❱━━━╮\n` +
                `┃\n` +
                `┃ 🚫 *Spam message removed!*\n` +
                `┃\n` +
                `┃ 👤 @${sender.split('@')[0]}\n` +
                `┃ 📝 *Reason:* Rate limit exceeded\n` +
                `┃\n` +
                `┃ 🛡️ *Muhammad Saqib - AntiSpam System*\n` +
                `╰━━━━━━━━━━━━━━━━━━━━━╯`,
          mentions: [sender]
        });
        
        // Reset tracker
        tracker.delete(key);
      }
      
    } catch (error) {
      // Silent fail to avoid crashing
      console.error('AntiSpam handler error:', error);
    }
  }
};
