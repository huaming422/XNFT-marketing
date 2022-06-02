import React, { useContext, useEffect } from 'react';
import Page from '@components/Page';
import AvatarInfo from './components/AvatarInfo';
import UserDetailTabs from './components/UserDetailTabs';
import { Context } from '@src/contexts/provider/Provider';
import Container from '@src/components/Container';
import { useWallet } from 'use-wallet';
import { useRouteMatch } from 'react-router-dom';
import { useState } from 'react';

const UserDetail: React.FC = () => {
  const match: {
    params: {
      tab: string;
    };
  } = useRouteMatch();
  const { tab } = match.params;
  const { connectWallet } = useContext(Context);

  // 获取 userAddress
  const { account } = useWallet();
  useEffect(() => {
    if (!window?.ethereum) {
      window.location.href = '/nowallet';
    }
    if (!account) {
      connectWallet();
    }
  }, []);

  const [refresh, setRefresh] = useState(false);

  return (
    <Page>
      <Container
        flex
        direction="column"
        align="center"
        justify="center"
        background="#FDFDFD"
        boxShadow="none"
        padding="0"
        margin="0"
      >
        <AvatarInfo
          account={account}
          handleChange={() => {
            setRefresh(!refresh);
          }}
        />
        <UserDetailTabs account={account} tab={tab === 'nfts' ? 0 : 1} refresh={refresh} />
      </Container>
    </Page>
  );
};

export default UserDetail;
