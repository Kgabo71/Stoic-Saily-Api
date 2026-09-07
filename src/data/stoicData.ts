import { ThemeOption, StoicQuote, StoicAuthor, DichotomyItem } from '../types';

export const THEMES: ThemeOption[] = [
  {
    id: 'theme-obsidian',
    name: 'Sophisticated Dark',
    subtitle: 'Obsidian & Antique Gold',
    isDark: true,
    previewBg: '#080808',
    previewAccent: '#B8860B',
    previewGlow: 'rgba(184, 134, 11, 0.35)',
    description: 'Deep #080808 obsidian canvas, #B8860B antique Roman gold radiance, hairline borders, and Georgia serif typography.'
  },
  {
    id: 'theme-marble',
    name: 'Marble Pantheon',
    subtitle: 'Classical Ivory & Gold',
    isDark: false,
    previewBg: '#f8f6f0',
    previewAccent: '#b45309',
    previewGlow: 'rgba(180, 83, 9, 0.25)',
    description: 'Polished Mediterranean limestone bathed in Greek morning sunlight.'
  },
  {
    id: 'theme-elysian',
    name: 'Athenian Midnight',
    subtitle: 'Celestial Cyan & Slate',
    isDark: true,
    previewBg: '#060911',
    previewAccent: '#06b6d4',
    previewGlow: 'rgba(6, 182, 212, 0.4)',
    description: 'Clear Aegean night sky under the tranquil guidance of the Logos.'
  },
  {
    id: 'theme-tyrian',
    name: 'Imperial Tyrian',
    subtitle: 'Royal Purple & Antique Brass',
    isDark: true,
    previewBg: '#0d0714',
    previewAccent: '#eab308',
    previewGlow: 'rgba(192, 132, 252, 0.45)',
    description: 'The purple robe Marcus Aurelius wore, reminding himself it is merely dyed sheep\'s wool.'
  },
  {
    id: 'theme-cypress',
    name: 'Cypress Grove',
    subtitle: 'Aegean Jade & Laurel',
    isDark: true,
    previewBg: '#07100b',
    previewAccent: '#10b981',
    previewGlow: 'rgba(16, 185, 129, 0.4)',
    description: 'Walking beneath the ancient pines and olive trees of the original Painted Porch (Stoa Poikile).'
  },
  {
    id: 'theme-parchment',
    name: 'Papyrus & Clay',
    subtitle: 'Aged Scroll & Terracotta',
    isDark: false,
    previewBg: '#f4ede2',
    previewAccent: '#c2410c',
    previewGlow: 'rgba(194, 65, 12, 0.25)',
    description: 'The warmth of ancient library scrolls, ink, and earthen Roman oil lamps.'
  }
];

export const STOIC_AUTHORS: StoicAuthor[] = [
  {
    id: 'marcus-aurelius',
    name: 'Marcus Aurelius',
    era: '121 – 180 CE',
    title: 'The Philosopher Emperor',
    openLibraryKey: 'OL26783A',
    bio: 'Roman Emperor and the last of the "Five Good Emperors". In the solitude of military encampments along the Danube, he penned Meditations as private notes to himself on duty, mortality, and virtue.',
    portraitCoverId: 10427320,
    famousWorks: ['Meditations', 'The Thoughts of the Emperor M. Aurelius Antoninus', 'The Emperor\'s Handbook']
  },
  {
    id: 'seneca',
    name: 'Lucius Annaeus Seneca',
    era: 'c. 4 BCE – 65 CE',
    title: 'The Roman Statesman & Playwright',
    openLibraryKey: 'OL138982A',
    bio: 'Statesman, playwright, and wealthy Roman senator who endured exile, political intrigue, and terminal drama, while composing deeply humane letters on time, friendship, and calm perseverance.',
    portraitCoverId: 8231998,
    famousWorks: ['Letters from a Stoic (Epistulae Morales)', 'On the Shortness of Life', 'On Anger', 'Of Peace of Mind']
  },
  {
    id: 'epictetus',
    name: 'Epictetus',
    era: 'c. 50 – c. 135 CE',
    title: 'The Freed Slave & Teacher',
    openLibraryKey: 'OL138983A',
    bio: 'Born a slave in Hierapolis (modern Turkey), Epictetus survived physical cruelty and exile to establish the famous philosophical school in Nicopolis. He taught that freedom is strictly an internal condition.',
    portraitCoverId: 6994112,
    famousWorks: ['Enchiridion (The Manual)', 'Discourses of Epictetus', 'The Art of Living']
  },
  {
    id: 'zeno-citium',
    name: 'Zeno of Citium',
    era: 'c. 334 – c. 262 BCE',
    title: 'The Founder of the Stoa',
    openLibraryKey: 'OL1804961A',
    bio: 'After losing all his wealth in a shipwreck off the coast of Attica, Zeno famously exclaimed: "Fortune bids me to be a less encumbered philosopher." He began teaching on the Painted Porch in Athens.',
    famousWorks: ['Republic of Zeno', 'On Life According to Nature']
  },
  {
    id: 'musonius-rufus',
    name: 'Gaius Musonius Rufus',
    era: 'c. 30 – c. 100 CE',
    title: 'The Roman Socrates',
    openLibraryKey: 'OL477038A',
    bio: 'Mentor to Epictetus, exiled three times by Roman emperors for speaking truth to tyrannical power. He insisted on philosophical vegetarianism, physical endurance, and full intellectual equality for women.',
    famousWorks: ['Lectures and Sayings', 'That Women Too Should Study Philosophy']
  }
];

export function getDayOfYear(date: Date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime() + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

export const STOIC_QUOTES: StoicQuote[] = [
  {
    id: 'quote-4',
    text: 'Waste no more time arguing about what a good man should be. Be one.',
    author: 'Marcus Aurelius',
    work: 'Meditations, Book X',
    discipline: 'action',
    conceptGreek: 'Ἀρετή (Aretē)',
    conceptEnglish: 'Moral Excellence & Virtue in Action',
    reflectionPrompt: 'How can you replace theoretical debate today with a direct, selfless act of service or honesty?',
    context: 'Marcus reminding himself during the Marcomannic Wars that theorizing ethics is useless without living them.',
    openLibraryEdition: 'OL6741753M',
    era: '161 AD'
  },
  {
    id: 'quote-1',
    text: 'You have power over your mind — not outside events. Realize this, and you will find strength.',
    author: 'Marcus Aurelius',
    work: 'Meditations, Book IV.3',
    discipline: 'perception',
    conceptGreek: 'Ἡγεμονικόν (Hēgemonikon)',
    conceptEnglish: 'The Ruling Faculty of the Mind',
    reflectionPrompt: 'What external circumstance is testing your peace today? Where can you withdraw your judgment from it?',
    context: 'Written by Marcus while dealing with treacherous generals and a deadly Antonine plague.',
    openLibraryEdition: 'OL24213788M',
    era: '170 AD'
  },
  {
    id: 'quote-2',
    text: 'We suffer more often in imagination than in reality.',
    author: 'Seneca',
    work: 'Moral Letters to Lucilius, Letter XIII',
    discipline: 'perception',
    conceptGreek: 'Πρόληψις (Prolēpsis)',
    conceptEnglish: 'Anticipated Anxiety vs Present Reality',
    reflectionPrompt: 'Is the future disaster you are dreading certain, or is your mind merely painting ghosts in the fog?',
    context: 'Seneca writing to calm his friend Lucilius, who was anxiously awaiting a political trial.',
    openLibraryEdition: 'OL13518296M',
    era: '65 AD'
  },
  {
    id: 'quote-3',
    text: 'Some things are in our control and others not. Things in our control are opinion, pursuit, desire, aversion, and, in a word, whatever are our own actions.',
    author: 'Epictetus',
    work: 'Enchiridion, Chapter 1',
    discipline: 'will',
    conceptGreek: 'Ἐφ\' ἡμῖν (Eph\' hēmin)',
    conceptEnglish: 'The Dichotomy of Control',
    reflectionPrompt: 'Divide your current to-do list: Which single item is completely within your power right now?',
    context: 'The opening axiom of the entire Stoic operating system.',
    openLibraryEdition: 'OL7095754M',
    era: '125 AD'
  },
  {
    id: 'quote-5',
    text: 'It is not that we have a short time to live, but that we waste a lot of it. Life is long enough, and a sufficiently generous estimate has been given to us for the highest achievements if it were all well invested.',
    author: 'Seneca',
    work: 'On the Shortness of Life, I',
    discipline: 'action',
    conceptGreek: 'Memento Mori',
    conceptEnglish: 'Remember You Must Die (Cherish Present Time)',
    reflectionPrompt: 'If this hour were your final hour of work, how would you direct your attention?',
    context: 'Dedicated to his father-in-law Paulinus, warning him against letting trivial administrative chores consume his lifespan.',
    openLibraryEdition: 'OL15438902W',
    era: '49 AD'
  },
  {
    id: 'quote-6',
    text: 'Do not seek for things to happen the way you want them to; rather, wish that what happens happens the way it happens: then you will be happy.',
    author: 'Epictetus',
    work: 'Enchiridion, Chapter 8',
    discipline: 'will',
    conceptGreek: 'Amor Fati',
    conceptEnglish: 'Love of One\'s Fate',
    reflectionPrompt: 'What unexpected obstacle occurred yesterday that you can choose to embrace as useful fuel?',
    context: 'Epictetus was physically crippled from slavery, yet viewed his limp as an external indifference.',
    openLibraryEdition: 'OL66749W',
    era: '125 AD'
  },
  {
    id: 'quote-7',
    text: 'The impediment to action advances action. What stands in the way becomes the way.',
    author: 'Marcus Aurelius',
    work: 'Meditations, Book V.20',
    discipline: 'action',
    conceptGreek: 'Ὑπεξαίρεσις (Hypexairesis)',
    conceptEnglish: 'The Reserve Clause',
    reflectionPrompt: 'Can the current friction in your path be converted into an exercise in patience, creativity, or courage?',
    context: 'Reflecting on rebellious provinces and uncooperative senators.',
    openLibraryEdition: 'OL12345W',
    era: '175 AD'
  },
  {
    id: 'quote-8',
    text: 'No person has the power to have everything they want, but it is in their power not to want what they haven\'t got, and cheerfully put to good use what they have.',
    author: 'Seneca',
    work: 'Moral Letters to Lucilius, Letter CXXIII',
    discipline: 'will',
    conceptGreek: 'Αὐτάρκεια (Autarkeia)',
    conceptEnglish: 'Self-Sufficiency & Contentment',
    reflectionPrompt: 'What possession or privilege are you chasing that you can happily declare unnecessary today?',
    context: 'Warning against the luxurious consumption of Nero\'s Roman court.',
    openLibraryEdition: 'OL15438865W',
    era: '64 AD'
  },
  {
    id: 'quote-9',
    text: 'Never say about anything, \'I have lost it,\' but only, \'I have returned it.\' Has your child died? It is returned. Has your wife died? She is returned. Has your estate been taken? It is returned.',
    author: 'Epictetus',
    work: 'Enchiridion, Chapter 11',
    discipline: 'perception',
    conceptGreek: 'Ἀπάθεια (Apatheia)',
    conceptEnglish: 'Freedom from Destructive Passions',
    reflectionPrompt: 'What blessing are you treating as an eternal right, rather than a temporary loan from nature?',
    context: 'Teaching students to see mortal attachments through cosmic perspective.',
    openLibraryEdition: 'OL66749W',
    era: '125 AD'
  },
  {
    id: 'quote-10',
    text: 'When you wake up in the morning, tell yourself: The people I deal with today will be meddling, ungrateful, arrogant, dishonest, jealous, and surly. They are like this because they cannot distinguish good from evil.',
    author: 'Marcus Aurelius',
    work: 'Meditations, Book II.1',
    discipline: 'action',
    conceptGreek: 'Προμελετᾶν (Premeditatio Malorum)',
    conceptEnglish: 'Premeditation of Evils & Compassion',
    reflectionPrompt: 'How will you protect your serenity when someone cuts you off, criticizes you, or fails to thank you today?',
    context: 'The classic morning preparation drill of Roman imperial leadership.',
    openLibraryEdition: 'OL12345W',
    era: '165 AD'
  },
  {
    id: 'quote-11',
    text: 'He who fears death will never do anything worthy of a man who is alive.',
    author: 'Seneca',
    work: 'Moral Letters to Lucilius, Letter LXX',
    discipline: 'will',
    conceptGreek: 'Φόβος Θανάτου',
    conceptEnglish: 'Overcoming the Dread of Mortality',
    reflectionPrompt: 'What bold, honest, or compassionate initiative are you postponing out of fear of failure or criticism?',
    context: 'Seneca contemplating his own precarious standing during the tyrannical reign of Nero.',
    openLibraryEdition: 'OL15438865W',
    era: '63 AD'
  },
  {
    id: 'quote-12',
    text: 'Don\'t explain your philosophy. Embody it.',
    author: 'Epictetus',
    work: 'Enchiridion, Chapter 46',
    discipline: 'action',
    conceptGreek: 'Ἔργον (Ergon)',
    conceptEnglish: 'Demonstration Through Conduct',
    reflectionPrompt: 'Where can you show restraint, calm, or kindness in silence today without bragging about it?',
    context: 'Epictetus warning students not to parade philosophical jargon at Roman dinner parties.',
    openLibraryEdition: 'OL66749W',
    era: '125 AD'
  },
  {
    id: 'quote-13',
    text: 'Dwell on the beauty of life. Watch the stars, and see yourself running with them.',
    author: 'Marcus Aurelius',
    work: 'Meditations, Book VII.47',
    discipline: 'perception',
    conceptGreek: 'Συμπάθεια (Sympatheia)',
    conceptEnglish: 'Cosmic Perspective & Interconnectedness',
    reflectionPrompt: 'Look up at the sky or a tree today. How does the vastness of the universe put your immediate worries into proportion?',
    context: 'Marcus cultivating awe and perspective amidst grueling military campaigns.',
    openLibraryEdition: 'OL12345W',
    era: '172 AD'
  },
  {
    id: 'quote-14',
    text: 'If anyone can refute me—show me I am making a mistake or looking at things from the wrong perspective—I will gladly change. What I seek is the truth, which never harmed anyone. What harms us is to persist in self-deceit and ignorance.',
    author: 'Marcus Aurelius',
    work: 'Meditations, Book VI.21',
    discipline: 'perception',
    conceptGreek: 'Ἀλήθεια (Aletheia)',
    conceptEnglish: 'Devotion to Objective Truth',
    reflectionPrompt: 'Are you clinging to being "right" in an argument, or are you genuinely open to the truth?',
    context: 'Marcus examining his own cognitive biases as absolute ruler of the Mediterranean world.',
    openLibraryEdition: 'OL12345W',
    era: '171 AD'
  },
  {
    id: 'quote-15',
    text: 'Associate with people who are likely to improve you. Welcome those whom you are capable of improving. The process is mutual: men learn as they teach.',
    author: 'Seneca',
    work: 'Moral Letters to Lucilius, Letter VII',
    discipline: 'action',
    conceptGreek: 'Κοινωνία (Koinonia)',
    conceptEnglish: 'Mutual Fellowship & Noble Friendship',
    reflectionPrompt: 'Who in your circle elevates your standards, and whose bad habits are you unconsciously adopting?',
    context: 'Seneca warning against spending idle hours amidst the mob at the Roman gladiatorial arena.',
    openLibraryEdition: 'OL15438865W',
    era: '62 AD'
  },
  {
    id: 'quote-16',
    text: 'First say to yourself what you would be; and then do what you have to do.',
    author: 'Epictetus',
    work: 'Discourses, Book III.23',
    discipline: 'will',
    conceptGreek: 'Προαίρεσις (Prohairesis)',
    conceptEnglish: 'Moral Character & Deliberate Purpose',
    reflectionPrompt: 'What kind of human being do you choose to be today before stepping into your first conversation?',
    context: 'Addressing youths who sought superficial eloquence rather than deep character formation.',
    openLibraryEdition: 'OL138983A',
    era: '108 AD'
  }
];

export const INITIAL_DICHOTOMY_ITEMS: DichotomyItem[] = [
  {
    id: 'd-1',
    title: 'Your core values, honesty, and intentions',
    description: 'How you choose to speak, judge, and act in any moment.',
    category: 'control',
    explanation: 'Epictetus states that our volition (Prohairesis) is the only realm where we hold total, sovereign jurisdiction.'
  },
  {
    id: 'd-2',
    title: 'What other people say or think about you',
    description: 'Reputation, office gossip, social media comments, and family opinions.',
    category: 'no_control',
    explanation: 'Other people\'s opinions belong to their minds, not yours. Chasing approval makes you their hostage.'
  },
  {
    id: 'd-3',
    title: 'How hard you prepare for a presentation or interview',
    description: 'Your research, rehearsal, attention to detail, and punctuality.',
    category: 'control',
    explanation: 'The effort, diligence, and focus invested are entirely within your sphere of action.'
  },
  {
    id: 'd-4',
    title: 'Whether you actually get hired or praised',
    description: 'The final decision of the board, client, or committee.',
    category: 'no_control',
    explanation: 'Like an archer, you can aim the arrow with perfect technique, but once released, the wind and target determine the hit.'
  },
  {
    id: 'd-5',
    title: 'Past mistakes and past events',
    description: 'Events that took place yesterday, last year, or 10 years ago.',
    category: 'no_control',
    explanation: 'The past is fixed and unchangeable. Stoics accept it with Amor Fati and focus only on the immediate present.'
  },
  {
    id: 'd-6',
    title: 'Your physiological response vs conscious reaction',
    description: 'The conscious breath and measured words you choose after feeling a surge of irritation.',
    category: 'control',
    explanation: 'The initial flash (propatheia) is involuntary, but whether you assent (synkatathesis) to rage is your choice.'
  },
  {
    id: 'd-7',
    title: 'Flight delays, traffic jams, and bad weather',
    description: 'External friction caused by nature, machinery, or strangers.',
    category: 'no_control',
    explanation: 'Complaining about rain does not dry the clouds. Adapting your schedule with cheerfulness is your virtue.'
  },
  {
    id: 'd-8',
    title: 'The kindness and justice you show to someone hostile',
    description: 'Choosing not to retaliate with insult when provoked.',
    category: 'control',
    explanation: 'Marcus: "The best revenge is to not be like your enemy."'
  }
];

export const VIRTUES = [
  {
    name: 'Wisdom',
    greek: 'Σοφία (Sophia / Phronesis)',
    description: 'Navigating complex situations in a logical, informed, and calm manner.',
    color: '#06b6d4'
  },
  {
    name: 'Courage',
    greek: 'Ἀνδρεία (Andreia)',
    description: 'Facing daily fear, standing up for truth, and enduring hardship without despair.',
    color: '#f59e0b'
  },
  {
    name: 'Justice',
    greek: 'Δικαιοσύνη (Dikaiosyne)',
    description: 'Treating all humans with fairness, honesty, and recognizing our universal fellowship.',
    color: '#c084fc'
  },
  {
    name: 'Temperance',
    greek: 'Σωφροσύνη (Sophrosyne)',
    description: 'Voluntary self-restraint, moderation, and mastery over destructive appetites.',
    color: '#10b981'
  }
];
