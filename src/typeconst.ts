import { BodyWithFrontmatter } from './frontmatter';


export interface EntryFrontmatter {
  title?: string
  published?: boolean
  legacy?: Record<string, any>
}

export interface EntrySlugData {
  /** Date, if it appears in the beginning of directory name. */
  date: Date | null

  /** Slug (URL string) following the date in directory name. */
  title: string
}


export interface EntryData {
  zh: BodyWithFrontmatter<EntryFrontmatter> | null
  en: BodyWithFrontmatter<EntryFrontmatter> | null
  cn: BodyWithFrontmatter<EntryFrontmatter> | null

  /** Information extracted from path to the file. */
  slugData: EntrySlugData

  //illustrationFilenames: string[]
}

export const categories = [
  'news',
  'action_community',
  'action_exhibition',
  'action_others',
  'action_truck',
  'kitchen_YauTong',
  'kitchen_TungTau',
  'kitchen_KwaiChung',
  'campus_gallery',
  'green_living_recipes',
  'green_living_others',
] as const;

export type CategoryID = typeof categories[number];

export const languages = [ 'zh', 'en', 'cn' ] as  const;

export type LanguageID = typeof languages[number];
