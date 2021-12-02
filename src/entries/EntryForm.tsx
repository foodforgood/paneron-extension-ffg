/** @jsx jsx */
/** @jsxFrag React.Fragment */

import React, { useContext, useEffect, useState } from 'react';
import { jsx, css } from '@emotion/react';
import styled from '@emotion/styled';

import { Button, Card, Colors, NonIdealState, Tab, Tabs } from '@blueprintjs/core';

import { DatasetContext } from '@riboseinc/paneron-extension-kit/context';

import fm, { BodyWithFrontmatter } from '../frontmatter';
import LangContext from '../LangContext';
import IllustrationPreview from '../common/IllustrationPreview';
import AsciidocPreview from '../common/AsciidocPreview';
import useEntryData from '../useEntryData';
import { EntryFrontmatter, LanguageID, languages } from '../typeconst';
import LocalizedEntryForm from './LocalizedEntryForm';
import IllustrationList from './IllustrationList';


type ValidTabID = LanguageID | 'illustrations';


function isValidTabID(val: string): val is ValidTabID {
  return languages.indexOf(val as LanguageID) >= 0 || val === 'illustrations';
}


const EntryForm: React.VoidFunctionComponent<{
  categoryID: string
  entrySlug: string
  onChangeLanguage?: (lang: LanguageID) => void
  className?: string
}> = function ({ categoryID, entrySlug, onChangeLanguage, className }) {
  const entryDataResp = useEntryData(categoryID, entrySlug);
  const langCtx = useContext(LangContext);
  const { performOperation, updateObjects } = useContext(DatasetContext);

  const [ selectedTabID, selectTab ] = useState<ValidTabID>(langCtx.selected);
  const [ selectedIllustration, selectIllustration ] = useState<string | null>(null);
  const [ asciidocPreview, setAsciidocPreview ] = useState<string | null>(null);

  useEffect(() => {
    setAsciidocPreview(null);
    if (selectedTabID !== 'illustrations' && onChangeLanguage) {
      onChangeLanguage(selectedTabID);
    }
  }, [selectedTabID]);

  async function _handleCommitPostChange(
    lang: LanguageID,
    data: BodyWithFrontmatter<EntryFrontmatter>,
  ) {
    if (updateObjects && entryDataResp.value) {
      const objectPath = `/${categoryID}/${entrySlug}/main-${lang}.adoc`;
      await updateObjects({
        objectChangeset: {
          [objectPath]: {
            newValue: { asText: fm.serialize(data) },
            oldValue: undefined,
          },
        },
        _dangerouslySkipValidation: true,
        commitMessage: `edit ${entrySlug} (${lang})`,
      });
      setAsciidocPreview(null);
    } else {
      throw new Error("Either access is read-only, or specified entry doesn’t exist");
    }
  }
  const handleCommitPostChange = performOperation('updating post', _handleCommitPostChange);

  if (entryDataResp.value !== null) {
    return (
      <Card className={className} css={css`padding: 0; display: flex; flex-flow: row nowrap;`}>
        <Tabs
            renderActiveTabPanelOnly
            selectedTabId={selectedTabID}
            onChange={(tabID: string, oldTabID: string) =>
              selectTab(isValidTabID(tabID) ? tabID : langCtx.selected)}
            css={css`
              width: 50%;

              flex: 1;
              display: flex;
              flex-flow: column nowrap;
              position: relative;

              .bp3-tab-list {
                overflow-x: auto;
                padding: 10px;
                height: auto;
                position: unset;

                /* Accommodate the new tab button on the right */
                display: block;
                white-space: nowrap;
                padding-right: 24px;

                /* Remove spacing between tabs */
                > *:not(:last-child) {
                  margin-right: 0;
                }

                /* Hide horizontal scrollbar (overlaps with tab titles on macOS) */
                ::-webkit-scrollbar {
                  height: 0px;
                  background: transparent;
                }
              }
              .bp3-tab-indicator { display: none; }
              .bp3-tab { line-height: unset; position: unset; display: inline-block; }
              .bp3-tab-panel { flex: 1; margin: 0; position: relative; }
            `}
            id="entryFormTabs">
          {languages.map(langID =>
            <Tab
              id={langID}
              key={langID}
              title={
                <TabTitleButton
                  active={selectedTabID === langID}
                  intent={selectedTabID === langID ? 'primary' : undefined}
                  small
                  icon="translate"
                >{langID}</TabTitleButton>
              }
              panel={
                <LocalizedEntryForm
                  css={css`position: absolute; inset: 0; overflow-y: auto;`}
                  objectData={entryDataResp.value?.[langID] ?? { frontmatter: {}, body: '' }}
                  onCommit={newData => handleCommitPostChange(langID, newData)}
                  onChange={newData => setAsciidocPreview(newData?.body ?? null)}
                />
              }
            />
          )}
          <Tab
            id="illustrations"
            title={
              <TabTitleButton
                active={selectedTabID === 'illustrations'}
                intent={selectedTabID === 'illustrations' ? 'primary' : undefined}
                small
                icon="media"
              >Illustrations</TabTitleButton>
            }
            panel={
              <IllustrationList
                css={css`position: absolute; inset: 0;`}
                categoryID={categoryID}
                entrySlug={entrySlug}
                onSelect={selectIllustration}
                selected={selectedIllustration}
              />
            }
          />
        </Tabs>

        {selectedTabID === 'illustrations' && selectedIllustration
          ? <IllustrationPreview
              objectPath={selectedIllustration}
              css={css`flex: 1; padding: 10px; background: ${Colors.GRAY2}; color: ${Colors.LIGHT_GRAY5}`}
            />
          : selectedTabID !== 'illustrations'
          ? <AsciidocPreview
              data={asciidocPreview ?? entryDataResp.value[selectedTabID]?.body ?? '(Nothing to preview)'}
              css={css`flex: 1; overflow-y: auto; padding: 20px; background: ${Colors.LIGHT_GRAY4};`}
            />
          : <NonIdealState
              css={css`flex: 1; padding: 20px; background: ${Colors.LIGHT_GRAY4};`}
              icon="star-empty"
              title="Nothing to preview" />}

      </Card>
    );

  } else {
    return <NonIdealState
      className={className}
      icon="heart-broken"
      title="Post not found"
    />;
  }
}

export default EntryForm;


const TabTitleButton = styled(Button)`
  margin-right: 5px;
`;
