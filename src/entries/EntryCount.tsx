/** @jsx jsx */
/** @jsxFrag React.Fragment */

import React, { useContext } from 'react';
import { jsx } from '@emotion/react';
import { Intent, Tag } from '@blueprintjs/core';
import useEntryIndex from '../useEntryIndex';
import LangContext from '../LangContext';


const EntryCount: React.FC<{
  categoryID: string
  drafts?: boolean
  nonZeroOnly?: true
  nonZeroIntent?: Intent
  className?: string
  large?: true
}> = function ({ categoryID, drafts, nonZeroOnly, nonZeroIntent, large, className }) {
  const langCtx = useContext(LangContext);
  const idx = useEntryIndex({ categoryID, langID: langCtx.selected, draft: drafts });

  if (idx.value.count > 0 || !nonZeroOnly) {
    return (
      <Tag
          large={large}
          intent={nonZeroIntent && idx.value.count > 0 ? nonZeroIntent : undefined}
          title={drafts ? "Number of draft entries" : undefined}
          className={className}>
        {idx.value.count}
      </Tag>
    );
  } else {
    return null;
  }
}


export default EntryCount;
