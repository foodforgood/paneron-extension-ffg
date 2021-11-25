import { useContext } from 'react';

import { DatasetContext } from '@riboseinc/paneron-extension-kit/context';
import { ValueHook } from '@riboseinc/paneron-extension-kit/types';
import { getIlloQueryExp } from './query';


export default function useIllustrationIndex(categoryID: string, entrySlug: string):
ValueHook<{ count: number, indexID: string }> {
  const { useFilteredIndex, useIndexDescription } = useContext(DatasetContext);

  const queryExpression = getIlloQueryExp(categoryID, entrySlug);

  const idxReq = useFilteredIndex({ queryExpression });
  const indexID = idxReq.value.indexID ?? '';
  const idxDescReq = useIndexDescription({ indexID });

  return {
    value: {
      count: idxDescReq.value.status.objectCount,
      indexID,
    },
    refresh: () => {
      idxReq.refresh();
      idxDescReq.refresh();
    },
    _reqCounter: idxReq._reqCounter + idxDescReq._reqCounter,
    isUpdating: idxReq.isUpdating || idxDescReq.isUpdating,
    errors: [...idxReq.errors, ...idxDescReq.errors],
  };
}
