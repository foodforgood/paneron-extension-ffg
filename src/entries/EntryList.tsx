/** @jsx jsx */
/** @jsxFrag React.Fragment */

import format from 'date-fns/format';
import React, { useContext, useState } from 'react';
import { jsx, css } from '@emotion/react';
import { Tag } from '@blueprintjs/core';

import makeSearchResultList from '@riboseinc/paneron-extension-kit/widgets/SearchResultList';

import fm from '../frontmatter';
import LangContext from '../LangContext';
import { getEntryQueryExp } from '../query';
import parseEntrySlug from '../parseEntrySlug';


const EntryList: React.VoidFunctionComponent<{
  categoryID: string
  drafts: boolean
  onOpen?: (slug: string) => void
  className?: string
}> = function ({ categoryID, drafts, onOpen, className }) {
  const langCtx = useContext(LangContext);

  const queryExpression = getEntryQueryExp({
    categoryID,
    draft: drafts,
    langID: langCtx.selected,
  });

  const [ selectedItemPath, selectItemPath ] = useState<string | null>(null);

  return (
    <SearchResultList
      className={className}
      onOpenItem={onOpen ? itemPath => onOpen!(itemPath.split('/')[2]) : undefined}
      queryExpression={queryExpression}
      selectedItemPath={selectedItemPath}
      onSelectItem={selectItemPath}
    />
  );
}


export default EntryList;


const EntryItem: React.FC<{ objectData: { asText: string }, objectPath: string }> =
function ({ objectData, objectPath }) {
  const slug = objectPath.split('/')[2];
  const { date, title } = parseEntrySlug(slug);

  let label: string;
  try {
    const { frontmatter } = fm.deserialize(objectData.asText);
    label = frontmatter.title ?? title;
  } catch (e) {
    label = title;
  }

  return (
    <span css={css`
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
      `}>
      <span css={css`flex: 1; overflow: hidden; text-overflow: ellipsis;`}>
        {label}
      </span>
      <Tag
          round minimal
          intent={date === null ? 'warning' : undefined}
          css={css`font-size: 10px; flex-shrink: 0; margin-right: 5px;`}>
        {date !== null
          ? format(date, 'yyyy-MM')
          : 'no date'}
      </Tag>
    </span>
  );
}


const SearchResultList = makeSearchResultList<{ asText: string }>(EntryItem, (objPath) => ({
  name: 'post',
  iconProps: {
    icon: 'document',
    title: objPath,
    htmlTitle: `Icon for item at ${objPath}`
  }
}));
