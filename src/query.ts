import { LanguageID } from './typeconst';


export interface Query {
  categoryID?: string
  substring?: string
  year?: string
  langID?: LanguageID
  draft?: boolean
}


export function getEntryQueryExp(query: Query): string {
  return `return (
    true
    ${query.categoryID
      ? `&& objPath.startsWith("/${query.categoryID}/")`
      : ''}
    ${query.langID
      ? `&& objPath.endsWith("-${query.langID}.adoc")`
      : ''}
    ${query.draft === false
      ? `&& obj.asText.indexOf("published: true") > 0`
      : ''}
    ${query.draft === true
      ? `&& (obj.asText.indexOf("published: true") < 0 || obj.asText.indexOf("published: false") > 0)`
      : ''}
    ${query.substring !== undefined
      ? `&& obj.asText.indexOf(${JSON.stringify(query.substring)}) > 0`
      : ''}
  )`;
}


export function getIlloQueryExp(categoryID: string, entrySlug: string): string {
  const objectPathPrefix = `/${categoryID}/${entrySlug}/`;
  return `return (objPath.startsWith("${objectPathPrefix}") && (
    objPath.endsWith('.pdf') ||
    objPath.endsWith('.JPG') ||
    objPath.endsWith('.jpeg') ||
    objPath.endsWith('.jpg') ||
    objPath.endsWith('.png')))`;
}
