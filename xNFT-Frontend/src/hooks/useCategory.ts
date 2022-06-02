import { useContext, useEffect, useState } from 'react';
import { Context } from '@src/contexts/provider/Provider';
import config from '../config';
import { useIntl } from 'react-intl';
import Axios from 'axios';

const useCategory = () => {
  const intl = useIntl();
  const { lang } = useContext(Context);
  const [categorys, setCategorys] = useState([]);
  const fetchCategorys = async () => {
    try {
      const response: any = await Axios.get(
        `${config.fetchUrl}/api/v1/xnft/public/cms/category?langCode=${intl.locale}`,
        {
          headers: {
            'Accept-Language': lang,
          },
        },
      );
      const { data } = response.data;
      setCategorys(data || []);
    } catch (e) {
      console.error('failed to get banners', e);
      setCategorys([]);
    }
  };

  useEffect(() => {
    fetchCategorys();
  }, []);
  return categorys;
};

export default useCategory;
