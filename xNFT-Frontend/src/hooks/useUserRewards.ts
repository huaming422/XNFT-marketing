import { useContext, useEffect, useState } from 'react';
import { Context } from '@src/contexts/provider/Provider';
import { IdentifierMap } from '@utils/constants';
import { useWallet } from 'use-wallet';
import config from '../config';
import Axios from 'axios';

const useUserRewards = () => {
  const { account } = useWallet();
  const { lang, originChainId } = useContext(Context);
  return async () => {
    const identifier = IdentifierMap[originChainId];
    try {
      const response: any = await Axios.get(
        `${config.fetchUrl}/api/v1/xnft/user/award/${identifier}/${account}`,
        {
          headers: {
            'Accept-Language': lang,
          },
        },
      );
      const { data } = response.data || [];
      return data;
    } catch (e) {
      console.error('failed to get user cards', e);
      return Promise.reject('failed');
    }
  };
};

export default useUserRewards;
