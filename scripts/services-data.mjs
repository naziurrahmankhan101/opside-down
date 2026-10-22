/**
 * Content for the six service pages (services/<slug>.html).
 * Edit copy here, then run `npm run services` (also runs before dev/build).
 * Mock-UI numbers are illustrative, never client results.
 */

const MOCKS = {
  chat: `<div class="mock mock--chat" data-mock="chat">
                <div class="chat__head">
                  <span class="chat__avatar">OD</span>
                  <div><b>Lumi · Booking Agent</b><small><i class="live"></i>online · replies in 3s</small></div>
                  <span class="chip chip--red mono">LEAD #2048</span>
                </div>
                <div class="chat__ctx mono" aria-hidden="true">
                  <span>SOURCE <b>INSTAGRAM AD · SPRING PROMO</b></span>
                  <span>RECEIVED <b>11:42 PM</b></span>
                  <span>FIRST REPLY <b class="ok">3s</b></span>
                </div>
                <div class="chat__body" id="chatBody">
                  <div class="chat__day mono">TODAY · AFTER HOURS</div>
                  <div class="msg msg--in">Hi! Do you have any Botox slots this week?</div>
                  <div class="msg msg--out">Yes! Thursday 4:15pm or Friday 11:00am — which works best?</div>
                  <div class="msg msg--in">Friday please 🙌</div>
                  <div class="msg msg--typing"><i></i><i></i><i></i></div>
                  <div class="msg msg--out">Booked ✓ Friday 11:00am. Confirmation sent by SMS.</div>
                  <div class="msg msg--sys mono">CALENDAR UPDATED · CRM SYNCED · 0:41 TOTAL</div>
                </div>
              </div>`,
  voice: `<div class="mock mock--voice" data-mock="voice">
                <div class="voice__top mono"><span><i class="live"></i>INCOMING CALL</span><span id="voiceTimer">00:00</span></div>
                <div class="wave" aria-hidden="true">
                  <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
                </div>
                <div class="voice__result mono">✓ CONSULT BOOKED · TUE 2:30PM</div>
              </div>`,
  report: `<div class="mock mock--report" data-mock="report">
                <div class="report__head mono"><span>WEEKLY REVENUE</span><span class="up">+38%</span></div>
                <div class="report__val">$<span data-count="48200" data-format="k">48.2k</span></div>
                <div class="bars" aria-hidden="true">
                  <i style="--h:34%"></i><i style="--h:48%"></i><i style="--h:40%"></i><i style="--h:58%"></i><i style="--h:52%"></i><i style="--h:70%"></i><i style="--h:64%"></i><i style="--h:86%"></i><i style="--h:78%"></i><i style="--h:96%"></i>
                </div>
              </div>`,
  creative: `<div class="mock mock--creative" data-mock="creative">
                <div class="creative" data-variant="A"><span class="mono">VARIANT A</span><b>Glow up<br />this Friday.</b><em class="mono">CTR 2.4%</em></div>
                <div class="creative" data-variant="B"><span class="mono">VARIANT B</span><b>Your summer<br />body starts now.</b><em class="mono">CTR 3.1%</em></div>
                <div class="creative" data-variant="C"><span class="mono">VARIANT C</span><b>Book in 30s.<br />Smile for life.</b><em class="mono">CTR 3.8%</em></div>
              </div>`,
  strategy: `<div class="mock mock--strategy" data-mock="strategy">
                <div class="report__head mono"><span>ROAS · 30D</span><span class="up">4.6×</span></div>
                <svg class="spark" viewBox="0 0 240 90" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    <linearGradient id="sparkFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0" stop-color="#d4978e" stop-opacity=".35" />
                      <stop offset="1" stop-color="#d4978e" stop-opacity="0" />
                    </linearGradient>
                  </defs>
                  <path class="spark__fill" d="M0 78 L24 70 L48 74 L72 58 L96 62 L120 46 L144 50 L168 32 L192 36 L216 18 L240 10 L240 90 L0 90 Z" fill="url(#sparkFill)" />
                  <path class="spark__line" pathLength="1" d="M0 78 L24 70 L48 74 L72 58 L96 62 L120 46 L144 50 L168 32 L192 36 L216 18 L240 10" fill="none" stroke="#d4978e" stroke-width="2.5" />
                </svg>
                <div class="strategy__log mono">▸ BUDGET SHIFTED → AD SET 3 <b>+22%</b></div>
              </div>`,
  flow: `<div class="mock mock--flow" data-mock="flow">
                <div class="flow">
                  <span class="flow__node">LEAD</span>
                  <span class="flow__node">QUALIFY</span>
                  <span class="flow__node">BOOK</span>
                  <span class="flow__node">CRM</span>
                  <span class="flow__node">FOLLOW-UP</span>
                </div>
                <div class="flow__meta mono"><span><i class="live"></i>WORKFLOW ACTIVE</span><span>RUN #4821 · 142MS</span></div>
              </div>`,
};

export const SERVICES = [
  {
    slug: 'speed-to-lead',
    num: '01',
    name: 'Speed-to-lead chatbots',
    short: 'SPEED-TO-LEAD CHATBOTS',
    meta: 'AI chat agents that answer every website, Instagram, WhatsApp and SMS lead in seconds, qualify them and book them into your calendar, 24/7.',
    h1: ['EVERY LEAD.', 'ANSWERED IN SECONDS.'],
    sub: 'Your leads message when they are ready to buy, often at night or on weekends. Our chat agents reply in seconds, in your voice, qualify them and book the appointment before they shop around.',
    facts: ['REPLIES IN < 60S', 'WORKS 24/7', 'LIVE IN 2–3 WEEKS'],
    mock: MOCKS.chat,
    problem: {
      h2: ['LEADS GO COLD', 'WHILE YOU\'RE BUSY.'],
      lede: 'The lead who messages first often books with whoever replies first. Most teams can\'t reply fast enough, all day, every day.',
      pains: [
        { t: 'REPLIES COME HOURS LATER', d: 'Your team answers between appointments. By then the lead has messaged three competitors.' },
        { t: 'NIGHTS AND WEEKENDS GO DARK', d: 'The DMs that arrive at 11pm sit unread until Monday, and most never reply back.' },
        { t: 'THE SAME TEN QUESTIONS', d: 'Price, availability, location, parking. Your staff answer them by hand, all day.' },
      ],
    },
    how: [
      { t: 'A LEAD REACHES OUT', d: 'From your website chat, Instagram or Facebook DMs, WhatsApp, SMS or a lead form.', list: ['WEB CHAT · DMS · SMS · FORMS'] },
      { t: 'AN AGENT REPLIES IN SECONDS', d: 'Trained on your services, prices and policies, and written in your brand voice.', list: ['UNDER 60 SECONDS, 24/7'] },
      { t: 'IT QUALIFIES THE LEAD', d: 'Asks what you would ask: the service, timing, budget and anything that rules them out.', list: ['YOUR QUESTIONS, YOUR RULES'] },
      { t: 'IT BOOKS THE APPOINTMENT', d: 'Offers real open slots, books them into your calendar and syncs the contact to your CRM.', list: ['CALENDAR + CRM SYNC'] },
      { t: 'IT FOLLOWS UP OR HANDS OFF', d: 'Nudges leads who go quiet, and passes anything sensitive to your team with the full conversation.', list: ['HUMAN HANDOFF WITH CONTEXT'] },
    ],
    included: [
      { t: 'One inbox, every channel', d: 'Website chat, Instagram, Facebook, WhatsApp and SMS answered by the same agent.' },
      { t: 'Trained on your business', d: 'Services, pricing, FAQs, policies and tone, reviewed with you before launch.' },
      { t: 'Real-time booking', d: 'Books into Calendly, GoHighLevel, Acuity, Google Calendar or your booking tool.' },
      { t: 'CRM sync', d: 'Every lead, answer and booking logged in your CRM automatically.' },
      { t: 'Follow-up sequences', d: 'Polite nudges for leads who go quiet, so fewer slip away.' },
      { t: 'Monthly tuning', d: 'We review real conversations every month and improve the answers.' },
    ],
    metrics: [
      { t: 'FIRST-REPLY TIME', d: 'How long a new lead waits for a useful answer.' },
      { t: 'LEAD-TO-BOOKING RATE', d: 'The share of conversations that end in a booked appointment.' },
      { t: 'AFTER-HOURS BOOKINGS', d: 'Appointments booked while your team was offline.' },
      { t: 'HANDOFF RATE', d: 'How often a human needed to step in, and why.' },
    ],
    fit: [
      { tag: 'MEDSPAS', d: 'Consult bookings from Instagram DMs and ads, day or night.' },
      { tag: 'E-COMMERCE', d: 'Pre-sale questions answered instantly so carts don\'t stall.' },
      { tag: 'GYMS & COACHES', d: 'Trial and discovery-call sign-ups followed up in seconds.' },
    ],
    faqs: [
      { q: 'Will customers know they are talking to AI?', a: 'We recommend the agent introduces itself as a virtual assistant. It answers naturally in your brand voice, and anything sensitive is handed to your team.' },
      { q: 'Which channels does it cover?', a: 'Website chat, Instagram and Facebook DMs, WhatsApp, SMS and lead forms. We start with the channels where most of your leads arrive.' },
      { q: 'What happens when it doesn\'t know an answer?', a: 'It says so, collects the details and hands the conversation to your team with full context, so the lead never has to repeat themselves.' },
      { q: 'How long until it\'s live?', a: 'Most chat agents go live in 2–3 weeks, including training on your content and testing with real scenarios.' },
    ],
  },
  {
    slug: 'voice-agents',
    num: '02',
    name: 'AI voice agents',
    short: 'AI VOICE AGENTS',
    meta: 'AI voice receptionists that answer every call, handle FAQs, book appointments and text confirmations, so no caller lands in voicemail.',
    h1: ['EVERY CALL.', 'PICKED UP.'],
    sub: 'A missed call is usually a booking that goes to the next business on the list. Our voice agents answer every call on the first ring, help the caller and book them in, day or night.',
    facts: ['ANSWERS EVERY CALL', 'BOOKS + CONFIRMS BY SMS', 'KEEPS YOUR NUMBER'],
    mock: MOCKS.voice,
    problem: {
      h2: ['MISSED CALLS.', 'MISSED REVENUE.'],
      lede: 'Callers rarely leave voicemails. When nobody answers, they call the next result on the map.',
      pains: [
        { t: 'THE FRONT DESK IS SWAMPED', d: 'Your team is with a patient or client when the phone rings, so it rings out.' },
        { t: 'AFTER HOURS MEANS VOICEMAIL', d: 'Evening and weekend callers, often your keenest, hear a recording and hang up.' },
        { t: 'ROUTINE CALLS EAT THE DAY', d: 'Hours, prices, directions and reschedules take time your staff could spend on customers.' },
      ],
    },
    how: [
      { t: 'A CALL COMES IN', d: 'On your existing number, either for every call or as overflow when your team is busy.', list: ['YOUR NUMBER, FORWARDED'] },
      { t: 'THE AGENT ANSWERS', d: 'A natural voice greets the caller, introduces itself and asks how it can help.', list: ['FIRST RING, 24/7'] },
      { t: 'IT HANDLES THE REQUEST', d: 'Answers questions from your knowledge base and understands what the caller needs.', list: ['TRAINED ON YOUR FAQS'] },
      { t: 'IT BOOKS AND CONFIRMS', d: 'Books, moves or cancels appointments in your calendar and texts the caller a confirmation.', list: ['CALENDAR + SMS'] },
      { t: 'IT LOGS AND ESCALATES', d: 'Sends a call summary to your CRM, and transfers urgent calls to a person straight away.', list: ['SUMMARIES · WARM TRANSFER'] },
    ],
    included: [
      { t: 'Natural voice', d: 'A warm, clear voice and script designed around how your callers talk.' },
      { t: 'Your knowledge base', d: 'Services, pricing, hours, location and policies, kept up to date.' },
      { t: 'Booking and rescheduling', d: 'Connected to your calendar so it can book, move and cancel.' },
      { t: 'SMS confirmations', d: 'Callers get a text with their appointment details right after the call.' },
      { t: 'Call summaries', d: 'Every call summarised and logged in your CRM, with recordings if you want them.' },
      { t: 'Warm transfer', d: 'Urgent or sensitive calls go straight to the right person on your team.' },
    ],
    metrics: [
      { t: 'ANSWER RATE', d: 'The share of calls picked up, including after hours.' },
      { t: 'BOOKINGS FROM CALLS', d: 'Appointments booked directly by the agent.' },
      { t: 'AFTER-HOURS CALLS HANDLED', d: 'Calls that would have gone to voicemail.' },
      { t: 'TRANSFER RATE', d: 'How often a caller needed a person, and for what.' },
    ],
    fit: [
      { tag: 'DENTISTS & DOCTORS', d: 'New-patient calls and reschedules handled while the team is chairside.' },
      { tag: 'MEDSPAS', d: 'Consult calls answered and booked, including evenings and weekends.' },
      { tag: 'GYMS & STUDIOS', d: 'Membership and class questions answered on the first ring.' },
    ],
    faqs: [
      { q: 'Do I need a new phone number?', a: 'No. You keep your number and forward calls to the agent, either all of them or only when your team doesn\'t pick up.' },
      { q: 'Will callers know it\'s AI?', a: 'We recommend it introduces itself as a virtual assistant. Most callers care that they got a quick, helpful answer and a booking.' },
      { q: 'Can it transfer to my staff?', a: 'Yes. You set the rules: urgent issues, specific keywords or any caller who asks for a person can be transferred live.' },
      { q: 'What about sensitive or medical questions?', a: 'The agent sticks to the information you approve and routes anything clinical or sensitive to your team.' },
    ],
  },
  {
    slug: 'automated-reporting',
    num: '03',
    name: 'Automated reporting',
    short: 'AUTOMATED REPORTING',
    meta: 'Automated weekly reports that pull your ads, sales and operations data together and explain what changed, delivered to Slack or email every Monday.',
    h1: ['YOUR NUMBERS.', 'EVERY MONDAY.'],
    sub: 'Stop spending evenings in spreadsheets. We connect your ad accounts, store, CRM and booking tools, and send a clear weekly report that explains what changed and what to do next.',
    facts: ['DELIVERED MONDAY 8AM', 'PLAIN-ENGLISH INSIGHTS', 'ALERTS WHEN THINGS BREAK'],
    mock: MOCKS.report,
    problem: {
      h2: ['DATA EVERYWHERE.', 'ANSWERS NOWHERE.'],
      lede: 'Your numbers live in five different tools that never agree. Pulling them together takes hours you don\'t have.',
      pains: [
        { t: 'EVENINGS IN SPREADSHEETS', d: 'Someone copies numbers from ad dashboards and your store every week, by hand.' },
        { t: 'NUMBERS THAT DON\'T MATCH', d: 'Meta says one thing, Shopify another, your CRM a third. Nobody knows which to trust.' },
        { t: 'PROBLEMS FOUND TOO LATE', d: 'A broken checkout or a cost spike shows up in next month\'s report, after the money is gone.' },
      ],
    },
    how: [
      { t: 'WE CONNECT YOUR SOURCES', d: 'Ad accounts, store, payments, CRM and booking software, read-only.', list: ['META · GOOGLE · SHOPIFY · STRIPE · CRM'] },
      { t: 'WE CLEAN AND RECONCILE', d: 'Data is matched across tools so revenue, leads and spend line up.', list: ['ONE SOURCE OF TRUTH'] },
      { t: 'AI WRITES THE SUMMARY', d: 'What changed this week, why it likely changed, and what to look at next, in plain English.', list: ['INSIGHTS, NOT JUST CHARTS'] },
      { t: 'IT ARRIVES MONDAY 8AM', d: 'In Slack or email, with a live dashboard for anyone who wants to dig deeper.', list: ['SLACK · EMAIL · DASHBOARD'] },
      { t: 'ALERTS BETWEEN REPORTS', d: 'If costs spike, ROAS drops or bookings stall mid-week, you hear about it the same day.', list: ['ANOMALY ALERTS'] },
    ],
    included: [
      { t: 'Weekly report', d: 'A one-page summary of revenue, leads, spend and the numbers you care about.' },
      { t: 'Live dashboard', d: 'Every metric in one place, updated automatically.' },
      { t: 'Plain-English insights', d: 'What moved, why it likely moved, and a suggested next step.' },
      { t: 'Custom KPIs', d: 'Cost per booking, revenue per lead, show rate: whatever runs your business.' },
      { t: 'Anomaly alerts', d: 'Same-day alerts when a number moves outside its normal range.' },
      { t: 'Read-only access', d: 'We read your data; we never change your accounts from reporting.' },
    ],
    metrics: [
      { t: 'HOURS SAVED', d: 'Time your team no longer spends building reports.' },
      { t: 'TIME TO INSIGHT', d: 'How quickly a problem or win is spotted.' },
      { t: 'COST PER ACQUISITION', d: 'Tracked across every channel in one view.' },
      { t: 'REVENUE PER LEAD', d: 'What a lead is really worth to your business.' },
    ],
    fit: [
      { tag: 'E-COMMERCE', d: 'Ads, store and email revenue reconciled into one weekly view.' },
      { tag: 'MULTI-LOCATION CLINICS', d: 'Bookings, show rates and revenue compared across locations.' },
      { tag: 'COACHES', d: 'Funnel numbers from ad click to paid client in one report.' },
    ],
    faqs: [
      { q: 'Which tools can you report on?', a: 'Most ad platforms, stores, payment processors, CRMs and booking tools. If it has an API or an export, we can usually include it.' },
      { q: 'Do I have to learn a new dashboard?', a: 'No. The report comes to Slack or email. The dashboard is there if you want it, not required.' },
      { q: 'Can you change anything in my accounts?', a: 'Reporting uses read-only access. Nothing in your ad accounts or store is changed.' },
      { q: 'How soon is the first report?', a: 'Usually within 2–3 weeks, once your sources are connected and the numbers are checked with you.' },
    ],
  },
  {
    slug: 'ai-ad-creatives',
    num: '04',
    name: 'AI ad creatives',
    short: 'AI AD CREATIVES',
    meta: 'On-brand static and video ad variants generated from your winning ads, tested every week and refreshed before fatigue drives up your costs.',
    h1: ['FRESH ADS.', 'EVERY WEEK.'],
    sub: 'Ads wear out fast, and tired creative quietly raises what you pay for every customer. We turn your winners into a steady stream of on-brand variants, test them, and keep what works.',
    facts: ['NEW VARIANTS WEEKLY', 'ON-BRAND, HUMAN-REVIEWED', 'EVERY PLATFORM SIZE'],
    mock: MOCKS.creative,
    problem: {
      h2: ['TIRED ADS.', 'RISING COSTS.'],
      lede: 'When the same ads run for weeks, people stop noticing them and your cost per customer creeps up.',
      pains: [
        { t: 'CREATIVE FATIGUE', d: 'Your best ad slowly stops working, and there\'s nothing ready to replace it.' },
        { t: 'ONE DESIGNER, TOO MANY ASKS', d: 'New variants take weeks, so testing happens rarely, if at all.' },
        { t: 'GUESSING WHAT TO TEST', d: 'Without a plan, tests are random and the learnings are lost.' },
      ],
    },
    how: [
      { t: 'WE LEARN FROM YOUR WINNERS', d: 'We analyse which hooks, offers and formats already work for you.', list: ['TOP ADS BY CTR AND CPA'] },
      { t: 'AI DRAFTS NEW ANGLES', d: 'Fresh hooks, headlines and concepts in your brand voice and visual style.', list: ['HOOKS · COPY · CONCEPTS'] },
      { t: 'WE PRODUCE VARIANTS', d: 'Static and short video ads in every size Meta, Instagram, TikTok and Google need.', list: ['1:1 · 4:5 · 9:16 · 16:9'] },
      { t: 'A HUMAN REVIEWS EVERYTHING', d: 'Nothing goes live without a brand and claims check, by us and then by you.', list: ['BRAND + CLAIMS CHECK'] },
      { t: 'TEST, KEEP, REPEAT', d: 'Structured tests each week; winners scale, losers are retired, learnings are logged.', list: ['WEEKLY TEST CYCLE'] },
    ],
    included: [
      { t: 'Weekly creative batches', d: 'A steady flow of new variants so you are never stuck with tired ads.' },
      { t: 'Brand kit', d: 'Your colours, fonts, tone and do\'s and don\'ts, applied to every ad.' },
      { t: 'Hooks and copy', d: 'Headlines, primary text and calls to action written for each angle.' },
      { t: 'Every format', d: 'Sized for feeds, stories, reels and display.' },
      { t: 'Test plan', d: 'Clear hypotheses for every test, so each round teaches you something.' },
      { t: 'Performance readouts', d: 'What won, what lost and what we will try next.' },
    ],
    metrics: [
      { t: 'CLICK-THROUGH RATE', d: 'Whether the ad stops the scroll and earns the click.' },
      { t: 'COST PER ACQUISITION', d: 'What each new customer costs from each creative.' },
      { t: 'CREATIVE WIN RATE', d: 'The share of new variants that beat the current best.' },
      { t: 'TIME TO REFRESH', d: 'How fast a fatigued ad is replaced.' },
    ],
    fit: [
      { tag: 'E-COMMERCE', d: 'Product ads refreshed weekly across Meta and TikTok.' },
      { tag: 'MEDSPAS', d: 'Treatment and offer ads that stay compliant and on-brand.' },
      { tag: 'GYMS & COACHES', d: 'Transformation and offer angles tested every week.' },
    ],
    faqs: [
      { q: 'Will the ads look AI-generated?', a: 'No. Everything follows your brand kit and is reviewed by a person before you see it. You approve every ad before it goes live.' },
      { q: 'Do you run the ads too?', a: 'We can launch tests in your ad account, and pair this with our ad strategy agents to manage budget between winners and losers.' },
      { q: 'What about claims in regulated industries?', a: 'We follow your approved claims list and platform rules, and flag anything that needs your sign-off.' },
      { q: 'Do I own the creatives?', a: 'Yes. Every ad and source file is yours.' },
    ],
  },
  {
    slug: 'ad-strategy-agents',
    num: '05',
    name: 'Ad strategy agents',
    short: 'AD STRATEGY AGENTS',
    meta: 'AI agents that monitor your ad spend around the clock, pause what\'s losing, scale what\'s winning within your limits, and explain every change.',
    h1: ['SMARTER SPEND.', 'AROUND THE CLOCK.'],
    sub: 'Ad budgets leak overnight and on weekends, when nobody is watching. Our strategy agents check every campaign hourly, act inside the guardrails you set, and tell you exactly what they changed.',
    facts: ['CHECKS EVERY HOUR', 'INSIDE YOUR GUARDRAILS', 'EVERY CHANGE LOGGED'],
    mock: MOCKS.strategy,
    problem: {
      h2: ['BUDGET LEAKS', 'WHILE YOU SLEEP.'],
      lede: 'A losing ad set can burn through a day of budget before anyone opens the dashboard.',
      pains: [
        { t: 'SPEND RUNS UNWATCHED', d: 'Campaigns overspend at night and over weekends, when nobody is checking.' },
        { t: 'SLOW REACTIONS', d: 'By the time a drop in ROAS is spotted, the money is already spent.' },
        { t: 'GUT-FEEL DECISIONS', d: 'Budget moves are made on hunches because nobody has time to dig in.' },
      ],
    },
    how: [
      { t: 'WE CONNECT YOUR AD ACCOUNTS', d: 'Meta, Google and TikTok, plus your store or CRM so the agent sees real revenue.', list: ['ADS + REAL REVENUE DATA'] },
      { t: 'YOU SET THE GUARDRAILS', d: 'Target cost per acquisition or ROAS, daily limits, and what the agent may and may not change.', list: ['YOUR RULES, ALWAYS'] },
      { t: 'THE AGENT WATCHES HOURLY', d: 'Every campaign, ad set and ad is checked against your targets around the clock.', list: ['24/7 MONITORING'] },
      { t: 'IT ACTS WITHIN LIMITS', d: 'Pauses clear losers and shifts budget to proven winners, never beyond your caps.', list: ['PAUSE · SCALE · REBALANCE'] },
      { t: 'IT EXPLAINS EVERYTHING', d: 'Every change is logged with a reason, and a person reviews the strategy with you weekly.', list: ['CHANGE LOG + WEEKLY REVIEW'] },
    ],
    included: [
      { t: 'Hourly monitoring', d: 'Campaigns checked against your targets around the clock.' },
      { t: 'Spend guardrails', d: 'Hard limits on budgets and changes that the agent cannot cross.' },
      { t: 'Automatic optimisation', d: 'Losers paused and winners scaled based on your real revenue.' },
      { t: 'Change log', d: 'A plain record of every action and why it was taken.' },
      { t: 'Slack alerts', d: 'Instant messages for big moves, anomalies or tracking issues.' },
      { t: 'Weekly strategy review', d: 'A person reviews results with you and plans the next tests.' },
    ],
    metrics: [
      { t: 'RETURN ON AD SPEND', d: 'Revenue earned for every dollar spent, by channel.' },
      { t: 'COST PER ACQUISITION', d: 'What each new customer costs, against your target.' },
      { t: 'WASTED SPEND', d: 'Budget spent on ads below your thresholds.' },
      { t: 'TIME TO REACT', d: 'How fast a problem is caught and fixed.' },
    ],
    fit: [
      { tag: 'E-COMMERCE', d: 'ROAS protected across Meta, Google and TikTok.' },
      { tag: 'LEAD-GEN PRACTICES', d: 'Cost per booked appointment kept under target.' },
      { tag: 'COACHES', d: 'Funnel ad spend balanced toward calls that close.' },
    ],
    faqs: [
      { q: 'Will it make changes without me?', a: 'Only inside the guardrails you approve. You decide what it can change and by how much, and you can switch it to suggestions-only.' },
      { q: 'Do I keep access to my ad accounts?', a: 'Always. The accounts stay yours; the agent works through the access you grant and can be removed any time.' },
      { q: 'How is this different from platform automation?', a: 'Platform tools optimise for the platform\'s metrics. Our agent uses your real revenue and your rules across every channel.' },
      { q: 'What spend level does this make sense for?', a: 'It is most useful once you spend consistently each month across more than one campaign. The audit will tell you honestly.' },
    ],
  },
  {
    slug: 'agentic-workflows',
    num: '06',
    name: 'Agentic workflows',
    short: 'AGENTIC WORKFLOWS',
    meta: 'AI-powered workflows that run your follow-ups, reminders, reviews, invoicing and handoffs automatically, inside the tools you already use.',
    h1: ['YOUR BACK OFFICE.', 'ON AUTOPILOT.'],
    sub: 'Reminders, follow-ups, review requests, invoices and data entry keep your team busy and still slip through the cracks. We automate them end to end, with a person in the loop where it matters.',
    facts: ['RUNS IN YOUR TOOLS', 'HUMAN CHECKPOINTS', 'FULLY DOCUMENTED'],
    mock: MOCKS.flow,
    problem: {
      h2: ['ROBOT WORK.', 'HUMAN TEAM.'],
      lede: 'Your team spends hours on tasks a system could do, and the tasks still get missed on busy days.',
      pains: [
        { t: 'FOLLOW-UPS SLIP', d: 'Quotes, check-ins and rebooking reminders depend on someone remembering.' },
        { t: 'COPY-PASTE BETWEEN TOOLS', d: 'The same details typed into the CRM, the calendar, the invoice and the spreadsheet.' },
        { t: 'NO-SHOWS AND SILENT CUSTOMERS', d: 'Missed appointments and happy customers who never leave a review.' },
      ],
    },
    how: [
      { t: 'WE MAP YOUR PROCESS', d: 'We walk through how work moves today and where it stalls or gets dropped.', list: ['PROCESS MAP'] },
      { t: 'WE DESIGN THE WORKFLOW', d: 'Triggers, steps and the points where a person should approve or step in.', list: ['HUMAN CHECKPOINTS'] },
      { t: 'WE BUILD IN YOUR TOOLS', d: 'Connected to the CRM, calendar, payments and messaging you already use.', list: ['NO NEW SOFTWARE TO LEARN'] },
      { t: 'WE TEST THE EDGE CASES', d: 'Cancellations, duplicates, missing data and errors, not just the happy path.', list: ['ERROR HANDLING'] },
      { t: 'IT RUNS AND WE MONITOR', d: 'Workflows run around the clock, with alerts if anything fails and monthly improvements.', list: ['MONITORED 24/7'] },
    ],
    included: [
      { t: 'Reminders and no-show recovery', d: 'Automatic reminders, plus rebooking for anyone who misses.' },
      { t: 'Review requests', d: 'Happy customers asked for a review at the right moment.' },
      { t: 'Invoice and payment follow-ups', d: 'Polite, persistent reminders until invoices are paid.' },
      { t: 'CRM hygiene', d: 'Contacts, tags and stages kept accurate without manual entry.' },
      { t: 'Onboarding sequences', d: 'New clients get the right forms, info and check-ins automatically.' },
      { t: 'Reactivation', d: 'Past customers invited back when they are due.' },
    ],
    metrics: [
      { t: 'HOURS SAVED', d: 'Manual work removed from your team\'s week.' },
      { t: 'NO-SHOW RATE', d: 'Missed appointments, before and after reminders.' },
      { t: 'NEW REVIEWS', d: 'Reviews collected each month.' },
      { t: 'REACTIVATED CUSTOMERS', d: 'Past customers who booked again.' },
    ],
    fit: [
      { tag: 'CLINICS & MEDSPAS', d: 'Reminders, aftercare, reviews and rebooking on autopilot.' },
      { tag: 'GYMS & COACHES', d: 'Onboarding, check-ins and win-back sequences.' },
      { tag: 'E-COMMERCE', d: 'Order issues, returns triage and customer follow-ups.' },
    ],
    faqs: [
      { q: 'Do I need new software?', a: 'Usually not. We build on the tools you already pay for and add a workflow layer only where it is needed.' },
      { q: 'What if something breaks?', a: 'Workflows are monitored. Failures trigger alerts, and we fix them, so problems don\'t sit unnoticed.' },
      { q: 'Can my team still step in?', a: 'Yes. We add approval steps wherever a person should decide, such as refunds or sensitive messages.' },
      { q: 'Who owns the workflows?', a: 'You do. Every workflow is documented and handed over, whether or not we keep running it for you.' },
    ],
  },
];
