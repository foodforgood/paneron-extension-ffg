/** @jsx jsx */
/** @jsxFrag React.Fragment */

import React, { useContext } from 'react';
import { jsx, css } from '@emotion/react';

import { BreadcrumbProps, Breadcrumbs, Button, Classes, Colors, Menu, MenuDivider, MenuItem } from '@blueprintjs/core';

import { DatasetContext } from '@riboseinc/paneron-extension-kit/context';
import { PersistentStateReducerHook } from '@riboseinc/paneron-extension-kit/usePersistentStateReducer';

import { categories, LanguageID, languages } from './typeconst';
import EntryCount from './entries/EntryCount';
import CategoryDashboard from './CategoryDashboard';
import EntryForm from './entries/EntryForm';
import LangContext from './LangContext';


type Action =
  | { type: 'select-category'; payload: { id: string; }; }
  | { type: 'select-entry'; payload: { slug: string | null; }; }
  | { type: 'select-language'; payload: { id: LanguageID; }; }

interface State {
  langID: LanguageID
  categoryID: string
  entrySlug: string | null
}


const RepositoryView: React.VoidFunctionComponent<Record<never, never>> =
function () {
  const { usePersistentDatasetStateReducer } = useContext(DatasetContext);

  const [ state, dispatch ] =
  (usePersistentDatasetStateReducer as PersistentStateReducerHook<State, Action>)(
    'item-browser',
    undefined,
    undefined,
    (prevState, action) => {
      switch (action.type) {
        case 'select-category':
          return {
            ...prevState,
            categoryID: action.payload.id,
          }
        case 'select-entry':
          if (prevState.categoryID) {
            return {
              ...prevState,
              entrySlug: action.payload.slug,
            }
          } else {
            return prevState;
          }
        case 'select-language':
          return {
            ...prevState,
            langID: action.payload.id,
          }
        default:
          throw new Error("Unexpected state");
      }
    },
    {
      categoryID: categories[0],
      langID: languages[0],
      entrySlug: null,
    },
    null);

  const breadcrumbItems: BreadcrumbProps[] = [
    { icon: 'folder-open', text: state.categoryID },
  ];

  if (state.entrySlug) {
    breadcrumbItems.push({
      icon: 'document',
      text: state.entrySlug,
    })
  }

  return (
    <LangContext.Provider value={{ selected: state.langID }}>
      <div css={css`
          background: ${Colors.LIGHT_GRAY2};
          position: absolute; inset: 0;
          overflow: visible; padding: 10px;
          display: flex; flex-flow: row nowrap;`}>

        <div css={css`flex: 1; display: flex; flex-flow: column nowrap;`}>
          <Breadcrumbs
            css={css`flex: 0; margin-bottom: 10px;`}
            items={breadcrumbItems} />
          {state.entrySlug
            ? <EntryForm
                categoryID={state.categoryID}
                entrySlug={state.entrySlug}
                onChangeLanguage={langID => dispatch({
                  type: 'select-language',
                  payload: { id: langID },
                })}
                css={css`flex: 1;`}
              />
            : <CategoryDashboard
                categoryID={state.categoryID}
                onOpenEntry={slug => dispatch({
                  type: 'select-entry',
                  payload: { slug },
                })}
                css={css`flex: 1;`}
              />}
        </div>

        {state.entrySlug
          ? <Button
              large
              icon="cross"
              title="Close (lose uncommitted changes)"
              css={css`position: absolute; top: 10px; right: 10px;`}
              onClick={() => dispatch({
                type: 'select-entry',
                payload: { slug: null },
              })}
            />
          : <nav css={css`flex: 0; margin-left: 10px;`}>
              <Menu className={Classes.ELEVATION_1}>
                <MenuDivider title="Sections" />
                {categories.map(catID =>
                  <MenuItem
                    icon={state.categoryID === catID ? 'folder-open' : 'folder-close'}
                    key={catID}
                    text={catID}
                    labelElement={
                      <EntryCount
                        categoryID={catID}
                        drafts
                        nonZeroOnly
                        nonZeroIntent="warning"
                      />
                    }
                    active={state.categoryID === catID}
                    onClick={() => dispatch({
                      type: 'select-category',
                      payload: { id: catID },
                    })}
                  />
                )}
              </Menu>
            </nav>}
      </div>
    </LangContext.Provider>
  );
};


export default RepositoryView;
