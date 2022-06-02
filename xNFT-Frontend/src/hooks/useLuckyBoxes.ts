import { useContext } from 'react';
import { Context } from '@src/contexts/provider/Provider';
import { IdentifierMap, pageSize } from '@utils/constants';
import config from '../config';
import Axios from 'axios';

const useLuckyBoxes = () => {
  const { lang, originChainId } = useContext(Context);
  return async (page: number, name?: string, sortField?: string, sortType?: string) => {
    const identifier = IdentifierMap[originChainId];
    try {
      const response: any = await Axios.get(
        `${config.fetchUrl}/api/v1/xnft/public/box/${identifier}?name=${name || ''}&sortField=${
          sortField || ''
        }&sortType=${sortType || ''}&page=${page}&pageSize=${pageSize}`,
        {
          headers: {
            'Accept-Language': lang,
          },
        },
      );
      const { data } = response.data;
      return data || [];
    } catch (e) {
      console.error('failed to get box', e);
      return [];
    }
  };
};

export default useLuckyBoxes;
