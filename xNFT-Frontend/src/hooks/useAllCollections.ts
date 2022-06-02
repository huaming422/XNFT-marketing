import { useEffect, useState, useContext } from 'react';
import { Context } from '@src/contexts/provider/Provider';
import { IdentifierMap } from '@utils/constants';
import { useWallet } from 'use-wallet';
import config from '../config';
import Axios from 'axios';

const useNFTPlatforms = () => {
  const { lang, originChainId } = useContext(Context);
  const { account } = useWallet();
  const [collections, setCollections] = useState([]);
  const fetchAllCollections = async () => {
    const identifier = IdentifierMap[originChainId];
    try {
      const response: any = await Axios.get(
        `${config.fetchUrl}/api/v1/xnft/public/nft/collection/${identifier}`,
        {
          headers: {
            'Accept-Language': lang,
          },
        },
      );
      const { data } = response.data;
      setCollections(data || []);
    } catch (e) {
      console.error('failed to get collections', e);
      setCollections([]);
    }
  };

  useEffect(() => {
    fetchAllCollections();
  }, []);

  return collections;
};

export default useNFTPlatforms;
