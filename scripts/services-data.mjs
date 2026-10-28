/**
 * Content for the service pages (services/<slug>.html).
 * Edit copy here, then run `npm run services` (also runs before dev/build).
 * Mock-UI numbers are illustrative, never client results.
 */

const MOCKS = {
  creative: `<div class="mock mock--creative mock--creative-lg" data-mock="creative">
                <div class="creative" data-variant="A"><span class="mono">ANGLE · THE GIFT</span><b>Her new<br />favourite ritual.</b><em class="mono">CTR 2.4%</em></div>
                <div class="creative" data-variant="B"><span class="mono">ANGLE · SAVES TIME</span><b>Glow in<br />60 seconds.</b><em class="mono">CTR 3.1%</em></div>
                <div class="creative" data-variant="C"><span class="mono">ANGLE · SOCIAL PROOF</span><b>12,000 five-star<br />reviews.</b><em class="mono">CTR 3.8%</em></div>
                <p class="creative__meta mono">BATCH 03 · 24 NEW ADS · BUILT FROM YOUR REAL PRODUCT</p>
              </div>`,
  flow: `<div class="mock mock--flow" data-mock="flow">
                <div class="flow">
                  <span class="flow__node">CUSTOMER REVIEWS</span>
                  <span class="flow__node">MARKET SIGNALS</span>
                  <span class="flow__node">BUYING REASONS</span>
                  <span class="flow__node">HOOKS</span>
                  <span class="flow__node">20 ADS LIVE</span>
                </div>
                <div class="flow__meta mono"><span><i class="live"></i>SPRINT · WEEK 2</span><span>ON TRACK</span></div>
              </div>`,
  mini: `<div class="mock mock--mini">
                <p class="mini__head mono"><span>AD COMMENT · 11:42 PM</span><span class="chip chip--red mono">LIVE</span></p>
                <div class="msg msg--in">Does this ship to Germany?</div>
                <div class="msg msg--out">Yes! 3–5 days, free over €50. Here's the link 👉</div>
                <div class="msg msg--in">Is the 50ml one in stock?</div>
                <div class="msg msg--out">It is, and it's our bestseller. Want the link to the 50ml?</div>
                <p class="mini__ok mono">● REPLIED IN 42 SECONDS</p>
              </div>`,
};

export const SERVICES = [
  {
    slug: 'creative-sprint',
    kicker: 'START HERE',
    num: '01',
    name: 'Creative Sprint',
    short: 'CREATIVE SPRINT',
    meta: 'A 30-day sprint that finds your strongest buying reasons, puts around 20 new ads live and shows you what wins. €390, credited if you continue.',
    h1: ['30 DAYS TO', 'YOUR NEXT WINNERS.'],
    sub: 'A low-risk way to see the engine work on your brand. We find the reasons your customers buy, turn them into around 20 fresh ads, test them live and show you exactly what wins and why.',
    facts: ['€390 ONE-OFF', '~20 ADS LIVE IN 14 DAYS', 'CREDITED IF YOU CONTINUE'],
    mock: MOCKS.flow,
    problem: {
      h2: ['GREAT PRODUCT.', 'TIRED ADS.'],
      lede: 'Most growing brands lean on a handful of ads for far too long. When they fade, there is nothing new ready and growth stalls while the next idea gets made.',
      pains: [
        { t: 'ONE WINNER DOES ALL THE WORK', d: 'A single ad carries the account until fatigue sets in and costs quietly creep up.' },
        { t: 'NEW IDEAS TAKE WEEKS', d: 'Briefing, shooting and editing by hand means only a few new ads a month, if that.' },
        { t: 'NO CLEAR READ ON WHAT WORKS', d: 'Without structured tests, it is hard to know which message moved the needle, so the next batch is a guess too.' },
      ],
    },
    how: [
      { t: 'DISCOVER', d: 'We study your ad account, your reviews and comments, and the ads in your category.', list: ['WEEK 1', 'ONE GOAL, AGREED IN WRITING'] },
      { t: 'CHOOSE FIVE ANGLES', d: 'You approve the five strongest reasons people buy. Each one becomes a family of ads.', list: ['ONE-PAGE PLAN'] },
      { t: 'CREATE AND LAUNCH', d: 'Around 20 statics and short videos, built from your real product, go live in a dedicated test campaign.', list: ['WEEK 2', 'EVERY AD CHECKED BY A PERSON'] },
      { t: 'LEARN AND REFINE', d: 'We pause what is not landing and build new versions of what is.', list: ['WEEK 3', 'NEW VERSIONS OF THE WINNERS'] },
      { t: 'REVIEW TOGETHER', d: 'A clear report on what won and why, then a strategy call about what comes next.', list: ['WEEK 4', 'REPORT + CALL'] },
    ],
    included: [
      { t: 'Customer insight', d: 'Buying reasons pulled from your reviews, comments and category, not guesswork.' },
      { t: 'Five tested angles', d: 'Each with its own hooks, headlines and visual directions.' },
      { t: 'Around 20 new ads', d: 'Statics and short-form video, sized for every Meta placement.' },
      { t: 'A clean test campaign', d: 'Built so every result is readable and every winner is clear.' },
      { t: 'Final report', d: 'What won, what did not, why, and what to make next.' },
      { t: 'Strategy call', d: 'A walkthrough of the results and a plan for the next 90 days.' },
    ],
    metrics: [
      { t: 'NEW WINNERS FOUND', d: 'Ads that match or beat your current best on cost per purchase.' },
      { t: 'COST PER PURCHASE', d: 'How the new ads compare with your existing ones.' },
      { t: 'HOOK RATE', d: 'How many people stop scrolling in the first three seconds.' },
      { t: 'WINNING ANGLES', d: 'Which buying reasons resonate most, to guide everything after.' },
    ],
    fit: [
      { tag: 'FIRST TIME WITH US', d: 'You want proof the engine works on your brand before committing.' },
      { tag: 'STALLED ACCOUNT', d: 'Your best ads are fading and nothing new is ready to replace them.' },
      { tag: 'NEW LAUNCH', d: 'A new product or season needs fresh angles, fast.' },
    ],
    faqs: [
      { q: 'What do you need from us?', a: 'Access to your Meta ad account, your product photos and video, and a test budget paid directly to Meta. We usually suggest €1,000–€2,000 for the Sprint.' },
      { q: 'What if you miss the 14 days?', a: 'If your first 20 ads are not live within 14 days of us receiving access and assets, we refund your €390 in full.' },
      { q: 'Do we get to approve the ads?', a: 'Yes. You approve the angles in week one and each batch before it goes live, with one round of changes per batch.' },
      { q: 'What happens after the Sprint?', a: 'If you continue into the Growth Partnership, the €390 is credited to your first month. If not, you keep every ad, the report and the insights.' },
    ],
  },
  {
    slug: 'growth-partnership',
    kicker: 'THE CORE ENGINE',
    num: '02',
    name: 'Growth Partnership',
    short: 'GROWTH PARTNERSHIP',
    meta: 'An always-on growth engine for e-commerce brands: 20–30 new ads a month, weekly testing, campaign management and weekly reporting. €790 a month plus 5% of growth above your baseline.',
    h1: ['AN ENGINE THAT', 'KEEPS COMPOUNDING.'],
    sub: 'Insight, creative, testing and media buying run as one system, every week. Your next winning ad is always in testing before the last one fades, and every round of results makes the next round sharper.',
    facts: ['20–30 NEW ADS A MONTH', '€790 + 5% OF GROWTH', 'MONTH TO MONTH'],
    mock: MOCKS.creative,
    problem: {
      h2: ['GROWTH NEEDS', 'A RHYTHM.'],
      lede: 'Winning on Meta today is less about targeting and more about how many good ideas you can test, how quickly, and how well you learn from them.',
      pains: [
        { t: 'TOO MANY SUPPLIERS', d: 'A designer here, a media buyer there, and nobody joining the dots between what is made and what works.' },
        { t: 'FEES DISCONNECTED FROM RESULTS', d: 'Most retainers cost the same whether your revenue grows or not.' },
        { t: 'REPORTS WITHOUT DECISIONS', d: 'Long decks full of numbers, and very little about what to do next.' },
      ],
    },
    how: [
      { t: 'LISTEN', d: 'Every week we read your results, reviews, comments and DMs for new buying reasons.', list: ['ALWAYS-ON INSIGHT'] },
      { t: 'CREATE', d: 'Fresh statics, short videos and copy, built from your real product and checked by a person.', list: ['20–30 NEW ADS A MONTH'] },
      { t: 'TEST', d: 'New ads go into structured tests so every result is clear and comparable.', list: ['EVERY WEEK'] },
      { t: 'SCALE', d: 'Winners get more budget; tired ads are retired before they drag performance down.', list: ['DAY-TO-DAY MANAGEMENT'] },
      { t: 'REPORT', d: 'One page every week on what won, what is next and why, plus a monthly strategy call.', list: ['WEEKLY + MONTHLY'] },
    ],
    included: [
      { t: '20–30 new ads a month', d: 'Statics, short-form video and copy for every Meta placement.' },
      { t: 'Ongoing customer insight', d: 'New angles from reviews, comments, DMs and your category.' },
      { t: 'Weekly testing', d: 'Structured tests that retire losers and build on winners.' },
      { t: 'Campaign management', d: 'Budgets, structure and scaling handled day to day.' },
      { t: 'One-page weekly report', d: 'Clear decisions, not dashboards, plus a monthly strategy call.' },
      { t: 'Founding terms', d: 'Your founding price is locked for six months, with no lock-in.' },
    ],
    metrics: [
      { t: 'AD REVENUE ABOVE BASELINE', d: 'The number our performance fee is tied to, measured in your Ads Manager.' },
      { t: 'ROAS', d: 'Return on ad spend compared with your three-month average.' },
      { t: 'COST PER PURCHASE', d: 'Tracked weekly as new creative enters the account.' },
      { t: 'CREATIVE WIN RATE', d: 'The share of new ads that earn a place in your scaling campaigns.' },
    ],
    fit: [
      { tag: 'STEADY SPENDERS', d: 'Brands investing consistently in Meta ads, typically from about €5k a month.' },
      { tag: 'REPEAT PURCHASE', d: 'Products people reorder, so better acquisition compounds into lifetime value.' },
      { tag: 'LEAN TEAMS', d: 'Founders who want a partner running the engine, not more people to manage.' },
    ],
    faqs: [
      { q: 'How does the 5% performance fee work?', a: 'Your average ROAS from the last three months sets the baseline. Each month we earn 5% of ad revenue above it, and nothing extra if you do not beat it. If spend grows by more than 50%, we agree a new baseline together.' },
      { q: 'What if you ship fewer than 20 ads in a month?', a: 'Then next month’s €790 is on us. We guarantee what we control: speed and output.' },
      { q: 'Who owns the ads?', a: 'You do. Every ad, every file and every insight is yours to keep, even if you leave.' },
      { q: 'Is there a minimum term?', a: 'No. It is month to month. Founding partners keep their price for six months.' },
    ],
  },
  {
    slug: 'ad-conversations',
    kicker: 'ADD-ON',
    num: '03',
    name: 'Ad Conversations',
    short: 'AD CONVERSATIONS',
    meta: 'Every comment and DM on your ads answered in under 60 seconds, day or night, with the link to buy. €199 a month, first month free for Growth Partnership brands.',
    h1: ['EVERY QUESTION.', 'TURNED INTO AN ORDER.'],
    sub: 'Fresh ads bring more attention, and more attention brings more questions. We answer every comment and DM under your ads in under a minute, in your brand voice, with the link to buy.',
    facts: ['REPLIES IN < 60S', 'DAY AND NIGHT', '€199 / MONTH · FIRST MONTH FREE'],
    mock: MOCKS.mini,
    problem: {
      h2: ['READY TO BUY.', 'LEFT WAITING.'],
      lede: 'A question under an ad is a buyer with their wallet out. When it waits hours for a reply, they often scroll on and never come back.',
      pains: [
        { t: 'QUESTIONS SIT FOR HOURS', d: 'Shipping, sizing and stock questions pile up under your best ads.' },
        { t: 'NIGHTS AND WEEKENDS GO QUIET', d: 'Many of your buyers scroll after hours, exactly when nobody is around to reply.' },
        { t: 'GOOD ADS, LOST SALES', d: 'You pay for the attention, then lose the sale in the comments.' },
      ],
    },
    how: [
      { t: 'A BUYER ASKS', d: 'In the comments under your ad, or in Instagram and Messenger DMs.', list: ['COMMENTS · DMS'] },
      { t: 'WE REPLY IN SECONDS', d: 'Trained on your products, shipping and policies, and written in your brand voice.', list: ['UNDER 60 SECONDS'] },
      { t: 'WE SHARE THE LINK', d: 'The right product, size or bundle, one tap away.', list: ['STRAIGHT TO CHECKOUT'] },
      { t: 'TRICKY ONES COME TO YOU', d: 'Complaints, refunds or anything sensitive are passed to your team with full context.', list: ['HUMAN HANDOFF'] },
      { t: 'WE LEARN FROM EVERY QUESTION', d: 'Common questions feed straight back into new ad angles.', list: ['FEEDS THE CREATIVE ENGINE'] },
    ],
    included: [
      { t: 'Comments and DMs', d: 'Ad comments plus Instagram and Messenger DMs, in one flow.' },
      { t: 'Trained on your store', d: 'Products, sizing, shipping, returns and tone, reviewed with you before launch.' },
      { t: 'Links to buy', d: 'Every helpful answer ends one tap from checkout.' },
      { t: 'Smart handoff', d: 'Anything sensitive goes to your team with the full conversation.' },
      { t: 'Spam and troll filtering', d: 'Hidden or flagged, so your ads stay clean.' },
      { t: 'Insight loop', d: 'Recurring questions become new angles for your ads.' },
    ],
    metrics: [
      { t: 'FIRST-REPLY TIME', d: 'How long a buyer waits for a useful answer.' },
      { t: 'QUESTIONS ANSWERED', d: 'Comments and DMs handled each month, day and night.' },
      { t: 'LINK CLICKS FROM REPLIES', d: 'Buyers who tapped through to your store from an answer.' },
      { t: 'HANDOFF RATE', d: 'How often your team needed to step in, and why.' },
    ],
    fit: [
      { tag: 'BUSY AD ACCOUNTS', d: 'Ads that attract lots of comments and questions every day.' },
      { tag: 'INTERNATIONAL SHIPPING', d: 'Buyers who need quick answers on delivery times and costs.' },
      { tag: 'SIZING AND VARIANTS', d: 'Products where the right size or bundle makes the sale.' },
    ],
    faqs: [
      { q: 'Will buyers know it is AI?', a: 'Replies are written in your brand voice and checked against your store information. We recommend being open that a virtual assistant helps your team, and anything sensitive always goes to a person.' },
      { q: 'Can we get it without the Growth Partnership?', a: 'Ad Conversations is built to work alongside the partnership, where more fresh ads bring more questions. Your first month is free.' },
      { q: 'What happens when it does not know an answer?', a: 'It says so politely, collects the details and passes the conversation to your team with full context.' },
      { q: 'Which platforms does it cover?', a: 'Comments on your Meta ads, plus Instagram and Messenger DMs.' },
    ],
  },
];
