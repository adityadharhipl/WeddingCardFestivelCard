// lib/templates.ts

export const TEMPLATE_STYLES = [
  // Existing Styles
  { id: 'royal_gold', name: '👑 Royal Gold & Black', category: 'wedding' },
  { id: 'blush_floral', name: '🌸 Blush Floral Pink', category: 'wedding' },
  { id: 'griha_pravesh', name: '🏡 Traditional Griha Pravesh', category: 'housewarming' },
  { id: 'modern_dark', name: '✨ Modern Minimalist Dark', category: 'all' },
  { id: 'mandala_gold', name: '🔱 Vintage Mandala Gold', category: 'all' },
  { id: 'neon_glow', name: '🎈 Neon Birthday Glow', category: 'birthday' },
  { id: 'blue_silver', name: '💎 Royal Blue & Silver Luxury', category: 'all' },
  { id: 'eucalyptus', name: '🌿 Eucalyptus Greenery', category: 'all' },
  { id: 'confetti', name: '🎉 Golden Confetti Celebration', category: 'birthday' },
  { id: 'marigold_swastik', name: '🔱 Auspicious Marigold Swastik', category: 'housewarming' },

  // 5 New Premium Wedding (Sadi/Shadi) Styles
  { id: 'traditional_hindu_wedding', name: '💍 Traditional Shadi Mandap', category: 'wedding' },
  { id: 'royal_mughal_invitation', name: '🕌 Royal Mughal Palace Gold', category: 'wedding' },
  { id: 'modern_pastel_wedding', name: '🎨 Minimalist Rose Gold Pastel', category: 'wedding' },
  { id: 'vintage_lace_invitation', name: '🎀 Elegant Vintage Lace', category: 'wedding' },
  { id: 'ruby_luxe_wedding', name: '🍷 Ruby Crimson Luxe', category: 'wedding' },

  // 5 New Birthday / Anniversary / General Styles
  { id: 'golden_anniversary_luxe', name: '💍 Golden Rings Anniversary', category: 'anniversary' },
  { id: 'retro_neon_birthday', name: '🕹️ Vaporwave Retro Birthday', category: 'birthday' },
  { id: 'baby_shower_cute', name: '👶 Cute Stars Baby Shower', category: 'birthday' },
  { id: 'corporate_inauguration', name: '🏢 Sleek Corporate Opening', category: 'all' },
  { id: 'sweet_sixteen_pink', name: '👑 Sweet Sixteen Glitter Crown', category: 'birthday' },
];

export function getNormalCardSvg(
  styleId: string,
  form: { eventType: string; names: string; date: string; venue: string }
): string {
  const rawSvg = getNormalCardSvgBase(styleId, form);
  if (!rawSvg) return '';
  // Inject watermark text node before the closing svg tag
  return rawSvg.replace(
    '</svg>',
    '<text x="50%" y="1165" text-anchor="middle" fill="#ffffff" fill-opacity="0.35" font-family="\'Outfit\', sans-serif" font-size="12" font-weight="700" letter-spacing="4">ADITYA DWIVEDI</text></svg>'
  );
}

function getNormalCardSvgBase(
  styleId: string,
  form: { eventType: string; names: string; date: string; venue: string }
): string {
  const event = form.eventType.toUpperCase();
  const names = form.names.toUpperCase();
  const date = form.date.toUpperCase();
  const venue = form.venue.toUpperCase();

  switch (styleId) {
    case 'royal_gold':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200" width="100%" height="100%">
          <rect width="100%" height="100%" fill="#0b0c10"/>
          <rect x="40" y="40" width="720" height="1120" fill="none" stroke="#D4AF37" stroke-width="3" rx="15"/>
          <rect x="52" y="52" width="696" height="1096" fill="none" stroke="#D4AF37" stroke-width="1" rx="10" stroke-dasharray="10, 5"/>
          <path d="M 40 120 L 120 40 M 680 40 L 760 120 M 40 1080 L 120 1160 M 680 1160 L 760 1080" stroke="#D4AF37" stroke-width="2"/>
          <circle cx="80" cy="80" r="10" fill="none" stroke="#D4AF37" stroke-width="2"/>
          <circle cx="720" cy="80" r="10" fill="none" stroke="#D4AF37" stroke-width="2"/>
          <circle cx="80" cy="1120" r="10" fill="none" stroke="#D4AF37" stroke-width="2"/>
          <circle cx="720" cy="1120" r="10" fill="none" stroke="#D4AF37" stroke-width="2"/>
          <text x="50%" y="220" text-anchor="middle" fill="#ff2d78" font-family="'Outfit', sans-serif" font-size="24" font-weight="600" letter-spacing="4">${event}</text>
          <image href="/ganpati.png" x="340" y="230" width="120" height="120" preserveAspectRatio="xMidYMid meet" />
          <text x="50%" y="460" text-anchor="middle" fill="#ffffffa0" font-family="'Outfit', sans-serif" font-size="16" font-weight="400" letter-spacing="2">TOGETHER WITH THEIR FAMILIES</text>
          <text x="50%" y="500" text-anchor="middle" fill="#ffffffa0" font-family="'Outfit', sans-serif" font-size="16" font-weight="400" letter-spacing="2">WE REQUEST THE HONOR OF YOUR PRESENCE AT THE CELEBRATION OF</text>
          <text x="50%" y="650" text-anchor="middle" fill="#D4AF37" font-family="'Outfit', sans-serif" font-size="46" font-weight="800" letter-spacing="2">${names}</text>
          <line x1="200" y1="730" x2="600" y2="730" stroke="#ffffff20" stroke-width="1"/>
          <text x="50%" y="810" text-anchor="middle" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="18" font-weight="600" letter-spacing="1">DATE &amp; TIME</text>
          <text x="50%" y="855" text-anchor="middle" fill="#ffffffb8" font-family="'Outfit', sans-serif" font-size="16" font-weight="400">${date}</text>
          <line x1="200" y1="910" x2="600" y2="910" stroke="#ffffff20" stroke-width="1"/>
          <text x="50%" y="990" text-anchor="middle" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="18" font-weight="600" letter-spacing="1">VENUE LOCATION</text>
          <text x="50%" y="1035" text-anchor="middle" fill="#ffffffb8" font-family="'Outfit', sans-serif" font-size="16" font-weight="400">${venue}</text>
          <text x="50%" y="1110" text-anchor="middle" fill="#ff2d78" font-family="'Outfit', sans-serif" font-size="14" font-weight="600" letter-spacing="3">PLEASE JOIN US FOR THE CELEBRATION</text>
        </svg>
      `;

    case 'blush_floral':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200" width="100%" height="100%">
          <rect width="100%" height="100%" fill="#1a1216"/>
          <rect x="40" y="40" width="720" height="1120" fill="none" stroke="#ff6b9d" stroke-width="2" rx="30"/>
          <circle cx="400" cy="300" r="120" fill="none" stroke="#ff2d78" stroke-width="1" stroke-opacity="0.3"/>
          <circle cx="400" cy="300" r="140" fill="none" stroke="#ff6b9d" stroke-width="1" stroke-opacity="0.2" stroke-dasharray="5,5"/>
          <text x="50%" y="220" text-anchor="middle" fill="#ff6b9d" font-family="'Outfit', sans-serif" font-size="24" font-weight="600" letter-spacing="5">${event}</text>
          <text x="50%" y="315" text-anchor="middle" fill="#ff2d78" font-family="'Outfit', sans-serif" font-size="48">🌸</text>
          <text x="50%" y="480" text-anchor="middle" fill="#ffffffb0" font-family="'Outfit', sans-serif" font-size="16" font-weight="400" letter-spacing="2">JOIN US IN THE CELEBRATION OF LOVE FOR</text>
          <text x="50%" y="620" text-anchor="middle" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="52" font-weight="900" letter-spacing="1">${names}</text>
          <line x1="250" y1="700" x2="550" y2="700" stroke="#ff6b9d" stroke-width="2" stroke-opacity="0.5"/>
          <text x="50%" y="790" text-anchor="middle" fill="#ff6b9d" font-family="'Outfit', sans-serif" font-size="18" font-weight="600" letter-spacing="1">WHEN</text>
          <text x="50%" y="835" text-anchor="middle" fill="#ffffffd0" font-family="'Outfit', sans-serif" font-size="18" font-weight="400">${date}</text>
          <text x="50%" y="950" text-anchor="middle" fill="#ff6b9d" font-family="'Outfit', sans-serif" font-size="18" font-weight="600" letter-spacing="1">WHERE</text>
          <text x="50%" y="995" text-anchor="middle" fill="#ffffffd0" font-family="'Outfit', sans-serif" font-size="18" font-weight="400">${venue}</text>
          <text x="50%" y="1090" text-anchor="middle" fill="#ff2d78" font-family="'Outfit', sans-serif" font-size="28">🌿</text>
        </svg>
      `;

    case 'griha_pravesh':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200" width="100%" height="100%">
          <rect width="100%" height="100%" fill="#1a0c02"/>
          <rect x="40" y="40" width="720" height="1120" fill="none" stroke="#D4AF37" stroke-width="3" rx="15"/>
          <path d="M 40 80 Q 200 120 360 80 Q 520 120 760 80" fill="none" stroke="#f59e0b" stroke-width="8" stroke-dasharray="15, 10"/>
          <text x="50%" y="220" text-anchor="middle" fill="#f59e0b" font-family="'Outfit', sans-serif" font-size="28" font-weight="800" letter-spacing="4">GRIHA PRAVESH INVITATION</text>
          <image href="/ganpati.png" x="340" y="280" width="120" height="120" preserveAspectRatio="xMidYMid meet" />
          <text x="50%" y="540" text-anchor="middle" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="16" font-weight="400" letter-spacing="2">WE INIVTE YOU TO GRACE THE AUSPICIOUS OCCASION OF THE HOUSEWARMING OF</text>
          <text x="50%" y="660" text-anchor="middle" fill="#D4AF37" font-family="'Outfit', sans-serif" font-size="42" font-weight="900" letter-spacing="1">${names}</text>
          <line x1="200" y1="730" x2="600" y2="730" stroke="#f59e0b" stroke-width="1" stroke-opacity="0.5"/>
          <text x="50%" y="810" text-anchor="middle" fill="#f59e0b" font-family="'Outfit', sans-serif" font-size="18" font-weight="700" letter-spacing="1">DATE &amp; MUHURAT</text>
          <text x="50%" y="855" text-anchor="middle" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="18" font-weight="400">${date}</text>
          <line x1="200" y1="910" x2="600" y2="910" stroke="#f59e0b" stroke-width="1" stroke-opacity="0.5"/>
          <text x="50%" y="990" text-anchor="middle" fill="#f59e0b" font-family="'Outfit', sans-serif" font-size="18" font-weight="700" letter-spacing="1">VENUE ADDRESS</text>
          <text x="50%" y="1035" text-anchor="middle" fill="#ffffffb8" font-family="'Outfit', sans-serif" font-size="16" font-weight="400">${venue}</text>
          <text x="50%" y="1110" text-anchor="middle" fill="#f59e0b" font-family="'Outfit', sans-serif" font-size="14" font-weight="600" letter-spacing="2">SHREE GANESHAYA NAMAH</text>
        </svg>
      `;

    case 'modern_dark':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200" width="100%" height="100%">
          <rect width="100%" height="100%" fill="#0a0a0c"/>
          <line x1="60" y1="60" x2="740" y2="60" stroke="#ffffff" stroke-width="1" stroke-opacity="0.1"/>
          <line x1="60" y1="60" x2="60" y2="1140" stroke="#ffffff" stroke-width="1" stroke-opacity="0.1"/>
          <line x1="740" y1="60" x2="740" y2="1140" stroke="#ffffff" stroke-width="1" stroke-opacity="0.1"/>
          <line x1="60" y1="1140" x2="740" y2="1140" stroke="#ffffff" stroke-width="1" stroke-opacity="0.1"/>
          <text x="50%" y="220" text-anchor="middle" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="20" font-weight="300" letter-spacing="10">${event}</text>
          <circle cx="400" cy="350" r="3" fill="#ff2d78"/>
          <text x="50%" y="470" text-anchor="middle" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="52" font-weight="800" letter-spacing="4">${names}</text>
          <text x="50%" y="580" text-anchor="middle" fill="#ffffffb0" font-family="'Outfit', sans-serif" font-size="15" font-weight="300" letter-spacing="2">INVITE YOU TO SHARE IN THEIR HAPPINESS</text>
          <rect x="250" y="670" width="300" height="1" fill="#ff2d78"/>
          <text x="50%" y="780" text-anchor="middle" fill="#ffffffb8" font-family="'Outfit', sans-serif" font-size="16" font-weight="300" letter-spacing="5">DATE AND TIME</text>
          <text x="50%" y="825" text-anchor="middle" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="20" font-weight="600">${date}</text>
          <text x="50%" y="940" text-anchor="middle" fill="#ffffffb8" font-family="'Outfit', sans-serif" font-size="16" font-weight="300" letter-spacing="5">VENUE LOCATION</text>
          <text x="50%" y="985" text-anchor="middle" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="18" font-weight="600">${venue}</text>
          <text x="50%" y="1090" text-anchor="middle" fill="#ff2d78" font-family="'Outfit', sans-serif" font-size="14" font-weight="600" letter-spacing="5">JOIN US</text>
        </svg>
      `;

    case 'mandala_gold':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200" width="100%" height="100%">
          <rect width="100%" height="100%" fill="#0d0d0e"/>
          <circle cx="400" cy="600" r="280" fill="none" stroke="#D4AF37" stroke-width="1" stroke-opacity="0.15"/>
          <circle cx="400" cy="600" r="260" fill="none" stroke="#D4AF37" stroke-width="1" stroke-opacity="0.1" stroke-dasharray="5, 10"/>
          <path d="M 400 320 A 280 280 0 0 0 400 880" fill="none" stroke="#D4AF37" stroke-width="1" stroke-opacity="0.1"/>
          <path d="M 120 600 A 280 280 0 0 0 680 600" fill="none" stroke="#D4AF37" stroke-width="1" stroke-opacity="0.1"/>
          <rect x="40" y="40" width="720" height="1120" fill="none" stroke="#D4AF37" stroke-width="2" rx="20"/>
          <text x="50%" y="200" text-anchor="middle" fill="#D4AF37" font-family="'Outfit', sans-serif" font-size="22" font-weight="600" letter-spacing="6">${event}</text>
          <text x="50%" y="280" text-anchor="middle" fill="#D4AF37" font-family="'Outfit', sans-serif" font-size="48">🔱</text>
          <text x="50%" y="420" text-anchor="middle" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="16" font-weight="300" letter-spacing="3">WE CORDIALLY INVITE YOU TO JOIN THE CELEBRATION OF</text>
          <text x="50%" y="560" text-anchor="middle" fill="#D4AF37" font-family="'Outfit', sans-serif" font-size="52" font-weight="900" letter-spacing="1">${names}</text>
          <line x1="200" y1="650" x2="600" y2="650" stroke="#D4AF37" stroke-width="1" stroke-opacity="0.3"/>
          <text x="50%" y="780" text-anchor="middle" fill="#ffffffd0" font-family="'Outfit', sans-serif" font-size="16" font-weight="600" letter-spacing="2">ON THE AUSPICIOUS DATE OF</text>
          <text x="50%" y="825" text-anchor="middle" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="20" font-weight="700">${date}</text>
          <text x="50%" y="940" text-anchor="middle" fill="#ffffffd0" font-family="'Outfit', sans-serif" font-size="16" font-weight="600" letter-spacing="2">VENUE ADDRESS</text>
          <text x="50%" y="985" text-anchor="middle" fill="#ffffffb8" font-family="'Outfit', sans-serif" font-size="18">${venue}</text>
        </svg>
      `;

    case 'neon_glow':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200" width="100%" height="100%">
          <rect width="100%" height="100%" fill="#090a10"/>
          <rect x="40" y="40" width="720" height="1120" fill="none" stroke="#ff2d78" stroke-width="3" rx="20" stroke-opacity="0.8" style="filter: drop-shadow(0 0 8px #ff2d78)"/>
          <text x="50%" y="220" text-anchor="middle" fill="#00ffff" font-family="'Outfit', sans-serif" font-size="28" font-weight="900" letter-spacing="8" style="filter: drop-shadow(0 0 6px #00ffff)">${event}</text>
          <text x="50%" y="360" text-anchor="middle" fill="#ff2d78" font-family="'Outfit', sans-serif" font-size="72" font-weight="900" letter-spacing="1" style="filter: drop-shadow(0 0 10px #ff2d78)">🎈 PARTY</text>
          <text x="50%" y="510" text-anchor="middle" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="18" font-weight="500">LET'S CELEBRATE THE BIRTHDAY OF</text>
          <text x="50%" y="650" text-anchor="middle" fill="#00ffff" font-family="'Outfit', sans-serif" font-size="56" font-weight="900" style="filter: drop-shadow(0 0 10px #00ffff)">${names}</text>
          <text x="50%" y="780" text-anchor="middle" fill="#ff2d78" font-family="'Outfit', sans-serif" font-size="18" font-weight="700" letter-spacing="2">WHEN TO ARRIVE</text>
          <text x="50%" y="825" text-anchor="middle" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="20" font-weight="600">${date}</text>
          <text x="50%" y="940" text-anchor="middle" fill="#ff2d78" font-family="'Outfit', sans-serif" font-size="18" font-weight="700" letter-spacing="2">PARTY LOCATION</text>
          <text x="50%" y="985" text-anchor="middle" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="18" font-weight="600">${venue}</text>
          <text x="50%" y="1090" text-anchor="middle" fill="#00ffff" font-family="'Outfit', sans-serif" font-size="15" font-weight="800" letter-spacing="4">BE READY FOR DANCING &amp; DRINKS!</text>
        </svg>
      `;

    case 'blue_silver':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200" width="100%" height="100%">
          <rect width="100%" height="100%" fill="#0a1128"/>
          <rect x="40" y="40" width="720" height="1120" fill="none" stroke="#c0c0c0" stroke-width="4" rx="20"/>
          <rect x="52" y="52" width="696" height="1096" fill="none" stroke="#c0c0c0" stroke-width="1" rx="15" stroke-dasharray="8, 4"/>
          <text x="50%" y="220" text-anchor="middle" fill="#c0c0c0" font-family="'Outfit', sans-serif" font-size="22" font-weight="600" letter-spacing="6">${event}</text>
          <text x="50%" y="320" text-anchor="middle" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="42">💎</text>
          <text x="50%" y="460" text-anchor="middle" fill="#ffffffa8" font-family="'Outfit', sans-serif" font-size="16" font-weight="300" letter-spacing="2">WE CORDIALLY REQUEST YOUR PRESENCE AT</text>
          <text x="50%" y="620" text-anchor="middle" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="52" font-weight="800" letter-spacing="1">${names}</text>
          <line x1="200" y1="700" x2="600" y2="700" stroke="#c0c0c0" stroke-width="1"/>
          <text x="50%" y="790" text-anchor="middle" fill="#c0c0c0" font-family="'Outfit', sans-serif" font-size="16" font-weight="600" letter-spacing="3">DATE AND MUHURAT</text>
          <text x="50%" y="835" text-anchor="middle" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="20" font-weight="700">${date}</text>
          <text x="50%" y="950" text-anchor="middle" fill="#c0c0c0" font-family="'Outfit', sans-serif" font-size="16" font-weight="600" letter-spacing="3">VENUE ADDRESS</text>
          <text x="50%" y="995" text-anchor="middle" fill="#ffffffb8" font-family="'Outfit', sans-serif" font-size="18">${venue}</text>
        </svg>
      `;

    case 'eucalyptus':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200" width="100%" height="100%">
          <rect width="100%" height="100%" fill="#111612"/>
          <rect x="40" y="40" width="720" height="1120" fill="none" stroke="#2e3830" stroke-width="2" rx="20"/>
          <path d="M 40 200 C 120 180, 180 120, 200 40" fill="none" stroke="#4a5d4e" stroke-width="2"/>
          <ellipse cx="120" cy="160" rx="25" ry="12" fill="#2e3c31" transform="rotate(-20, 120, 160)"/>
          <ellipse cx="170" cy="110" rx="20" ry="10" fill="#3b4c3e" transform="rotate(-40, 170, 110)"/>
          <text x="50%" y="220" text-anchor="middle" fill="#4a5d4e" font-family="'Outfit', sans-serif" font-size="24" font-weight="600" letter-spacing="5">${event}</text>
          <text x="50%" y="450" text-anchor="middle" fill="#ffffffd0" font-family="'Outfit', sans-serif" font-size="16" font-weight="400" letter-spacing="2">PLEASE JOIN US TO CELEBRATE THE OCCASION OF</text>
          <text x="50%" y="590" text-anchor="middle" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="50" font-weight="800">${names}</text>
          <line x1="250" y1="680" x2="550" y2="680" stroke="#4a5d4e" stroke-width="1"/>
          <text x="50%" y="770" text-anchor="middle" fill="#4a5d4e" font-family="'Outfit', sans-serif" font-size="16" font-weight="700" letter-spacing="2">DATE &amp; TIME</text>
          <text x="50%" y="815" text-anchor="middle" fill="#ffffffd0" font-family="'Outfit', sans-serif" font-size="18" font-weight="500">${date}</text>
          <text x="50%" y="930" text-anchor="middle" fill="#4a5d4e" font-family="'Outfit', sans-serif" font-size="16" font-weight="700" letter-spacing="2">WHERE TO JOIN</text>
          <text x="50%" y="975" text-anchor="middle" fill="#ffffffd0" font-family="'Outfit', sans-serif" font-size="18" font-weight="500">${venue}</text>
          <text x="50%" y="1080" text-anchor="middle" fill="#4a5d4e" font-family="'Outfit', sans-serif" font-size="28">🌿</text>
        </svg>
      `;

    case 'confetti':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200" width="100%" height="100%">
          <rect width="100%" height="100%" fill="#0c0a0f"/>
          <circle cx="100" cy="150" r="5" fill="#D4AF37" opacity="0.6"/>
          <circle cx="180" cy="220" r="8" fill="#ff2d78" opacity="0.4"/>
          <circle cx="700" cy="180" r="6" fill="#D4AF37" opacity="0.5"/>
          <circle cx="650" cy="280" r="4" fill="#ff2d78" opacity="0.6"/>
          <circle cx="150" cy="950" r="6" fill="#D4AF37" opacity="0.4"/>
          <circle cx="680" cy="1000" r="8" fill="#ff2d78" opacity="0.5"/>
          <rect x="40" y="40" width="720" height="1120" fill="none" stroke="#D4AF37" stroke-width="2" rx="20"/>
          <text x="50%" y="220" text-anchor="middle" fill="#ff2d78" font-family="'Outfit', sans-serif" font-size="24" font-weight="700" letter-spacing="5">${event}</text>
          <text x="50%" y="360" text-anchor="middle" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="64" font-weight="900" style="filter: drop-shadow(0 4px 10px rgba(0,0,0,0.5))">🎉 CELEBRATE!</text>
          <text x="50%" y="500" text-anchor="middle" fill="#ffffffb8" font-family="'Outfit', sans-serif" font-size="16" font-weight="400">YOU ARE CORDIALLY INVITED TO THE PARTY FOR</text>
          <text x="50%" y="640" text-anchor="middle" fill="#D4AF37" font-family="'Outfit', sans-serif" font-size="52" font-weight="900">${names}</text>
          <line x1="200" y1="720" x2="600" y2="720" stroke="#ffffff1f" stroke-width="1"/>
          <text x="50%" y="800" text-anchor="middle" fill="#ff2d78" font-family="'Outfit', sans-serif" font-size="18" font-weight="700" letter-spacing="2">DATE &amp; TIME</text>
          <text x="50%" y="845" text-anchor="middle" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="18" font-weight="500">${date}</text>
          <text x="50%" y="950" text-anchor="middle" fill="#ff2d78" font-family="'Outfit', sans-serif" font-size="18" font-weight="700" letter-spacing="2">LOCATION</text>
          <text x="50%" y="995" text-anchor="middle" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="18" font-weight="500">${venue}</text>
        </svg>
      `;

    case 'marigold_swastik':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200" width="100%" height="100%">
          <rect width="100%" height="100%" fill="#1a0002"/>
          <rect x="40" y="40" width="720" height="1120" fill="none" stroke="#D4AF37" stroke-width="3" rx="15"/>
          <path d="M 40 60 L 760 60" stroke="#f97316" stroke-width="12" stroke-dasharray="14, 14" stroke-linecap="round"/>
          <path d="M 40 60 L 760 60" stroke="#eab308" stroke-width="12" stroke-dasharray="14, 14" stroke-dashoffset="14" stroke-linecap="round"/>
          <image href="/ganpati.png" x="340" y="240" width="120" height="120" preserveAspectRatio="xMidYMid meet" />
          <g transform="translate(400, 420) scale(1.5)" stroke="#D4AF37" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path d="M -30 0 L 30 0"/>
            <path d="M 0 -30 L 0 30"/>
            <path d="M -30 0 L -30 -30"/>
            <path d="M 30 0 L 30 30"/>
            <path d="M 0 -30 L 30 -30"/>
            <path d="M 0 30 L -30 30"/>
            <circle cx="-15" cy="-15" r="3" fill="#D4AF37"/>
            <circle cx="15" cy="-15" r="3" fill="#D4AF37"/>
            <circle cx="-15" cy="15" r="3" fill="#D4AF37"/>
            <circle cx="15" cy="15" r="3" fill="#D4AF37"/>
          </g>
          <text x="50%" y="200" text-anchor="middle" fill="#eab308" font-family="'Outfit', sans-serif" font-size="28" font-weight="900" letter-spacing="4">GRIHA PRAVESH INVITATION</text>
          <text x="50%" y="490" text-anchor="middle" fill="#ffffffcc" font-family="'Outfit', sans-serif" font-size="16" font-weight="400" letter-spacing="2">SHREE GANESHAYA NAMAH</text>
          <text x="50%" y="540" text-anchor="middle" fill="#ffffffa0" font-family="'Outfit', sans-serif" font-size="15" font-weight="300" letter-spacing="1">PLEASE JOIN US FOR THE GRIHA PRAVESH OF OUR NEW HOME</text>
          <text x="50%" y="670" text-anchor="middle" fill="#D4AF37" font-family="'Outfit', sans-serif" font-size="44" font-weight="900" letter-spacing="2">${names}</text>
          <line x1="200" y1="740" x2="600" y2="740" stroke="#D4AF37" stroke-width="1" stroke-opacity="0.3"/>
          <text x="50%" y="820" text-anchor="middle" fill="#eab308" font-family="'Outfit', sans-serif" font-size="18" font-weight="700" letter-spacing="2">DATE &amp; MUHURAT</text>
          <text x="50%" y="865" text-anchor="middle" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="18" font-weight="500">${date}</text>
          <text x="50%" y="960" text-anchor="middle" fill="#eab308" font-family="'Outfit', sans-serif" font-size="18" font-weight="700" letter-spacing="2">VENUE LOCATION</text>
          <text x="50%" y="1005" text-anchor="middle" fill="#ffffffd0" font-family="'Outfit', sans-serif" font-size="18">${venue}</text>
        </svg>
      `;

    // ─── 5 New Shadi (Wedding) Styles ───
    case 'traditional_hindu_wedding':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200" width="100%" height="100%">
          <rect width="100%" height="100%" fill="#2b0307"/>
          <rect x="40" y="40" width="720" height="1120" fill="none" stroke="#D4AF37" stroke-width="4" rx="15"/>
          <rect x="52" y="52" width="696" height="1096" fill="none" stroke="#D4AF37" stroke-width="1" rx="10" stroke-dasharray="12, 6"/>
          
          <!-- Marigold Garlands Hanging at top corners -->
          <path d="M 40 80 Q 200 110 360 80" fill="none" stroke="#f97316" stroke-width="6" stroke-dasharray="10, 8"/>
          <path d="M 440 80 Q 600 110 760 80" fill="none" stroke="#f97316" stroke-width="6" stroke-dasharray="10, 8"/>
          
          <!-- Ganesh Icon Representation -->
          <image href="/ganpati.png" x="340" y="160" width="120" height="120" preserveAspectRatio="xMidYMid meet" />

          <text x="50%" y="380" text-anchor="middle" fill="#D4AF37" font-family="'Outfit', sans-serif" font-size="28" font-weight="900" letter-spacing="4">SHUBH VIVAH</text>
          <text x="50%" y="460" text-anchor="middle" fill="#ffffffd0" font-family="'Outfit', sans-serif" font-size="16" letter-spacing="1">WE INVITE YOU TO JOIN US ON THE AUSPICIOUS CELEBRATION OF WEDDING</text>
          
          <!-- Large Decorative Names block -->
          <text x="50%" y="600" text-anchor="middle" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="48" font-weight="800" letter-spacing="2">${names}</text>
          
          <line x1="200" y1="670" x2="600" y2="670" stroke="#D4AF37" stroke-width="1.5"/>
          
          <text x="50%" y="760" text-anchor="middle" fill="#D4AF37" font-family="'Outfit', sans-serif" font-size="18" font-weight="700" letter-spacing="2">DATE &amp; MUHURAT</text>
          <text x="50%" y="810" text-anchor="middle" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="20" font-weight="600">${date}</text>
          
          <line x1="200" y1="870" x2="600" y2="870" stroke="#D4AF37" stroke-width="1"/>
          
          <text x="50%" y="960" text-anchor="middle" fill="#D4AF37" font-family="'Outfit', sans-serif" font-size="18" font-weight="700" letter-spacing="2">VENUE DETAILS</text>
          <text x="50%" y="1010" text-anchor="middle" fill="#ffffffcc" font-family="'Outfit', sans-serif" font-size="16">${venue}</text>
          
          <text x="50%" y="1100" text-anchor="middle" fill="#f97316" font-family="'Outfit', sans-serif" font-size="14" font-weight="700" letter-spacing="3">SHREE GANESHAYA NAMAH</text>
        </svg>
      `;

    case 'royal_mughal_invitation':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200" width="100%" height="100%">
          <rect width="100%" height="100%" fill="#0a231c"/>
          
          <!-- Mughal Arch Frame -->
          <path d="M 40 1160 L 40 400 C 40 100 200 40 400 40 C 600 40 760 100 760 400 L 760 1160 Z" fill="none" stroke="#D4AF37" stroke-width="4"/>
          <path d="M 52 1148 L 52 400 C 52 110 200 52 400 52 C 600 52 748 110 748 400 L 748 1148 Z" fill="none" stroke="#D4AF37" stroke-width="1" stroke-dasharray="10, 5"/>
          
          <!-- Dome arch details -->
          <path d="M 400 40 C 370 70, 310 90, 260 90 C 150 90, 70 180, 70 300" fill="none" stroke="#D4AF37" stroke-width="1.5"/>
          <path d="M 400 40 C 430 70, 490 90, 540 90 C 650 90, 730 180, 730 300" fill="none" stroke="#D4AF37" stroke-width="1.5"/>

          <text x="50%" y="220" text-anchor="middle" fill="#D4AF37" font-family="'Outfit', sans-serif" font-size="24" font-weight="600" letter-spacing="5">ROYAL INVITATION</text>
          <text x="50%" y="300" text-anchor="middle" fill="#D4AF37" font-family="'Outfit', sans-serif" font-size="44">🕌</text>

          <text x="50%" y="450" text-anchor="middle" fill="#ffffff95" font-family="'Outfit', sans-serif" font-size="16" letter-spacing="2">IN THE HONORABLE PRESENCE OF YOUR FAMILY, WE CELEBRATE THE UNION OF</text>

          <text x="50%" y="600" text-anchor="middle" fill="#D4AF37" font-family="'Outfit', sans-serif" font-size="52" font-weight="800" letter-spacing="2">${names}</text>
          
          <line x1="250" y1="680" x2="550" y2="680" stroke="#D4AF37" stroke-width="1"/>

          <text x="50%" y="780" text-anchor="middle" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="18" font-weight="600" letter-spacing="2">DATE &amp; TIME</text>
          <text x="50%" y="830" text-anchor="middle" fill="#ffffffb8" font-family="'Outfit', sans-serif" font-size="18">${date}</text>
          
          <text x="50%" y="950" text-anchor="middle" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="18" font-weight="600" letter-spacing="2">VENUE BANQUET</text>
          <text x="50%" y="1000" text-anchor="middle" fill="#ffffffb8" font-family="'Outfit', sans-serif" font-size="16">${venue}</text>
          
          <text x="50%" y="1090" text-anchor="middle" fill="#D4AF37" font-family="'Outfit', sans-serif" font-size="14" font-weight="700" letter-spacing="4">PLEASE JOIN US FOR THE ROYAL VIVAH</text>
        </svg>
      `;

    case 'modern_pastel_wedding':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200" width="100%" height="100%">
          <rect width="100%" height="100%" fill="#faf5f6"/>
          <!-- Delicate Rose Gold line border -->
          <rect x="50" y="50" width="700" height="1100" fill="none" stroke="#e0a899" stroke-width="2" rx="20"/>
          
          <!-- Floral rings top background -->
          <circle cx="400" cy="280" r="90" fill="none" stroke="#e0a899" stroke-dasharray="4,4" stroke-width="1"/>
          
          <text x="50%" y="200" text-anchor="middle" fill="#e0a899" font-family="'Outfit', sans-serif" font-size="22" font-weight="600" letter-spacing="4">${event}</text>
          <text x="50%" y="290" text-anchor="middle" fill="#b07b6e" font-family="'Outfit', sans-serif" font-size="36">🌸</text>
          
          <text x="50%" y="450" text-anchor="middle" fill="#7a6e6b" font-family="'Outfit', sans-serif" font-size="16" letter-spacing="1">WE CORDIALLY INVITE YOU TO SHARE IN THE JOY OF</text>
          
          <text x="50%" y="580" text-anchor="middle" fill="#3a302e" font-family="'Outfit', sans-serif" font-size="52" font-weight="800">${names}</text>
          
          <line x1="250" y1="660" x2="550" y2="660" stroke="#e0a899" stroke-width="1"/>
          
          <text x="50%" y="760" text-anchor="middle" fill="#b07b6e" font-family="'Outfit', sans-serif" font-size="18" font-weight="600">DATE OF CELEBRATION</text>
          <text x="50%" y="810" text-anchor="middle" fill="#3a302e" font-family="'Outfit', sans-serif" font-size="20" font-weight="500">${date}</text>
          
          <text x="50%" y="930" text-anchor="middle" fill="#b07b6e" font-family="'Outfit', sans-serif" font-size="18" font-weight="600">LOCATION &amp; VENUE</text>
          <text x="50%" y="980" text-anchor="middle" fill="#5c504d" font-family="'Outfit', sans-serif" font-size="16">${venue}</text>
          
          <text x="50%" y="1080" text-anchor="middle" fill="#e0a899" font-family="'Outfit', sans-serif" font-size="14" font-weight="600" letter-spacing="3">PLEASE JOIN OUR FAMILY</text>
        </svg>
      `;

    case 'vintage_lace_invitation':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200" width="100%" height="100%">
          <rect width="100%" height="100%" fill="#f4ebe1"/>
          <!-- Lace border using small circles and lines -->
          <rect x="40" y="40" width="720" height="1120" fill="none" stroke="#d5c3b1" stroke-width="3" rx="10"/>
          <rect x="52" y="52" width="696" height="1096" fill="none" stroke="#d5c3b1" stroke-width="1" rx="8" stroke-dasharray="6, 6"/>

          <text x="50%" y="220" text-anchor="middle" fill="#8d725a" font-family="'Outfit', sans-serif" font-size="22" font-weight="600" letter-spacing="6">VINTAGE WEDDING INVITATION</text>
          <text x="50%" y="300" text-anchor="middle" fill="#d5c3b1" font-family="'Outfit', sans-serif" font-size="44">🎀</text>

          <text x="50%" y="460" text-anchor="middle" fill="#695747" font-family="'Outfit', sans-serif" font-size="16" letter-spacing="2">TOGETHER WITH FAMILY WE INVITE YOU TO CELEBRATE THE UNION OF</text>

          <text x="50%" y="600" text-anchor="middle" fill="#523d2a" font-family="'Outfit', sans-serif" font-size="48" font-weight="900" letter-spacing="1">${names}</text>
          
          <line x1="200" y1="670" x2="600" y2="670" stroke="#d5c3b1" stroke-width="2"/>

          <text x="50%" y="780" text-anchor="middle" fill="#8d725a" font-family="'Outfit', sans-serif" font-size="18" font-weight="700">DATE &amp; TIME OF CEREMONY</text>
          <text x="50%" y="830" text-anchor="middle" fill="#523d2a" font-family="'Outfit', sans-serif" font-size="18" font-weight="500">${date}</text>
          
          <text x="50%" y="950" text-anchor="middle" fill="#8d725a" font-family="'Outfit', sans-serif" font-size="18" font-weight="700">VENUE LOCATION ADDRESS</text>
          <text x="50%" y="1000" text-anchor="middle" fill="#695747" font-family="'Outfit', sans-serif" font-size="16">${venue}</text>
          
          <text x="50%" y="1090" text-anchor="middle" fill="#8d725a" font-family="'Outfit', sans-serif" font-size="13" font-weight="600" letter-spacing="3">LOVE IS PATIENT, LOVE IS KIND</text>
        </svg>
      `;

    case 'ruby_luxe_wedding':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200" width="100%" height="100%">
          <rect width="100%" height="100%" fill="#3a0007"/>
          <rect x="40" y="40" width="720" height="1120" fill="none" stroke="#D4AF37" stroke-width="4" rx="20"/>
          <rect x="52" y="52" width="696" height="1096" fill="none" stroke="#D4AF37" stroke-width="1.2" rx="15" stroke-dasharray="10, 5"/>
          
          <text x="50%" y="220" text-anchor="middle" fill="#D4AF37" font-family="'Outfit', sans-serif" font-size="24" font-weight="600" letter-spacing="5">${event}</text>
          <text x="50%" y="320" text-anchor="middle" fill="#D4AF37" font-family="'Outfit', sans-serif" font-size="56" font-weight="800">🍷</text>
          
          <text x="50%" y="460" text-anchor="middle" fill="#ffffffab" font-family="'Outfit', sans-serif" font-size="16" letter-spacing="2">THE HONOR OF YOUR PRESENCE IS REQUESTED AT THE MARRIAGE OF</text>
          
          <text x="50%" y="600" text-anchor="middle" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="54" font-weight="900" letter-spacing="2">${names}</text>
          
          <line x1="200" y1="680" x2="600" y2="680" stroke="#D4AF37" stroke-width="1.5"/>
          
          <text x="50%" y="780" text-anchor="middle" fill="#D4AF37" font-family="'Outfit', sans-serif" font-size="18" font-weight="700">DATE &amp; TIME</text>
          <text x="50%" y="830" text-anchor="middle" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="20">${date}</text>
          
          <text x="50%" y="950" text-anchor="middle" fill="#D4AF37" font-family="'Outfit', sans-serif" font-size="18" font-weight="700">VENUE DETAILS</text>
          <text x="50%" y="1000" text-anchor="middle" fill="#ffffffcc" font-family="'Outfit', sans-serif" font-size="16">${venue}</text>
        </svg>
      `;

    // ─── 5 New Birthday / Anniversary / General Styles ───
    case 'golden_anniversary_luxe':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200" width="100%" height="100%">
          <rect width="100%" height="100%" fill="#ffffff"/>
          <rect x="40" y="40" width="720" height="1120" fill="none" stroke="#D4AF37" stroke-width="3" rx="15"/>
          <rect x="52" y="52" width="696" height="1096" fill="none" stroke="#D4AF37" stroke-width="1" rx="10" stroke-dasharray="10, 5"/>
          
          <!-- Golden Rings Representation at top center -->
          <g transform="translate(400, 300) scale(1.3)" stroke="#D4AF37" stroke-width="4" fill="none">
            <circle cx="-20" cy="0" r="30"/>
            <circle cx="20" cy="0" r="30"/>
          </g>

          <text x="50%" y="220" text-anchor="middle" fill="#0b0c10" font-family="'Outfit', sans-serif" font-size="24" font-weight="800" letter-spacing="4">${event}</text>
          <text x="50%" y="460" text-anchor="middle" fill="#555" font-family="'Outfit', sans-serif" font-size="16" letter-spacing="2">PLEASE JOIN US TO CELEBRATE THE ANNIVERSARY UNION OF</text>
          
          <text x="50%" y="600" text-anchor="middle" fill="#0b0c10" font-family="'Outfit', sans-serif" font-size="46" font-weight="900" letter-spacing="2">${names}</text>
          
          <line x1="200" y1="670" x2="600" y2="670" stroke="#D4AF37" stroke-width="1.5"/>
          
          <text x="50%" y="780" text-anchor="middle" fill="#D4AF37" font-family="'Outfit', sans-serif" font-size="18" font-weight="700">DATE &amp; MUHURAT</text>
          <text x="50%" y="830" text-anchor="middle" fill="#0b0c10" font-family="'Outfit', sans-serif" font-size="20" font-weight="600">${date}</text>
          
          <text x="50%" y="950" text-anchor="middle" fill="#D4AF37" font-family="'Outfit', sans-serif" font-size="18" font-weight="700">VENUE LOCATION</text>
          <text x="50%" y="1000" text-anchor="middle" fill="#555" font-family="'Outfit', sans-serif" font-size="16">${venue}</text>
        </svg>
      `;

    case 'retro_neon_birthday':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200" width="100%" height="100%">
          <rect width="100%" height="100%" fill="#0a001a"/>
          
          <!-- Cyberpunk Grid lines at bottom -->
          <path d="M 0 1000 L 800 1000 M 0 1050 L 800 1050 M 0 1100 L 800 1100 M 0 1150 L 800 1150" stroke="#ff007f" stroke-width="1" stroke-opacity="0.3"/>
          <path d="M 100 1000 L 0 1200 M 250 1000 L 150 1200 M 400 1000 L 400 1200 M 550 1000 L 650 1200 M 700 1000 L 800 1200" stroke="#ff007f" stroke-width="1" stroke-opacity="0.3"/>

          <text x="50%" y="220" text-anchor="middle" fill="#00ffff" font-family="'Outfit', sans-serif" font-size="28" font-weight="900" letter-spacing="6" style="filter: drop-shadow(0 0 6px #00ffff)">${event}</text>
          <text x="50%" y="340" text-anchor="middle" fill="#ff007f" font-family="'Outfit', sans-serif" font-size="64" font-weight="900" style="filter: drop-shadow(0 0 10px #ff007f)">RETRO PARTY</text>

          <text x="50%" y="490" text-anchor="middle" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="16">YOU ARE INVITED TO DANCE &amp; CELEBRATE THE BIRTHDAY OF</text>

          <text x="50%" y="620" text-anchor="middle" fill="#00ffff" font-family="'Outfit', sans-serif" font-size="52" font-weight="900" style="filter: drop-shadow(0 0 8px #00ffff)">${names}</text>
          
          <line x1="200" y1="690" x2="600" y2="690" stroke="#ff007f" stroke-width="2"/>

          <text x="50%" y="780" text-anchor="middle" fill="#ff007f" font-family="'Outfit', sans-serif" font-size="18" font-weight="700">DATE &amp; TIME</text>
          <text x="50%" y="830" text-anchor="middle" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="20">${date}</text>
          
          <text x="50%" y="930" text-anchor="middle" fill="#ff007f" font-family="'Outfit', sans-serif" font-size="18" font-weight="700">VENUE LOCATION</text>
          <text x="50%" y="980" text-anchor="middle" fill="#ffffffd0" font-family="'Outfit', sans-serif" font-size="18">${venue}</text>
        </svg>
      `;

    case 'baby_shower_cute':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200" width="100%" height="100%">
          <rect width="100%" height="100%" fill="#fbf7f0"/>
          
          <!-- Cute baby cloud border shapes -->
          <circle cx="100" cy="150" r="10" fill="#e2cbbb" opacity="0.4"/>
          <circle cx="700" cy="180" r="15" fill="#cbe3db" opacity="0.5"/>
          <circle cx="150" cy="980" r="12" fill="#cbe3db" opacity="0.4"/>
          <circle cx="680" cy="950" r="10" fill="#e2cbbb" opacity="0.5"/>

          <text x="50%" y="220" text-anchor="middle" fill="#9d7e68" font-family="'Outfit', sans-serif" font-size="24" font-weight="700" letter-spacing="4">${event}</text>
          <text x="50%" y="310" text-anchor="middle" fill="#8ab6a3" font-family="'Outfit', sans-serif" font-size="44">👶🍼</text>

          <text x="50%" y="460" text-anchor="middle" fill="#6d5849" font-family="'Outfit', sans-serif" font-size="16">JOIN US IN WELCOMING THE SWEET LITTLE CELEBRANT OF</text>

          <text x="50%" y="590" text-anchor="middle" fill="#8ab6a3" font-family="'Outfit', sans-serif" font-size="48" font-weight="800">${names}</text>
          
          <line x1="250" y1="670" x2="550" y2="670" stroke="#ebd6c8" stroke-width="2"/>

          <text x="50%" y="770" text-anchor="middle" fill="#9d7e68" font-family="'Outfit', sans-serif" font-size="18" font-weight="700">DATE &amp; TIME DETAILS</text>
          <text x="50%" y="820" text-anchor="middle" fill="#6d5849" font-family="'Outfit', sans-serif" font-size="18">${date}</text>
          
          <text x="50%" y="930" text-anchor="middle" fill="#9d7e68" font-family="'Outfit', sans-serif" font-size="18" font-weight="700">CELEBRATION ADDRESS</text>
          <text x="50%" y="980" text-anchor="middle" fill="#6d5849" font-family="'Outfit', sans-serif" font-size="16">${venue}</text>
        </svg>
      `;

    case 'corporate_inauguration':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200" width="100%" height="100%">
          <rect width="100%" height="100%" fill="#0d1117"/>
          <!-- Professional Blue Frame border -->
          <rect x="40" y="40" width="720" height="1120" fill="none" stroke="#58a6ff" stroke-width="2" rx="10"/>
          
          <text x="50%" y="220" text-anchor="middle" fill="#58a6ff" font-family="'Outfit', sans-serif" font-size="24" font-weight="700" letter-spacing="5">GRAND OPENING INVITATION</text>
          <text x="50%" y="300" text-anchor="middle" fill="#58a6ff" font-family="'Outfit', sans-serif" font-size="48">🏢</text>

          <text x="50%" y="460" text-anchor="middle" fill="#8b949e" font-family="'Outfit', sans-serif" font-size="16" letter-spacing="1">WE CORDIALLY INVITE YOU TO THE INAUGURATION CEREMONY OF</text>

          <text x="50%" y="600" text-anchor="middle" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="48" font-weight="800">${names}</text>
          
          <line x1="200" y1="680" x2="600" y2="680" stroke="#58a6ff" stroke-width="1.5"/>

          <text x="50%" y="780" text-anchor="middle" fill="#58a6ff" font-family="'Outfit', sans-serif" font-size="18" font-weight="700">DATE &amp; INAUGURAL MUHURAT</text>
          <text x="50%" y="830" text-anchor="middle" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="18">${date}</text>
          
          <text x="50%" y="950" text-anchor="middle" fill="#58a6ff" font-family="'Outfit', sans-serif" font-size="18" font-weight="700">VENUE LOCATION ADDRESS</text>
          <text x="50%" y="1000" text-anchor="middle" fill="#8b949e" font-family="'Outfit', sans-serif" font-size="16">${venue}</text>
        </svg>
      `;

    case 'sweet_sixteen_pink':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200" width="100%" height="100%">
          <rect width="100%" height="100%" fill="#2b001a"/>
          <!-- Sparkly Pink border -->
          <rect x="40" y="40" width="720" height="1120" fill="none" stroke="#ff1493" stroke-width="3" rx="20"/>
          
          <text x="50%" y="220" text-anchor="middle" fill="#ff69b4" font-family="'Outfit', sans-serif" font-size="24" font-weight="600" letter-spacing="5">${event}</text>
          <text x="50%" y="320" text-anchor="middle" fill="#ff1493" font-family="'Outfit', sans-serif" font-size="64" font-weight="800">👑</text>

          <text x="50%" y="460" text-anchor="middle" fill="#ffffffd0" font-family="'Outfit', sans-serif" font-size="16">YOU ARE INVITED TO THE SWEET CELEBRATION PARTY FOR</text>

          <text x="50%" y="600" text-anchor="middle" fill="#ff69b4" font-family="'Outfit', sans-serif" font-size="52" font-weight="900">${names}</text>
          
          <line x1="250" y1="670" x2="550" y2="670" stroke="#ff1493" stroke-width="2"/>

          <text x="50%" y="780" text-anchor="middle" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="18" font-weight="700">DATE &amp; CELEBRATION TIME</text>
          <text x="50%" y="830" text-anchor="middle" fill="#ff69b4" font-family="'Outfit', sans-serif" font-size="20" font-weight="500">${date}</text>
          
          <text x="50%" y="950" text-anchor="middle" fill="#ffffff" font-family="'Outfit', sans-serif" font-size="18" font-weight="700">PARTY LOCATION VENUE</text>
          <text x="50%" y="1000" text-anchor="middle" fill="#ffffffd0" font-family="'Outfit', sans-serif" font-size="16">${venue}</text>
        </svg>
      `;

    default:
      return '';
  }
}
