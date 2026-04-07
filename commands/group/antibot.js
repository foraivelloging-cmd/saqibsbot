const database = require('../../database');
const config = require('../../config');
const { jidDecode, jidEncode } = require('@whiskeysockets/baileys');

const cooldown = new Map(); // key -> ts

const normalizeToPn = (jid) => {
  try {
    if (!jid || typeof jid !== 'string') return jid;
    if (jid.endsWith('@g.us') || jid === 'status@broadcast') return jid;
    const d = jidDecode(jid);
    if (!d?.user) return jid;
    return jidEncode(d.user, 's.whatsapp.net');
  } catch {
    return jid;
  }
};

const getName = (sock, jid) => {
  const pn = normalizeToPn(jid);
  const c1 = sock?.store?.contacts?.[jid];
  const c2 = sock?.store?.contacts?.[pn];
  const name = c1?.notify || c1?.name || c2?.notify || c2?.name || '';
  return typeof name === 'string' ? name.trim() : '';
};

const suspiciousName = (name) => {
  const n = String(name || '').toLowerCase();
  if (!n) return false;
  // Aggressive patterns based on common bot branding
  return (
    /(^|[\s._-])(xmd|md|x-md|wa-bot|wabot|bot|robot|assistant)([\s._-]|$)/i.test(n) ||
    /-md\b/i.test(n) ||
    /\bmd\b/i.test(n) ||
    /\bbot\b/i.test(n) ||
    /\bproboy\b/i.test(n) ||
    /\bshaheen\b/i.test(n)
  );
};

const suspiciousCommand = (text) => {
  const t = String(text || '').trim();
  if (!t) return false;
  const prefixes = ['.', '/', '#', '!', '$'];
  if (!prefixes.includes(t[0])) return false;
  const cmd = t.slice(1).split(/\s+/)[0]?.toLowerCase() || '';
  if (!cmd) return false;
  const common = new Set([
    'menu', 'help', 'ping', 'alive', 'owner', 'repo', 'play', 'song', 'yta', 'yt', 'tiktok', 'fb', 'facebook',
    'ig', 'instagram', 'sticker', 's', 'img', 'image', 'ai', 'gpt', 'prompt', 'command', 'commands',
    'antilink', 'antispam', 'antifake', 'antibot', 'welcome', 'goodbye', 'set', 'get', 'eval', 'exec'
  ]);
  return common.has(cmd) || cmd.endsWith('md') || cmd.endsWith('xmd');
};

const warnAndMaybeRemove = async (sock, groupId, userJid, reason, extra) => {
  const key = `${groupId}|${userJid}`;
  const last = cooldown.get(key) || 0;
  if (Date.now() - last < 30_000) return;
  cooldown.set(key, Date.now());

  const data = database.addWarning(groupId, userJid, `AntiBot: ${reason}`);
  const maxWarnings = config.maxWarnings || 3;
  const botIsAdmin = !!extra.isBotAdmin;

  try {
    await sock.sendMessage(groupId, {
      text: `╭━━━❰🤖 BOT DETECTED ❱━━━╮\n` +
            `┃\n` +
            `┃ 🚫 *Bot Account Detected!*\n` +
            `┃\n` +
            `┃ 👤 *User:* @${userJid.split('@')[0]}\n` +
            `┃ 📝 *Reason:* ${reason}\n` +
            `┃ 📊 *Warning:* ${data.count}/${maxWarnings}\n` +
            `┃\n` +
            `┃ ━━━━━━━━━━━━━━━━━━\n` +
            `┃\n` +
            `┃ 🛡️ *Protected by Muhammad Saqib*\n` +
            `┃ 👨‍💻 *AntiBot Security System*\n` +
            `┃ 🤖 *ProBoy-MD Bot*\n` +
            `╰━━━━━━━━━━━━━━━━━━━━━╯`,
      mentions: [userJid]
    });
  } catch {}

  if (data.count >= maxWarnings && botIsAdmin) {
    try { 
      await sock.groupParticipantsUpdate(groupId, [userJid], 'remove');
      await sock.sendMessage(groupId, {
        text: `╭━━━❰👢 BOT KICKED ❱━━━╮\n` +
              `┃\n` +
              `┃ 🤖 *Bot Account KICKED!*\n` +
              `┃\n` +
              `┃ 👤 @${userJid.split('@')[0]}\n` +
              `┃ 📊 *Warnings:* ${data.count}/${maxWarnings}\n` +
              `┃\n` +
              `┃ 🛡️ *Muhammad Saqib - Security System*\n` +
              `╰━━━━━━━━━━━━━━━━━━━━━╯`,
        mentions: [userJid]
      });
    } catch {}
  }
};

module.exports = {
  name: 'antibot',
  aliases: ['abot', 'botguard', 'nobot'],
  category: 'group',
  description: '🤖 Advanced AntiBot System by Muhammad Saqib - Automatically detects and removes bot accounts',
  usage: '.antibot <on/off/status/help>',
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
          `╭━━━❰🤖 ANTI-BOT SYSTEM ❱━━━╮\n` +
          `┃\n` +
          `┃ 👨‍💻 *Developer:* ${DEVELOPER.name}\n` +
          `┃ 🎨 *Role:* ${DEVELOPER.role}\n` +
          `┃ 📍 *Location:* ${DEVELOPER.location}\n` +
          `┃ 🤖 *Bot:* ${DEVELOPER.bot}\n` +
          `┃\n` +
          `┃ ━━━━━━━━━━━━━━━━━━\n` +
          `┃\n` +
          `┃ 📋 *What is AntiBot?*\n` +
          `┃ Automatically detects and removes\n` +
          `┃ bot accounts from your group\n` +
          `┃\n` +
          `┃ ━━━━━━━━━━━━━━━━━━\n` +
          `┃\n` +
          `┃ 🔘 *.antibot on* - Enable protection\n` +
          `┃ 🔘 *.antibot off* - Disable protection\n` +
          `┃ 🔘 *.antibot status* - Check settings\n` +
          `┃\n` +
          `┃ ━━━━━━━━━━━━━━━━━━\n` +
          `┃\n` +
          `┃ 🔍 *Detection Methods:*\n` +
          `┃ • Bot keywords in name (bot, md, xmd)\n` +
          `┃ • Bot commands (menu, ping, sticker)\n` +
          `┃ • WhatsApp bot metadata flags\n` +
          `┃\n` +
          `┃ ━━━━━━━━━━━━━━━━━━\n` +
          `┃\n` +
          `┃ ⚡ *Powered by Muhammad Saqib*\n` +
          `┃ 🛡️ *AntiBot Security System v2.0*\n` +
          `╰━━━━━━━━━━━━━━━━━━━━━╯`
        );
      }

      await react('⏳');

      // ON
      if (sub === 'on' || sub === 'enable') {
        database.updateGroupSettings(from, { antibot: true });
        await reply(
          `✅ *AntiBot System ENABLED!*\n\n` +
          `🤖 Bot detection is now ACTIVE.\n` +
          `🔍 Any bot account trying to join will be detected and removed.\n` +
          `📝 Bot commands will also be flagged.\n\n` +
          `👨‍💻 *Developer:* Muhammad Saqib\n` +
          `🤖 *Bot:* ProBoy-MD`
        );
        await react('✅');
      } 
      
      // OFF
      else if (sub === 'off' || sub === 'disable') {
        database.updateGroupSettings(from, { antibot: false });
        await reply(
          `❌ *AntiBot System DISABLED!*\n\n` +
          `🤖 Bot accounts can now join the group.\n\n` +
          `👨‍💻 *Muhammad Saqib - Developer*`
        );
        await react('✅');
      } 
      
      // STATUS
      else if (sub === 'status') {
        const status = s.antibot ? '🟢 ACTIVE' : '🔴 INACTIVE';
        
        await reply(
          `╭━━━❰🤖 ANTI-BOT STATUS ❱━━━╮\n` +
          `┃\n` +
          `┃ 📊 *System Status:* ${status}\n` +
          `┃\n` +
          `┃ ━━━━━━━━━━━━━━━━━━\n` +
          `┃\n` +
          `┃ 🔍 *Detection Methods:*\n` +
          `┃\n` +
          `┃ 📛 *Name Patterns:* bot, md, xmd, robot\n` +
          `┃ ⌨️ *Bot Commands:* ., /, #, ! prefixes\n` +
          `┃ 🏷️ *Metadata:* WhatsApp bot flags\n` +
          `┃\n` +
          `┃ ━━━━━━━━━━━━━━━━━━\n` +
          `┃\n` +
          `┃ 👨‍💻 *Developer:* Muhammad Saqib\n` +
          `┃ 🎨 *Role:* Creative Visual Artist & Developer\n` +
          `┃ 📍 *Location:* Faisalabad, Pakistan\n` +
          `┃ 🤖 *Bot:* ProBoy-MD\n` +
          `┃\n` +
          `┃ ⚠️ *Note:* Admins are never affected\n` +
          `╰━━━━━━━━━━━━━━━━━━━━━╯`
        );
      }
      
      else {
        await reply(
          `❌ *Unknown Command!*\n\n` +
          `Available commands:\n` +
          `• .antibot on - Enable protection\n` +
          `• .antibot off - Disable protection\n` +
          `• .antibot status - Check settings\n` +
          `• .antibot help - Show this menu\n\n` +
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

  // Detect bots when they try to join
  async handleGroupUpdate(sock, update, extra) {
    try {
      const { id, participants, action } = update;
      if (action !== 'add') return;

      const s = database.getGroupSettings(id);
      if (!s.antibot) return;

      const groupMetadata = extra.groupMetadata;
      if (!groupMetadata) return;

      // Check if bot is admin
      const botId = sock.user?.id ? sock.user.id.split(':')[0] : null;
      const botJid = botId ? `${botId}@s.whatsapp.net` : null;
      const botIsAdmin = botJid
        ? groupMetadata.participants?.some(p => (p.id || p.jid) === botJid && (p.admin === 'admin' || p.admin === 'superadmin'))
        : false;
      
      if (!botIsAdmin) return;

      for (const p of participants || []) {
        const jid = typeof p === 'string' ? p : (p.id || p.jid || p.participant);
        if (!jid) continue;
        const info = groupMetadata.participants?.find(x => (x.id || x.jid) === jid) || null;

        // Skip admins
        if (info?.admin === 'admin' || info?.admin === 'superadmin') continue;

        // Detection 1: metadata bot flags (if present)
        const metaBot = info?.isBot === true || info?.bot === true || info?.verifiedLevel === 2;

        // Detection 2: contact/name branding patterns
        const name = getName(sock, jid);
        const nameBot = suspiciousName(name);

        if (metaBot || nameBot) {
          await warnAndMaybeRemove(sock, id, normalizeToPn(jid) || jid, metaBot ? 'Bot metadata detected' : `Bot name pattern: ${name || 'unknown'}`, extra);
        }
      }
    } catch {
      // ignore
    }
  },

  // Detect bots by their commands
  async handleMessage(sock, msg, extra) {
    try {
      if (!extra.isGroup) return;
      
      const s = database.getGroupSettings(extra.from);
      if (!s.antibot) return;
      if (!extra.sender || msg.key.fromMe) return;
      
      // Skip admins and owner
      if (extra.isAdmin || extra.isOwner) return;

      const content = extra.utils?.getMessageContent ? extra.utils.getMessageContent(msg) : msg.message;
      const text =
        content?.conversation ||
        content?.extendedTextMessage?.text ||
        content?.imageMessage?.caption ||
        content?.videoMessage?.caption ||
        '';

      if (!suspiciousCommand(text)) return;
      
      await warnAndMaybeRemove(sock, extra.from, normalizeToPn(extra.sender) || extra.sender, `Bot command detected: ${text.slice(0, 40)}`, extra);
    } catch {
      // ignore
    }
  }
};
