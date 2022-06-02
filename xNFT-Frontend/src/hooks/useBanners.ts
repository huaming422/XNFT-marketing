import { useEffect, useState, useContext } from 'react';
import { Context } from '@src/contexts/provider/Provider';
import { IdentifierMap } from '@utils/constants';
import config from '../config';
import { useIntl } from 'react-intl';
import axios from 'axios';
/**
 * 1. [] componentDidMount
 * 2. [test] listen test update
 * 3. unmount
 * @returns
 */
const useBanners = () => {
  const intl = useIntl();
  const { lang, originChainId } = useContext(Context);
  const [banners, setBanners] = useState([]);
  const fetchBanners = async () => {
    const identifier = IdentifierMap[originChainId];
    try {
      const response: any = await axios.get(
        `${config.fetchUrl}/api/v1/xnft/public/cms/banner/${identifier}?langCode=${intl.locale}`,
        {
          headers: {
            'Accept-Language': lang,
          },
        },
      );
      const { data } = response.data;
      setBanners(data || []);
    } catch (e) {
      console.error('failed to get banners', e);
      setBanners([]);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);
  return banners;
};

export default useBanners;
