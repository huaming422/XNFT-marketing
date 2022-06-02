import { useContext } from 'react';
import { Context } from '@src/contexts/provider/Provider';
import { IdentifierMap } from '@utils/constants';
import config from '../config';
import Axios from 'axios';

const useNFTsByBox = () => {
  const { lang, originChainId } = useContext(Context);
  return async (nftAddress: string, tokenId: string, boxOwnerAddress: string) => {
    const identifier = IdentifierMap[originChainId];
    try {
      const response: any = await Axios.get(
        `${config.fetchUrl}/api/v1/xnft/public/box/nft/${identifier}/${nftAddress}/${tokenId}/${boxOwnerAddress}`,
        {
          headers: {
            'Accept-Language': lang,
          },
        },
      );
      const { data } = response.data;
      return data || [];
    } catch (e) {
      console.error("failed to get box's nft", e);
      return [];
    }
  };
};

export default useNFTsByBox;
