/** @jsx jsx */
/** @jsxFrag React.Fragment */

import React from 'react';
import ADocProcessor from 'asciidoctor';
import { jsx } from '@emotion/react';


const adoc = ADocProcessor();


const AsciidocPreview: React.FC<{ data: string, className?: string }> =
function ({ data, className }) {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: adoc.convert(data, { backend: 'html5' }) as string }}
      className={className}
    />
  );
}


export default AsciidocPreview;

