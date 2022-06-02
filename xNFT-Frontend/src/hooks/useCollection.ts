import { useContext } from 'react';
import { Context } from '@src/contexts/provider/Provider';
import { IdentifierMap } from '@utils/constants';
import config from '../config';
import Axios from 'axios';

const useNums = (projectId: string) => {
  const { lang, originChainId } = useContext(Context);
  const defaultValue = {
    backgroundImageUrl: '',
    boxCount: '',
    description: '',
    externalLink: '',
    favoriteCount: '',
    hidden: '',
    imageUrl: '',
    name: '',
    nftCount: '',
    nftOwnerCount: '',
    nftTradeCount: '',
    ownerAddress: '',
    slug: '',
    socialChannel: '',
    tradeCount: '',
  };
  const fetchNums = async () => {
    const identifier = IdentifierMap[originChainId];
    try {
      const response: any = await Axios.get(
        `${config.fetchUrl}/api/v1/xnft/public/collection/${identifier}/${projectId}`,
        {
          headers: {
            'Accept-Language': lang,
          },
        },
      );
      const { data } = response.data;
      return data || defaultValue;
    } catch (e) {
      console.error('failed to get detailData', e);
      return defaultValue;
    }
  };
  return fetchNums;
};

export default useNums;
