import { useEffect, useState, useContext } from 'react';
import { Context } from '@src/contexts/provider/Provider';
import { IdentifierMap } from '@utils/constants';
import config from '../config';
import Axios from 'axios';

const useBlindBox = (projectId: string) => {
  const [blind, setBlind] = useState({
    records: [],
  });
  const { lang, originChainId } = useContext(Context);
  const fetchBlinds = async () => {
    const identifier = IdentifierMap[originChainId];
    try {
      const response: any = await Axios.get(
        `${config.fetchUrl}/api/v1/xnft/public/collection/box/${identifier}/${projectId}?page=1&pageSize=20`,
        {
          headers: {
            'Accept-Language': lang,
          },
        },
      );
      const { data } = response.data;
      setBlind(
        data || {
          records: [],
        },
      );
      return data;
    } catch (e) {
      console.error('failed to get blindboxs', e);
    }
  };

  useEffect(() => {
    fetchBlinds();
  }, []);
  return blind;
};

export default useBlindBox;
