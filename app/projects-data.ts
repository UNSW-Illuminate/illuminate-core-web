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
 * independent of this file. To tweak it, see:
 *   - app/components/ShaderGradient.tsx   – vertex/fragment shader source
 *   - app/hooks/useShaderSettings.ts      – runtime uniforms (speed, grain,
 *                                           colour mode, ripple, etc.)
 * Default shader values are defined in DEFAULT_SETTINGS inside
 * useShaderSettings.ts and are persisted to localStorage under the key
 * 'illuminate-settings'.
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

type ProjectDiscoverItem = {
  title: string;
  type: string;
  shortDescription: string;
  href?: string;
};

export type ProjectPageData = {
  /** URL segment, e.g. 'synergy' → /projects/synergy. Must match the image folder name. */
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

export type ProjectPageSeed = Omit<ProjectPageData, 'heroImage' | 'galleryImages'>;

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

/**
 * Teaser entries shown in "Discover More" lists for projects that don't yet
 * have a full project page. They appear after the real linked projects.
 * once the project is added to projectPageSeeds below it will appear
 * there automatically and can be removed from this list.
 */

// ---------------------------------------------------------------------------
// HOW TO ADD A PROJECT
// ---------------------------------------------------------------------------
// 1. Copy one of the existing seed objects below and paste it at the end of
//    the array (or wherever chronologically appropriate).
//
// 2. Set a unique `slug` (lowercase, hyphen-separated). This becomes the URL:
//    /projects/[slug]
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
// 5. The project page is automatically available at /projects/[slug] via the
//    projects/[projectSlug] dynamic route — no routing changes needed.
//
// 6. If you want the project to appear in "Discover More" on other project
//    pages, it will do so automatically once it is in this array.
// ---------------------------------------------------------------------------
const projectPageSeeds: ProjectPageSeed[] = [
  {
    slug: 'synergy',
    title: 'Synergy',
    projectType: 'Installation',
    shortDescription:
      'An interactive nature-inspired installation demonstrating superorganism behavior through light-reactive ferns and audience movement.',
    location: 'Vivid Sydney',
    dates: '2025',
    description:
      "Synergy captures a stunning moment in nature - a large tree surrounded by ferns. It represents the interlinked mechanisms of a superorganism. In these complex beings, inconspicuous organisms demonstrate emergent properties by sharing signals and nutrients for the greater good of the collective. \n\nIn Synergy, this survival mechanism is demonstrated by the illumination of the ferns which are triggered by the passage of visitors along the path.",
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
      "As one walks into the 'Secret Garden', iridescent stars above flicker delicately and shyly dance amongst the breeze. Laneway takes the most magnificent part of the night sky and leads curious minds down a path into the 'Secret Garden', hidden away from the main area of the UNSW Kensington campus.\n\nLaneway was commissioned as part of the UNSW Estate Management's Secret Garden Project to transform a small area of the campus into a lively meeting spot at the university. The stars hang down from above and are able to dance in the breeze, reflecting light onto the surrounding buildings. The fairytale-like experience stimulates a sense of tranquility and wonder before transitioning into a jubilant space where individuals come together and interact, far away from troubles and worries.",
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
      "Celestial Pancake is a suspended audio-visual installation that visitors can walk under. It is composed of a four-meter radius ‘ceiling’ with fiber optics and an evolving four-point soundtrack. From afar, the whole terminal is bathed in washes of light, drawing people in and encouraging them to pause reflectively. Set to alternating colour palettes inspired by space phenomenon that enchanted us as kids, the installation transports a slice of the sky and brings it to us on the ground.\n\nProject Illuminate for 2019 was formed by three major teams, the art & design team, technical team and administration team. The student project group consists upwards of 90 students who participate in artistic design, engineering design, manufacturing, operations and marketing.",
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
      "Crystallise is a lighted mural comprising of multi-coloured triangular and quadrilateral forms. The installation appears to as a mosaic, but encourages viewers to come close through displaying randomly generated colours and patterns. As they come into close proximity with the mural, sections of the canvas fade, leaving behind only a pair of wings.\n\nOur main inspiration was Colette Miller’s angel wings murals, which were exhibited as street art in Sydney (Australia), Los Angeles (United States), Juarez (Mexico), Nairobi (Kenya) and many other locations. To Miller, the wings “represent our inner angel” and remind individuals of the pure and good part of the human condition that emerges even as individuals experience trauma and guilt in their lives. The wings’ embodiment of the human spirit challenges individuals to consider their choices as humanity and work towards a greater good.\n\nWe extend Miller’s artwork to different spectrums of humanity, and the idea that everyone has secrets or hidden truths. By having different lighting patterns on the artwork and hiding the pair of wings until observers come in close proximity, the installation allows people to fulfil their desire to find truths within themselves and recognise and cherish their differences.",
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
      "The Mondrian Cube was first commissioned for the Vivid Sydney 2016 festival. Taking inspiration from Dutch artist Piet Mondrian and the De Stilj movement, this two-metre-tall interactive lighting installation features bold dark lines enclosing blocks of primary colours. Visitors of the Vivid festival can change the colour arrangement of each side by simply pressing against each rectangular block, thus creating their own Mondrian artwork. \n\n\The installation was wholly built and designed by undergraduate UNSW students from different faculties and disciplines. Though the Mondrian Cube, CREATE encouraged members to push beyond their boundaries and manage a real-life engineering project, allowing them to develop valuable skills through student collaboration.",
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
      "From the straw-like reeds that plucker along banks of the river to the shoots of bamboo sprouting in plant boxes of nearby suburban homes, “Paralanguage” draws inspiration from the plants and animals that make up the Georges River catchment area.\n\nThese illustrations are encapsulated in the gentle symphony of colorful lights and an ambient soundscape of rustling leaves, flowing streams, and bird songs. We aim to foster a dialogue between the self and the environment; the audience and the artwork and creating an experience that aims to deepen one’s appreciation of the environment and strengthen the bridge between nature and our ever-advancing society.",
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
 * Editable project fields (no derived images), exposed for the /admin tool to
 * hydrate from the committed source of truth.
 */
export const projectSeeds: ProjectPageSeed[] = projectPageSeeds;

export const projectPages: ProjectPageData[] = projectPageSeeds.map((project) => ({
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

export function getDiscoverMoreProjects(currentSlug: string): ProjectDiscoverItem[] {
  const linkedProjects = projectPages
    .filter((project) => project.slug !== currentSlug)
    .map((project) => ({
      title: project.title,
      type: project.projectType,
      shortDescription: project.shortDescription,
      href: `/projects/${project.slug}`,
    }));

  return [...linkedProjects];
}