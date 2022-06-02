import { useContext } from 'react';
import { Context } from '@src/contexts/provider/Provider';
import { IdentifierMap } from '@utils/constants';
import config from '../config';
import Axios from 'axios';

const useBoxDetail = () => {
  const { lang, originChainId } = useContext(Context);
  const fetchBoxDetail = async (tokenId: string, nftAddress: string) => {
    const identifier = IdentifierMap[originChainId];
    try {
      const detailData: any = await Axios.get(
        `${config.fetchUrl}/api/v1/xnft/public/box/${identifier}/${nftAddress}/${tokenId}`,
        {
          headers: {
            'Accept-Language': lang,
          },
        },
      );
      return detailData?.data?.data;
    } catch (e) {
      console.error('failed to get banners', e);
      return null;
    }
  };
  return fetchBoxDetail;
};

export default useBoxDetail;
