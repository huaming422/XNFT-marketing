import { useEffect, useState, useContext } from 'react';
import { Context } from '@src/contexts/provider/Provider';
import { IdentifierMap } from '@utils/constants';
import config from '../config';
import Axios from 'axios';

const usePaymentSymbols = () => {
  const { lang, originChainId } = useContext(Context);
  const [symbols, setSymbols] = useState([]);
  const fetchPaymentSymbols = async () => {
    const identifier = IdentifierMap[originChainId];
    try {
      const response: any = await Axios.get(
        `${config.fetchUrl}/api/v1/xnft/public/cms/contract/${identifier}`,
        {
          headers: {
            'Accept-Language': lang,
          },
        },
      );
      const { data } = response.data;
      setSymbols(data || []);
    } catch (e) {
      console.error('failed to get paymentSymbols', e);
      setSymbols([]);
    }
  };

  useEffect(() => {
    fetchPaymentSymbols();
  }, []);
  return symbols;
};

export default usePaymentSymbols;
