import { useContext } from 'react';
import { Context } from '@src/contexts/provider/Provider';
import { IdentifierMap, pageSize } from '@utils/constants';
import Axios from 'axios';
import config from '../config';

const useSaleCards = () => {
  const { lang, originChainId } = useContext(Context);
  return async (
    page: number,
    nftStatus?: string,
    slug?: string,
    category?: string,
    nftName?: string,
    sortField?: string,
    sortType?: string,
  ) => {
    const identifier = IdentifierMap[originChainId];
    try {
      const response: any = await Axios.get(
        `${
          config.fetchUrl
        }/api/v1/xnft/public/nft/${identifier}?&page=${page}&pageSize=${pageSize}&nftStatus=${nftStatus}&slug=${
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
      return (
        data || {
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
        size: 10,
        total: 0,
      };
    }
  };
};

export default useSaleCards;
