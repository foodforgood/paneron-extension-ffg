/** @jsx jsx */
/** @jsxFrag React.Fragment */

import React, { useContext } from 'react';
import { jsx, css } from '@emotion/react';
import { Button } from '@blueprintjs/core';

import { DatasetContext } from '@riboseinc/paneron-extension-kit/context';
import makeSearchResultList from '@riboseinc/paneron-extension-kit/widgets/SearchResultList';

import { getIlloQueryExp } from '../query';
import ActionButton from '../common/ActionButton';


const IllustrationList: React.VoidFunctionComponent<{
  categoryID: string
  entrySlug: string
  selected: string | null
  onSelect: (filename: string | null) => void
  className?: string
}> = function ({ categoryID, entrySlug, selected, onSelect, className }) {
  const { addFromFilesystem, performOperation, operationKey } = useContext(DatasetContext);

  const queryExpression = getIlloQueryExp(
    categoryID,
    entrySlug,
  );

  async function _handleAdd() {
    if (addFromFilesystem) {
      await addFromFilesystem(
        { prompt: "Please select an image file", allowMultiple: true },
        `added illustrations for ${entrySlug}`,
        `${categoryID}/${entrySlug}`,
        { offloadToLFS: true });
    }
  }
  const canAdd = !operationKey && addFromFilesystem !== undefined;
  const handleAdd = performOperation('adding illustrations', _handleAdd);

  return (
    <div className={className} css={css`display: flex; flex-flow: column nowrap;`}>
      <div css={css`flex: 1;`}>
        <SearchResultList
          queryExpression={queryExpression}
          selectedItemPath={selected}
          onSelectItem={onSelect}
        />
      </div>
      <ActionButton
          disabled={!canAdd}
          onClick={canAdd ? handleAdd : undefined}>
        Add illustrations
      </ActionButton>
    </div>
  );
}


export default IllustrationList;


const Illustration: React.FC<{ objectData: any, objectPath: string }> =
function ({ objectPath }) {
  const filename = objectPath.split('/')[3];
  const { updateObjects, performOperation } = useContext(DatasetContext);

  async function _handleDelete() {
    if (updateObjects) {
      await updateObjects({
        commitMessage: `deleted illustration ${objectPath}`,
        objectChangeset: {
          [objectPath]: { newValue: null },
        },
        _dangerouslySkipValidation: true,
      });
    }
  }
  const handleDelete = performOperation('deleting illustration', _handleDelete);

  return (
    <span css={css`
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
      `}>
      <span css={css`flex: 1;`}>
        {filename}
      </span>
      <Button
        small
        minimal
        title="Delete this image"
        icon="cross"
        onClick={handleDelete}
        disabled={!updateObjects}
      />
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
