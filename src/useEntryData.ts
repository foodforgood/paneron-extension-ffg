
import { useContext } from 'react';

import { DatasetContext } from '@riboseinc/paneron-extension-kit/context';
import { ValueHook } from '@riboseinc/paneron-extension-kit/types';

import { EntryData, EntryFrontmatter, LanguageID, languages } from './typeconst';
import frontmatter, { BodyWithFrontmatter } from './frontmatter';
import parseEntrySlug from './parseEntrySlug';


function getObjectPathForLanguage(categoryID: string, entrySlug: string, langID: LanguageID) {
  return `/${categoryID}/${entrySlug}/main-${langID}.adoc`
}


export default function useEntryData(categoryID: string, entrySlug: string):
ValueHook<EntryData | null> {
  const { useObjectData } = useContext(DatasetContext);

  const objectPaths = languages.map(langID => getObjectPathForLanguage(categoryID, entrySlug, langID));

  const dataReq = useObjectData({ objectPaths });

  const langData: Record<LanguageID, BodyWithFrontmatter<EntryFrontmatter> | null> = {
    cn: null, zh: null, en: null,
  }

  for (const langID of languages) {
    const objectPath = getObjectPathForLanguage(categoryID, entrySlug, langID);
    const maybeData = dataReq.value.data[objectPath];

    let data: BodyWithFrontmatter<EntryFrontmatter> | null;
    if (maybeData && maybeData.asText) {
      data = frontmatter.deserialize(maybeData.asText);
    } else {
      data = null;
    }

    langData[langID] = data;
  }

  let value: EntryData | null;
  if (Object.values(langData).find(val => val !== null)) {
    value = {
      slugData: parseEntrySlug(entrySlug),
      ...langData,
    };
  } else {
    value = null;
  }

  return {
    value,
    refresh: dataReq.refresh,
    isUpdating: dataReq.isUpdating,
    _reqCounter: dataReq._reqCounter,
    errors: dataReq.errors,
  };
}
