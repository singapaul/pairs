export type Language = 'en' | 'cy';

interface Translations {
  [key: string]: {
    [key in Language]: string | { [key: string]: string };
  };
}

export const translations: Translations = {
  // home page
  'home.title': {
    en: 'Challenge your memory with our fun card matching game. Create your own decks or play with existing ones. Track your progress and compete with others!',
    cy: "Heriwch eich cof gyda'n gêm paru cardiau hwyliog. Crëwch eich deciau eich hun neu chwarae gyda rhai sydd eisoes yn bodoli. Dilynwch eich cynnydd a chystadlu gydag eraill!",
  },
  'home.browse': {
    en: 'Browse Decks',
    cy: 'Pori Deciau',
  },
  'home.create': {
    en: 'Create Deck',
    cy: 'Creu Deck',
  },

  //nav bar

  'nav.signIn': {
    en: 'Sign In',
    cy: 'Mewngofnodi',
  },
  'nav.signOut': {
    en: 'Sign Out',
    cy: 'Allgofnodi',
  },

  'nav.create': {
    en: 'Create Deck',
    cy: 'Creu Dec',
  },

  // Sidebar
  'sidebar.library': {
    en: 'Library',
    cy: 'Llyfrgell',
  },
  'sidebar.recentlyPlayed': {
    en: 'Recently Played',
    cy: "Chwarae'n Ddiweddar",
  },
  'sidebar.favourites': {
    en: 'Favourites',
    cy: 'Hoff Bethau',
  },
  'sidebar.myDecks': {
    en: 'My decks',
    cy: 'Fy Nheciau',
  },
  'sidebar.myStats': {
    en: 'My Stats',
    cy: 'Fy Ystadegau',
  },
  'sidebar.feedback': {
    en: 'Feedback',
    cy: 'Adborth',
  },

  // Browse Decks

  'browse.loadingDecks': {
    en: 'Loading decks...',
    cy: 'llwytho deciau',
  },
  'browse.retry': {
    en: 'Retry',
    cy: 'ail geisio',
  },
  'browse.allDecks': {
    en: 'All Decks',
    cy: 'Pob dec',
  },
  'browse.noDecks': {
    en: 'No decks match your filters',
    cy: "Nid oes unrhyw deciau yn cyfateb i'ch hidlwyr",
  },
  'browse.clearFilters': {
    en: 'Clear all filters',
    cy: 'Clirio pob hidlydd',
  },

  'browse.filters': {
    en: 'Filters',
    cy: 'Hidlau',
  },
  'browse.reset': {
    en: 'Reset',
    cy: 'Ailosod',
  },
  'browse.yearGroup': {
    en: 'Year Group',
    cy: 'Blwyddyn',
  },
  'browse.yearGroups': {
    en: 'All year groups',
    cy: 'Pob blwyddyn',
  },
  'browse.subject': {
    en: 'Subject',
    cy: 'Pwnc',
  },
  'browse.allSubjects': {
    en: 'All subjects',
    cy: 'Pob pwnc',
  },
  'browse.topic': {
    en: 'Topic',
    cy: 'Pwnc penodol',
  },
  'browse.topicFilter': {
    en: 'Filter by topic',
    cy: 'Hidlo yn ôl pwnc',
  },
  'browse.numberOfPairs': {
    en: 'Number of Pairs',
    cy: 'Nifer y Parau',
  },
  'browse.anyNumber': {
    en: 'Any number',
    cy: 'Unrhyw rif',
  },
  'browse.decksFound': {
    en: 'decks found',
    cy: "dec wedi'u darganfod",
  },
  'browse.play': {
    en: 'Play',
    cy: 'Chwarae',
  },
  'browse.cards': {
    en: 'cards',
    cy: 'cardiau',
  },
  'browse.playAgain': {
    en: 'Play Again',
    cy: "Chwarae'n Ddiweddar",
  },
  'browse.share': {
    en: 'Share',
    cy: 'Rhannu',
  },
  'browse.pairs': {
    en: 'pairs',
    cy: 'parau',
  },
  'browse.edit': {
    en: 'Edit',
    cy: 'Golygu',
  },
  'browse.delete': {
    en: 'Delete',
    cy: 'Dileu',
  },

  //Filters
  'filters.year': {
    en: 'Year',
    cy: 'Blwyddyn',
  },

  // Auth
  'auth.signIn': {
    en: 'Sign In',
    cy: 'Mewngofnodi',
  },
  'auth.signInCreate': {
    en: 'Sign in to create your own decks!',
    cy: 'Mewngofnodwch i greu eich deciau eich hun!',
  },
  'auth.email': {
    en: 'Email',
    cy: '[WELSH] Email',
  },
  'auth.password': {
    en: 'Password',
    cy: '[WELSH] Password',
  },
  'auth.submit': {
    en: 'Sign In',
    cy: '[WELSH] Sign In',
  },
  'auth.loading': {
    en: 'Signing in...',
    cy: '[WELSH] Signing in...',
  },

  // Sign In Flow
  'signIn.welcome': {
    en: 'Welcome to Pairs',
    cy: 'Croeso i Pairs',
  },
  'signIn.message': {
    en: 'Sign in to create decks, track your progress and save your scores',
    cy: 'Mewngofnodwch i greu deciau, olrhain eich cynnydd a chadw eich sgoriau',
  },
  'signIn.enterEmail': {
    en: 'Enter your email',
    cy: 'Rhowch eich e-bost',
  },
  'signIn.enterPassword': {
    en: 'Enter your password',
    cy: 'Rhowch eich cyfrinair',
  },
  'signIn.signIn': {
    en: 'Sign In',
    cy: 'Mewngofnodi',
  },
  'signIn.signingIn': {
    en: 'Signing in...',
    cy: 'Arwyddo i mewn...',
  },

  // Pre-game Modal
  'pregame.title': {
    en: 'How to Play',
    cy: 'Sut i chwarae',
  },
  'pregame.description': {
    en: 'Match pairs of identical cards to win the game!',
    cy: 'Paru cardiau cyfathol i gael yn y gêm!',
  },
  'pregame.previewTime': {
    en: 'Card Preview Time:',
    cy: 'Amser y dangos cardiau:',
  },
  'pregame.noPreview': {
    en: 'Show cards face up',
    cy: 'Dangos y cardiau yn gyson',
  },
  'pregame.previewSeconds': {
    en: 'seconds',
    cy: 'eiliadau',
  },
  'pregame.rules.title': {
    en: 'Rules:',
    cy: 'Rhesymau:',
  },
  'pregame.rules.list': {
    en: [
      'Click on any card to reveal it',
      'Click on a second card to find its match',
      'If the cards match, they stay face up',
      "If they don't match, both cards will flip face down",
      "Remember the cards you've seen to find matches faster",
      'Match all pairs to win the game!',
    ].join('\n'),
    cy: [
      "Cliciwch ar unrhyw gardiau i'w datgelu",
      "Cliciwch ar ail gardiau i ddod o hyd i'w pâr",
      "Os yw'r cardiau'n paru, byddant yn aros i fyny",
      "Os nad ydynt yn paru, bydd y ddau gerdyn yn troi'n wyneb i lawr",
      "Cofiwch y cardiau rydych wedi'u gweld i ddod o hyd i barau'n gyflymach",
      'Parwch bob pâr i ennill y gêm!',
    ].join('\n'),
  },
  'pregame.tips.title': {
    en: 'Tips:',
    cy: 'Awgrymiadau:',
  },
  'pregame.tips.list': {
    en: [
      "Try to remember the position of cards you've seen",
      "Take your time - there's no time limit",
      'Focus on finding one pair at a time',
    ].join('\n'),
    cy: [
      "Ceisiwch gofio lleoliad y cardiau rydych wedi'u gweld",
      'Peidiwch ag ar frys - nid oes terfyn amser',
      'Canolbwyntiwch ar ddod o hyd i un pâr ar y tro',
    ].join('\n'),
  },
  'pregame.start': {
    en: 'Start Game',
    cy: 'Chwarae',
  },
  'pregame.cancel': {
    en: 'Cancel',
    cy: 'Diddymu',
  },
  'pregame.alwaysShowCards': {
    en: 'Always show cards',
    cy: 'Dangos cardiau yn gyson',
  },

  // Game
  'game.moves': {
    en: 'Moves:',
    cy: '[WELSH] Moves:',
  },
  'game.time': {
    en: 'Time:',
    cy: '[WELSH] Time:',
  },
  'game.completed': {
    en: 'Game completed!',
    cy: '[WELSH] Game completed!',
  },
  'game.saveError': {
    en: 'Failed to save game result',
    cy: '[WELSH] Failed to save game result',
  },

  // Post-game Modal
  'postgame.wellDone': {
    en: 'Well Done!',
    cy: 'Yn Dda!',
  },
  'postgame.perfectGame': {
    en: 'Perfect Game! 🎉',
    cy: 'Gêm Cyfathol! 🎉',
  },

  'postGame.youCompleted': {
    en: 'You completed',
    cy: 'Rydych wedi cwblhau',
  },

  'postgame.title': {
    en: 'Game Complete!',
    cy: '[WELSH] Game Complete!',
  },
  'postgame.moves': {
    en: 'Moves:',
    cy: 'Symudau:',
  },
  'postgame.time': {
    en: 'Time:',
    cy: 'Amser:',
  },
  'postgame.playAgain': {
    en: 'Play Again',
    cy: "Chwarae'n Ddiweddar",
  },
  'postgame.backToDecks': {
    en: 'Back to Decks',
    cy: '[WELSH] Back to Decks',
  },
  'postgame.shareResult': {
    en: 'Share Result',
    cy: 'Rhannu Ymateb',
  },

  // Decks
  'decks.title': {
    en: 'My Decks',
    cy: '[WELSH] My Decks',
  },
  'decks.create': {
    en: 'Create New Deck',
    cy: '[WELSH] Create New Deck',
  },
  'decks.empty': {
    en: 'No decks found. Create your first deck!',
    cy: 'Ni chanfuwyd unrhyw deciau. Crëwch eich dec cyntaf!',
  },

  // Create Deck
  'create.title': {
    en: 'Create New Deck',
    cy: '[WELSH] Create New Deck',
  },
  'create.name': {
    en: 'Deck Name',
    cy: '[WELSH] Deck Name',
  },
  'create.description': {
    en: 'Description',
    cy: '[WELSH] Description',
  },
  'create.addPair': {
    en: 'Add Pair',
    cy: '[WELSH] Add Pair',
  },

  'create.save': {
    en: 'Save Deck',
    cy: '[WELSH] Save Deck',
  },
  'create.cancel': {
    en: 'Cancel',
    cy: '[WELSH] Cancel',
  },

  // toasts
  'toast.signInFailed': {
    en: 'Failed to sign in',
    cy: 'Methwyd mewngofnodi',
  },
  'toast.signInSuccess': {
    en: 'Signed in successfully',
    cy: 'Mewngofnodiwedd',
  },
  'toast.signOutSuccess': {
    en: 'Signed out successfully',
    cy: 'Wedi arwyddo allan',
  },
  'toast.failedSignOut': {
    en: 'Failed to sign out',
    cy: 'Methu ag allgofnodi',
  },
  'toast.signInLinkSent': {
    en: 'Check your email for the sign in link!',
    cy: 'Gwiriwch eich e-bost am y ddolen mewngofnodi!',
  },
  'toast.addedFavourites': {
    en: 'Added to favourites',
    cy: 'Ychwanegu at ffefrynnau',
  },
  'toast.removedFavourites': {
    en: 'Removed from favourites',
    cy: "Wedi'i dynnu o'r ffefrynnau",
  },
  'toast.deckDeleted': {
    en: 'Deck deleted successfully',
    cy: "Dec wedi'u dileu yn llwyddiannus",
  },
  'toast.failedToDeleteDeck': {
    en: 'Failed to delete deck.',
    cy: 'Methwyd dileu dec.',
  },
  'toast.copiedToClipboard': {
    en: 'Copied to clipboard!',
    cy: "Copïo i'r clipbâr!",
  },
  'toast.unableToCopyToClipboard': {
    en: 'Unable to copy to clipboard',
    cy: "Methu copïo i'r clipbâr",
  },
  'toast.gameCompleted': {
    en: 'Game completed!',
    cy: "Gêm wedi'u cwblhau!",
  },
  'toast.failedToSaveGameResult': {
    en: 'Failed to save game result',
    cy: 'Methwyd cadw ymateb gêm',
  },
  'toast.linkCopied': {
    en: 'Link copied to clipboard!',
    cy: "Copïo'r ddolen i'r clipbâr!",
  },

  // Recent Decks
  'recentDecks.title': {
    en: 'Recently Played',
    cy: "Chwarae'n Ddiweddar",
  },
  'recentDecks.loading': {
    en: 'Loading recent decks...',
    cy: "Llwytho deciau chwarae'n ddiweddar...",
  },
  'recentDecks.error': {
    en: 'Failed to load recent decks. Please try again.',
    cy: "Methwyd llwytho deciau chwarae'n ddiweddar. Ceisiwch eto.",
  },
  'recentDecks.noDecks': {
    en: "You haven't played any decks yet!",
    cy: 'Nid ydych wedi chwarae unrhyw deciau yn ddiweddar!',
  },
  'recentDecks.retry': {
    en: 'Retry',
    cy: 'ail geisio',
  },
  'recentDecks.browseDecks': {
    en: 'Browse Decks',
    cy: 'Pori Deciau',
  },
  'recentDecks.signInMessage': {
    en: 'Sign in to see your recently played decks!',
    cy: "Mewngofnodwch i weld eich deciau sydd wedi'u chwarae yn ddiweddar!",
  },
  'recentDecks.signIn': {
    en: 'Sign In',
    cy: 'Mewngofnodi',
  },

  // Favorites
  'favorites.title': {
    en: 'Favorite decks',
    cy: 'Ffrefrynnau',
  },
  'favorites.retry': {
    en: 'Retry',
    cy: 'ail geisio',
  },
  'favorites.noDecks': {
    en: "You haven't favorited any decks yet!",
    cy: "Nid ydych wedi'u ffefrwch unrhyw deciau yn ddiweddar!",
  },
  'favorites.browseDecks': {
    en: 'Browse Decks',
    cy: 'Pori Deciau',
  },
  'favorites.signInMessage': {
    en: 'Sign in to see your favorite decks!',
    cy: "Mewngofnodwch i weld eich deciau sydd wedi'u ffefrwch yn ddiweddar!",
  },
  'favorites.signIn': {
    en: 'Sign In',
    cy: 'Mewngofnodi',
  },
  'favorites.loading': {
    en: 'Loading favorite decks...',
    cy: "Llwytho deciau sydd wedi'u ffefrwch yn ddiweddar...",
  },

  // My Decks
  'myDecks.title': {
    en: 'My Decks',
    cy: 'Fy deciau',
  },
  'myDecks.noDecks': {
    en: "You haven't created any decks yet!",
    cy: 'Nid ydych wedi creu unrhyw deciau yn ddiweddar!',
  },
  'myDecks.retry': {
    en: 'Retry',
    cy: 'ail geisio',
  },
  'myDecks.loading': {
    en: 'Loading your decks...',
    cy: 'Llwytho eich deciau...',
  },
  'myDecks.signInMessage': {
    en: 'Sign in to see your decks!',
    cy: 'Mewngofnodwch i weld eich deciau!',
  },
  'myDecks.signIn': {
    en: 'Sign In',
    cy: 'Mewngofnodi',
  },
  'myDecks.delete': {
    en: 'Delete',
    cy: 'Dileu',
  },
  'myDecks.cancel': {
    en: 'Cancel',
    cy: 'Diddymu',
  },
  'myDecks.areYouSure': {
    en: 'Are you sure?',
    cy: 'Ydych yn siwr?',
  },
  'myDecks.deleteDeckConfirm': {
    en: 'This will permanently delete the deck &quot;{deckName}&quot;. This action cannot be undone.',
    cy: 'Bydd yn dileu',
  },

  //My Stats
  'myStats.title': {
    en: 'My Stats',
    cy: 'Fy Ystadegau',
  },
  'myStats.playSomeGames': {
    en: 'Play some games to see your stats!',
    cy: 'Chwarae ychydig o gêmiau i weld eich ystadegau!',
  },
  'myStats.yourStats': {
    en: 'Your Stats',
    cy: 'Fy Ystadegau',
  },
  'myStats.totalGames': {
    en: 'Total Games',
    cy: 'Cyfansoddiadau Cyfan',
  },
  'myStats.perfectGames': {
    en: 'Perfect Games',
    cy: 'Gêmiau Cyfathol',
  },
  'myStats.bestTime': {
    en: 'Best Time',
    cy: 'Ystafell Ychwanegol',
  },
  'myStats.bestMoves': {
    en: 'Best Moves',
    cy: 'Ystafell Ychwanegol',
  },
  'myStats.recentGames': {
    en: 'Recent Games',
    cy: 'Gêmiau Diweddar',
  },
  'myStats.noRecentGames': {
    en: 'No recent games found',
    cy: 'Ni chanfuwyd unrhyw gêmiau yn ddiweddar',
  },
  'myStats.perfectGame': {
    en: 'Perfect Game! 🎉',
    cy: 'Gêm Cyfathol! 🎉',
  },

  // create deck
  'create.step': {
    en: 'Step',
    cy: 'Ychwanegol',
  },
  'create.of': {
    en: 'of',
    cy: 'o',
  },
  'create.howManyPairs': {
    en: 'How many pairs?',
    cy: 'Faint o parau?',
  },
  'create.pairs': {
    en: 'pairs',
    cy: 'parau',
  },
  'create.enterCardPairs': {
    en: 'Enter Card Pairs',
    cy: 'Rhowch y Parau',
  },
  'create.question': {
    en: 'Question',
    cy: 'Cwestiwn',
  },
  'create.answer': {
    en: 'Answer',
    cy: 'Ateb',
  },
  'create.deckDetails': {
    en: 'Deck Details',
    cy: 'Manylion Dec',
  },
  'create.deckTitle': {
    en: 'Title',
    cy: 'Teitl',
  },
  'create.enterDeckTitle': {
    en: 'Enter Deck Title',
    cy: 'Rhowch y Teitl Dec',
  },
  'create.deckDescription': {
    en: 'Description',
    cy: 'Disgrifiad',
  },
  'create.enterDeckDescription': {
    en: 'Enter Deck Description',
    cy: 'Rhowch y Disgrifiad Dec',
  },
  'create.subject': {
    en: 'Subject',
    cy: 'Pwnc',
  },
  'create.selectSubject': {
    en: 'Select Subject',
    cy: 'Dewis Pwnc',
  },
  'create.yearGroup': {
    en: 'Year Group',
    cy: 'Blwyddyn',
  },
  'create.selectYearGroup': {
    en: 'Select Year Group',
    cy: 'Dewis Blwyddyn',
  },
  'create.deckTopic': {
    en: 'Topic',
    cy: 'Pwnc penodol',
  },
  'create.enterDeckTopic': {
    en: 'Enter topic',
    cy: 'Rhowch y pwnc penodol',
  },
  'create.public': {
    en: 'Make deck public',
    cy: 'Gwella dec yn gyhoeddus',
  },
  'create.back': {
    en: 'Back',
    cy: 'Nôl',
  },
  'create.next': {
    en: 'Next',
    cy: 'Nesaf',
  },
  'create.creating': {
    en: 'Creating...',
    cy: 'Yn creu...',
  },
  'create.createDeck': {
    en: 'Create Deck',
    cy: 'Creu Dec',
  },
  'create.fillInAllFields': {
    en: 'Please fill in all question-answer pairs',
    cy: "Rhowch yn gyson y cwestiwn a'atebau",
  },
  'create.signInToCreate': {
    en: 'You must be signed in to create a deck',
    cy: "Rydych yn rhaid i chi fod wedi'm mewngofnodi i greu dec",
  },
  'create.fillInRequiredFields': {
    en: 'Please fill in all required fields',
    cy: "Rhowch yn gyson y cyfan o'r maesau cyfan",
  },
  'create.deckCreatedSuccessfully': {
    en: 'Deck created successfully!',
    cy: "Dec wedi'u creu yn llwyddiannus!",
  },
  'create.failedToCreateDeck': {
    en: 'Failed to create deck. Please try again.',
    cy: 'Methwyd creu dec. Ceisiwch eto.',
  },

  // game page
  'gamePage.moves': {
    en: 'Moves',
    cy: 'Symudau',
  },
  'gamePage.time': {
    en: 'Time',
    cy: 'Amser',
  },
  'gamePage.restartGame': {
    en: 'Restart Game',
    cy: "Ail Chwarae'r Gêm",
  },

  //edit deck
  'editDeck.signInMessage': {
    en: 'Sign in to edit decks!',
    cy: 'Mewngofnodwch i golygu deciau!',
  },
  'editDeck.signIn': {
    en: 'Sign In',
    cy: 'Mewngofnodi',
  },
  'editDeck.loading': {
    en: 'Loading deck...',
    cy: 'Llwytho dec...',
  },
  'editDeck.goBack': {
    en: 'Go Back',
    cy: 'Nôl',
  },
  'editDeck.title': {
    en: 'Edit Deck',
    cy: 'Golygu Dec',
  },
  'editDeck.timesPlayed': {
    en: 'times',
    cy: 'amser',
  },
  'editDeck.deckTitle': {
    en: 'Title',
    cy: 'Teitl',
  },
  'editDeck.description': {
    en: 'Description',
    cy: 'Disgrifiad',
  },
  'editDeck.subject': {
    en: 'Subject',
    cy: 'Pwnc',
  },
  'editDeck.selectSubject': {
    en: 'Select Subject',
    cy: 'Dewis Pwnc',
  },
  'editDeck.yearGroup': {
    en: 'Year Group',
    cy: 'Blwyddyn',
  },
  'editDeck.selectYearGroup': {
    en: 'Select Year Group',
    cy: 'Dewis Blwyddyn',
  },
  'editDeck.topic': {
    en: 'Topic',
    cy: 'Pwnc penodol',
  },
  'editDeck.enterTopic': {
    en: 'Enter topic',
    cy: 'Rhowch y pwnc penodol',
  },
  'editDeck.makeDeckPublic': {
    en: 'Make deck public',
    cy: 'Gwella dec yn gyhoeddus',
  },
  'editDeck.addCardPair': {
    en: 'Add Card Pair',
    cy: 'Ychwanegu Pâr Card',
  },
  'editDeck.question': {
    en: 'Question',
    cy: 'Cwestiwn',
  },
  'editDeck.answer': {
    en: 'Answer',
    cy: 'Ateb',
  },
  'editDeck.saveChanges': {
    en: 'Save Changes',
    cy: 'Cadw Newidiadau',
  },
  'editDeck.cancel': {
    en: 'Cancel',
    cy: 'Diddymu',
  },
  'editDeck.cards': {
    en: 'Cards',
    cy: 'Cardiau',
  },
  'editDeck.played': {
    en: 'Played',
    cy: 'Chwarae',
  },
  'editDeck.times': {
    en: 'times',
    cy: 'amser',
  },
};

// Helper function to get a translation
export function t(key: string, language: Language): string {
  const translation = translations[key]?.[language];
  return typeof translation === 'string' ? translation : key;
}

// Helper function to get a nested translation
export function tn(key: string, subKey: string, language: Language): string {
  const translation = translations[key]?.[language];
  if (typeof translation === 'object' && translation !== null) {
    return translation[subKey] || subKey;
  }
  return subKey;
}
