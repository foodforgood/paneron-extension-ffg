/** @jsx jsx */
/** @jsxFrag React.Fragment */

import update from 'immutability-helper';

import React, { useEffect, useState } from 'react';
import { jsx, css } from '@emotion/react';
import styled from '@emotion/styled';

import { Button, ButtonGroup, FormGroup as BaseFormGroup, InputGroup, TextArea } from '@blueprintjs/core';

import { BodyWithFrontmatter } from '../frontmatter';
import { EntryFrontmatter } from '../typeconst';


const LocalizedEntryForm: React.FC<{
  objectData: BodyWithFrontmatter<EntryFrontmatter>
  onCommit?: (dataToBeCommitted: BodyWithFrontmatter<EntryFrontmatter>) => void
  onChange?: (changedData: BodyWithFrontmatter<EntryFrontmatter> | null) => void
  className?: string
}> = function ({ objectData, onCommit, onChange, className }) {
  const [editedData, setEdited] =
    useState<BodyWithFrontmatter<EntryFrontmatter> | null>(null);

  const data = editedData ?? objectData;

  const published = data.frontmatter.published === true;

  const canCommit = editedData !== null && JSON.stringify(objectData) !== JSON.stringify(editedData);

  useEffect(() => {
    onChange?.(editedData);
  }, [JSON.stringify(editedData)]);

  return (
    <div className={className} css={css`display: flex; flex-flow: column nowrap;`}>
      <FormGroup>
        <InputGroup
          placeholder={onCommit ? "Please write a title…" : "(there is no title)"}
          readOnly={!onCommit}
          value={data.frontmatter.title ?? ''}
          onChange={(evt: React.FormEvent<HTMLInputElement>) =>
            setEdited(update(data, {
              frontmatter: {
                title: {
                  $set: evt.currentTarget.value,
                },
              },
            }))
          }
        />
      </FormGroup>

      <FormGroup>
        <ButtonGroup>
          <Button
              small
              active={!published}
              intent={!published ? 'warning' : undefined}
              onClick={() => setEdited(update(data, {
                frontmatter: {
                  $unset: ['published'],
                },
              }))}
              disabled={objectData.frontmatter.published}>
            Unpublished
          </Button>
          <Button
              small
              active={published}
              intent={published ? 'success' : undefined}
              onClick={() => setEdited(update(data, {
                frontmatter: {
                  published: {
                    $set: true,
                  },
                },
              }))}>
            Published
          </Button>
        </ButtonGroup>
      </FormGroup>

      <FormGroup helperText="Please write AsciiDoc, and preview on the right." css={css`flex: 1; position: relative;`}>
        <TextArea
          fill
          css={css`position: absolute; inset: 0;`}
          placeholder={onCommit ? "Please write some contents…" : "(there is no contents)"}
          value={data.body ?? ''}
          readOnly={!onCommit}
          onChange={(evt: React.FormEvent<HTMLTextAreaElement>) =>
            setEdited(update(data, {
              body: {
                $set: evt.currentTarget.value,
              },
            }))
          }
        />
      </FormGroup>

      <Button
          intent={canCommit ? 'success' : undefined}
          disabled={!canCommit}
          onClick={onCommit && editedData
            ? () => onCommit!(editedData)
            : undefined}>
        Commit changes
      </Button>
    </div>
  );
}


const FormGroup = styled(BaseFormGroup)`
  margin-bottom: 5px;
`


export default LocalizedEntryForm;
