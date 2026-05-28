export interface WorkData {
  title: string;
  category: string;
  description: string;
  images: string[];
}

export const worksData: Record<string, WorkData> = {
  'La Symphonie': {
    title: 'La Symphonie des Vagabonds',
    category: 'Sculpture Sonore — 2024',
    description: `
      <p>La Symphonie des vagabonds est un projet à la croisée de l'art, de la science et de la cosmologie. Le terme « vagabond » renvoie ici à son origine étymologique : issu du grec planêtês, il désignait, dans l'astronomie antique, les astres errants, les planètes, par opposition aux étoiles fixes. Depuis l'Antiquité, les planètes sont perçues comme des astres errants, des vagabonds parcourant le ciel. De Pythagore aux cosmologies médiévales, elles sont associées à l'idée d'une harmonie des sphères : un ordre invisible où les mouvements célestes produiraient une musique cosmique, inaudible mais fondatrice de l'équilibre du monde.</p>
      <p>La Symphonie des vagabonds s'inscrit dans cet héritage mythologique et philosophique en proposant une traduction sensible du chant des planètes du système solaire. Chaque planète — Mercure, Vénus, la Terre, Mars, Jupiter, Saturne, Uranus et Neptune — devient un instrument d'un orchestre cosmique.</p>
      <p>À partir des fréquences propres aux mouvements planétaires, transposées dans le domaine audible selon la loi de l'octave cosmique formulée par le scientifique Hans Cousto, l'œuvre met en vibration des films d'eau grâce à la cymatique. Les ondes sonores génèrent alors des formes aquatiques mouvantes, projetées au plafond de l'espace d'exposition.</p>
      <p>Huit dispositifs au sol associent eau, son, lumière et optique de projection. Le spectateur est invité à lever les yeux, à contempler un ciel recomposé où les figures vibratoires dessinent un ballet cosmique. Les apparitions sonores et lumineuses des planètes s'orchestrent comme une partition vivante, faite de présences, de silences et de résonances.</p>
      <p>Sans recours à la captation vidéo, l'œuvre repose sur des phénomènes physiques réels. Elle propose une déambulation immersive, où science et mythe se rejoignent, et où l'ancienne idée de l'harmonie des sphères retrouve une forme perceptible, dansante et lumineuse.</p>
    `,
    images: [
      '/Images/Oeuvres/La_symphony/1.XimenesYoann,La symphonie des vagabonds.jpg',
      '/Images/Oeuvres/La_symphony/Jupiter.jpg',
      '/Images/Oeuvres/La_symphony/Mars.jpg',
      '/Images/Oeuvres/La_symphony/Mercure.jpg',
      '/Images/Oeuvres/La_symphony/Neptune.jpg',
      '/Images/Oeuvres/La_symphony/Saturne.jpg',
      '/Images/Oeuvres/La_symphony/Terre.jpg',
      '/Images/Oeuvres/La_symphony/Uranus.jpg',
      '/Images/Oeuvres/La_symphony/Vénus.jpg',
    ],
  },
  'Le Big Bang de Louise': {
    title: 'Le Big Bang de Louise',
    category: 'Installation — 2016',
    description: `
      <p>À l'origine, le silence. Du néant surgit un cri : le Big Bang.</p>
      <p>Le 26 juillet 1978, Louise Brown, premier enfant né par fécondation in vitro, entre dans le monde en émettant son premier cri. Cet instant inaugural devient ici l'écho contemporain de l'acte de création cosmique.</p>
      <p>S'appuyant sur la cymatique — science qui permet de visualiser le son — l'œuvre donne une forme visible au premier cri de Louise Brown. Des fragments de cette vibration originelle sont projetés sur des plaques métalliques recouvertes de sable, révélant des figures issues de l'onde sonore.</p>
      <p>La forme ovoïde des plaques fait référence au fond diffus cosmologique, la plus ancienne image connue de l'Univers. Entre mythes de la création et théories scientifiques, Le Big Bang de Louise interroge le pouvoir génésiaque du son : une force immatérielle capable d'organiser la matière, de structurer le monde et de faire advenir le vivant.</p>
    `,
    images: [
      '/Images/Oeuvres/Le Big Bang de Louise/Le Big Bang de Louise.jpg',
      '/Images/Oeuvres/Le Big Bang de Louise/Le Big Bang de Louise, Cymatique, aluminium, peinture acrylique, 450x25cm_2016, YX.jpg',
      '/Images/Oeuvres/Le Big Bang de Louise/n°1_Le Big Bang de Louise_1253 Hertz.jpg',
      '/Images/Oeuvres/Le Big Bang de Louise/n°2_Le Big Bang de Louise_1804 Hertz.jpg',
      '/Images/Oeuvres/Le Big Bang de Louise/n°3_Le Big Bang de Louise_2147 Hertz.jpg',
      '/Images/Oeuvres/Le Big Bang de Louise/n°4_Le Big Bang de Louise_2661 Hertz.jpg',
      '/Images/Oeuvres/Le Big Bang de Louise/n°5_Le Big Bang de Louise_2736 Hertz.jpg',
      '/Images/Oeuvres/Le Big Bang de Louise/n°6_Le Big Bang de Louise_2762 Hertz.jpg',
    ],
  },
  Mantras: {
    title: 'Mantras',
    category: 'Sculpture — 2023',
    description: `
      <p>Les mots, savamment maîtrisés, renferment un pouvoir capable de commander la réalité. Ce phénomène s'exprime avec une particulière acuité dans la sphère politico-sociale, où la parole tend à imprimer des vérités sur le monde. En écho aux mythes créationnistes, nous reconnaissons le démiurge dans la parole des hommes et des femmes d'influence.</p>
      <p>Mantras explore précisément cette idée. Chacun des Mantras ici présentés — sculptures aériennes construites sur le modèle d'un spectre sonore — constitue un portrait sonore, élaboré à partir d'extraits de discours d'hommes et de femmes ayant façonné l'histoire moderne par la force de leurs mots. Barack Obama, Nelson Mandela, Martin Luther King… sont convoqués pour la performativité de leur parole.</p>
      <p>S'inspirant du pouvoir performatif du Verbe, l'œuvre réactive cette conception d'une parole génésiaque du monde, inscrite au cœur même du pouvoir politique.</p>
      <p>Il est des hommes et des femmes qui, par leur discours, ont changé le monde. Il est des moments de l'Histoire où les mots d'un grand orateur portent l'espoir, interpellent les consciences et animent les peuples.</p>
      <p class="italic mt-4">« Le monde a-t-il jamais été transformé autrement que par la pensée et son support magique : le mot ? »<br>— Thomas Mann</p>
    `,
    images: [
      '/Images/Oeuvres/Mantras/1.Mantras.jpg',
      '/Images/Oeuvres/Mantras/3.Mantras.jpg',
      '/Images/Oeuvres/Mantras/4.Mantras.jpg',
      '/Images/Oeuvres/Mantras/5.Mantras.jpg',
      '/Images/Oeuvres/Mantras/7.Mantras.jpg',
    ],
  },
  'Nùn': {
    title: 'Nùn',
    category: 'Sculpture — 2022',
    description: `
      <p>Dans la mythologie égyptienne du clergé de Memphis, Nûn n'est pas un dieu mais un principe de création : l'océan primordial, informe et obscur, d'où émerge la vie et vers lequel tout retourne. Sans commencement ni créateur préalable, il englobe toute chose. De son agitation naît Ptah, le premier dieu, qui engendre le monde par la parole.</p>
      <p>Cette figure du chaos originel traverse de nombreuses cosmogonies. On en retrouve une trace dans la tradition islamique dès l'ouverture de la sourate Al-Qalam :<br>« Nûn. Par la plume et ce qu'ils écrivent. »<br>Dieu y crée d'abord la plume, chargée d'inscrire ce qui adviendra.</p>
      <p>Avec le projet Nûn, le spectateur observe un œuf, symbole universel de la Création, fissuré sous l'effet des ondes sonores du Big Bang. Pour mettre en vibration ce Nûn primordial, l'œuvre utilise la reconstitution sonore du Big Bang réalisée par le physicien John G. Cramer (Université de Washington, Seattle), à partir des données du satellite WMAP.</p>
      <p>L'ensemble du dispositif est dissimulé dans l'œuf, d'où émergent lumière et vibration. À l'intérieur, l'océan primordial s'anime : le Nûn égyptien entre en résonance avec le Nûn islamique. Le chaos devient langage, la vibration devient forme, et le son — force invisible — redevient acte de création.</p>
    `,
    images: [
      '/Images/Oeuvres/Nùn/DSC_0532.jpg',
      '/Images/Oeuvres/Nùn/63.jpg',
    ],
  },
  'Souvenir from Earth': {
    title: 'Souvenir from Earth',
    category: 'Installation — 2022',
    description: `
      <p>Souvenirs from Earth est né d'un travail de recherche consacré aux espèces aviaires disparues depuis la période coloniale. Plus de 250 oiseaux se sont éteints sous l'effet direct des activités humaines : destruction des habitats, déforestation massive, agriculture sur brûlis, introduction d'espèces invasives et dérèglement climatique.</p>
      <p>À partir d'archives sonores issues du travail de bio- et éco-acousticiens, l'œuvre rassemble les chants de sept espèces aujourd'hui éteintes, autrefois endémiques de territoires précis d'Amérique centrale, du Brésil, de Micronésie et d'Hawaï. Ces voix disparues deviennent les vestiges d'un monde qui ne répond plus.</p>
      <p>Chaque chant est traduit en spectre sonore, puis incarné dans une sculpture réalisée en charbon. Réduit en sable, puis lié par une résine invisible, ce matériau fossile agit comme une matière funéraire.</p>
      <p>Présentées sous cloche de verre, à la manière de reliques, de taxidermies abstraites ou d'objets votifs, ces sculptures deviennent des tombeaux sonores. L'installation prend la forme d'un rituel de mémoire.</p>
    `,
    images: [
      '/Images/Oeuvres/Souvenir from Earth/Souvenirs from Earth - Copie.jpg',
      '/Images/Oeuvres/Souvenir from Earth/IMG_20220901_184845_2 - copie.jpg',
    ],
  },
  Speechscape: {
    title: "Speechscape 31°47' N 35°13' E",
    category: 'Installation — 2015-2017',
    description: `
      <p>Le mot ne se contente pas de désigner le réel : il le façonne. Par la parole, des réalités prennent forme, se stabilisent ou se fragmentent. Le langage agit comme une matière invisible, capable d'orienter le regard et de moduler notre perception du monde.</p>
      <p>Speechscape aborde ce phénomène à travers un paysage discursif composé de différentes dénominations attribuées à un même territoire. David Ben Gourion proclame un « État d'Israël » ; Yasser Arafat revendique un « État de Palestine ». Deux noms, deux récits, deux réalités antagonistes projetées sur une même terre.</p>
      <p>L'œuvre propose une expérience perceptive clivée. Selon la face depuis laquelle le spectateur observe l'installation, un paysage distinct se révèle. Les films translucides filtrent la vision et empêchent toute appréhension simultanée des formes.</p>
      <p>Speechscape 31°47' N 35°13' E révèle ainsi la capacité du langage à modeler l'espace perçu et à produire des réalités concurrentes.</p>
    `,
    images: [
      '/Images/Oeuvres/Speechscape/speechscape_1.jpg',
      '/Images/Oeuvres/Speechscape/speechscape_2.jpg',
      '/Images/Oeuvres/Speechscape/speechscape_3.jpg',
    ],
  },
};

export const heroSlides = [
  '/Images/Oeuvres/La_symphony/1.XimenesYoann,La symphonie des vagabonds.jpg',
  '/Images/Oeuvres/Le Big Bang de Louise/Le Big Bang de Louise.jpg',
  '/Images/Oeuvres/Mantras/1.Mantras.jpg',
  '/Images/Oeuvres/Nùn/DSC_0532.jpg',
  '/Images/Oeuvres/Souvenir from Earth/Souvenirs from Earth - Copie.jpg',
  '/Images/Oeuvres/Speechscape/speechscape_1.jpg',
];
