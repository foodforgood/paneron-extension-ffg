/** @jsx jsx */
/** @jsxFrag React.Fragment */

import format from 'date-fns/format';
import React from 'react';
import { jsx, css } from '@emotion/react';
import { Button, Tag } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';

import { DatasetContext } from '@riboseinc/paneron-extension-kit/context';
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
  const langCtx = React.useContext(LangContext);

  const queryExpression = getEntryQueryExp({
    categoryID,
    draft: drafts,
    langID: langCtx.selected,
  });

  const [ selectedItemPath, selectItemPath ] = React.useState<string | null>(null);

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
  const { updateTree, performOperation } = React.useContext(DatasetContext);
  const slug = objectPath.split('/')[2];
  const { date, title } = parseEntrySlug(slug);

  let label: string;
  let published: boolean;
  try {
    const { frontmatter } = fm.deserialize(objectData.asText);
    label = frontmatter.title ?? title;
    published = frontmatter.published ?? false;
  } catch (e) {
    label = title;
    published = false;
  }

  async function _handleDelete() {
    if (updateTree) {
      const components = objectPath.split('/');
      components.pop();
      await updateTree({
        commitMessage: `deleted article at ${objectPath}`,
        subtreeRoot: components.join('/'),
        newSubtreeRoot: null,
      });
    }
  }
  const handleDelete = performOperation('deleting article', _handleDelete);

  return (
    <span css={css`
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
      `}>
      <span css={css`flex: 1; overflow: hidden; text-overflow: ellipsis;`}>
        {label}
      </span>
      {published
        ? <Tag
              round minimal
              intent={date === null ? 'warning' : undefined}
              css={css`font-size: 10px; flex-shrink: 0; margin-right: 5px;`}>
            {date !== null
              ? format(date, 'yyyy-MM')
              : 'no date'}
          </Tag>
        : <Popover2
              placement="bottom-end"
              content={
                <Button
                    intent="danger"
                    disabled={!updateTree}
                    css={css`margin: 10px;`}
                    onClick={handleDelete}>
                  Delete all language versions of this article, and all its illustrations
                </Button>
              }>
            <Button
              small
              minimal
              icon="cross"
              title="You can delete this article, while it’s still a draft."
            />
          </Popover2>}
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
