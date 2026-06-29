/**
 * team-data.ts
 *
 * Committed source of truth for the Illuminate team. The /admin tool hydrates
 * from this seed and stores local edits (including uploaded photos as data URLs)
 * in the browser under 'illuminate-admin-team'.
 */

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  /** A /public path (e.g. /team/jane.webp) or an uploaded data URL. */
  photo?: string;
};

export const teamSeed: TeamMember[] = [];
