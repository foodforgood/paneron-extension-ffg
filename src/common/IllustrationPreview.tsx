/** @jsx jsx */
/** @jsxFrag React.Fragment */

import React, { useContext } from 'react';
import { jsx } from '@emotion/react';
import { DatasetContext } from '@riboseinc/paneron-extension-kit/context';


const IllustrationPreview: React.VoidFunctionComponent<{ relativePath: string, className?: string }> =
function ({ relativePath, className }) {
  const { makeAbsolutePath } = useContext(DatasetContext);
  const p = makeAbsolutePath(relativePath);

  return (
    <img
      src={`file://${p}`}
      className={className}
    />
  );
}


export default IllustrationPreview;
