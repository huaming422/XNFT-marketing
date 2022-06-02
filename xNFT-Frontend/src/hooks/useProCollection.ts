import { useEffect, useState, useContext } from 'react';
import { Context } from '@src/contexts/provider/Provider';
import { IdentifierMap } from '@utils/constants';
import config from '../config';
import Axios from 'axios';

const useCollectionNums = () => {
  const { lang, originChainId } = useContext(Context);
  return async (projectId: string, pageSize: number) => {
    const identifier = IdentifierMap[originChainId];
    try {
      const response: any = await Axios.get(
        `${config.fetchUrl}/api/v1/xnft/public/collection/nft/${identifier}/${projectId}?pageSize=${pageSize}`,
        {
          headers: {
            'Accept-Language': lang,
          },
        },
      );
      const { data } = response.data;
      return data;
    } catch (e) {
      console.error('failed to get collections', e);
      return {
        countId: '',
        current: 1,
        hitCount: false,
        maxLimit: null,
        optimizeCountSql: true,
        orders: [],
        pages: 0,
        records: [],
        searchCount: true,
        size: 10,
        total: 0,
      };
    }
  };
};

export default useCollectionNums;
