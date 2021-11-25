/** @jsx jsx */
/** @jsxFrag React.Fragment */

import React from 'react';
import { jsx, css } from '@emotion/react';

import makeSearchResultList from '@riboseinc/paneron-extension-kit/widgets/SearchResultList';

import { getIlloQueryExp } from '../query';


const IllustrationList: React.VoidFunctionComponent<{
  categoryID: string
  entrySlug: string
  selected: string | null
  onSelect: (filename: string | null) => void
  className?: string
}> = function ({ categoryID, entrySlug, selected, onSelect, className }) {
  const queryExpression = getIlloQueryExp(
    categoryID,
    entrySlug,
  );

  return (
    <SearchResultList
      className={className}
      queryExpression={queryExpression}
      selectedItemPath={selected}
      onSelectItem={onSelect}
    />
  );
}


export default IllustrationList;


const Illustration: React.FC<{ objectData: any, objectPath: string }> =
function ({ objectPath }) {
  const filename = objectPath.split('/')[3];
  return (
    <span css={css`
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
      `}>
      {filename}
    </span>
  );
}


const SearchResultList = makeSearchResultList<{ asText: string }>(Illustration, (objPath) => ({
  name: 'image',
  iconProps: {
    icon: 'media',
    title: objPath,
    htmlTitle: `Icon for item at ${objPath}`
  }
}));
