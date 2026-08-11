import fs from 'node:fs';
import path from 'node:path';

/**
 * projects-data.ts
 *
 * Centralised data source for all portfolio project pages.
 *
 * SHADER BACKGROUND
 * -----------------
 * The animated WebGL shader gradient that sits behind every page is
 * independent of this file. Its fixed runtime values and rendering pipeline
 * live in app/components/ShaderGradient.tsx.
 *
 * PROJECT PAGES
 * -------------
 * Each full project lives in projectPageSeeds below. See the comment block
 * above that array for step-by-step addition instructions.
 */

type ProjectImage = {
  src: string;
  alt: string;
};

export type ProjectPageData = {
  /** URL segment, e.g. 'synergy' → /synergy. Must match the image folder name. */
  slug: string;
  title: string;
  projectType: string;
  /** One-liner shown in cards and discover-more lists. */
  shortDescription: string;
  location: string;
  dates: string;
  /** Full body copy shown on the project page. Use \n\n for paragraph breaks. */
  description: string;
  /** Derived automatically from the first existing numbered image in the folder. */
  heroImage?: ProjectImage;
  galleryImages: ProjectImage[];
};

type ProjectPageSeed = Omit<ProjectPageData, 'heroImage' | 'galleryImages'>;

/**
 * Derives heroImage and galleryImages from existing files in /public.
 *
 * Expected asset layout:
 *   public/projectImages/[slug]/01.webp
 *   public/projectImages/[slug]/02.webp
 *   public/projectImages/[slug]/03.jpg
 *   ...
 *
 * Only numbered files are included. Non-numbered assets (e.g. dither.webp)
 * are ignored.
 */
function buildProjectImages(slug: string, title: string) {
  const directory = path.join(process.cwd(), 'public', 'projectImages', slug);
  const imageFilePattern = /^(\d+)\.(webp|jpg|jpeg|png|avif)$/i;

  // Reading the folder can fail (missing directory, permissions); treat any
  // failure as "no images" so a single bad folder never breaks the build.
  let imageFilenames: string[] = [];
  try {
    if (fs.existsSync(directory)) {
      imageFilenames = fs
        .readdirSync(directory)
        .filter((filename) => imageFilePattern.test(filename))
        .sort((a, b) => {
          const aNumber = Number(a.match(imageFilePattern)?.[1] ?? 0);
          const bNumber = Number(b.match(imageFilePattern)?.[1] ?? 0);
          return aNumber - bNumber;
        });
    }
  } catch (e) {
    console.error(`Could not read images for project "${slug}":`, e);
  }

  const galleryImages = imageFilenames.map((filename, index) => ({
    src: `/projectImages/${slug}/${filename}`,
    alt: `${title} image ${index + 1}`,
  }));

  return {
    heroImage: galleryImages[0],
    galleryImages,
  };
}

// ---------------------------------------------------------------------------
// HOW TO ADD A PROJECT
// ---------------------------------------------------------------------------
// 1. Copy one of the existing seed objects below and paste it at the end of
//    the array. Order within the array doesn't matter — every list is sorted
//    by `dates`, newest first (see projectsByDate below).
//
// 2. Set a unique `slug` (lowercase, hyphen-separated). This becomes the URL:
//    /[slug]
//
// 3. Place images in:
//    public/projectImages/[slug]/01.webp  (hero — shown first)
//    public/projectImages/[slug]/02.webp
//    …
//    Numbered images are auto-detected and rendered.
//
// 4. Fill in title, projectType, shortDescription, location, dates, and
//    description. Use \n\n in description for paragraph breaks.
//
// 5. The project page is automatically available at /[slug] via the
//    app/(site)/[projectSlug] dynamic route — no routing changes needed.
//
// 6. The project also joins the landing-page selector and the previous/next
//    navigation automatically once it is in this array.
// ---------------------------------------------------------------------------
const projectPageSeeds: ProjectPageSeed[] = [
  {
    slug: 'synergy',
    title: 'Synergy',
    projectType: 'Installation',
    shortDescription:
      'An interactive nature-inspired installation demonstrating superorganism behaviour through light-reactive ferns and audience movement.',
    location: 'Vivid Sydney',
    dates: '2018',
    description:
      "Synergy brings to life the story of how a forest works as a single organism.\n\nUnderground, root systems connect trees to one another, allowing them to share signals and nutrients across the whole network. The installation responds visually: light pulses along the roots towards the central tree, and the ferns begin to animate in response, as though the tree has passed on a warning. Each fern lights up when a visitor comes close, then fades again.\n\nSynergy is an image of collective behaviour. It only comes to life when multiple participants engage at the same time, and that shared experience is what stays with the audience.",
  },
  {
    slug: 'resonance',
    title: 'Resonance',
    projectType: 'Installation',
    shortDescription:
      'An interactive light installation that invites visitors to engage with the living memory of place',
    location: 'Uncontained Festival',
    dates: '2026',
    description:
      "Kogarah — a Dharug word — means 'place of reeds.' \n\nWe invite you to experience Resonance as a living memory of the river’s rushes and banks. \n\n\Don’t be afraid to touch the grasses and watch the ripple of light travel through the entire field. At its centre, find a meditative well, take a moment to peek inside, what will you find?",
  },

  {
    slug: 'heartstring',
    title: 'Heartstring',
    projectType: 'Installation',
    shortDescription:
      'An interactive light installation that invites visitors to engage with the living memory of place',
    location: 'Uncontained Festival',
    dates: '2022',
    description:
      "In a spectacular union of yarn, paint and technology, Heartstrings explores how connection between people breathes life into a community. \n\nSpools of glowing yarn lace together to form a reaching hand that mimics life with its gentle glow. Red ribbons wind along the bench, inviting audiences to take a seat and connect with those who have sat before and will sit after them. \n\nInspired by the legend of the Red String of Fate, Heartstrings serves as a powerful reminder to people that they are not alone.",
  },
  {
    slug: 'laneway',
    title: 'Laneway',
    projectType: 'Installation',
    shortDescription:
      'An interactive light installation that invites visitors to engage with the living memory of place',
    location: 'UNSW Kensington',
    dates: '2020',
    description:
      "Laneway was commissioned as part of UNSW Estate Management’s Secret Garden Project, transforming a small area of the campus into a lively meeting place. The fairytale-like experience inspires a sense of tranquillity and wonder before opening into a jubilant space where people can come together and interact, far from their troubles and worries.\n\nAs visitors enter the Secret Garden, iridescent stars flicker delicately overhead and dance in the wind. Laneway takes the most magnificent part of the night sky and leads curious minds down a path into the Secret Garden, hidden away from the main area of UNSW’s Kensington campus.",
  },
  {
    slug: 'celestial-pancake',
    title: 'Celestial Pancake',
    projectType: 'Installation',
    shortDescription:
      'An interactive light installation that invites visitors to engage with the living memory of place',
    location: 'Vivid Sydney',
    dates: '2019',
    description:
      "Celestial Pancake is a suspended audiovisual light installation that engages with the childlike wonder of gazing into a starry sky. The artwork transports a slice of the night sky for us to gaze into and enjoy.\n\nAs visitors walk beneath the canopy of stars, the optical-fibre lights dance and glow, echoing the exploding stars in the galaxies of our universe. From afar, the whole terminal is bathed in washes of light, drawing people in and encouraging them to pause and reflect. Alternating colour palettes inspired by the celestial phenomena that enchanted us as children complete the experience.",
  },
  {
    slug: 'crystallise',
    title: 'Crystallise',
    projectType: 'Installation',
    shortDescription:
      'An interactive light installation that invites visitors to engage with the living memory of place',
    location: 'Vivid Sydney',
    dates: '2017',
    description:
      "Inspired by Colette Miller’s angel-wing murals and the metaphor of wings as our inner angels, Crystallise reminds visitors of the power we hold within ourselves to do good.\n\nAt first glance, the installation appears to be a mosaic of lights. As participants approach, pieces of the LED canvas begin to fade away, leaving only a pair of wings behind.\n\nCrystallise was constructed from lightweight materials including plywood and corflute. Waterproof LED modules and power supplies were controlled by a small microcontroller to transform the lights.",
  },

  {
    slug: 'mondrian-cube',
    title: 'Mondrian Cube',
    projectType: 'Installation',
    shortDescription:
      'An interactive light installation that invites visitors to engage with the living memory of place',
    location: 'Vivid Sydney',
    dates: '2016',
    description:
      "The Mondrian Cube was commissioned for the Vivid Sydney 2016 festival. Inspired by Dutch artist Piet Mondrian and the De Stijl movement, this two-metre-tall interactive light installation features bold, dark lines surrounding blocks of primary colour. Visitors can change the colour arrangement on each side by pressing individual rectangular blocks, creating their own Mondrian artwork.\n\nUndergraduate UNSW students from several faculties and disciplines developed and delivered the installation. By managing a real-world engineering project, the students gained vital skills through teamwork and collaboration.",
  },

  {
    slug: 'paralanguage',
    title: 'Paralanguage',
    projectType: 'Installation',
    shortDescription:
      'An interactive light installation that invites visitors to engage with the living memory of place',
    location: 'Uncontained Festival',
    dates: '2023',
    description:
      "Paralanguage was commissioned by Georges River Council as a focal artwork for the opening event of Uncontained.\n\nFrom the straw-like reeds lining the riverbanks to the shoots of bamboo sprouting in planter boxes outside nearby suburban homes, Paralanguage draws inspiration from the plants and animals of the Georges River catchment. These illustrations are brought to life through a gentle symphony of colourful lights and an ambient soundscape of rustling leaves, flowing streams and birdsong.\n\nThe artwork creates a dialogue between the self and the environment, and between the audience and the artwork, deepening our appreciation of the natural world.",
  },

  {
    slug: 'viscera',
    title: 'Viscera',
    projectType: 'Installation',
    shortDescription:
      'An interactive light installation that invites visitors to engage with the living memory of place',
    location: 'UNSW Kensington',
    dates: '2025',
    description:
      "Viscera begins with a simple act: choosing a pathogen. Nine specimens ( bacteria, viruses, prions, and parasites) sit waiting in their petri dishes and corning flasks. Place one on the pedestal, and the mannequin transforms. Animated projections bloom across its surface, tracing the chosen organism's path through the body - routes of transmission, sites of infection, the immune system's response rendered in vivid, shifting light.\n\nThe magic lies in what's hidden. Beneath the pedestal, an RFID scanner silently reads each specimen and triggers its corresponding animation - an invisible handshake between object and installation that makes the experience feel instinctive and immediate. Swap one flask for another, and the body before you tells a different story.\n\nHoused within the Museum of Human Disease at UNSW, Viscera transforms clinical knowledge into something felt. By placing a pathogen in your hands and watching what it does inside a human body, the installation collapses the distance between observer and disease — making the invisible, for a moment, impossible to ignore.",
  },
];

/**
 * Reads the most recent year out of a `dates` string so projects can be
 * ordered chronologically regardless of how the field is written:
 *   '2025'                  → 2025
 *   'May–June 2024'         → 2024
 *   'November 2023 – 2024'  → 2024
 * Anything without a four-digit year sorts last.
 */
function parseProjectYear(dates: string) {
  const years = dates.match(/\d{4}/g);

  if (!years) {
    return 0;
  }

  return Math.max(...years.map(Number));
}

/**
 * Newest first. `sort` on a copy keeps projectPageSeeds untouched, and JS sorts
 * are stable, so projects sharing a year keep their authored order.
 */
const projectsByDate: ProjectPageSeed[] = [...projectPageSeeds].sort(
  (a, b) => parseProjectYear(b.dates) - parseProjectYear(a.dates),
);

export const projectPages: ProjectPageData[] = projectsByDate.map((project) => ({
  ...project,
  ...buildProjectImages(project.slug, project.title),
}));

export function getProjectBySlug(slug: string) {
  return projectPages.find((project) => project.slug === slug);
}

export function getAdjacentProjects(currentSlug: string) {
  const currentIndex = projectPages.findIndex((project) => project.slug === currentSlug);

  if (currentIndex === -1 || projectPages.length <= 1) {
    return {
      previousProject: null,
      nextProject: null,
    };
  }

  const previousProject = projectPages[(currentIndex - 1 + projectPages.length) % projectPages.length];
  const nextProject = projectPages[(currentIndex + 1) % projectPages.length];

  return {
    previousProject,
    nextProject,
  };
}
