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
  /** Derived automatically from the first image in galleryImages via buildProjectImages. */
  heroImage: ProjectImage;
  galleryImages: ProjectImage[];
};

type ProjectPageSeed = Omit<ProjectPageData, 'heroImage' | 'galleryImages'> & {
  /**
   * Total number of images for this project.
   * buildProjectImages will generate sequential paths:
   *   /projectImages/[slug]/01.webp, 02.webp … [imageCount].webp
   * The first image (01.webp) is used as the hero image automatically.
   */
  imageCount: number;
};

function toTwoDigitString(value: number) {
  return value.toString().padStart(2, '0');
}

/**
 * Derives heroImage and galleryImages from a slug and image count.
 *
 * Expected asset layout:
 *   public/projectImages/[slug]/01.webp
 *   public/projectImages/[slug]/02.webp
 *   … up to [imageCount].webp
 *
 * Images must be pre-placed in public/ before the project goes live.
 */
function buildProjectImages(slug: string, title: string, imageCount: number) {
  const galleryImages = Array.from({ length: imageCount }, (_, index) => {
    const imageNumber = toTwoDigitString(index + 1);
    return {
      src: `/projectImages/${slug}/${imageNumber}.webp`,
      alt: `${title} image ${index + 1}`,
    };
  });

  return {
    heroImage: galleryImages[0],
    galleryImages,
  };
}

/**
 * Teaser entries shown in "Discover More" lists for projects that don't yet
 * have a full project page. They appear after the real linked projects.
 * Add a teaser here to keep a slot visible while work is in progress;
 * once the project is added to projectPageSeeds below it will appear
 * there automatically and can be removed from this list.
 */
const teaserProjects: ProjectDiscoverItem[] = [
  {
    title: 'Pancake',
    type: 'Interactive Build',
    shortDescription: 'A playful hands-on build that explores interaction design through physical prototypes.',
  },
  {
    title: 'Dithering Effect',
    type: 'Visualisation',
    shortDescription: 'A visual experiment that blends digital texture and motion into a responsive display.',
  },
  {
    title: '2025 Showcase',
    type: 'Exhibition',
    shortDescription: 'A curated collection of CREATE projects presented as immersive engineering experiences.',
  },
];

// ---------------------------------------------------------------------------
// HOW TO ADD A PROJECT
// ---------------------------------------------------------------------------
// 1. Copy one of the existing seed objects below and paste it at the end of
//    the array (or wherever chronologically appropriate).
//
// 2. Set a unique `slug` (lowercase, hyphen-separated). This becomes the URL:
//    /[slug]
//
// 3. Place images in:
//    public/projectImages/[slug]/01.webp  (hero — shown first)
//    public/projectImages/[slug]/02.webp
//    …
//    Increment `imageCount` to match the number of images you added.
//
// 4. Fill in title, projectType, shortDescription, location, dates, and
//    description. Use \n\n in description for paragraph breaks.
//
// 5. The project page is automatically available at /[slug] via the
//    [projectSlug] dynamic route — no routing changes needed.
//
// 6. If you want the project to appear in "Discover More" on other project
//    pages, it will do so automatically once it is in this array.
//    Remove any matching teaser entry from teaserProjects above.
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
    imageCount: 4,
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
    imageCount: 4,
  },
];

export const projectPages: ProjectPageData[] = projectPageSeeds.map((project) => ({
  ...project,
  ...buildProjectImages(project.slug, project.title, project.imageCount),
}));

export function getProjectBySlug(slug: string) {
  return projectPages.find((project) => project.slug === slug);
}

export function getDiscoverMoreProjects(currentSlug: string): ProjectDiscoverItem[] {
  const linkedProjects = projectPages
    .filter((project) => project.slug !== currentSlug)
    .map((project) => ({
      title: project.title,
      type: project.projectType,
      shortDescription: project.shortDescription,
      href: `/${project.slug}`,
    }));

  return [...linkedProjects, ...teaserProjects];
}