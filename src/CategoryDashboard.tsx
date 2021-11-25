/** @jsx jsx */
/** @jsxFrag React.Fragment */

import React, { useState } from 'react';
import { jsx, css } from '@emotion/react';

import { Button, H5 } from '@blueprintjs/core';

import EntryCount from './entries/EntryCount';
import EntryList from './entries/EntryList';


const CategoryDashboard: React.VoidFunctionComponent<{
  categoryID: string
  onOpenEntry?: (slug: string) => void
  className?: string
}> = function ({ categoryID, onOpenEntry, className }) {
  const [ archiveExpanded, setArchiveExpanded ] = useState<boolean>(false);

  function handleToggleArchive() {
    setArchiveExpanded(state => !state);
  }

  return (
    <div className={className} css={css`display: flex; flex-flow: column nowrap;`}>

      <H5>
        <Button
          css={css`margin-right: 10px;`}
          icon={archiveExpanded ? 'chevron-right' : 'chevron-down'}
          onClick={handleToggleArchive}
        />
        Unpublished
        <EntryCount
          categoryID={categoryID}
          drafts
          nonZeroIntent="warning"
          css={css`margin: 0 10px;`}
        />
        <Button intent="primary">Write new</Button>
      </H5>
      {archiveExpanded
        ? null
        : <div css={css`flex: 1;`}>
            <EntryList categoryID={categoryID} drafts onOpen={onOpenEntry} />
          </div>}

      <H5>
        <Button
          css={css`margin-right: 10px;`}
          icon={archiveExpanded ? 'chevron-down' : 'chevron-right'}
          onClick={handleToggleArchive}
        />
        Published
        <EntryCount
          categoryID={categoryID}
          drafts={false}
          css={css`margin: 0 10px;`}
        />
      </H5>
      {archiveExpanded
        ? <div css={css`flex: 1;`}>
            <EntryList categoryID={categoryID} drafts={false} onOpen={onOpenEntry} />
          </div>
        : null}

    </div>
  );
}


export default CategoryDashboard;
