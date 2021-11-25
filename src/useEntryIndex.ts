import { useContext } from 'react';

import { DatasetContext } from '@riboseinc/paneron-extension-kit/context';
import { ValueHook } from '@riboseinc/paneron-extension-kit/types';

import { getEntryQueryExp, Query } from './query';


export default function useEntryIndex(q: Query): ValueHook<{ count: number, indexID: string }> {
  const { useFilteredIndex, useIndexDescription } = useContext(DatasetContext);

  const queryExpression = getEntryQueryExp(q);

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
