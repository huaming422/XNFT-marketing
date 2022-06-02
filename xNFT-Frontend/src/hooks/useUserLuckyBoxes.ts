import { useContext } from 'react';
import { Context } from '@src/contexts/provider/Provider';
import { IdentifierMap } from '@utils/constants';
import { useWallet } from 'use-wallet';
import config from '../config';
import { getDefaultProvider } from '@src/utils/provider';
import Axios from 'axios';

const useUserLuckyBoxes = () => {
  const { lang, originChainId } = useContext(Context);
  const { account } = useWallet();
  return async (pageSize: number, name?: string, sortField?: string, sortType?: string) => {
    if (!account) {
      await getDefaultProvider();
    }
    const identifier = IdentifierMap[originChainId];
    try {
      const response: any = await Axios.get(
        `${config.fetchUrl}/api/v1/xnft/box/${identifier}/${account?.toLowerCase()}?name=${
          name || ''
        }&sortField=${sortField || ''}&sortType=${
          sortType || ''
        }&page=${1}&pageSize=${pageSize}`,
        {
          headers: {
            'Accept-Language': lang,
          },
        },
      );
      const { data } = response.data;
      return (
        data || {
          countId: '',
          current: 1,
          hitCount: false,
          maxLimit: null,
          optimizeCountSql: true,
          orders: [],
          pages: 1,
          records: [],
          searchCount: true,
          size: pageSize,
          total: 0,
        }
      );
    } catch (e) {
      console.error('failed to get user cards', e);
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
        size: pageSize,
        total: 0,
      };
    }
  };
};

export default useUserLuckyBoxes;
