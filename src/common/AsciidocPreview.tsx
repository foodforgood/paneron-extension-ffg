/** @jsx jsx */
/** @jsxFrag React.Fragment */

import React from 'react';
import ADocProcessor from 'asciidoctor';
import { jsx } from '@emotion/react';
import { Classes } from '@blueprintjs/core';


const adoc = ADocProcessor();


const AsciidocPreview: React.FC<{ data: string, className?: string }> =
function ({ data, className }) {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: adoc.convert(data, { backend: 'html5' }) as string }}
      className={`${Classes.RUNNING_TEXT} ${className}`}
    />
  );
}


export default AsciidocPreview;

