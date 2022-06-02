import { useContext } from 'react';
import { Context } from '@src/contexts/provider/Provider';
import { IdentifierMap } from '@utils/constants';
import config from '../config';
import { useIntl } from 'react-intl';
import Axios from 'axios';

const useCardDetail = () => {
  const intl = useIntl();
  const { lang, originChainId } = useContext(Context);
  const fetchCardDetail = async (
    tokenId: string,
    nftAddress: string,
    ownerAddress: string,
    boxAddress?: string,
    boxTokenId?: string,
  ) => {
    const identifier = IdentifierMap[originChainId];
    try {
      const detailData: any = await Axios.get(
        `${
          config.fetchUrl
        }/api/v1/xnft/public/nft/${identifier}/${nftAddress}/${tokenId}/${ownerAddress}?langCode=${
          intl.locale
        }&boxAddress=${boxAddress || ''}&boxTokenId=${boxTokenId || ''}`,
        {
          headers: {
            'Accept-Language': lang,
          },
        },
      );
      const { data } = detailData.data;
      return data;
    } catch (e) {
      console.error('failed to get card detail', e);
      return {};
    }
  };

  return fetchCardDetail;
};

export default useCardDetail;
