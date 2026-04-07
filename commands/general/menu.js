/**
 * Menu Command - Display all available commands
 * Enhanced by Muhammad Saqib - ProBoy-MD Developer
 */

const config = require('../../config');
const { loadCommands } = require('../../utils/commandLoader');
const ui = require('../../utils/ui');

// Developer Info
const DEVELOPER = {
    name: 'Muhammad Saqib',
    role: 'Creative Visual Artist & Developer',
    age: '17 Years',
    location: 'Faisalabad, Pakistan',
    contact: '0347-8936242',
    bot: 'ProBoy-MD',
    newsletterJid: '120363407057906982@newsletter', // ✅ Updated Newsletter JID
    version: '3.0.2'
};

module.exports = {
    name: 'menu',
    aliases: ['help', 'commands', 'saqib', 'guide', 'cmds'],
    category: 'general',
    description: '📋 Show all available ProBoy-MD commands',
    usage: '.menu',
    
    async execute(sock, msg, args, extra) {
        try {
            const commands = loadCommands();
            const categories = {};

            // Group commands by category
            commands.forEach((cmd, name) => {
                if (cmd.name === name) {
                    if (!categories[cmd.category]) {
                        categories[cmd.category] = [];
                    }
                    categories[cmd.category].push(cmd);
                }
            });

            const ownerNames = Array.isArray(config.ownerName) ? config.ownerName : [config.ownerName];
            const displayOwner = DEVELOPER.name;

            // Build beautiful menu with Saqib branding
            let menuText = `╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮\n`;
            menuText += `┃      📋 PROBOY-MD COMMANDS      ┃\n`;
            menuText += `┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n`;
            menuText += `┃\n`;
            menuText += `┃ 👨‍💻 *Developer:* ${DEVELOPER.name}\n`;
            menuText += `┃ 🎨 *Role:* ${DEVELOPER.role}\n`;
            menuText += `┃ 📍 *Location:* ${DEVELOPER.location}\n`;
            menuText += `┃ 📞 *Contact:* ${DEVELOPER.contact}\n`;
            menuText += `┃ 🤖 *Bot:* ${DEVELOPER.bot}\n`;
            menuText += `┃ 📅 *Version:* ${DEVELOPER.version}\n`;
            menuText += `┃\n`;
            menuText += `┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n`;
            menuText += `┃\n`;
            menuText += `┃ 👤 *User:* @${extra.sender.split('@')[0]}\n`;
            menuText += `┃ ⚡ *Prefix:* ${config.prefix}\n`;
            menuText += `┃ 🧩 *Total Commands:* ${commands.size}\n`;
            menuText += `┃ 📂 *Categories:* ${Object.keys(categories).length}\n`;
            menuText += `┃\n`;
            menuText += `┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n`;
            menuText += `┃\n`;

            // General Commands
            if (categories.general) {
                menuText += `┃ ╭━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n`;
                menuText += `┃ ┃ 📌 *GENERAL COMMANDS*\n`;
                menuText += `┃ ┣━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n`;
                categories.general.forEach(cmd => {
                    const desc = cmd.description || 'No description';
                    menuText += `┃ ┃ ✯ .${cmd.name}\n`;
                    menuText += `┃ ┃    └─ ${desc.substring(0, 45)}${desc.length > 45 ? '...' : ''}\n`;
                });
                menuText += `┃ ┃\n`;
                menuText += `┃ ╰━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n`;
                menuText += `┃\n`;
            }

            // Group Commands
            if (categories.group) {
                menuText += `┃ ╭━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n`;
                menuText += `┃ ┃ 👥 *GROUP MANAGEMENT*\n`;
                menuText += `┃ ┣━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n`;
                categories.group.forEach(cmd => {
                    const desc = cmd.description || 'No description';
                    menuText += `┃ ┃ ✯ .${cmd.name}\n`;
                    menuText += `┃ ┃    └─ ${desc.substring(0, 45)}${desc.length > 45 ? '...' : ''}\n`;
                });
                menuText += `┃ ┃\n`;
                menuText += `┃ ╰━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n`;
                menuText += `┃\n`;
            }

            // Media Commands
            if (categories.media) {
                menuText += `┃ ╭━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n`;
                menuText += `┃ ┃ 🎵 *MEDIA DOWNLOADER*\n`;
                menuText += `┃ ┣━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n`;
                categories.media.forEach(cmd => {
                    const desc = cmd.description || 'No description';
                    menuText += `┃ ┃ ✯ .${cmd.name}\n`;
                    menuText += `┃ ┃    └─ ${desc.substring(0, 45)}${desc.length > 45 ? '...' : ''}\n`;
                });
                menuText += `┃ ┃\n`;
                menuText += `┃ ╰━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n`;
                menuText += `┃\n`;
            }

            // Utility Commands
            if (categories.utility) {
                menuText += `┃ ╭━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n`;
                menuText += `┃ ┃ 🔧 *UTILITY TOOLS*\n`;
                menuText += `┃ ┣━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n`;
                categories.utility.forEach(cmd => {
                    const desc = cmd.description || 'No description';
                    menuText += `┃ ┃ ✯ .${cmd.name}\n`;
                    menuText += `┃ ┃    └─ ${desc.substring(0, 45)}${desc.length > 45 ? '...' : ''}\n`;
                });
                menuText += `┃ ┃\n`;
                menuText += `┃ ╰━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n`;
                menuText += `┃\n`;
            }

            // Fun Commands
            if (categories.fun) {
                menuText += `┃ ╭━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n`;
                menuText += `┃ ┃ 🎮 *FUN & GAMES*\n`;
                menuText += `┃ ┣━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n`;
                categories.fun.forEach(cmd => {
                    const desc = cmd.description || 'No description';
                    menuText += `┃ ┃ ✯ .${cmd.name}\n`;
                    menuText += `┃ ┃    └─ ${desc.substring(0, 45)}${desc.length > 45 ? '...' : ''}\n`;
                });
                menuText += `┃ ┃\n`;
                menuText += `┃ ╰━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n`;
                menuText += `┃\n`;
            }

            // AI Commands
            if (categories.ai) {
                menuText += `┃ ╭━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n`;
                menuText += `┃ ┃ 🤖 *AI COMMANDS*\n`;
                menuText += `┃ ┣━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n`;
                categories.ai.forEach(cmd => {
                    const desc = cmd.description || 'No description';
                    menuText += `┃ ┃ ✯ .${cmd.name}\n`;
                    menuText += `┃ ┃    └─ ${desc.substring(0, 45)}${desc.length > 45 ? '...' : ''}\n`;
                });
                menuText += `┃ ┃\n`;
                menuText += `┃ ╰━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n`;
                menuText += `┃\n`;
            }

            // Anime Commands
            if (categories.anime) {
                menuText += `┃ ╭━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n`;
                menuText += `┃ ┃ 🎨 *ANIME COMMANDS*\n`;
                menuText += `┃ ┣━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n`;
                categories.anime.forEach(cmd => {
                    const desc = cmd.description || 'No description';
                    menuText += `┃ ┃ ✯ .${cmd.name}\n`;
                    menuText += `┃ ┃    └─ ${desc.substring(0, 45)}${desc.length > 45 ? '...' : ''}\n`;
                });
                menuText += `┃ ┃\n`;
                menuText += `┃ ╰━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n`;
                menuText += `┃\n`;
            }

            // Textmaker Commands
            if (categories.textmaker) {
                menuText += `┃ ╭━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n`;
                menuText += `┃ ┃ ✨ *TEXTMAKER COMMANDS*\n`;
                menuText += `┃ ┣━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n`;
                categories.textmaker.forEach(cmd => {
                    const desc = cmd.description || 'No description';
                    menuText += `┃ ┃ ✯ .${cmd.name}\n`;
                    menuText += `┃ ┃    └─ ${desc.substring(0, 45)}${desc.length > 45 ? '...' : ''}\n`;
                });
                menuText += `┃ ┃\n`;
                menuText += `┃ ╰━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n`;
                menuText += `┃\n`;
            }

            // Owner Commands (only show if user is owner)
            if (categories.owner && extra.isOwner) {
                menuText += `┃ ╭━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n`;
                menuText += `┃ ┃ 👑 *OWNER COMMANDS*\n`;
                menuText += `┃ ┣━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n`;
                categories.owner.forEach(cmd => {
                    const desc = cmd.description || 'No description';
                    menuText += `┃ ┃ ✯ .${cmd.name}\n`;
                    menuText += `┃ ┃    └─ ${desc.substring(0, 45)}${desc.length > 45 ? '...' : ''}\n`;
                });
                menuText += `┃ ┃\n`;
                menuText += `┃ ╰━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n`;
                menuText += `┃\n`;
            }

            menuText += `┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n`;
            menuText += `┃\n`;
            menuText += `┃ 💡 *Tips:*\n`;
            menuText += `┃ • Type .help <command> for details\n`;
            menuText += `┃ • Reply to a view-once message with .avo\n`;
            menuText += `┃ • Use .tagall to mention everyone\n`;
            menuText += `┃\n`;
            menuText += `┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n`;
            menuText += `┃\n`;
            menuText += `┃ 📢 *Join our Newsletter:*\n`;
            menuText += `┃ ${DEVELOPER.newsletterJid}\n`;
            menuText += `┃\n`;
            menuText += `┃ 🌐 *Social Media:*\n`;
            menuText += `┃ • GitHub: github.com/techai242\n`;
            menuText += `┃ • Instagram: @mrsaqib242\n`;
            menuText += `┃ • TikTok: @mrsaqib242\n`;
            menuText += `┃\n`;
            menuText += `┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n`;
            menuText += `┃\n`;
            menuText += `┃ ⚡ *Powered by Muhammad Saqib*\n`;
            menuText += `┃ 🛡️ *ProBoy-MD Security System*\n`;
            menuText += `┃ 🤖 *Version ${DEVELOPER.version}*\n`;
            menuText += `┃\n`;
            menuText += `╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;

            // Send menu with image
            const fs = require('fs');
            const path = require('path');
            const imagePath = path.join(__dirname, '../../utils/bot_image.jpg');
            
            // Try to send with Muhammad Saqib's image
            let saqibImageBuffer = null;
            try {
                const axios = require('axios');
                const imageResponse = await axios.get('https://ik.imagekit.io/shaban/SHABAN-1768573425069_nIPVZQOaT.jpg', {
                    responseType: 'arraybuffer',
                    timeout: 10000
                });
                saqibImageBuffer = Buffer.from(imageResponse.data);
            } catch (err) {
                console.log('Could not load Saqib image');
            }

            if (saqibImageBuffer) {
                await sock.sendMessage(extra.from, {
                    image: saqibImageBuffer,
                    caption: menuText,
                    mentions: [extra.sender],
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: DEVELOPER.newsletterJid,
                            newsletterName: DEVELOPER.bot,
                            serverMessageId: -1
                        }
                    }
                }, { quoted: msg });
            } else if (fs.existsSync(imagePath)) {
                const imageBuffer = fs.readFileSync(imagePath);
                await sock.sendMessage(extra.from, {
                    image: imageBuffer,
                    caption: menuText,
                    mentions: [extra.sender],
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: DEVELOPER.newsletterJid,
                            newsletterName: DEVELOPER.bot,
                            serverMessageId: -1
                        }
                    }
                }, { quoted: msg });
            } else {
                await sock.sendMessage(extra.from, {
                    text: menuText,
                    mentions: [extra.sender]
                }, { quoted: msg });
            }

            await extra.react('📋');
            
        } catch (error) {
            console.error('Menu error:', error);
            await extra.reply(
                `╭━━━❰❌ MENU ERROR ❱━━━╮\n` +
                `┃\n` +
                `┃ ❌ *Failed to load menu*\n` +
                `┃\n` +
                `┃ 📝 *Error:* ${error.message}\n` +
                `┃\n` +
                `┃ 👨‍💻 *Muhammad Saqib - Developer*\n` +
                `╰━━━━━━━━━━━━━━━━━━━━━╯`
            );
        }
    }
};
