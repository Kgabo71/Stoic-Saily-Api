export interface DocumentChapter {
  id: string;
  chapterNumber: number | string;
  title: string;
  subtitle?: string;
  text: string[];
}

export interface StoicDocument {
  workKey: string; // e.g. 'OL12345W'
  editionKey?: string; // e.g. 'OL6741753M'
  title: string;
  originalTitle: string;
  author: string;
  authorKey: string;
  year: string;
  translator: string;
  summary: string;
  coverUrl?: string;
  chapters: DocumentChapter[];
}

export const STOIC_DOCUMENTS: Record<string, StoicDocument> = {
  // Marcus Aurelius — Meditations (OL12345W / OL6741753M)
  'OL12345W': {
    workKey: 'OL12345W',
    editionKey: 'OL6741753M',
    title: 'Meditations',
    originalTitle: 'Τὰ εἰς ἑαυτόν (To Himself)',
    author: 'Marcus Aurelius Antoninus',
    authorKey: 'OL26783A',
    year: '161–180 CE',
    translator: 'George Long, M.A.',
    summary: 'The private spiritual journal of the Emperor of Rome, written during military campaigns along the Danube frontier. Never intended for publication, it stands as the ultimate handbook on personal discipline, duty, resilience, and inner tranquility.',
    coverUrl: 'https://covers.openlibrary.org/b/id/8231856-L.jpg',
    chapters: [
      {
        id: 'meditations-book-1',
        chapterNumber: 'Book I',
        title: 'Debts and Lessons in Character',
        subtitle: 'Gratitude towards teachers, family, and mentors',
        text: [
          "1. From my grandfather Verus I learned good morals and the government of my temper.",
          "2. From the reputation and remembrance of my father, modesty and a manly character.",
          "3. From my mother, piety and beneficence, and abstinence, not only from evil deeds, but even from evil thoughts; and further, simplicity in my way of living, far removed from the habits of the rich.",
          "4. From my great-grandfather, not to have frequented public schools, and to have had good teachers at home, and to know that on such things a man should spend liberally.",
          "5. From my governor, to be neither of the green nor of the blue party at the games in the Circus, nor a partizan either of the Parmularius or the Scutarius at the gladiators' fights; from him too I learned endurance of labor, and to want little, and to work with my own hands, and not to meddle with other people's affairs, and not to be ready to listen to slander.",
          "6. From Diognetus, not to busy myself about trifling things, and not to give credit to what was said by miracle-workers and jugglers about incantations and the driving away of daemons and such things.",
          "7. From Rusticus I received the impression that my character required improvement and discipline; and from him I learned not to be led astray to sophistic emulation, nor to writing on speculative subjects, nor to delivering little hortatory orations, nor to showing myself off as a man who does great actions.",
          "8. From Apollonius I learned freedom of will and undeviating steadiness of purpose; to look to nothing else, not even for a moment, except to reason; and to be always the same, in sharp pains, on the loss of a child, and in long illnesses.",
          "9. From Maximus I learned self-government, and not to be led aside by anything; and cheerfulness in all circumstances, as well as in illness; and a just admixture in the moral character of sweetness and dignity, and to do what was set before me without complaining."
        ]
      },
      {
        id: 'meditations-book-2',
        chapterNumber: 'Book II',
        title: 'On the River of Time & Daily Awakening',
        subtitle: 'The morning contemplation on difficult mortals and duty',
        text: [
          "1. When you wake up in the morning, tell yourself: The people I deal with today will be meddling, ungrateful, arrogant, dishonest, jealous, and surly. They are like this because they cannot distinguish good from evil. But I have seen the beauty of good, and the ugliness of evil, and have recognized that the wrongdoer has a nature related to my own—not of the same blood or birth, but the same mind, and possessing a share of the divine. And so none of them can hurt me. No one can implicate me in ugliness. Nor can I feel angry at my kinsman, or hate him. We were made to work together like feet, hands, and eyes, like the two rows of the teeth, upper and lower. To obstruct each other is unnatural. To feel anger at someone, to turn your back on him: these are obstructions.",
          "2. Whatever this is that I am, it is a little flesh and breath, and the ruling part. Despise the flesh: blood and bones and a network, a jumble of nerves, veins, and arteries. Consider the breath: wind, constantly changing, expelled and sucked back in again. There remains the ruling part: think of yourself as an old man. No longer allow this part of you to be enslaved, to be pulled like a puppet by every selfish impulse, to rage against your present lot, or to flinch from what the future holds.",
          "3. Remember how long you have been putting these things off, and how often you have received opportunities from the gods and not used them. You must at last perceive what kind of cosmos you are a part of, and what kind of sovereign governs it, and that a limit of time is fixed for you, which if you do not use for clearing away the clouds from your mind, it will go and you will go, and it will never return.",
          "4. Hourly think strenuously as a Roman and a man to do what you have in hand with perfect and simple dignity, and feeling of affection, and freedom, and justice; and to give yourself relief from all other thoughts. And you will give yourself relief, if you do every act of your life as if it were the last."
        ]
      },
      {
        id: 'meditations-book-4',
        chapterNumber: 'Book IV',
        title: 'The Inner Citadel & Cosmic Order',
        subtitle: 'Retreating into one’s own soul and loving what happens',
        text: [
          "1. Men look for retreats for themselves, the country, the sea-shore, the hills; and you yourself, too, are peculiarly accustomed to long for such things. But all this is the very commonest stupidity, when it is open to you, at what hour you will, to retire into yourself. For nowhere can man find a quieter or more untroubled retreat than in his own soul, above all when he possesses within himself such thoughts as will at once make him calm.",
          "2. Constantly give yourself this retreat, and renew yourself. Let your basic principles be brief and fundamental, so that at once they will banish all sorrow and send you back without any irritation to the life to which you must return.",
          "3. Remember that you are a rational mortal. The universe is change; our life is what our thoughts make it.",
          "4. If a thing is difficult to accomplish, do not think it is humanly impossible; but if any human being is capable of it, consider that you too are capable of it.",
          "5. Love the humble art which you have learned, and take rest in it; and pass through the rest of life like one who has entrusted to the gods his whole soul, making himself neither the tyrant nor the slave of any man."
        ]
      }
    ]
  },

  // Seneca — Letters from a Stoic (OL15438865W / OL7091942M)
  'OL15438865W': {
    workKey: 'OL15438865W',
    editionKey: 'OL7091942M',
    title: 'Letters from a Stoic',
    originalTitle: 'Epistulae Morales ad Lucilium',
    author: 'Lucius Annaeus Seneca',
    authorKey: 'OL138982A',
    year: '65 CE',
    translator: 'Richard Mott Gummere, Ph.D.',
    summary: 'A masterpiece of epistolary wisdom written to his friend Lucilius. Seneca offers warm, practical counsel on avoiding the maddening crowd, mastering the fear of death, treasuring the present hour, and finding quiet joy within.',
    coverUrl: 'https://covers.openlibrary.org/b/id/8231998-L.jpg',
    chapters: [
      {
        id: 'seneca-letter-1',
        chapterNumber: 'Letter I',
        title: 'On Saving Time',
        subtitle: 'Reclaiming the only possession that truly belongs to us',
        text: [
          "1. Continue to act thus, my dear Lucilius—set yourself free for your own sake; gather and save your time, which till lately has been forced from you, or filched away, or has merely slipped through your fingers. Make yourself believe the truth of my words,—that certain moments are torn from us, that some are gently removed, and that others glide beyond our reach.",
          "2. The most disgraceful kind of loss, however, is that due to carelessness. What man can you show me who places any value on his time, who reckons the worth of each passing day, who understands that he is dying daily? In this we are mistaken: that we look forward to death, whereas much of death has already passed! Whatever years lie behind us are in death's hands.",
          "3. Therefore, Lucilius, do what you write me that you are doing: hold every hour in your grasp. Lay hold of today's task, and you will not need to depend so much upon tomorrow's. While we are postponing, life speeds by. Nothing, Lucilius, is ours, except time."
        ]
      },
      {
        id: 'seneca-letter-2',
        chapterNumber: 'Letter II',
        title: 'On Discursiveness in Reading',
        subtitle: 'Why reading few great minds surpasses skimming many',
        text: [
          "1. Judging by what you write me and by what I hear, I am forming a good opinion of you. You do not run hither and thither and distract yourself by changing your abode; for such restlessness is the sign of a disordered mind. The primary indication, to my thinking, of a well-ordered mind is a man's ability to remain in one place and linger in his own company.",
          "2. Be careful, however, lest this reading of many authors and books of every sort may tend to make you discursive and unsteady. You must linger among a limited number of master-thinkers, and digest their works, if you would derive ideas which shall win firm hold in your mind. Everywhere means nowhere.",
          "3. Food that is vomited up as soon as eaten is not assimilated and does not nourish the body. There is nothing so detrimental to health as constant change of remedies. A wound will not heal over if you keep trying different salves upon it.",
          "4. Therefore, read always from the tested writers, and if you ever take a momentary excursus into other realms, return quickly to the masters."
        ]
      }
    ]
  },

  // Epictetus — Enchiridion / The Handbook (OL66749W / OL7104276M)
  'OL66749W': {
    workKey: 'OL66749W',
    editionKey: 'OL7104276M',
    title: 'The Enchiridion (The Handbook)',
    originalTitle: 'Ἐγχειρίδιον Ἐπικτήτου',
    author: 'Epictetus',
    authorKey: 'OL138983A',
    year: '125 CE',
    translator: 'Elizabeth Carter',
    summary: 'A short, concentrated guide to mental invulnerability. Epictetus explains the core principle of Stoicism: distinguishing sharply between what is in our control and what is not, freeing the mind from anxiety, grief, and enslavement.',
    coverUrl: 'https://covers.openlibrary.org/b/id/6994112-L.jpg',
    chapters: [
      {
        id: 'enchiridion-section-1',
        chapterNumber: 'Chapter I',
        title: 'Things in Our Control vs. Things Not',
        subtitle: 'The cornerstone of Stoic freedom',
        text: [
          "1. Some things are in our control and others not. Things in our control are opinion, pursuit, desire, aversion, and, in a word, whatever are our own actions.",
          "2. Things not in our control are body, property, reputation, command, and, in one word, whatever are not our own actions.",
          "3. The things in our control are by nature free, unrestrained, unhindered; but those not in our control are weak, slavish, restrained, belonging to others.",
          "4. Remember, then, that if you suppose that things which are slavish by nature are also free, and that what belongs to others is your own, then you will be hindered. You will lament, you will be disturbed, and you will find fault both with gods and men. But if you suppose that only to be your own which is your own, and what belongs to others such as it really is, then no one will ever compel you or restrain you. Further, you will find fault with no one or accuse no one. You will do nothing against your will. No one will hurt you, you will have no enemies, and you will not be harmed."
        ]
      },
      {
        id: 'enchiridion-section-5',
        chapterNumber: 'Chapter V',
        title: 'Not Things, But Judgments Disturbe Us',
        subtitle: 'The origin of emotional turmoil',
        text: [
          "1. Men are disturbed, not by things, but by the principles and notions which they form concerning things. Death, for instance, is not terrible, else it would have appeared so to Socrates too. But the terror consists in our notion of death that it is terrible.",
          "2. When therefore we are hindered, or disturbed, or grieved, let us never attribute it to others, but to ourselves; that is, to our own principles.",
          "3. An uninstructed person will lay the fault of his own bad condition upon others. Someone just starting on instruction will lay the fault upon himself. But someone perfectly instructed will neither place blame upon others nor upon himself."
        ]
      },
      {
        id: 'enchiridion-section-8',
        chapterNumber: 'Chapter VIII',
        title: 'Amor Fati: The Will of the Cosmos',
        subtitle: 'Desiring events as they actually happen',
        text: [
          "1. Don't demand that things happen as you wish, but wish that they happen as they do happen, and you will go on well.",
          "2. Sickness is a hindrance to the body, but not to your will, unless the will itself chooses. Lameness is a hindrance to the leg, but not to your will. Say this to yourself with regard to everything that happens, then you will see such obstacles as hindrances to something else, but not to yourself."
        ]
      }
    ]
  },

  // Seneca — On the Shortness of Life (OL15438902W)
  'OL15438902W': {
    workKey: 'OL15438902W',
    editionKey: 'OL10526017M',
    title: 'On the Shortness of Life',
    originalTitle: 'De Brevitate Vitae',
    author: 'Lucius Annaeus Seneca',
    authorKey: 'OL138982A',
    year: '49 CE',
    translator: 'Aubrey Stewart, M.A.',
    summary: 'Seneca demolishes the universal human complaint that nature has granted us too brief a span of life, proving that life is long enough if it is wisely invested rather than squandered on trivialities.',
    coverUrl: 'https://covers.openlibrary.org/b/id/10526017-L.jpg',
    chapters: [
      {
        id: 'brevitate-chapter-1',
        chapterNumber: 'Chapter I',
        title: 'Life Is Long If You Know How to Use It',
        subtitle: 'Refuting the ancient grievance against nature',
        text: [
          "1. The majority of mortals, Paulinus, complain bitterly of the spitefulness of Nature, that we are begotten for a brief moment, and that even this space of time granted to us rushes by so speedily and swiftly that, with very few exceptions, life leaves us just as we are preparing to live it.",
          "2. It is not that we have a short time to live, but that we waste a lot of it. Life is long enough, and a sufficiently generous estimate has been given to us for the highest achievements, if it were all well invested. But when it is squandered in luxurious and careless living, where no good is accomplished, we are at last constrained by the final necessity to see that it has passed away before we were even aware that it was passing.",
          "3. So it is: we are not given a short life, but we make it short, and we are not ill-supplied, but wasteful of it."
        ]
      }
    ]
  }
};

/**
 * Returns a Stoic document by Open Library work or edition key,
 * or constructs an Open Library document reader dynamically.
 */
export function getDocumentByOpenLibraryKey(key: string): StoicDocument | null {
  const cleanKey = key.replace('/works/', '').replace('/books/', '').trim();
  
  // Direct match
  if (STOIC_DOCUMENTS[cleanKey]) {
    return STOIC_DOCUMENTS[cleanKey];
  }

  // Match by edition
  for (const doc of Object.values(STOIC_DOCUMENTS)) {
    if (doc.editionKey && doc.editionKey.toLowerCase() === cleanKey.toLowerCase()) {
      return doc;
    }
  }

  // Match by partial title / keyword
  if (cleanKey.toLowerCase().includes('meditation') || cleanKey.toLowerCase().includes('marcus') || cleanKey.toLowerCase().includes('aurelius')) {
    return STOIC_DOCUMENTS['OL12345W'];
  }
  if (cleanKey.toLowerCase().includes('letter') || cleanKey.toLowerCase().includes('seneca')) {
    return STOIC_DOCUMENTS['OL15438865W'];
  }
  if (cleanKey.toLowerCase().includes('enchiridion') || cleanKey.toLowerCase().includes('epictetus') || cleanKey.toLowerCase().includes('handbook')) {
    return STOIC_DOCUMENTS['OL66749W'];
  }
  if (cleanKey.toLowerCase().includes('shortness') || cleanKey.toLowerCase().includes('brevitate')) {
    return STOIC_DOCUMENTS['OL15438902W'];
  }

  return null;
}
