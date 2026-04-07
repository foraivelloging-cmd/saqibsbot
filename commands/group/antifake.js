const database = require('../../database');

const getNumber = (jid) => (typeof jid === 'string' ? jid.split('@')[0] : '');

const parseCodes = (input) =>
  input
    .split(',')
    .map(s => s.trim().replace(/^\+/, ''))
    .filter(Boolean);

module.exports = {
  name: 'antifake',
  aliases: ['afake', 'fakeguard', 'countryguard'],
  category: 'group',
  description: '🛡️ Advanced AntiFake System by Muhammad Saqib - Blocks fake/foreign numbers from joining',
  usage: '.antifake <on/off/status/set/help>',
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
          `╭━━━❰🛡️ ANTI-FAKE SYSTEM ❱━━━╮\n` +
          `┃\n` +
          `┃ 👨‍💻 *Developer:* ${DEVELOPER.name}\n` +
          `┃ 🎨 *Role:* ${DEVELOPER.role}\n` +
          `┃ 📍 *Location:* ${DEVELOPER.location}\n` +
          `┃ 🤖 *Bot:* ${DEVELOPER.bot}\n` +
          `┃\n` +
          `┃ ━━━━━━━━━━━━━━━━━━\n` +
          `┃\n` +
          `┃ 📋 *What is AntiFake?*\n` +
          `┃ Blocks members from specific countries\n` +
          `┃ Only allows numbers with selected country codes\n` +
          `┃\n` +
          `┃ ━━━━━━━━━━━━━━━━━━\n` +
          `┃\n` +
          `┃ 🔘 *.antifake on* - Enable protection\n` +
          `┃ 🔘 *.antifake off* - Disable protection\n` +
          `┃ 🔘 *.antifake status* - Check settings\n` +
          `┃ 🔘 *.antifake set <codes>* - Set allowed countries\n` +
          `┃ 🔘 *.antifake info* - Show country codes\n` +
          `┃\n` +
          `┃ ━━━━━━━━━━━━━━━━━━\n` +
          `┃\n` +
          `┃ 📝 *Examples:*\n` +
          `┃ .antifake set 92 (Pakistan only)\n` +
          `┃ .antifake set 92,1 (Pakistan + USA)\n` +
          `┃ .antifake set 92,44,1 (PK, UK, USA)\n` +
          `┃\n` +
          `┃ ━━━━━━━━━━━━━━━━━━\n` +
          `┃\n` +
          `┃ ⚡ *Powered by Muhammad Saqib*\n` +
          `┃ 🛡️ *AntiFake Security System v2.0*\n` +
          `╰━━━━━━━━━━━━━━━━━━━━━╯`
        );
      }

      await react('⏳');

      // ON
      if (sub === 'on' || sub === 'enable') {
        database.updateGroupSettings(from, { antifake: true });
        await reply(
          `✅ *AntiFake System ENABLED!*\n\n` +
          `🛡️ Only members with allowed country codes can join.\n` +
          `📝 Use .antifake set 92 to allow Pakistan numbers.\n` +
          `🔧 Use .antifake status to check current settings.\n\n` +
          `👨‍💻 *Developer:* Muhammad Saqib\n` +
          `🤖 *Bot:* ProBoy-MD`
        );
        await react('✅');
      } 
      
      // OFF
      else if (sub === 'off' || sub === 'disable') {
        database.updateGroupSettings(from, { antifake: false });
        await reply(
          `❌ *AntiFake System DISABLED!*\n\n` +
          `🌍 Members from any country can now join.\n\n` +
          `👨‍💻 *Muhammad Saqib - Developer*`
        );
        await react('✅');
      } 
      
      // STATUS
      else if (sub === 'status') {
        const codes = Array.isArray(s.antifakeAllowedCodes) ? s.antifakeAllowedCodes : [];
        const status = s.antifake ? '🟢 ACTIVE' : '🔴 INACTIVE';
        
        // Get country names from codes
        const getCountryName = (code) => {
          const countries = {
            '1': '🇺🇸 USA/Canada',
            '7': '🇷🇺 Russia',
            '20': '🇪🇬 Egypt',
            '27': '🇿🇦 South Africa',
            '31': '🇳🇱 Netherlands',
            '32': '🇧🇪 Belgium',
            '33': '🇫🇷 France',
            '34': '🇪🇸 Spain',
            '36': '🇭🇺 Hungary',
            '39': '🇮🇹 Italy',
            '40': '🇷🇴 Romania',
            '41': '🇨🇭 Switzerland',
            '44': '🇬🇧 United Kingdom',
            '45': '🇩🇰 Denmark',
            '46': '🇸🇪 Sweden',
            '47': '🇳🇴 Norway',
            '48': '🇵🇱 Poland',
            '49': '🇩🇪 Germany',
            '51': '🇵🇪 Peru',
            '52': '🇲🇽 Mexico',
            '53': '🇨🇺 Cuba',
            '54': '🇦🇷 Argentina',
            '55': '🇧🇷 Brazil',
            '56': '🇨🇱 Chile',
            '57': '🇨🇴 Colombia',
            '58': '🇻🇪 Venezuela',
            '60': '🇲🇾 Malaysia',
            '61': '🇦🇺 Australia',
            '62': '🇮🇩 Indonesia',
            '63': '🇵🇭 Philippines',
            '64': '🇳🇿 New Zealand',
            '65': '🇸🇬 Singapore',
            '66': '🇹🇭 Thailand',
            '81': '🇯🇵 Japan',
            '82': '🇰🇷 South Korea',
            '84': '🇻🇳 Vietnam',
            '86': '🇨🇳 China',
            '90': '🇹🇷 Turkey',
            '91': '🇮🇳 India',
            '92': '🇵🇰 Pakistan',
            '93': '🇦🇫 Afghanistan',
            '94': '🇱🇰 Sri Lanka',
            '95': '🇲🇲 Myanmar',
            '98': '🇮🇷 Iran',
            '212': '🇲🇦 Morocco',
            '213': '🇩🇿 Algeria',
            '216': '🇹🇳 Tunisia',
            '218': '🇱🇾 Libya',
            '220': '🇬🇲 Gambia',
            '221': '🇸🇳 Senegal',
            '222': '🇲🇷 Mauritania',
            '223': '🇲🇱 Mali',
            '224': '🇬🇳 Guinea',
            '225': '🇨🇮 Ivory Coast',
            '226': '🇧🇫 Burkina Faso',
            '227': '🇳🇪 Niger',
            '228': '🇹🇬 Togo',
            '229': '🇧🇯 Benin',
            '230': '🇲🇺 Mauritius',
            '231': '🇱🇷 Liberia',
            '232': '🇸🇱 Sierra Leone',
            '233': '🇬🇭 Ghana',
            '234': '🇳🇬 Nigeria',
            '235': '🇹🇩 Chad',
            '236': '🇨🇫 Central African Republic',
            '237': '🇨🇲 Cameroon',
            '238': '🇨🇻 Cape Verde',
            '239': '🇸🇹 Sao Tome',
            '240': '🇬🇶 Equatorial Guinea',
            '241': '🇬🇦 Gabon',
            '242': '🇨🇬 Congo',
            '243': '🇨🇩 DR Congo',
            '244': '🇦🇴 Angola',
            '245': '🇬🇼 Guinea-Bissau',
            '246': '🇮🇴 British Indian Ocean Territory',
            '247': '🇦🇨 Ascension Island',
            '248': '🇸🇨 Seychelles',
            '249': '🇸🇩 Sudan',
            '250': '🇷🇼 Rwanda',
            '251': '🇪🇹 Ethiopia',
            '252': '🇸🇴 Somalia',
            '253': '🇩🇯 Djibouti',
            '254': '🇰🇪 Kenya',
            '255': '🇹🇿 Tanzania',
            '256': '🇺🇬 Uganda',
            '257': '🇧🇮 Burundi',
            '258': '🇲🇿 Mozambique',
            '260': '🇿🇲 Zambia',
            '261': '🇲🇬 Madagascar',
            '262': '🇷🇪 Réunion',
            '263': '🇿🇼 Zimbabwe',
            '264': '🇳🇦 Namibia',
            '265': '🇲🇼 Malawi',
            '266': '🇱🇸 Lesotho',
            '267': '🇧🇼 Botswana',
            '268': '🇸🇿 Eswatini',
            '269': '🇰🇲 Comoros',
            '290': '🇸🇭 St Helena',
            '291': '🇪🇷 Eritrea',
            '297': '🇦🇼 Aruba',
            '298': '🇫🇴 Faroe Islands',
            '299': '🇬🇱 Greenland',
            '350': '🇬🇮 Gibraltar',
            '351': '🇵🇹 Portugal',
            '352': '🇱🇺 Luxembourg',
            '353': '🇮🇪 Ireland',
            '354': '🇮🇸 Iceland',
            '355': '🇦🇱 Albania',
            '356': '🇲🇹 Malta',
            '357': '🇨🇾 Cyprus',
            '358': '🇫🇮 Finland',
            '359': '🇧🇬 Bulgaria',
            '370': '🇱🇹 Lithuania',
            '371': '🇱🇻 Latvia',
            '372': '🇪🇪 Estonia',
            '373': '🇲🇩 Moldova',
            '374': '🇦🇲 Armenia',
            '375': '🇧🇾 Belarus',
            '376': '🇦🇩 Andorra',
            '377': '🇲🇨 Monaco',
            '378': '🇸🇲 San Marino',
            '379': '🇻🇦 Vatican City',
            '380': '🇺🇦 Ukraine',
            '381': '🇷🇸 Serbia',
            '382': '🇲🇪 Montenegro',
            '383': '🇽🇰 Kosovo',
            '385': '🇭🇷 Croatia',
            '386': '🇸🇮 Slovenia',
            '387': '🇧🇦 Bosnia',
            '389': '🇲🇰 North Macedonia',
            '420': '🇨🇿 Czech Republic',
            '421': '🇸🇰 Slovakia',
            '423': '🇱🇮 Liechtenstein',
            '500': '🇫🇰 Falkland Islands',
            '501': '🇧🇿 Belize',
            '502': '🇬🇹 Guatemala',
            '503': '🇸🇻 El Salvador',
            '504': '🇭🇳 Honduras',
            '505': '🇳🇮 Nicaragua',
            '506': '🇨🇷 Costa Rica',
            '507': '🇵🇦 Panama',
            '508': '🇵🇲 St Pierre',
            '509': '🇭🇹 Haiti',
            '590': '🇬🇵 Guadeloupe',
            '591': '🇧🇴 Bolivia',
            '592': '🇬🇾 Guyana',
            '593': '🇪🇨 Ecuador',
            '594': '🇬🇫 French Guiana',
            '595': '🇵🇾 Paraguay',
            '596': '🇲🇶 Martinique',
            '597': '🇸🇷 Suriname',
            '598': '🇺🇾 Uruguay',
            '599': '🇨🇼 Curaçao',
            '670': '🇹🇱 East Timor',
            '672': '🇦🇶 Antarctica',
            '673': '🇧🇳 Brunei',
            '674': '🇳🇷 Nauru',
            '675': '🇵🇬 Papua New Guinea',
            '676': '🇹🇴 Tonga',
            '677': '🇸🇧 Solomon Islands',
            '678': '🇻🇺 Vanuatu',
            '679': '🇫🇯 Fiji',
            '680': '🇵🇼 Palau',
            '681': '🇼🇫 Wallis and Futuna',
            '682': '🇨🇰 Cook Islands',
            '683': '🇳🇺 Niue',
            '685': '🇼🇸 Samoa',
            '686': '🇰🇮 Kiribati',
            '687': '🇳🇨 New Caledonia',
            '688': '🇹🇻 Tuvalu',
            '689': '🇵🇫 French Polynesia',
            '690': '🇹🇰 Tokelau',
            '691': '🇫🇲 Micronesia',
            '692': '🇲🇭 Marshall Islands',
            '850': '🇰🇵 North Korea',
            '852': '🇭🇰 Hong Kong',
            '853': '🇲🇴 Macau',
            '855': '🇰🇭 Cambodia',
            '856': '🇱🇦 Laos',
            '880': '🇧🇩 Bangladesh',
            '886': '🇹🇼 Taiwan',
            '960': '🇲🇻 Maldives',
            '961': '🇱🇧 Lebanon',
            '962': '🇯🇴 Jordan',
            '963': '🇸🇾 Syria',
            '964': '🇮🇶 Iraq',
            '965': '🇰🇼 Kuwait',
            '966': '🇸🇦 Saudi Arabia',
            '967': '🇾🇪 Yemen',
            '968': '🇴🇲 Oman',
            '969': '🇾🇪 Yemen',
            '970': '🇵🇸 Palestine',
            '971': '🇦🇪 UAE',
            '972': '🇮🇱 Israel',
            '973': '🇧🇭 Bahrain',
            '974': '🇶🇦 Qatar',
            '975': '🇧🇹 Bhutan',
            '976': '🇲🇳 Mongolia',
            '977': '🇳🇵 Nepal',
            '992': '🇹🇯 Tajikistan',
            '993': '🇹🇲 Turkmenistan',
            '994': '🇦🇿 Azerbaijan',
            '995': '🇬🇪 Georgia',
            '996': '🇰🇬 Kyrgyzstan',
            '998': '🇺🇿 Uzbekistan'
          };
          return countries[code] || `Code +${code}`;
        };

        let allowedList = '';
        if (codes.length) {
          allowedList = codes.map(code => `┃   📞 +${code} → ${getCountryName(code)}`).join('\n');
        } else {
          allowedList = '┃   ❌ No codes set';
        }

        await reply(
          `╭━━━❰🛡️ ANTI-FAKE STATUS ❱━━━╮\n` +
          `┃\n` +
          `┃ 📊 *System Status:* ${status}\n` +
          `┃\n` +
          `┃ ━━━━━━━━━━━━━━━━━━\n` +
          `┃\n` +
          `┃ 🌍 *Allowed Countries:*\n` +
          `${allowedList}\n` +
          `┃\n` +
          `┃ ━━━━━━━━━━━━━━━━━━\n` +
          `┃\n` +
          `┃ 👨‍💻 *Developer:* Muhammad Saqib\n` +
          `┃ 🎨 *Role:* Creative Visual Artist & Developer\n` +
          `┃ 📍 *Location:* Faisalabad, Pakistan\n` +
          `┃ 🤖 *Bot:* ProBoy-MD\n` +
          `┃\n` +
          `┃ 📝 *To change:* .antifake set 92,1\n` +
          `╰━━━━━━━━━━━━━━━━━━━━━╯`
        );
      } 
      
      // SET CODES
      else if (sub === 'set') {
        const codes = parseCodes(args.slice(1).join(' '));
        if (!codes.length) {
          return reply(
            `❌ *Invalid Country Codes!*\n\n` +
            `Usage: .antifake set 92 (Pakistan only)\n` +
            `.antifake set 92,1 (Pakistan + USA)\n` +
            `.antifake set 92,44,1 (PK, UK, USA)\n\n` +
            `📝 Common codes:\n` +
            `• 92 → Pakistan 🇵🇰\n` +
            `• 91 → India 🇮🇳\n` +
            `• 1 → USA/Canada 🇺🇸🇨🇦\n` +
            `• 44 → United Kingdom 🇬🇧\n` +
            `• 61 → Australia 🇦🇺\n\n` +
            `👨‍💻 *Muhammad Saqib - Developer*`
          );
        }
        
        database.updateGroupSettings(from, { antifakeAllowedCodes: codes });
        
        // Get country names for confirmation
        const getCountryName = (code) => {
          const countries = { '92': '🇵🇰 Pakistan', '1': '🇺🇸 USA/Canada', '44': '🇬🇧 UK', '91': '🇮🇳 India', '61': '🇦🇺 Australia' };
          return countries[code] || `+${code}`;
        };
        
        const countryList = codes.map(code => `  • ${getCountryName(code)}`).join('\n');
        
        await reply(
          `✅ *AntiFake System UPDATED!*\n\n` +
          `🌍 *Allowed Countries:*\n${countryList}\n\n` +
          `🛡️ Only members with these country codes can join.\n` +
          `📝 Use .antifake status to verify.\n\n` +
          `👨‍💻 *Muhammad Saqib - Developer*\n` +
          `🤖 *ProBoy-MD Security System*`
        );
        await react('✅');
      } 
      
      // INFO - Show all country codes
      else if (sub === 'info' || sub === 'codes') {
        await reply(
          `╭━━━❰🌍 COUNTRY CODES ❱━━━╮\n` +
          `┃\n` +
          `┃ 📞 *Common Country Codes:*\n` +
          `┃\n` +
          `┃   92  → 🇵🇰 Pakistan\n` +
          `┃   91  → 🇮🇳 India\n` +
          `┃   1   → 🇺🇸 USA/Canada\n` +
          `┃   44  → 🇬🇧 United Kingdom\n` +
          `┃   61  → 🇦🇺 Australia\n` +
          `┃   49  → 🇩🇪 Germany\n` +
          `┃   33  → 🇫🇷 France\n` +
          `┃   39  → 🇮🇹 Italy\n` +
          `┃   34  → 🇪🇸 Spain\n` +
          `┃   55  → 🇧🇷 Brazil\n` +
          `┃   81  → 🇯🇵 Japan\n` +
          `┃   82  → 🇰🇷 South Korea\n` +
          `┃   86  → 🇨🇳 China\n` +
          `┃   62  → 🇮🇩 Indonesia\n` +
          `┃   60  → 🇲🇾 Malaysia\n` +
          `┃   63  → 🇵🇭 Philippines\n` +
          `┃   66  → 🇹🇭 Thailand\n` +
          `┃   84  → 🇻🇳 Vietnam\n` +
          `┃   90  → 🇹🇷 Turkey\n` +
          `┃   20  → 🇪🇬 Egypt\n` +
          `┃   27  → 🇿🇦 South Africa\n` +
          `┃   234 → 🇳🇬 Nigeria\n` +
          `┃\n` +
          `┃ ━━━━━━━━━━━━━━━━━━\n` +
          `┃\n` +
          `┃ 📝 *Usage:* .antifake set 92,1,44\n` +
          `┃ (Separate codes with commas)\n` +
          `┃\n` +
          `┃ 👨‍💻 *Muhammad Saqib - Developer*\n` +
          `╰━━━━━━━━━━━━━━━━━━━━━╯`
        );
      }
      
      else {
        await reply(
          `❌ *Unknown Command!*\n\n` +
          `Available commands:\n` +
          `• .antifake on - Enable protection\n` +
          `• .antifake off - Disable protection\n` +
          `• .antifake status - Check settings\n` +
          `• .antifake set 92 - Set allowed countries\n` +
          `• .antifake info - Show country codes\n\n` +
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

  // Auto-kick fake numbers when they join
  async handleGroupUpdate(sock, update, extra) {
    try {
      const { id, participants, action } = update;
      if (action !== 'add') return;
      
      const s = database.getGroupSettings(id);
      if (!s.antifake) return;

      const allowed = Array.isArray(s.antifakeAllowedCodes) ? s.antifakeAllowedCodes : [];
      if (!allowed.length) return;

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
        const num = getNumber(jid);
        if (!num) continue;
        
        const ok = allowed.some(code => num.startsWith(String(code)));
        
        if (!ok) {
          // Kick the fake number
          try { 
            await sock.groupParticipantsUpdate(id, [jid], 'remove');
            
            // Send notification
            await sock.sendMessage(id, {
              text: `╭━━━❰🛡️ ANTI-FAKE ALERT ❱━━━╮\n` +
                    `┃\n` +
                    `┃ ⚠️ *Fake/Foreign Number Detected!*\n` +
                    `┃\n` +
                    `┃ 📞 *Number:* +${num}\n` +
                    `┃ 🚫 *Status:* KICKED\n` +
                    `┃\n` +
                    `┃ ━━━━━━━━━━━━━━━━━━\n` +
                    `┃\n` +
                    `┃ 🛡️ *Protected by Muhammad Saqib*\n` +
                    `┃ 👨‍💻 *AntiFake Security System*\n` +
                    `┃ 🤖 *ProBoy-MD Bot*\n` +
                    `╰━━━━━━━━━━━━━━━━━━━━━╯`
            });
          } catch (err) {
            console.log('Failed to kick fake number:', err);
          }
        }
      }
    } catch (error) {
      // Ignore errors silently
    }
  }
};
