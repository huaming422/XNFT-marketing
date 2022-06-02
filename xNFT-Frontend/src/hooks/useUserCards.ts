import { useContext } from 'react';
import { Context } from '@src/contexts/provider/Provider';
import { IdentifierMap } from '@utils/constants';
import { useWallet } from 'use-wallet';
import config from '../config';
import Axios from 'axios';

const useUserCards = () => {
  const { lang, originChainId, connectWallet } = useContext(Context);
  const { account } = useWallet();
  return async (
    pageSize: number,
    nftStatus: string,
    slug: string,
    category: string,
    nftName: string,
    sortField: string,
    sortType: string,
  ) => {
    if (!account) {
      return connectWallet();
    }
    const identifier = IdentifierMap[originChainId];
    try {
      const response: any = await Axios.get(
        `${
          config.fetchUrl
        }/api/v1/xnft/nft/${identifier}/${account?.toLowerCase()}?page=1&pageSize=${pageSize}&nftStatus=${nftStatus}&slug=${
          slug || ''
        }&category=${category || ''}&name=${nftName || ''}&sortField=${
          sortField || ''
        }&sortType=${sortType || ''}`,
        {
          headers: {
            'Accept-Language': lang,
          },
        },
      );
      const { data } = response.data;
      return data;
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
        size: 10,
        total: 0,
      };
    }
  };
};

export default useUserCards;
