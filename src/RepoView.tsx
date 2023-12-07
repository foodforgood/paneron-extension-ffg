/** @jsx jsx */
/** @jsxFrag React.Fragment */

import React, { useContext, useMemo, useCallback } from 'react';
import { jsx, css } from '@emotion/react';

import { BreadcrumbProps, Button, Classes, Colors, Menu, MenuDivider, MenuItem } from '@blueprintjs/core';
import { Breadcrumbs2 as Breadcrumbs } from '@blueprintjs/popover2';

import { DatasetContext } from '@riboseinc/paneron-extension-kit/context';
import type { PersistentStateReducerHook } from '@riboseinc/paneron-extension-kit/usePersistentStateReducer';

import { categories, type LanguageID, languages } from './typeconst';
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

const initialState: State = {
  categoryID: categories[0],
  langID: languages[0],
  entrySlug: null,
} as const;

function stateReducer(prevState: State, action: Action) {
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
};


const RepositoryView: React.VoidFunctionComponent<Record<never, never>> =
function () {
  const { usePersistentDatasetStateReducer } = useContext(DatasetContext);

  const [ state, dispatch ] =
  (usePersistentDatasetStateReducer as PersistentStateReducerHook<State, Action>)(
    'item-browser',
    undefined,
    undefined,
    stateReducer,
    initialState,
    null);

  const handleSetLanguage = useCallback(function _handleSetLanguage(langID: LanguageID) {
    dispatch({
      type: 'select-language',
      payload: { id: langID },
    });
  }, []);

  const breadcrumbItems: BreadcrumbProps[] = [
    {
      icon: 'folder-open',
      text: state.categoryID,
      onClick: state.entrySlug
        ? () => dispatch({ type: 'select-entry', payload: { slug: null } })
        : undefined,
    },
  ];

  if (state.entrySlug) {
    breadcrumbItems.push({
      icon: 'document',
      text: state.entrySlug,
    })
  }

  const nav = useMemo(
    (() =>
      !state.entrySlug
        ? <nav css={css`flex: 0; padding: 10px;`}>
            <Menu
                className={Classes.ELEVATION_1}
                css={css`width: 25vw; .bp4-menu-item-label { line-height: 1; }`}>

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
            <div css={css`margin-top: 5px;`}>
              {languages.map(langID =>
                <Button
                    css={css`margin-right: 5px;`}
                    icon="translate"
                    small
                    active={langID === state.langID}
                    intent={langID === state.langID ? 'primary' : undefined}
                    onClick={() => handleSetLanguage(langID)}>
                  {langID}
                </Button>
              )}
            </div>
          </nav>
        : null
    ),
    [state.categoryID, state.langID, state.entrySlug, handleSetLanguage, categories],
  );

  return (
    <LangContext.Provider value={{ selected: state.langID }}>
      <div css={css`
          background: ${Colors.LIGHT_GRAY2};
          .bp4-dark & {
            background: ${Colors.DARK_GRAY2};
          }
          position: absolute; inset: 0;
          overflow: hidden;
          display: flex; flex-flow: row nowrap;`}>

        <div css={css`flex: 1; padding: 10px; display: flex; flex-flow: column nowrap; overflow: hidden;`}>

          <Breadcrumbs
            css={css`flex: 0; margin-bottom: 10px; white-space: nowrap;`}
            items={breadcrumbItems}
          />

          {state.entrySlug
            ? <EntryForm
                categoryID={state.categoryID}
                entrySlug={state.entrySlug}
                onChangeLanguage={handleSetLanguage}
                css={css`flex: 1; overflow: hidden;`}
              />
            : <CategoryDashboard
                categoryID={state.categoryID}
                onChangeLanguage={handleSetLanguage}
                onOpenEntry={slug => dispatch({
                  type: 'select-entry',
                  payload: { slug },
                })}
                css={css`flex: 1;`}
              />}
        </div>

        {nav}

      </div>
    </LangContext.Provider>
  );
};


export default RepositoryView;
