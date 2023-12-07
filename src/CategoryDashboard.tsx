/** @jsx jsx */
/** @jsxFrag React.Fragment */

import React from 'react';
import { jsx, css } from '@emotion/react';

import { Button, H5, InputGroup } from '@blueprintjs/core';
import { Popover2, Tooltip2 } from '@blueprintjs/popover2';

import EntryCount from './entries/EntryCount';
import EntryList from './entries/EntryList';
import { LanguageID, languages } from './typeconst';


function forceSlug(val: string): string {
  return val.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
}


const CategoryDashboard: React.VoidFunctionComponent<{
  categoryID: string
  onChangeLanguage?: (newLangID: LanguageID) => void
  onOpenEntry?: (slug: string) => void
  className?: string
}> = function ({ categoryID, onOpenEntry, onChangeLanguage, className }) {
  const [ archiveExpanded, setArchiveExpanded ] = React.useState<boolean>(false);
  const [ newEntrySlug, setNewEntrySlug ] = React.useState('');

  function handleToggleArchive() {
    setArchiveExpanded(state => !state);
  }

  function handleNew() {
    if (canStartNew) {
      onChangeLanguage(languages[0]);
      onOpenEntry(newEntrySlug);
      setNewEntrySlug('');
    }
  }
  const canStartNew = onOpenEntry && onChangeLanguage && newEntrySlug.replace('-', '').trim() !== '';

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
        <Popover2 minimal content={
          <InputGroup
            value={newEntrySlug}
            onChange={evt => setNewEntrySlug(forceSlug(evt.currentTarget.value))}
            placeholder="New article ID…"
            leftElement={
              <Tooltip2 placement="bottom-start" content={<>Enter article ID that starts with a date, e.g. <code>2017-10-28-6th-hong_kong-food-carnival</code></>}>
                <Button minimal small disabled icon="info-sign" />
              </Tooltip2>
            }
            rightElement={
              <Button
                  small
                  minimal
                  disabled={!canStartNew}
                  onClick={handleNew}>
                Confirm
              </Button>
            }
          />
        }>
          <Button intent="primary" disabled={!onOpenEntry}>Write new</Button>
        </Popover2>
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
