import parse from 'date-fns/parse';
import format from 'date-fns/format';
import { EntrySlugData } from './typeconst';

export default function parseEntrySlug(slug: string): EntrySlugData {
  const parts = slug.split('-');

  let maybeDate: Date | null = null;
  if (parts.length > 3) {
    try {
      maybeDate = parse(`${parts[0]}-${parts[1]}-${parts[2]}`, 'yyyy-MM-dd', new Date()) ?? null;
      format(maybeDate, 'yyyy-MM-dd');
    } catch (e) {
      maybeDate = null;
    }
  }

  if (maybeDate) {
    return { date: maybeDate, title: parts.slice(3).join('-') };
  } else {
    return { date: null, title: slug };
  }
}
