/**
 * Site configuration — Meenakshi (Mannu) ❤️
 * Author: Deepesh
 */
const CONFIG = {
  name: 'Meenakshi',
  nickname: 'Mannu',
  author: 'Deepesh',
  birthday: { day: 20, month: 5, label: '20 May' },
  letterPassword: 'mannu',

  hero: {
    title: 'For My Mannu ❤️',
    subtitle: 'Every heartbeat carries your name.',
    eyebrow: 'A digital love story by Deepesh',
  },

  loveLetter: `My Dearest Mannu,

From the very first moment you walked into my life, everything changed. Your smile became my sunrise, your laughter my favorite song, and your love the greatest gift the universe ever gave me.

You are not just my girlfriend — you are my best friend, my peace, my home, and my forever. Every day with you feels like a beautiful dream I never want to wake up from.

On your birthday and every day after, I want you to know that you deserve all the love, happiness, and magic this world has to offer. I promise to stand by you, cherish you, protect your heart, and love you more with every sunrise.

You are my today, my tomorrow, and my always.

Forever yours,
Deepesh ❤️`,

  typewriterMessages: [
    'You are the most beautiful person I have ever known...',
    'Every moment with you feels like magic...',
    'Your smile is my favorite view in this world...',
    'I fall in love with you more every single day...',
    'You are my happiness, my peace, and my home...',
    'Mannu, you make my world complete...',
  ],

  dreams: [
    { icon: '🌅', title: 'Sunrise Together', text: 'Watching every sunrise wrapped in your arms, nowhere else I would rather be.' },
    { icon: '✈️', title: 'Travel the World', text: 'Exploring beautiful places hand in hand, creating memories in every corner of the earth.' },
    { icon: '🏡', title: 'Our Dream Home', text: 'Building a cozy home filled with laughter, love, and endless happiness together.' },
    { icon: '🌙', title: 'Stargazing Nights', text: 'Lying under the stars, talking about everything and nothing, just us forever.' },
    { icon: '💍', title: 'Forever Together', text: 'Growing old with you, loving you through every season of life.' },
    { icon: '🎂', title: 'Every Birthday', text: 'Celebrating your special day every year, making you feel like the queen you are.' },
  ],

  compliments: [
    'Your smile could light up the darkest night sky.',
    'You are the most beautiful soul inside and out.',
    'Your laugh is my absolute favorite sound.',
    'You make ordinary moments feel extraordinary.',
    'Your kindness inspires me every single day.',
    'You are incredibly smart and I admire your mind.',
    'Your eyes hold the entire universe.',
    'You deserve all the love in the world.',
    'You make me want to be the best version of myself.',
    'Your presence alone makes everything better.',
    'You are my favorite notification.',
    'You are cuter than anything in this world.',
    'Your heart is pure gold, Mannu.',
    'You are my lucky charm.',
    'The world is better because you exist.',
    'You are my sunshine on cloudy days.',
    'Your voice is sweeter than any melody.',
    'You are my dream come true.',
    'I am so proud to call you mine.',
    'You are absolutely perfect to me.',
  ],
};

/** Generate 100 unique reasons */
(function generateReasons() {
  const base = [
    'Your beautiful smile', 'Your kind heart', 'Your gentle nature', 'Your sparkling eyes',
    'Your infectious laughter', 'Your inner strength', 'Your warm presence', 'Your caring soul',
    'Your cute expressions', 'Your loving nature', 'Your intelligence', 'Your honesty',
    'Your patience with me', 'Your support always', 'Your beautiful voice', 'Your soft heart',
    'The way you care', 'The way you listen', 'The way you understand me', 'The way you make me laugh',
    'How you brighten my day', 'How you calm my storms', 'How you believe in me', 'How you inspire me',
    'How you love unconditionally', 'How you make me feel special', 'How you hold my hand', 'How you say my name',
    'Your morning texts', 'Your goodnight wishes', 'Your silly jokes', 'Your deep conversations',
    'Your random hugs', 'Your forehead kisses', 'Your comforting words', 'Your playful side',
    'You accept me fully', 'You forgive my mistakes', 'You celebrate my wins', 'You stand by me always',
    'You are my best friend', 'You are my safe place', 'You are my home', 'You are my peace',
    'You are my happiness', 'You are my motivation', 'You are my favorite person', 'You are my universe',
    'Every moment with you', 'Every memory we share', 'Every photo of us', 'Every dream about us',
    'The way you dress', 'The way you walk', 'The way you talk', 'The way you think',
    'Your birthday — 20 May', 'Your name — Mannu', 'Your real name — Meenakshi', 'Everything about you',
  ];

  const templates = [
    'I love you because of {reason}.',
    'You make my heart skip because of {reason}.',
    'My world is brighter because of {reason}.',
    'I fall for you daily because of {reason}.',
    'Forever grateful for {reason}.',
  ];

  const reasons = [];
  let i = 0;
  while (reasons.length < 100) {
    const reason = base[i % base.length];
    const tpl = templates[Math.floor(i / base.length) % templates.length];
    const text = tpl.replace('{reason}', reason.toLowerCase());
    if (!reasons.includes(text)) reasons.push(text);
    i++;
    if (i > 500) break;
  }
  CONFIG.reasons100 = reasons.slice(0, 100);
})();

/** Photo helpers */
function getPhotoCategory(name) {
  const l = name.toLowerCase();
  if (l.includes('20260520')) return 'may20';
  if (l.includes('20260522')) return 'may22';
  if (l.includes('2026-03-03')) return 'march';
  return 'all';
}

function getPhotoCaption(name) {
  if (name.includes('20260520')) return 'Birthday memories 🎂';
  if (name.includes('20260522')) return 'Beautiful day 💕';
  if (name.includes('2026-03-03')) return 'Sweet moments ✨';
  if (name.includes('COLLAGE')) return 'Us ❤️';
  return 'Mannu 💖';
}

function getPhotoUrl(photo) {
  return photo.local || photo.drive || '';
}
