import { useContext, useEffect, useState } from 'react';
import { Context } from '@src/contexts/provider/Provider';
import Axios from 'axios';
import config from '../config';

// 14_chain-取得chain列表信息
const useChains = () => {
  const { lang } = useContext(Context);
  const [chains, setChains] = useState([]);
  const fetchChains = async () => {
    try {
      const response: any = await Axios.get(`${config.fetchUrl}/api/v1/xnft/public/cms/chain`, {
        headers: {
          'Accept-Language': lang,
        },
      });
      const { data } = response.data;
      setChains(data || []);
    } catch (e) {
      console.error('failed to get chains', e);
    }
  };

  useEffect(() => {
    fetchChains();
  }, []);

  return chains;
};

export default useChains;
