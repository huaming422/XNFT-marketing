import { useEffect, useState, useContext } from 'react';
import { Context } from '@src/contexts/provider/Provider';
import { IdentifierMap, pageSize } from '@utils/constants';
import { useIntl } from 'react-intl';
import Axios from 'axios';
import config from '../config';

const useNFTBills = () => {
  const { lang, originChainId } = useContext(Context);
  return async (nftAddress: string, tokenId: string, page: number) => {
    const identifier = IdentifierMap[originChainId];
    try {
      const result = await Axios.get(
        `${config.fetchUrl}/api/v1/xnft/public/nft/tx/${identifier}/${nftAddress}/${tokenId}?page=${page}&pageSize=${pageSize}`,
        {
          headers: {
            'Accept-Language': lang,
          },
        },
      );
      const { data } = result;
      return (
        data?.data || {
          countId: '',
          current: 1,
          hitCount: false,
          maxLimit: null,
          optimizeCountSql: true,
          orders: [],
          pages: 0,
          records: [],
          searchCount: true,
          size: 12,
          total: 0,
        }
      );
    } catch (e) {
      console.error('failed to getBoxBill', e);
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
        size: 12,
        total: 0,
      };
    }
  };
};

export default useNFTBills;
