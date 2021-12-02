import yaml from 'js-yaml';


export interface BodyWithFrontmatter<T extends Record<string, any> = Record<string, any>> {
  frontmatter: T
  body: string
}


const FRONTMATTER_SEP = '---';

function isObject(val: any): val is Record<string, any> {
  return val !== null && typeof val === 'object' && Array.isArray(val) === false;
}


export default {
  deserialize: (raw: string): BodyWithFrontmatter => {
    const rawTrimmed = raw.trim();

    // First part is empty, second part is frontmatter content,
    // third and subsequent parts is body.
    const parts = rawTrimmed.split(FRONTMATTER_SEP);

    if (parts.length >= 3) {
      const frontmatterRaw = parts[1];

      // Let it throw:
      const maybeFrontmatter = yaml.load(frontmatterRaw);

      if (isObject(maybeFrontmatter)) {
        const frontmatter = maybeFrontmatter;
        const body = parts.slice(2).join(FRONTMATTER_SEP);
        return { body, frontmatter };
      } else {
        throw new Error("Frontmatter contents are invalid");
      }
    } else {
      throw new Error("No or invalid frontmatter found");
    }
  },
  serialize: ({ body, frontmatter }: BodyWithFrontmatter): string => {
    const rawFrontmatter = yaml.dump(frontmatter);
    return ['', `\n${rawFrontmatter}\n`, `\n${body}`].join(FRONTMATTER_SEP);
  },
}
