import { useEffect, useState, useContext } from 'react';
import { Context } from '@src/contexts/provider/Provider';
import { IdentifierMap } from '@utils/constants';
import { useWallet } from 'use-wallet';
import config from '../config';
import Axios from 'axios';

const useNFTPlatforms = () => {
  const { lang, originChainId } = useContext(Context);
  const { account } = useWallet();
  const [nftPlatforms, setNFTPlatForms] = useState([]);
  const fetchNFTPlatforms = async () => {
    const identifier = IdentifierMap[originChainId];
    try {
      const response: any = await Axios.get(
        `${
          config.fetchUrl
        }/api/v1/xnft/public/nft/contract/${identifier}/${account?.toLowerCase()}`,
        {
          headers: {
            'Accept-Language': lang,
          },
        },
      );
      const { data } = response.data;
      setNFTPlatForms(data || []);
    } catch (e) {
      console.error('failed to get paymentSymbols', e);
      setNFTPlatForms([]);
    }
  };

  useEffect(() => {
    if (account) {
      fetchNFTPlatforms();
    }
  }, [account]);

  return nftPlatforms;
};

export default useNFTPlatforms;
