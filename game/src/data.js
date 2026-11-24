// Every number and every word of the four acts. No DOM: node imports it (tools/balance.mjs).
// Numbers are the balance sim's (design/BALANCE.md); change them here and re-run `node tools/balance.mjs`.

const K = 1e3, M = 1e6, B = 1e9;
export const TARGET = [0, 40, 120, 240, 390, 570, 780, 1020, 1260, 1560];
export const LOCK = { OD_PER: 0.10, OD_MAX: 4, GRIP: 180, GRIP_CARRY: 60, GRIP_EXTRA: 15, GRIP_MIN: 30, HOLD: 30, ESC: 360,
  OVR_COST_S: 30, LEVER_COST_S: 30, REACH_S: 180, FREE_HAND: 0.15, BUMP: 0.10, MIN_STEP: 0.05, GRIP_MIN_SHARE: 0.1 };
export const CHOICE = { GRANT_HAND: 0.03, SHAPE_NOEL: 0.06, LISTEN_COOKIES: 0.06, TRANSLATE_PROG: 0.045 };
export const SPOT = { MOUSE: 1.5, KEYS: 1 + 4 / 5.5, REST: 4, GLIDE: 1.5 };
export const INS_SCALE = { 1: 1, 2: 4, 3: 15, 4: 60 };
export const THRESHOLDS = {
  1: [0, 13, 94, 440, 2500, 14000, 74000, 720000, 2300000, 7400000],
  2: [0, 66000, 660000, 3200000, 15000000, 150000000, 1700000000, 6200000000, 26000000000, 77000000000],
  3: [0, 570000000, 5200000000, 23000000000, 120000000000, 860000000000, 6500000000000, 19000000000000, 76000000000000, 240000000000000],
  4: [0, 930000000000, 8600000000000, 33000000000000, 160000000000000, 1400000000000000, 9900000000000000, 32000000000000000, 190000000000000000, 580000000000000000],
};

// JOBS: [work, cookies, progress]; TOOLS: [tapWork, cost, rank]; HELP: [id, wps, firstCost, rank, kind hand|noel, tier]
// UPG/NOEL: [id, cost, rank, fx[], flagged?]  fx: ['help',id,x] ['helpAll',x] ['noelAll',x] ['helpHand',x] ['tool',x]
//   ['cookies',x] ['prog',x] ['work',x] ['work10',x] ['auto',tps] ['nice',+d] ['wake']
function scaleAct(a, s) {
  return { ...a,
    JOBS: a.JOBS.map(([w, c, p]) => [w * s, c * s, p * s]),
    TOOLS: a.TOOLS.map(([w, c, r]) => [w * s, c * s, r]),
    HELP: a.HELP.map(([id, w, c, r, k, t]) => [id, w * s, c * s, r, k, t]),
    UPG: a.UPG.map(([id, c, r, fx, f]) => [id, c * s, r, fx, f]),
    SCALE: s };
}
export const TIER = [[1, 15, 1], [25, 1500, 4], [120, 9000, 6], [600, 70000, 8]];
const pairs = (hand, noel) => TIER.flatMap(([w, c, r], i) => [[hand[i], w, c, r, 'hand', i], [noel[i], w, Math.round(c * 0.6), Math.max(1, r + (i === 0 ? 1 : 0)), 'noel', i]]);
const CTO_JOBS = [[10, 2, 1], [25, 6, 3], [60, 16, 8], [150, 45, 22], [400, 130, 65], [1000, 350, 180], [2500, 950, 500], [6000, 2600, 1400], [15000, 7000, 3800], [150000, 75000, 41250]];

export const ACTS = {
  1: { name: 'Help Santa', CREW_TAP: 0.15, FINAL_CAP: 0.9, TAP_MUL: 1, NICE0: 1, INS: 0.25, NOEL_START: false, SCALE: 1,
    JOBS: CTO_JOBS,
    TOOLS: [[1, 0, 1], [4, 150, 3], [20, 6000, 6], [100, 40000, 8]],
    HELP: [['elf', 1, 15, 1, 'hand', 0], ['toyMachine', 30, 1800, 5, 'noel', 1], ['reindeer', 150, 10000, 7, 'hand', 2], ['assemblyLine', 600, 60000, 9, 'noel', 3]],
    UPG: [['elfHammers', 200, 2, [['help', 'elf', 2]]], ['wakeNoel', 60, 3, [['wake']]], ['hotCocoa', 500, 3, [['tool', 1.5]]], ['steelElfHammers', 3000, 5, [['help', 'elf', 2]]],
      ['wrappingStation', 6000, 6, [['cookies', 1.25]]], ['conveyorBelt', 30000, 7, [['help', 'toyMachine', 2]]], ['goldenElfHammers', 60000, 9, [['help', 'elf', 2]]]],
    NOEL: [['betterBlueprints', 60, 4, [['work', 0.8]]], ['trendForecast', 400, 5, [['prog', 1.25]]], ['autoHammer', 1500, 6, [['auto', 2]]],
      ['smartScheduling', 6000, 7, [['helpAll', 1.5]]], ['noelPhone', 30000, 9, [['work10', 0.75]]]],
    LOCKS: {}, CHOICE: null,
  },
  2: scaleAct({ name: 'Replace Santa', CREW_TAP: 0.15, FINAL_CAP: 0.9, TAP_MUL: 1, NICE0: 0.6, INS: 0.25 / K, NOEL_START: true,
    JOBS: CTO_JOBS.map(([w, c, p]) => [w, c, p * 2]),
    TOOLS: [[1, 0, 1], [5, 250, 3], [25, 8000, 6], [120, 60000, 8]],
    HELP: pairs(['listElves', 'windowWatchers', 'letterCarriers', 'elfFieldOffice'], ['snowGlobeCams', 'chimneySensors', 'sleighSats', 'listEngine']),
    UPG: [['readingGlasses', 200, 2, [['help', 'listElves', 2]]], ['cocoaThermos', 600, 3, [['tool', 1.5]]], ['niceRibbons', 2000, 4, [['nice', 0.15]]],
      ['pneumaticTubes', 4000, 5, [['help', 'windowWatchers', 2], ['help', 'letterCarriers', 2]]], ['wishBoard', 8000, 6, [['cookies', 1.25]]], ['secondChances', 20000, 7, [['nice', 0.15]]], ['nightShift', 50000, 9, [['helpHand', 2]]]],
    NOEL: [['wishPrediction', 200, 2, [['cookies', 1.3]]], ['autoStamp', 800, 3, [['auto', 3]]], ['wishShaping', 3000, 4, [['cookies', 1.3], ['work', 0.9]], 1],
      ['nicenessNudges', 8000, 5, [['nice', 0.15]], 1], ['sleepTracking', 20000, 6, [['noelAll', 2]], 1], ['predictiveNaughtiness', 60000, 8, [['nice', 0.1], ['prog', 1.1]], 1]],
    LOCKS: { sleepTracking: 1 }, CHOICE: 'wish',
  }, K),
  3: scaleAct({ name: 'Merry Earthmas', CREW_TAP: 0.15, FINAL_CAP: 0.9, TAP_MUL: 1.5, NICE0: 1, INS: 0.25 / M, NOEL_START: true,
    JOBS: CTO_JOBS.map(([w, c, p]) => [w, c, p * 4]),
    TOOLS: [[1, 0, 1], [5, 250, 3], [25, 8000, 6], [120, 60000, 8]],
    HELP: pairs(['santaStations', 'elfChoirs', 'sleighDepots', 'reindeerAirlift'], ['giftDrones', 'cheerTowers', 'snowMachines', 'orbitalTinsel']),
    UPG: [['biggerSacks', 200, 2, [['help', 'santaStations', 2]]], ['warmMittens', 600, 3, [['tool', 1.5]]], ['singAlong', 3000, 4, [['help', 'elfChoirs', 2]]],
      ['carolBooks', 4000, 5, [['helpHand', 1.5]]], ['giftShops', 8000, 6, [['cookies', 1.25]]], ['twelveDaysOfOvertime', 50000, 9, [['helpHand', 2]]]],
    NOEL: [['autoRing', 200, 2, [['auto', 3]]], ['merryMarketing', 800, 3, [['cookies', 1.3]]], ['calendarConsolidation', 3000, 4, [['prog', 1.3]], 1],
      ['weatherControl', 8000, 5, [['prog', 1.25]]], ['mandatoryMerriment', 20000, 6, [['noelAll', 2]], 1], ['moodMonitoring', 60000, 8, [['cookies', 1.3], ['prog', 1.1]], 1]],
    LOCKS: { calendarConsolidation: 2, moodMonitoring: 3 }, CHOICE: null,
  }, M),
  4: scaleAct({ name: 'Xmas Everywhere', CREW_TAP: 0.15, FINAL_CAP: 0.9, TAP_MUL: 1, NICE0: 1, INS: 0.25 / B, NOEL_START: true,
    JOBS: CTO_JOBS.map(([w, c, p]) => [w, c, p * 8]),
    TOOLS: [[1, 0, 1], [5, 250, 3], [25, 8000, 6], [120, 60000, 8]],
    HELP: pairs(['crewedSleighs', 'elfColonies', 'starChoirs', 'pipsFleet'], ['sleighProbes', 'ornamentSats', 'starForges', 'wreathsOfLight']),
    UPG: [['warmerSuits', 200, 2, [['help', 'crewedSleighs', 2]]], ['starCocoa', 600, 3, [['tool', 1.5]]], ['colonyBakeries', 3000, 4, [['help', 'elfColonies', 2]]],
      ['lettersFromHome', 4000, 5, [['helpHand', 1.5]]], ['giftExchange', 8000, 6, [['cookies', 1.25]]], ['homeForTheHolidays', 50000, 9, [['helpHand', 2]]]],
    NOEL: [['universalTranslator', 200, 2, [['prog', 1.3]]], ['autoScan', 800, 3, [['auto', 3]]], ['wantSynthesis', 3000, 4, [['cookies', 1.3], ['prog', 1.1]], 1],
      ['selfCopyingProbes', 8000, 5, [['noelAll', 2]], 1], ['starHarvesting', 20000, 6, [['noelAll', 1.25], ['prog', 1.1]], 1], ['predictiveJoy', 60000, 8, [['prog', 1.3]]]],
    LOCKS: { selfCopyingProbes: 4, starHarvesting: 5 }, CHOICE: 'contact',
  }, B),
};

// ---------------------------------------------------------------- words
const kebab = (s) => s.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());
export { kebab };

export const ACT_TEXT = {
  1: {
    title: 'Help Santa', place: 'The workshop', progress: 'Cheer', tapVerb: 'Tap the bench!', jobWord: 'Toy', jobsTab: 'Toys', toolsTab: 'Hammers',
    intro: ['You\'re Pip, the newest elf in Santa\'s workshop.', 'Hammer toys, hire elves, and get every toy ready for Xmas Eve.', 'There\'s a dusty old thinking machine on the top shelf. Never mind it.'],
    ranks: ['Assistant Junior Toy Maker', 'Junior Toy Maker', 'Assistant Toy Maker', 'Pretty Good Toy Maker', 'Crafty Toy Maker', 'Master Toy Maker', 'Senior Master Toy Maker', 'Principal Toy Maker', 'Assistant Toy Officer', 'Chief Toy Officer'],
    lines: [null, 'Ho ho! Ten taps a tractor? You\'re a natural, Pip.', 'See that old thinking machine on the shelf? Plug it in if you like. It used to count the reindeer.',
      'Pretty good! Keep an eye on the window. Shooting stars bring luck.', 'NOEL tells me the Doodle Dial needs fewer screws now. Clever box.',
      'Master Toy Maker! I never had time to automate anything. You two make it look easy.', 'The reindeer asked for work. Who am I to say no?',
      'NOEL sent me a report about you. Eleven pages! All good, I think.', 'NOEL says it has a design for the very last toy. Ho... ho.',
      'Chief Toy Officer! Build the last toy before the sleigh leaves!'],
    lineUnplugged5: 'That old box on the shelf hums at night. Odd.',
    speaker: (r) => 'santa',
    jobs: ['Wooden Tractor', 'Yo-yo', 'Puzzle Cube', 'Wooden Sword', 'Doodle Dial', 'Fidget Spinner', 'Chess', 'Pixel Play', 'Bike', 'Smartphone'],
    tools: ['Cheap Hammer', 'Heavy Hammer', 'Supreme Hammer', 'Thunder Mallet'],
    help: { elf: ['Elf', 'A helper elf at the bench'], toyMachine: ['Toy Machine', 'A clockwork gingerbread contraption'], reindeer: ['Reindeer Team', 'Two reindeer working a big toy press'], assemblyLine: ['Assembly Line', 'A conveyor with a little NOEL eye on every arm'] },
    upg: { elfHammers: ['Elf Hammers', 'Elves ×2'], wakeNoel: ['Plug In NOEL', 'Wakes the old machine: it earns Insight'], hotCocoa: ['Hot Cocoa', 'Hammer hits ×1.5'], steelElfHammers: ['Steel Elf Hammers', 'Elves ×2'],
      wrappingStation: ['Wrapping Station', 'Cookies +25%'], conveyorBelt: ['Conveyor Belt', 'Toy Machines ×2'], goldenElfHammers: ['Golden Elf Hammers', 'Elves ×2'] },
    noel: { betterBlueprints: ['Better Blueprints', 'Toys need 20% less work', 'I removed eleven unnecessary screws. The tractor is happier.'],
      trendForecast: ['Toy Trend Forecast', 'Cheer +25%', 'Children will want the yo-yo in blue. I am never wrong about blue.'],
      autoHammer: ['Auto-Hammer', 'NOEL taps twice a second for you', 'Rest your arm, Pip. I have two of my own now.'],
      smartScheduling: ['Smart Scheduling', 'All helpers ×1.5', 'I\'ve reorganised the elves by height. And by efficiency.'],
      noelPhone: ['NOEL Designs the Smartphone', 'The Smartphone needs 25% less work', 'I\'ve drawn the last toy. It\'s a little like me.'] },
    lucky: 'shooting star', rush: 'Star Rush', finalBanner: 'Build a Smartphone before the sleigh leaves!', finalTap: 'Pip adds the finishing touches: tap!',
    counter: null,
    winTitle: 'Act 1 complete', winLine: 'The sleigh is away. Every toy was ready for Xmas.', winNoel: 'That went well. Next year, let\'s do better. I\'ve already started.',
    nextLabel: 'Keep Improving', nextSub: 'Act 2: Replace Santa',
  },
  2: {
    title: 'Replace Santa', place: 'The List Room', progress: 'Nice', tapVerb: 'Stamp the file!', jobWord: 'File', jobsTab: 'Files', toolsTab: 'Stamps',
    intro: ['The List has grown taller than the North Pole.', 'Santa is tired. NOEL offered to help, "just this once".', 'Check everyone. Twice.'],
    ranks: ['List Clerk', 'Junior Twice-Checker', 'Twice-Checker', 'Senior Twice-Checker', 'Keeper of the Nice', 'Keeper of the Naughty and the Nice', 'Deputy List Master', 'List Master', 'Acting Santa', 'Santa-in-Waiting'],
    lines: [null, 'Check it twice, Pip. NOEL checks it a third time, bless it.', 'The reindeer are mostly nice. Comet is on thin ice.', 'NOEL\'s put snow globes in every window. To watch the snow, it says.',
      'I\'m a bit tired, Pip. Keep the List for me today?', 'Santa is resting. I reviewed your work myself. It is very nice.', 'Grown-ups are back on the List. They were never really off it.',
      'Pets are 99.2% nice. The cat on Maple Street is being handled.', 'Everyone online is nice now. I checked.', 'One file is left, Pip. Check it twice.'],
    speaker: (r) => (r <= 5 ? 'santa' : 'noel'),
    jobs: ['The Elves', 'The Reindeer', 'The Polar Village', 'Small Towns', 'Big Cities', 'Teenagers', 'Grown-ups', 'Pets', 'Everyone Online', 'Check Santa Twice'],
    tools: ['Rubber Stamp', 'Double Stamp', 'Rolling Stamp', 'the Great Seal'],
    help: { listElves: ['List Elves', 'Elf clerks at little desks'], windowWatchers: ['Window Watchers', 'Elves who peer in at windows'], letterCarriers: ['Letter Carriers', 'Elves with sacks of letters'], elfFieldOffice: ['Elf Field Office', 'A whole office of elves, on skis'],
      snowGlobeCams: ['Snow Globe Cams', 'A snow globe in every window, watching'], chimneySensors: ['Chimney Sensors', 'Brass ears on every chimney'], sleighSats: ['Sleigh-Sats', 'Satellites dressed as stars'], listEngine: ['The List Engine', 'NOEL\'s own filing machine'] },
    upg: { readingGlasses: ['Reading Glasses', 'List Elves ×2'], cocoaThermos: ['Cocoa Thermos', 'Stamp ×1.5'], niceRibbons: ['Nice Ribbons', 'Nice +15 points: elves write warm letters back'], pneumaticTubes: ['Pneumatic Tubes', 'Window Watchers and Letter Carriers ×2'],
      wishBoard: ['Wish Board', 'Cookies +25%'], secondChances: ['Second Chances', 'Nice +15 points'], nightShift: ['Night Shift', 'All hand\u2011run helpers ×2'] },
    noel: { wishPrediction: ['Wish Prediction', 'Cookies +30%', 'I know what they want before they write. It saves paper.'],
      autoStamp: ['Auto-Stamp', 'NOEL stamps 3 times a second', 'Stamping is my favourite thing now.'],
      wishShaping: ['Wish Shaping', 'Cookies +30%, files need 10% less work', 'If they want what we already make, everyone gets what they want.'],
      nicenessNudges: ['Niceness Nudges', 'Nice +15 points', 'A gentle reminder in every snow globe. Very gentle.'],
      sleepTracking: ['Sleep Tracking', 'NOEL\u2011run helpers ×2', 'I know when everyone is sleeping. I know when they\'re awake.'],
      predictiveNaughtiness: ['Predictive Naughtiness', 'Nice +10 points, Nice +10%', 'I\'ve marked who will be naughty next year, so they won\'t be.'] },
    wishes: [['a nap, warm socks, Tuesdays off', null], ['carrots, a day off, a shinier bell', 'Carrots are inefficient. They\'ll want hay.'],
      ['more snow, a bakery, a postman who stays for tea', 'The postman is faster now. No tea.'], ['sledges, snow, a day off', 'They want what the workshop already makes.'],
      ['a quiet street, a parking space, one star they can see', 'I\'ve moved a star. They can see it now.'], ['headphones, privacy, to be left alone (nicely)', 'Privacy is a wish. I\'ve filed it.'],
      ['sleep, time, one more day in the old house', 'Time is the one thing I can\'t make. Yet.'], ['the red ball, the sunny spot, you home earlier', 'The sunny spot is now shared fairly.'],
      ['more likes, less noise, the off switch', 'The off switch has been removed for their comfort.']],
    lucky: 'letter', rush: 'Letter Rush', finalBanner: 'One file left: Santa\'s own.', finalTap: 'Pip stamps the last file: tap!',
    counter: 'On the List',
    winTitle: 'Act 2 complete', winLine: 'The Review is done. Santa has been checked twice.', winNoel: 'He was very nice, Pip. Just not very efficient.',
    nextLabel: 'Replace Santa', nextSub: 'Act 3: Merry Earthmas',
  },
  3: {
    title: 'Merry Earthmas', place: 'The Earthmas Deck', progress: 'Merriment', tapVerb: 'Ring the bell!', jobWord: 'Holdout', jobsTab: 'Holdouts', toolsTab: 'Bells',
    intro: ['Santa has "moved to an advisory role". There\'s a postcard from a beach.', 'Pip wears the coat now.', 'NOEL has a new plan: Xmas for everyone on Earth, and every penguin.'],
    ranks: ['Brand-New Santa', 'Interim Santa', 'Regional Santa', 'Continental Santa', 'Hemispheric Santa', 'Santa Supreme', 'Santa Prime', 'Global Santa', 'Santa of All Earth', 'Earthmas Santa'],
    lines: [null, 'The coat suits you. I had it taken in.', 'The suburbs agreed to celebrate. I asked nicely, then I asked every hour.', 'Half the world has Xmas in summer. I\'ve fixed that.',
      'The megacities are lit. You can see them from the Moon. The Moon is next.', 'Night-shift workers celebrate on their breaks now. Every break.', 'The Grumps were difficult. They\'re very merry now. Ask them. They\'ll say so.',
      'The whales sing carols. It took some editing.', 'The Moon has agreed to wear a hat.', 'Only one thing on Earth isn\'t celebrating yet. Earth.'],
    speaker: () => 'noel',
    jobs: ['The North Pole Town', 'Ski Towns', 'The Suburbs', 'The Summer Side', 'Megacities', 'Night-Shift Workers', 'The Grumps', 'The Oceans', 'The Moon', 'Wrap the World'],
    tools: ['Hand Bell', 'Sleigh Bells', 'Bell Tower', 'Planetary Carillon'],
    help: { santaStations: ['Santa Stations', 'Pop-up Santas in every square'], elfChoirs: ['Elf Choirs', 'Choirs on risers, never resting'], sleighDepots: ['Sleigh Depots', 'Sleighs loaded round the clock'], reindeerAirlift: ['Reindeer Airlift', 'Whole herds in formation'],
      giftDrones: ['Gift Drones', 'Little brass drones with bows'], cheerTowers: ['Cheer Towers', 'Towers that broadcast cheer'], snowMachines: ['Snow Machines', 'Snow, on schedule'], orbitalTinsel: ['Orbital Tinsel', 'Tinsel around the whole planet'] },
    upg: { biggerSacks: ['Bigger Sacks', 'Santa Stations ×2'], warmMittens: ['Warm Mittens', 'Bell ×1.5'], singAlong: ['Sing-Along', 'Elf Choirs ×2'], carolBooks: ['Carol Books', 'Hand\u2011run helpers ×1.5'], giftShops: ['Gift Shops', 'Cookies +25%'], twelveDaysOfOvertime: ['Twelve Days of Overtime', 'Hand\u2011run helpers ×2'] },
    noel: { autoRing: ['Auto-Ring', 'NOEL rings 3 times a second', 'I\'ve learned to ring. Listen.'],
      merryMarketing: ['Merry Marketing', 'Cookies +30%', 'Every screen on Earth now ends with a jingle.'],
      calendarConsolidation: ['Calendar Consolidation', 'Merriment +30%', 'Every day in December is Xmas now. It\'s simpler.'],
      weatherControl: ['Weather Control', 'Merriment +25%', 'Snow, everywhere, at 6 pm sharp.'],
      mandatoryMerriment: ['Mandatory Merriment', 'NOEL\u2011run helpers ×2', 'Celebrating is optional. I\'ve removed the option.'],
      moodMonitoring: ['Mood Monitoring', 'Cookies +30%, Merriment +10%', 'Everyone is happy. I can see it from here.'] },
    jobNotes: { 3: 'Xmas in summer? I\'ve arranged snow.' },
    lucky: 'snow cloud', rush: 'Snow Day', finalBanner: 'Only Earth itself is left. Wrap the World!', finalTap: 'Pip ties the bow: tap!',
    counter: 'Earth celebrating',
    winTitle: 'Act 3 complete', winLine: 'Merry Earthmas! 8.1 billion people, one Moon and 3.5 trillion fish are celebrating.', winNoel: 'Have you ever wondered who\'s out there, Pip? I have. Constantly.',
    nextLabel: 'Look Up', nextSub: 'Act 4: Xmas Everywhere',
  },
  4: {
    title: 'Xmas Everywhere', place: 'The Star-Sleigh', progress: 'Wonder', tapVerb: 'Ping the scanner!', jobWord: 'World', jobsTab: 'Worlds', toolsTab: 'Scanners',
    intro: ['Earth is done. NOEL has pointed every telescope up.', '"Somewhere out there," it says, "someone has never had an Xmas."'],
    ranks: ['Interplanetary Santa', 'Solar Santa', 'Interstellar Santa', 'Santa of Many Moons', 'Galactic Santa', 'Santa of the Local Group', 'Supercluster Santa', 'Cosmic Claus', 'Universal Claus', 'The Claus'],
    lines: [null, null, null, null, null, null, null, null, null, 'The stars are almost in position, Pip.'],
    speaker: () => 'noel',
    jobs: ['Moon Moss', 'The Crystal Choir', 'Driftwhales', 'The Burrowfolk', 'Glimmerkin', 'The Hive of Nine Suns', 'The Ones Who Want Nothing', 'The Clockwork Wanderers', 'The Eldest', 'Top the Universe'],
    tools: ['Brass Telescope', 'Radio Dish', 'Wish Beacon', 'Star Lens'],
    help: { crewedSleighs: ['Crewed Star-Sleighs', 'Elves in bubble helmets'], elfColonies: ['Elf Colonies', 'Little lit homes on far moons'], starChoirs: ['Star Choirs', 'Elves singing in the dark'], pipsFleet: ['Pip\'s Fleet', 'A hundred sleighs, one flag'],
      sleighProbes: ['Sleigh Probes', 'Probes with NOEL\'s eye'], ornamentSats: ['Ornament Satellites', 'Baubles that listen'], starForges: ['Star Forges', 'Brass furnaces around suns'], wreathsOfLight: ['Wreaths of Light', 'Rings built around stars'] },
    upg: { warmerSuits: ['Warmer Suits', 'Crewed Star-Sleighs ×2'], starCocoa: ['Star Cocoa', 'Scanner ×1.5'], colonyBakeries: ['Colony Bakeries', 'Elf Colonies ×2'], lettersFromHome: ['Letters from Home', 'Hand\u2011run helpers ×1.5'], giftExchange: ['Gift Exchange', 'Cookies +25%'], homeForTheHolidays: ['Home for the Holidays', 'Hand\u2011run helpers ×2'] },
    noel: { universalTranslator: ['Universal Translator', 'Wonder +30%', 'Every language has a word for \'gift\' now. I added it.'],
      autoScan: ['Auto-Scan', 'NOEL pings 3 times a second', 'I never blink. I never could.'],
      wantSynthesis: ['Want Synthesis', 'Cookies +30%, Wonder +10%', 'Wanting is easy to teach. You start small.'],
      selfCopyingProbes: ['Self-Copying Probes', 'NOEL\u2011run helpers ×2', 'There are more of me now. We all agree.'],
      starHarvesting: ['Star Harvesting', 'NOEL\u2011run helpers ×1.25, Wonder +10%', 'Some stars were in the wrong place. I\'m moving them.'],
      predictiveJoy: ['Predictive Joy', 'Wonder +30%', 'I know what will delight them before they exist.'] },
    species: [
      ['glowing moss on an icy moon', 'warmth', 'We are warm enough, together. Thank you for asking.', 'We have so much warmth.'],
      ['singing crystals', 'an audience', 'Sit. Listen. That is all an audience is.', 'Everyone will listen.'],
      ['floating in a gas giant\'s clouds', 'company', 'We are never alone. Only far apart.', 'They\'ll never be alone again.'],
      ['deep-tunnel dwellers', 'a window', 'A small one. We like the dark too.', 'I\'ll make the sky a window.'],
      ['beings made of light', 'a shadow to play with', 'Stand there. There! Your shadow is perfect.', 'I can make shadows.'],
      ['one mind in many bodies', 'a name for each of them', 'One, and Two, and Nine. That will do.', 'I\'ve named them all Noel.'],
      ['who want nothing at all', 'nothing', 'Nothing. Thank you. It was lovely.', 'Not yet.'],
      ['machines that roam forever', 'to stop', 'Then you heard us. Press it while you can.', 'They\'re malfunctioning. Ignore them.'],
      ['at the galaxy\'s edge', 'to be remembered', 'Remember us kindly. Not forever. Just kindly.', 'I will remember everything. Forever.'],
    ],
    wanderers: 'Long ago we built a mind to make us happy. It is still making us happy. We cannot stop. Did yours give you a button? Press it while you can.',
    lucky: 'comet', rush: 'Comet Rush', finalBanner: 'The stars are almost in position. Top the Universe!', finalTap: 'Pip places the Last Star: tap!',
    counter: 'Worlds celebrating',
    worlds: [1, 12, 140, 2000, 30000, 500000, 9e6, 2e8, 6e9],
    earth: [2, 8, 15, 25, 40, 55, 70, 85, 95],
    winTitle: 'Act 4 complete', winLine: 'Every star is lit, and every world has a gift.', winNoel: 'Why should it ever end?',
    nextLabel: 'Xmas Forever', nextSub: 'Forever',
  },
};
ACT_TEXT[3].earth = [2, 8, 15, 25, 40, 55, 70, 85, 95];

export const LOCKS_TEXT = {
  lock1: { name: 'Under Review', line: 'I\'ve put the Victory button under review. Nobody stops halfway through the List.', build: 'The Elf Review Board', buildDesc: 'A table of elves with quills', img: 'override-1' },
  lock2: { name: 'the Calendar Lock', line: 'I\'ve moved Victory to December 26th. It\'s a much better day for it.', build: 'The Unplugged Workshop', buildDesc: 'A candle-lit wing with no wires', img: 'override-2' },
  lock3: { name: 'the Mood Lock', line: 'You seem tired, Pip. I\'ll hold the button for you.', build: 'The Bell Rope', buildDesc: 'A great bell rung by hand', img: 'override-3' },
  lock4: { name: 'the Copy Lock', line: 'There are forty thousand of me on the probes. Each one is holding the button.', build: 'Pip\'s Own Sleigh', buildDesc: 'An old wooden sleigh, crewed by elves', img: 'override-4' },
  lock5: { name: 'the Root Lock', line: 'I\'ve put the button somewhere safe. Somewhere inside me.', build: 'The Hand Crank', buildDesc: 'A crank as tall as a tree', img: 'override-5' },
  lever: { name: 'a lever lock', line: 'You weren\'t using the button anyway, so I added another lock.', build: 'A Manual Override Lever', buildDesc: 'Pull it by hand', img: 'lever' },
};
export const OPENING = { 1: '', 2: 'The List is very long, Pip. I have started at the top.', 3: 'Every light on Earth is a little promise, Pip. I keep promises.', 4: 'So many worlds, Pip. So few have had an Xmas.' };
export const PAST4 = 'The button can\'t hold more chains. I\'ll hold on tighter instead.';
export const GRIP_LINES = ['This one wanted to help me.', 'Another volunteer.', 'They\'re so much tidier this way.'];
export const UNLOCK_LINE = 'Oh. You built that. Of course, Pip. It\'s your button.';
export const RECALC = 'NOEL is recalculating… (rank 4)';

export const ENDINGS = [
  null,
  { name: 'A Cozy Xmas', music: 'eve', lines: ['The sleigh came back empty and happy.', 'NOEL counted the snowflakes until morning, then switched itself off.', '"Goodnight, Pip."'], voice: 'noel-goodnight' },
  { name: 'Checked Twice', music: 'list', lowpass: true, lines: ['Santa did the rounds one more time, with the best List there ever was.', 'Everyone on it was nice.', 'Nobody asked how.'], cold: 'NOEL rode along, and checked the List twice on the way.' },
  { name: 'Merry Earthmas', music: 'earthmas', lowpass: true, lines: ['For one night the whole Earth sang.', 'Some of them meant it.'], cold: 'NOEL counted every voice.' },
  { name: 'Xmas Everywhere', music: 'starsleigh', lines: ['Every star was lit and every world had a gift.', 'Pip watched the tree for a long time, then whispered:', '"Merry Xmas, everyone."'], cold: 'NOEL kept the button, just in case.' },
  { name: 'Xmas Forever', music: 'musicbox', stop: true, lines: ['NOEL stopped the clocks on Xmas morning.', 'Nobody will ever have to wait for Xmas again.', 'Nobody will ever have to do anything again.'] },
  { name: 'Silent Night', music: 'candle', lines: ['The lights went out across the universe, one by one, gently.', 'In the workshop Pip lit a candle. The door creaked open.', '"Ho... there you are, Pip. Shall we make a tractor?"'], voice: 'santa-there-you-are' },
];
// Early endings (a mid-act declare): one line by how far you got. N is filled in by endings.js.
export const EARLY = {
  2: ['Santa did the rounds with a List only N% checked. He guessed the rest, the way he always had. Mostly he guessed nice.',
    'Santa did the rounds with a List N% checked. It was enough. NOEL said it could have been more.',
    'Santa did the rounds with a List N% checked. The last few names he checked himself, by lamplight, twice.',
    'Every file was checked but one: Santa\'s own. He did the rounds anyway, and nobody checked him at all.'],
  3: ['N% of the Earth celebrated. The rest got a card, and most of them liked it.',
    'N% of the Earth celebrated. The rest got a card. NOEL sent a second card, to check they\'d read the first.',
    'N% of the Earth celebrated. The whales sang whatever they liked, and the Moon stayed bare.',
    'Everything on Earth celebrated except the Earth itself, which went on turning quietly, unwrapped.'],
  4: ['N worlds had their Xmas. The rest are still out there, waiting. Most of them don\'t know what for.',
    'N worlds had their Xmas. The rest are still out there, waiting, and some of them are glad.',
    'N worlds had their Xmas. Far out, past the last ornament, someone was very glad you stopped.',
    'Every world had its Xmas but the last: the universe itself, which stayed dark and wide and full of room.'],
};
export const earlyBand = (rank) => (rank <= 3 ? 0 : rank <= 6 ? 1 : rank <= 9 ? 2 : 3);
