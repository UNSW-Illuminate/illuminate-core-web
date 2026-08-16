/**
 * team-data.ts
 *
 * Committed source of truth for the Illuminate team.
 *
 * Photos live in public/team/ and are referenced by path. A member without a
 * photo renders as an initials tile, so the roster never waits on a headshot.
 */

/** Which block of the /team page a member appears in. */
export type TeamGroup = 'leadership' | 'technical' | 'members';

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  group: TeamGroup;
  /** A /public path, for example /team/jane.webp. */
  photo?: string;
};

/**
 * The four disciplines a member joins. Each one maps to a technical lead above,
 * and the names are listed again on /contact.
 */
export type Portfolio = {
  id: string;
  name: string;
  tagline: string;
};

export const portfolios: Portfolio[] = [
  {
    id: 'art-and-design',
    name: 'Art & Design',
    tagline: 'Concept, form, and finish',
  },
  {
    id: 'mechanical',
    name: 'Mechanical',
    tagline: 'Structure, fabrication, and installation',
  },
  {
    id: 'electrical',
    name: 'Electrical',
    tagline: 'Power, wiring, and light output',
  },
  {
    id: 'software',
    name: 'Software',
    tagline: 'Firmware, interaction, and behaviour',
  },
];

export const teamSeed: TeamMember[] = [
  {
    id: 'lisa-huang',
    name: 'Lisa Huang',
    role: 'Project Lead',
    group: 'leadership',
    photo: '/team/lisa-huang.jpg',
  },
  {
    id: 'lisa-ni',
    name: 'Lisa Ni',
    role: 'Project Lead',
    group: 'leadership',
    photo: '/team/lisa-ni.jpg',
  },
  {
    id: 'alexei-machkevitch',
    name: 'Alexei Machkevitch',
    role: 'Art and Design Lead',
    group: 'technical',
    photo: '/team/alexei-machkevitch.jpg',
  },
  {
    id: 'andrew-ni',
    name: 'Andrew Ni',
    role: 'Electrical Lead',
    group: 'technical',
    photo: '/team/andrew-ni.jpg',
  },
  {
    id: 'fange-wu',
    name: 'Fange Wu',
    role: 'Electrical Lead',
    group: 'technical',
    photo: '/team/fang-wu.jpeg',
  },
  {
    id: 'jacky-peng',
    name: 'Jacky Peng',
    role: 'Mechanical Lead',
    group: 'technical',
    photo: '/team/jacky-peng.png',
  },
  {
    id: 'justin-prasad',
    name: 'Justin Prasad',
    role: 'Software Lead',
    group: 'technical',
    photo: '/team/justin-prasad.jpeg',
  },
  { id: 'andrew-smedley', name: 'Andrew Smedley', role: 'Member', group: 'members' },
  { id: 'aarush-sood', name: 'Aarush Sood', role: 'Member', group: 'members' },
  { id: 'jennifer-yu', name: 'Jennifer Yu', role: 'Member', group: 'members' },
  { id: 'alex-shim', name: 'Alex Shim', role: 'Member', group: 'members' },
  { id: 'aneesa-shaki', name: 'Aneesa Shaki', role: 'Member', group: 'members' },
  { id: 'audrey-kao', name: 'Audrey Kao', role: 'Member', group: 'members' },
  { id: 'samantha-kabidin', name: 'Samantha Kabidin', role: 'Member', group: 'members' },
  { id: 'selena-duong', name: 'Selena Duong', role: 'Member', group: 'members' },
  { id: 'chanunchida-sugunasil', name: 'Chanunchida Sugunasil', role: 'Member', group: 'members' },
  { id: 'daniel-yu', name: 'Daniel Yu', role: 'Member', group: 'members' },
  { id: 'huzaifa-bin-yasir', name: 'Huzaifa Bin Yasir', role: 'Member', group: 'members' },
  { id: 'rishi-chidambaram', name: 'Rishi Chidambaram', role: 'Member', group: 'members' },
  { id: 'nandita-vemuri', name: 'Nandita Vemuri', role: 'Member', group: 'members' },
  { id: 'marlon-reid', name: 'Marlon Reid', role: 'Member', group: 'members' },
  { id: 'naimul-azmat', name: 'Naimul Azmat', role: 'Member', group: 'members' },
  { id: 'rosanne-lee', name: 'Rosanne Lee', role: 'Member', group: 'members' },
  { id: 'tonglin-li', name: 'Tonglin Li', role: 'Member', group: 'members' },
];
