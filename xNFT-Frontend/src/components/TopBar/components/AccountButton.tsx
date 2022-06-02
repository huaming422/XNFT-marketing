import React, { useEffect, useState, useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { useWallet, ChainUnsupportedError } from 'use-wallet';
import Button from '@src/components/Button';
import Dropdown from 'rc-dropdown';
import { useIntl } from 'react-intl';
import useMedia from 'use-media';
import Menu, { Item as MenuItem } from 'rc-menu';
import 'rc-dropdown/assets/index.css';

interface AccountButtonProps {}

declare global {
  interface Window {
    ethereum?: any;
  }
}

const AccountButton: React.FC<AccountButtonProps> = () => {
  const intl = useIntl();
  const [errorTxt, setErrorTxt] = useState('');
  const { color } = useContext(ThemeContext);
  const { account, connect, reset, error } = useWallet();
  const isMobile = useMedia({ maxWidth: '600px' });

  /* eslint-disable react-hooks/exhaustive-deps */
  const connectWallet = () => {
    connect('injected');
    localStorage.setItem('autoConnect', 'true');
  };

  useEffect(() => {
    const autoConnect = localStorage.getItem('autoConnect');
    if (!autoConnect) {
      localStorage.setItem('autoConnect', 'true');
      connectWallet();
    }
  }, []);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const autoConnect = localStorage.getItem('autoConnect');
    if (!account && autoConnect === 'true') {
      connectWallet();
    }
    if (account) {
      setErrorTxt('');
    }
  }, [account]);

  useEffect(() => {
    if (error instanceof ChainUnsupportedError) {
      setErrorTxt(intl.formatMessage({ id: 'common.connect.wallet.network.error' }));
    } else {
      setErrorTxt('');
    }
  }, [error]);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    window?.ethereum?.on('connect', () => {
      console.debug('connected');
      connectWallet();
    });

    window?.ethereum?.on('disconnect', () => {
      console.debug('disconnect');
      window.location.reload();
    });

    window?.ethereum?.on('accountsChanged', (accounts: Array<string>) => {
      console.debug('account changed', accounts);
      connectWallet();
    });

    window?.ethereum?.on('networkChanged', (networkId: number) => {
      console.debug('networkChanged', networkId);
      window.location.reload();
    });

    window?.ethereum?.on('chainChanged', (chainId: number) => {
      console.debug('chainChanged', chainId);
      window.location.reload();
    });
  }, []);

  if (errorTxt) {
    return (
      <Button
        onClick={() => connectWallet()}
        size={isMobile ? 'sm' : 'md'}
        variant="primary"
        text={intl.formatMessage({ id: 'common.connect.wallet.network.error' })}
      />
    );
  }
  return (
    <StyledAccountButton>
      {!account ? (
        <Button
          onClick={() => connectWallet()}
          variant="primary"
          size={isMobile ? 'sm' : 'md'}
          text={intl.formatMessage({ id: 'common.connect.wallet' })}
        />
      ) : (
        <Dropdown
          overlay={
            <Menu mode="inline">
              <MenuItem
                key="Heco"
                onClick={() => {
                  localStorage.setItem('autoConnect', 'false');
                  reset();
                }}
              >
                {intl.formatMessage({ id: 'common.disconnect.wallet' })}
              </MenuItem>
            </Menu>
          }
          placement="bottomCenter"
        >
          <StyledDropdownChainMenu color={color.primary.main}>
            {`${account.slice(0, 5)}...${account.slice(account.length - 5, account.length)}`}
          </StyledDropdownChainMenu>
        </Dropdown>
      )}
    </StyledAccountButton>
  );
};

const StyledDropdownChainMenu = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 400;
  color: #fff;
  background: ${(props) => props.color};
  cursor: pointer;
  -webkit-text-decoration: none;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 4px;
  min-width: 100px;
`;

const StyledAccountButton = styled.div`
  button {
    height: 38px;
  }
`;

const StyledQuitBtn = styled.div`
  background-color: #0079ff;
  border-radius: 4px;
  padding: 8px 12px;
  margin-top: 8px;
  cursor: pointer;
`;

export default AccountButton;
