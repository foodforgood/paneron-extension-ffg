/** @jsx jsx */
/** @jsxFrag React.Fragment */

import React from 'react';
import { jsx, css } from '@emotion/react';
import { NonIdealState, Spinner } from '@blueprintjs/core';
import { DatasetContext } from '@riboseinc/paneron-extension-kit/context';


const IllustrationPreview: React.VoidFunctionComponent<{ objectPath: string, className?: string }> =
function ({ objectPath, className }) {
  const { useObjectData } = React.useContext(DatasetContext);
  const objDataResp = useObjectData({ objectPaths: [objectPath], resolveLFS: true });

  if (objDataResp.isUpdating) {
    return <NonIdealState
      className={className}
      icon={<Spinner />}
      description="Retrieving file…"
    />;
  } else {
    const base64string = objDataResp.value.data[objectPath]?.asBase64;
    if (base64string) {
      const mime = Object.entries(MIME_MAP).
        find(([ext, ]) => objectPath.toLowerCase().endsWith(ext))?.[1] ?? 'image/jpeg';
      const dataURL = `data:${mime};base64,${base64string}`;
      return <img
        src={dataURL}
        className={className}
        css={css`object-fit: contain; overflow: hidden;`}
      />;
    } else {
      return <NonIdealState
        className={className}
        icon="heart-broken"
        title="Failed to load file preview"
        description="The error is: base64 string is missing."
      />;
    }
  }
}


const MIME_MAP = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
};


export default IllustrationPreview;
