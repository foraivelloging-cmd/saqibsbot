/**
 * TagGroups Command - Send broadcast messages to multiple groups
 * Enhanced with Muhammad Saqib Developer
 */

const config = require('../../config');

module.exports = {
  name: 'taggroups',
  aliases: ['sendtag', 'taggrp', 'broadcast', 'bc', 'massmessage'],
  category: 'owner',
  description: '📢 Advanced Broadcast System by Muhammad Saqib - Send messages to multiple groups at once',
  usage: '.taggroups <jid1,jid2,...> ± <message>\nOR reply to a message with .taggroups jid1,jid2,...',
  ownerOnly: true,

  async execute(sock, msg, args, extra) {
    const { reply, react, from } = extra;
    const q = args.join(' ');

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

    // Help menu
    if (!q || q === 'help') {
      return reply(
        `╭━━━❰📢 BROADCAST SYSTEM ❱━━━╮\n` +
        `┃\n` +
        `┃ 👨‍💻 *Developer:* ${DEVELOPER.name}\n` +
        `┃ 🎨 *Role:* ${DEVELOPER.role}\n` +
        `┃ 📍 *Location:* ${DEVELOPER.location}\n` +
        `┃ 🤖 *Bot:* ${DEVELOPER.bot}\n` +
        `┃\n` +
        `┃ ━━━━━━━━━━━━━━━━━━\n` +
        `┃\n` +
        `┃ 📋 *What is Broadcast?*\n` +
        `┃ Send a single message to multiple\n` +
        `┃ groups at the same time!\n` +
        `┃\n` +
        `┃ ━━━━━━━━━━━━━━━━━━\n` +
        `┃\n` +
        `┃ 📝 *How to Use:*\n` +
        `┃\n` +
        `┃ *Method 1 (Direct):*\n` +
        `┃ .taggroups jid1,jid2,jid3 ± message\n` +
        `┃\n` +
        `┃ *Method 2 (Reply):*\n` +
        `┃ 1. Reply to a message\n` +
        `┃ 2. Type .taggroups jid1,jid2,jid3\n` +
        `┃\n` +
        `┃ ━━━━━━━━━━━━━━━━━━\n` +
        `┃\n` +
        `┃ 📝 *Example:*\n` +
        `┃ .taggroups 123456789@g.us,987654321@g.us ± Hello everyone!\n` +
        `┃\n` +
        `┃ ⚡ *Note:* Separate JIDs with commas\n` +
        `┃ Use ± to separate JIDs from message\n` +
        `┃\n` +
        `┃ ⚡ *Powered by Muhammad Saqib*\n` +
        `┃ 📢 *ProBoy-MD Broadcast System v2.0*\n` +
        `╰━━━━━━━━━━━━━━━━━━━━━╯`
      );
    }

    if (!q.includes('±') && !msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
      return reply(
        `╭━━━❰❌ INVALID FORMAT ❱━━━╮\n` +
        `┃\n` +
        `┃ ❌ *Wrong command format!*\n` +
        `┃\n` +
        `┃ 📝 *Correct Usage:*\n` +
        `┃ .taggroups jid1,jid2 ± message\n` +
        `┃\n` +
        `┃ 📝 *Example:*\n` +
        `┃ .taggroups 123@g.us,456@g.us ± Hello!\n` +
        `┃\n` +
        `┃ 💡 *Tip:* Use ± symbol to separate\n` +
        `┃ group IDs from your message\n` +
        `┃\n` +
        `┃ 👨‍💻 *Muhammad Saqib - Developer*\n` +
        `╰━━━━━━━━━━━━━━━━━━━━━╯`
      );
    }

    let jidsInput, messageText;
    
    // Handle replied message
    if (msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
      jidsInput = q;
      const quotedMsg = msg.message.extendedTextMessage.contextInfo.quotedMessage;
      messageText = quotedMsg.conversation ||
                    quotedMsg.extendedTextMessage?.text ||
                    quotedMsg.imageMessage?.caption ||
                    quotedMsg.videoMessage?.caption ||
                    'No text in replied message';
    } else {
      const [e, f] = q.split('±').map(s => s.trim());
      jidsInput = e;
      messageText = f;
    }

    if (!messageText) {
      return reply(
        `╭━━━❰❌ NO MESSAGE ❱━━━╮\n` +
        `┃\n` +
        `┃ ❌ *Message cannot be empty!*\n` +
        `┃\n` +
        `┃ 📝 *Example:*\n` +
        `┃ .taggroups 123@g.us ± Your message here\n` +
        `┃\n` +
        `┃ 👨‍💻 *Muhammad Saqib - Developer*\n` +
        `╰━━━━━━━━━━━━━━━━━━━━━╯`
      );
    }

    // Parse JIDs
    const jids = jidsInput.split(',').map(j => j.trim()).filter(j => j);
    let validJids = [];
    let invalidJids = [];

    // Validate JIDs
    for (const jid of jids) {
      if (jid.endsWith('@g.us')) {
        validJids.push(jid);
      } else {
        invalidJids.push(jid);
      }
    }

    if (validJids.length === 0) {
      return reply(
        `╭━━━❰❌ NO VALID GROUPS ❱━━━╮\n` +
        `┃\n` +
        `┃ ❌ *No valid group IDs found!*\n` +
        `┃\n` +
        `┃ 📝 *Valid format:* xxxxxx@g.us\n` +
        `┃\n` +
        `┃ 👨‍💻 *Muhammad Saqib - Developer*\n` +
        `╰━━━━━━━━━━━━━━━━━━━━━╯`
      );
    }

    if (invalidJids.length > 0) {
      await reply(
        `╭━━━❰⚠️ INVALID JIDs ❱━━━╮\n` +
        `┃\n` +
        `┃ ⚠️ *These JIDs are invalid:*\n` +
        `┃ ${invalidJids.map(j => `┃ • ${j}`).join('\n')}\n` +
        `┃\n` +
        `┃ ✅ *Proceeding with ${validJids.length} valid groups*\n` +
        `┃\n` +
        `┃ 👨‍💻 *Muhammad Saqib - Developer*\n` +
        `╰━━━━━━━━━━━━━━━━━━━━━╯`
      );
    }

    await react('📢');
    
    let sent = 0;
    let failed = 0;
    let failedGroups = [];
    const startTime = Date.now();

    // Create beautiful broadcast message
    const broadcastMessage = 
      `╭━━━❰📢 BROADCAST MESSAGE ❱━━━╮\n` +
      `┃\n` +
      `┃ 👨‍💻 *From:* ${DEVELOPER.name}\n` +
      `┃ 🎨 *Role:* ${DEVELOPER.role}\n` +
      `┃ 🤖 *Bot:* ${DEVELOPER.bot}\n` +
      `┃\n` +
      `┃ ━━━━━━━━━━━━━━━━━━\n` +
      `┃\n` +
      `┃ 📝 *Message:*\n` +
      `┃ ${messageText}\n` +
      `┃\n` +
      `┃ ━━━━━━━━━━━━━━━━━━\n` +
      `┃\n` +
      `┃ 🛡️ *Powered by Muhammad Saqib*\n` +
      `┃ 📢 *ProBoy-MD Broadcast System*\n` +
      `╰━━━━━━━━━━━━━━━━━━━━━╯`;

    // Send to each group
    for (const groupId of validJids) {
      try {
        // Get group info
        const groupInfo = await sock.groupMetadata(groupId).catch(() => null);
        
        if (!groupInfo) {
          failed++;
          failedGroups.push(groupId);
          await reply(`❌ Cannot fetch info for: ${groupId}`);
          continue;
        }
        
        // Get all participants
        const participants = groupInfo.participants.map(p => p.id);
        const groupName = groupInfo.subject || 'Unknown Group';
        
        // Send message with mentions
        await sock.sendMessage(groupId, { 
          text: broadcastMessage, 
          mentions: participants 
        });
        
        sent++;
        
        // Send confirmation to owner
        if (sent % 5 === 0) {
          await reply(`📢 Progress: ${sent}/${validJids.length} groups done...`);
        }
        
      } catch (e) {
        failed++;
        failedGroups.push(`${groupId}: ${e.message}`);
        await reply(`❌ Failed to send to ${groupId}: ${e.message}`);
      }
      
      // Delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 1000));
    }

    const endTime = Date.now();
    const timeTaken = ((endTime - startTime) / 1000).toFixed(1);

    // Send final report
    const resultMessage = 
      `╭━━━❰📊 BROADCAST REPORT ❱━━━╮\n` +
      `┃\n` +
      `┃ ✅ *Successfully sent:* ${sent}\n` +
      `┃ ❌ *Failed:* ${failed}\n` +
      `┃ 📊 *Total groups:* ${validJids.length}\n` +
      `┃ ⏱️ *Time taken:* ${timeTaken} seconds\n` +
      `┃\n` +
      `┃ ━━━━━━━━━━━━━━━━━━\n` +
      `┃\n` +
      `┃ 📝 *Message preview:*\n` +
      `┃ ${messageText.substring(0, 100)}${messageText.length > 100 ? '...' : ''}\n` +
      `┃\n` +
      `┃ ━━━━━━━━━━━━━━━━━━\n` +
      `┃\n` +
      `┃ 👨‍💻 *Developer:* ${DEVELOPER.name}\n` +
      `┃ 🤖 *Bot:* ${DEVELOPER.bot}\n` +
      `╰━━━━━━━━━━━━━━━━━━━━━╯`;

    if (failedGroups.length > 0 && failedGroups.length <= 5) {
      await reply(resultMessage + `\n\n❌ *Failed groups:*\n${failedGroups.map(g => `• ${g}`).join('\n')}`);
    } else if (failedGroups.length > 5) {
      await reply(resultMessage + `\n\n❌ *${failedGroups.length} groups failed to receive the message.*`);
    } else {
      await reply(resultMessage);
    }

    await react('✅');
  }
};
