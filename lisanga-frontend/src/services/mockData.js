import { API_DELAY } from '../utils/constants';
import { generateExcerpt } from '../utils/formatters';

export const delay = (ms = API_DELAY) => new Promise(resolve => setTimeout(resolve, ms));

export const mockUsers = [
  {
    id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    username: 'admin',
    email: 'admin@lisanga.com',
    password: 'Password123!',
    role: 'admin',
    avatarUrl: null,
    createdAt: '2026-01-15T10:00:00.000Z',
    isActive: true
  },
  {
    id: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    username: 'marie_dubois',
    email: 'marie@example.com',
    password: 'Password123!',
    role: 'user',
    avatarUrl: null,
    createdAt: '2026-02-10T14:30:00.000Z',
    isActive: true
  },
  {
    id: '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r',
    username: 'jean_martin',
    email: 'jean@example.com',
    password: 'Password123!',
    role: 'user',
    avatarUrl: null,
    createdAt: '2026-02-15T09:00:00.000Z',
    isActive: true
  },
  {
    id: '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s',
    username: 'sophie_bernard',
    email: 'sophie@example.com',
    password: 'Password123!',
    role: 'user',
    avatarUrl: null,
    createdAt: '2026-03-01T16:45:00.000Z',
    isActive: true
  },
  {
    id: '5e6f7g8h-9i0j-1k2l-3m4n-5o6p7q8r9s0t',
    username: 'luc_petit',
    email: 'luc@example.com',
    password: 'Password123!',
    role: 'user',
    avatarUrl: null,
    createdAt: '2026-03-10T11:20:00.000Z',
    isActive: true
  },
  {
    id: '6f7g8h9i-0j1k-2l3m-4n5o-6p7q8r9s0t1u',
    username: 'emma',
    email: 'emma@gmail.com',
    password: 'Emma@2026',
    role: 'user',
    avatarUrl: null,
    createdAt: '2026-04-21T00:00:00.000Z',
    isActive: true
  }
];

export const mockArticles = [
  {
    id: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
    title: 'Introduction à React 18 et ses nouvelles fonctionnalités',
    content: 'React 18 apporte de nombreuses améliorations et nouvelles fonctionnalités qui transforment la façon dont nous développons des applications web. Le Concurrent Rendering permet désormais à React de préparer plusieurs versions de l\'interface utilisateur simultanément, offrant une expérience utilisateur plus fluide. Les Transitions API permettent de marquer certaines mises à jour comme non urgentes, ce qui améliore considérablement la réactivité de l\'application.\n\nLe nouveau hook useTransition est particulièrement utile pour gérer les états de chargement lors de navigation ou de recherches. Automatic Batching regroupe automatiquement les mises à jour d\'état, même dans les gestionnaires d\'événements asynchrones, réduisant ainsi le nombre de rendus.\n\nSuspense a été amélioré et fonctionne désormais de manière plus cohérente, permettant un meilleur contrôle du chargement des données. Le Server Components permet de rendre certains composants côté serveur, réduisant la taille du bundle JavaScript envoyé au client.\n\nCes améliorations rendent React plus performant et plus facile à utiliser pour créer des applications web modernes et réactives.',
    excerpt: '',
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    category: 'Technologie',
    author: mockUsers[1],
    likesCount: 42,
    dislikesCount: 3,
    commentsCount: 12,
    createdAt: '2026-04-18T10:30:00.000Z',
    updatedAt: '2026-04-18T10:30:00.000Z'
  },
  {
    id: 'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7',
    title: 'Les meilleures pratiques pour démarrer une startup en 2026',
    content: 'Lancer une startup en 2026 nécessite une approche stratégique et une compréhension approfondie du marché actuel. La première étape consiste à identifier un problème réel que vous pouvez résoudre de manière unique. Le marché est saturé de solutions similaires, il est donc crucial de trouver votre proposition de valeur unique.\n\nLa validation du marché est essentielle avant d\'investir massivement. Utilisez des MVP (Minimum Viable Products) pour tester vos hypothèses rapidement et à moindre coût. Écoutez vos premiers utilisateurs et itérez en fonction de leurs retours.\n\nLe financement reste un défi majeur. Explorez différentes options : bootstrapping, business angels, capital-risque, crowdfunding. Chaque option a ses avantages et inconvénients selon votre modèle d\'affaires et vos objectifs de croissance.\n\nConstituez une équipe complémentaire et talentueuse. Les compétences techniques doivent être équilibrées avec des compétences en business, marketing et vente. La culture d\'entreprise doit être définie dès le début pour attirer et retenir les meilleurs talents.\n\nEnfin, la persévérance est clé. Les échecs font partie du parcours entrepreneurial. Apprenez de chaque erreur et restez flexible dans votre approche.',
    excerpt: '',
    imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800',
    category: 'Business',
    author: mockUsers[2],
    likesCount: 38,
    dislikesCount: 2,
    commentsCount: 8,
    createdAt: '2026-04-17T14:15:00.000Z',
    updatedAt: '2026-04-17T14:15:00.000Z'
  },
  {
    id: 'c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8',
    title: 'Design System : construire une bibliothèque de composants cohérente',
    content: 'Un design system est bien plus qu\'une simple bibliothèque de composants. C\'est un langage visuel et fonctionnel partagé qui unifie l\'expérience utilisateur à travers tous les produits d\'une organisation. La création d\'un design system efficace commence par l\'établissement de tokens de design : couleurs, typographies, espacements, ombres.\n\nLes composants doivent être atomiques et réutilisables. Commencez par les éléments de base (boutons, inputs, cartes) avant de créer des composants plus complexes. Chaque composant doit avoir une documentation claire avec des exemples d\'utilisation et des props bien définies.\n\nL\'accessibilité doit être intégrée dès le début, pas ajoutée après coup. Utilisez des contrastes de couleurs suffisants, gérez le focus clavier correctement, et incluez des attributs ARIA appropriés.\n\nLa maintenance d\'un design system est un processus continu. Versionnez vos composants, communiquez les changements clairement, et créez un processus de contribution pour que l\'équipe puisse proposer des améliorations.\n\nOutillez-vous correctement : Storybook pour la documentation, Figma pour le design, et des tests automatisés pour garantir la stabilité.',
    excerpt: '',
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    category: 'Design',
    author: mockUsers[3],
    likesCount: 56,
    dislikesCount: 1,
    commentsCount: 15,
    createdAt: '2026-04-16T09:45:00.000Z',
    updatedAt: '2026-04-16T09:45:00.000Z'
  },
  {
    id: 'd4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s9',
    title: 'Organiser un hackathon communautaire réussi',
    content: 'Les hackathons sont d\'excellentes opportunités pour rassembler la communauté tech, favoriser l\'innovation et créer des connexions. L\'organisation d\'un hackathon réussi nécessite une planification minutieuse et une exécution soignée.\n\nCommencez par définir un thème clair et engageant. Le thème doit être suffisamment spécifique pour guider les participants mais assez large pour encourager la créativité. Fixez une date au moins 2-3 mois à l\'avance pour permettre aux participants de s\'organiser.\n\nLe choix du lieu est crucial. Assurez-vous d\'avoir suffisamment d\'espace, une bonne connexion internet, des prises électriques en nombre, et des zones de repos. La nourriture et les boissons doivent être disponibles tout au long de l\'événement.\n\nRecrutez des mentors expérimentés qui peuvent guider les équipes et répondre aux questions techniques. Les prix et récompenses doivent être attrayants mais l\'expérience et l\'apprentissage doivent rester au centre.\n\nCréez un code de conduite clair et inclusif. Tous les participants doivent se sentir en sécurité et respectés. Prévoyez un système de feedback pour améliorer les éditions futures.',
    excerpt: '',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    category: 'Communauté',
    author: mockUsers[4],
    likesCount: 31,
    dislikesCount: 0,
    commentsCount: 6,
    createdAt: '2026-04-15T16:20:00.000Z',
    updatedAt: '2026-04-15T16:20:00.000Z'
  },
  {
    id: 'e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0',
    title: 'Apprendre le TypeScript : guide complet pour débutants',
    content: 'TypeScript est un sur-ensemble typé de JavaScript qui compile vers du JavaScript pur. Il apporte la sécurité des types statiques tout en conservant la flexibilité de JavaScript. Pour les débutants, le typage peut sembler contraignant au début, mais les avantages deviennent rapidement évidents.\n\nCommencez par les types de base : string, number, boolean, array, et object. Comprenez la différence entre les types et les interfaces. Les interfaces sont idéales pour décrire la forme des objets et peuvent être étendues, tandis que les types sont plus flexibles pour les unions et intersections.\n\nLes génériques sont l\'une des fonctionnalités les plus puissantes de TypeScript. Ils permettent de créer des composants réutilisables qui fonctionnent avec plusieurs types plutôt qu\'un seul.\n\nUtilisez strictement le mode strict du compilateur. Cela peut sembler difficile au début, mais cela vous force à écrire un code plus sûr et prévisible. Les erreurs seront détectées au moment de la compilation plutôt qu\'à l\'exécution.\n\nPratiquez régulièrement en convertissant de petits projets JavaScript en TypeScript. Commencez simple et augmentez progressivement la complexité.',
    excerpt: '',
    imageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
    category: 'Formation',
    author: mockUsers[1],
    likesCount: 67,
    dislikesCount: 2,
    commentsCount: 22,
    createdAt: '2026-04-14T11:00:00.000Z',
    updatedAt: '2026-04-14T11:00:00.000Z'
  },
  {
    id: 'f6g7h8i9-j0k1-l2m3-n4o5-p6q7r8s9t0u1',
    title: 'Conférence DevFest 2026 : Ce qu\'il faut retenir',
    content: 'La conférence DevFest 2026 a rassemblé plus de 2000 développeurs du monde entier pour trois jours d\'apprentissage intensif et de networking. Voici les points clés à retenir de cet événement majeur.\n\nLe keynote d\'ouverture a mis l\'accent sur l\'IA générative et son impact sur le développement logiciel. Les outils d\'assistance au code alimentés par l\'IA ne remplacent pas les développeurs mais les rendent plus productifs en automatisant les tâches répétitives.\n\nLes sessions sur le WebAssembly ont montré comment cette technologie mature permet d\'exécuter du code haute performance directement dans le navigateur. Plusieurs entreprises ont partagé leurs cas d\'usage réussis, notamment dans les domaines du gaming et de l\'édition vidéo.\n\nLa sécurité applicative était un thème récurrent. Les experts ont insisté sur l\'importance de la sécurité by design plutôt que comme une réflexion après coup. Les démonstrations de vulnérabilités courantes ont rappelé à tous l\'importance de la vigilance.\n\nLe networking a été facilité par une application mobile dédiée qui a permis de programmer des rencontres et de suivre les conversations thématiques. L\'événement se termine avec un sentiment d\'enthousiasme collectif pour l\'avenir du développement.',
    excerpt: '',
    imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
    category: 'Événement',
    author: mockUsers[2],
    likesCount: 45,
    dislikesCount: 1,
    commentsCount: 11,
    createdAt: '2026-04-13T08:30:00.000Z',
    updatedAt: '2026-04-13T08:30:00.000Z'
  }
];

mockArticles.forEach(article => {
  article.excerpt = generateExcerpt(article.content, 150);
});

export const mockComments = [
  {
    id: 'c1a2b3c4-d5e6-f7g8-h9i0-j1k2l3m4n5o6',
    content: 'Excellent article ! J\'ai particulièrement apprécié la section sur les Transitions API.',
    author: mockUsers[2],
    articleId: mockArticles[0].id,
    parentId: null,
    replies: [
      {
        id: 'c2b3c4d5-e6f7-g8h9-i0j1-k2l3m4n5o6p7',
        content: 'Tout à fait d\'accord ! Les Transitions changent vraiment la donne pour les UX complexes.',
        author: mockUsers[3],
        articleId: mockArticles[0].id,
        parentId: 'c1a2b3c4-d5e6-f7g8-h9i0-j1k2l3m4n5o6',
        replies: [],
        createdAt: '2026-04-18T12:15:00.000Z'
      }
    ],
    createdAt: '2026-04-18T11:45:00.000Z'
  },
  {
    id: 'c3c4d5e6-f7g8-h9i0-j1k2-l3m4n5o6p7q8',
    content: 'Pouvez-vous donner un exemple concret d\'utilisation de useTransition ?',
    author: mockUsers[4],
    articleId: mockArticles[0].id,
    parentId: null,
    replies: [],
    createdAt: '2026-04-18T13:00:00.000Z'
  },
  {
    id: 'c4d5e6f7-g8h9-i0j1-k2l3-m4n5o6p7q8r9',
    content: 'Article très inspirant pour tous les entrepreneurs en devenir !',
    author: mockUsers[1],
    articleId: mockArticles[1].id,
    parentId: null,
    replies: [],
    createdAt: '2026-04-17T15:30:00.000Z'
  },
  {
    id: 'c5e6f7g8-h9i0-j1k2-l3m4-n5o6p7q8r9s0',
    content: 'Super guide ! Avez-vous des recommandations d\'outils pour créer un design system ?',
    author: mockUsers[4],
    articleId: mockArticles[2].id,
    parentId: null,
    replies: [
      {
        id: 'c6f7g8h9-i0j1-k2l3-m4n5-o6p7q8r9s0t1',
        content: 'Storybook et Figma sont indispensables. Pour les tokens, jetez un œil à Style Dictionary.',
        author: mockUsers[3],
        articleId: mockArticles[2].id,
        parentId: 'c5e6f7g8-h9i0-j1k2-l3m4-n5o6p7q8r9s0',
        replies: [],
        createdAt: '2026-04-16T11:00:00.000Z'
      }
    ],
    createdAt: '2026-04-16T10:30:00.000Z'
  }
];
