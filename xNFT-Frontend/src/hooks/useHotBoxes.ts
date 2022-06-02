import { useEffect, useState, useContext } from 'react';
import { Context } from '@src/contexts/provider/Provider';
import { IdentifierMap } from '@utils/constants';
import config from '../config';
import Axios from 'axios';

const useHotBoxes = () => {
  const [boxes, setBoxes] = useState({
    nft: [],
    collection: [],
    boxPrivate: [],
  });
  const { lang, originChainId } = useContext(Context);
  const identifier = IdentifierMap[originChainId];

  const fetchBoxes = async () => {
    try {
      const response: any = await Axios.get(
        `${config.fetchUrl}/api/v1/xnft/public/cms/recommend/${identifier}`,
        {
          headers: {
            'Accept-Language': lang,
          },
        },
      );
      const { data } = response.data;
      setBoxes(
        data || {
          nft: [],
          collection: [],
          boxPrivate: [],
        },
      );
    } catch (e) {
      console.error('failed to get nft and collections', e);
    }
  };

  useEffect(() => {
    fetchBoxes();
  }, []);

  return boxes;
};

export default useHotBoxes;
