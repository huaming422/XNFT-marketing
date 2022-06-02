import React, { useState, useContext, useEffect, useRef, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { useIntl } from 'react-intl';
import Container from '../Container';
import Logo from '../Logo';
import Spacer from '@components/Spacer';
import useMedia from 'use-media';
import Decimal from 'decimal.js';
import Modal from 'styled-react-modal';
import { useHistory, useRouteMatch, NavLink } from 'react-router-dom';
import { Context } from '@src/contexts/provider/Provider';
import xNFTIcon from '@assets/img/xNFTLogo.png';
import XNPIcon from '@assets/img/XNPLogo.png';
import ArrowUp from '@assets/img/arrow-up.png';
import ArrowDown from '@assets/img/arrow-down.png';
import CloseIcon from '@assets/img/close.png';
import config from '@src/config';
import Dropdown from 'rc-dropdown';
import { throttle } from 'throttle-debounce';
import Menu, { Item as MenuItem } from 'rc-menu';
import useChains from '@hooks/useChains';
import Xnftlogo from '@assets/img/logo.png';
import openlogo from '@assets/img/open.png';
import { useWallet } from 'use-wallet';
import useUserRewards from '@hooks/useUserRewards';
import Button from '../Button';
import DefaultAvatar from '@assets/img/boy.png';
import { EVENT, IdentifierMap, metaDownloadUrl } from '@src/utils/constants';
import useOperation from '@src/hooks/useOperation';

declare global {
  interface window {
    ethereum?: any;
    location?: any;
  }
}
interface TopBarProps {
  hasBanner?: boolean;
}

const TopBar: React.FC<TopBarProps> = (props) => {
  const intl = useIntl();
  const match: {
    path: string;
  } = useRouteMatch();
  const history = useHistory();
  const chains = useChains();
  const { account } = useWallet();
  const fetchUserRewards = useUserRewards();
  const { lang, setLang, onSwitchChainId, originChainId, event, avatar, setAvatar } =
    useContext(Context);

  const { saveUserAddress } = useOperation();

  const [chainMenu, setChainMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const fetchData = async () => {
    const userRewards = await fetchUserRewards();
    setUserAwards(userRewards || []);

    const userInfo = await saveUserAddress();
    const { data } = userInfo;
    const { profileImageUrl } = data || {};
    if (profileImageUrl && !avatar) {
      setAvatar(`${profileImageUrl}?x-oss-process=image/resize,s_120`);
    }
  };
  const [userAwards, setUserAwards] = useState([]);
  useEffect(() => {
    if (account) {
      fetchData();
    }
  }, [account]);

  useEffect(() => {
    if (event === EVENT.UPDATE_AVATAR) {
      fetchData();
    }
  }, [event]);

  // 余额Modal
  const [balanceModal, setBalanceModal] = useState<boolean>(false);
  const toggleBalanceModal = () => {
    setBalanceModal(!balanceModal);
    fetchData();
  };

  const isMobile = useMedia({ maxWidth: '600px' });

  useEffect(() => {
    if (
      match.path.includes('/user') ||
      match.path.includes('/collection') ||
      match.path.includes('/demo') ||
      match.path.includes('/luckybox-detail') ||
      match.path.includes('/card-detail') ||
      match.path.includes('/nowallet') ||
      match.path.includes('/market')
    ) {
      setIsScrolled(true);
    }
  }, [match.path]);

  // 监听页面滚动修改顶部菜单栏
  const handleScroll = useCallback((e: any) => {
    if (
      match.path.includes('/user') ||
      match.path.includes('/collection') ||
      match.path.includes('/demo') ||
      match.path.includes('/luckybox-detail') ||
      match.path.includes('/card-detail') ||
      match.path.includes('/nowallet') ||
      match.path.includes('/market')
    ) {
      setIsScrolled(true);
    } else {
      const scrollTop =
        (e.srcElement ? e.srcElement.documentElement.scrollTop : false) ||
        window.pageYOffset ||
        (e.srcElement ? e.srcElement.body.scrollTop : 0);
      if (scrollTop > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    }
  }, []);
  useEffect(() => {
    const throttledHandleScroll = throttle(500, handleScroll);
    window.addEventListener('scroll', throttledHandleScroll);
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, []);

  const [chainId, setChainId] = useState(
    originChainId || localStorage.getItem('chainId') || config.chainId,
  );

  // user switched other chain
  const [chainModal, setChainModal] = useState(false);
  const toggleChainModal = () => {
    setChainModal(!chainModal);
  };

  const switchNetwork = (targetChainId: string) => {
    switch (targetChainId) {
      case '56':
        return window?.ethereum?.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x38',
              chainName: 'BSC Mainnet',
              nativeCurrency: {
                name: 'BSC',
                symbol: 'BNB',
                decimals: 18,
              },
              rpcUrls: ['https://bsc-dataseed.binance.org'],
              blockExplorerUrls: ['https://bscscan.com/'],
            },
          ],
        });
      case '97':
        // setOperation(OPERATION.DEFAULT);
        return window?.ethereum?.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x61',
              chainName: 'BSC Mainnet',
              nativeCurrency: {
                name: 'BSC',
                symbol: 'BNB',
                decimals: 18,
              },
              rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
              blockExplorerUrls: ['https://testnet-explorer.binance.org/'],
            },
          ],
        });
      case '128':
        return window?.ethereum?.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x80',
              chainName: 'Heco Mainnet',
              nativeCurrency: {
                name: 'Heco',
                symbol: 'HT',
                decimals: 18,
              },
              rpcUrls: ['https://http-mainnet-node.hecochain.com'],
              blockExplorerUrls: ['https://hecoinfo.com'],
            },
          ],
        });
      case '256':
        return window?.ethereum?.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x100',
              chainName: 'Heco Testnet',
              nativeCurrency: {
                name: 'Heco',
                symbol: 'HT',
                decimals: 18,
              },
              rpcUrls: ['https://http-testnet.hecochain.com'],
              blockExplorerUrls: ['https://testnet.hecoinfo.com'],
            },
          ],
        });
      case '1337':
    }
  };

  const chainMenus = (
    <StyledChainMenu mode="inline">
      {chains.map((item) => (
        <MenuItem
          key={item.identifier}
          onClick={() => {
            localStorage.setItem('chainId', item.chainId);
            onSwitchChainId(item.chainId);
            setChainId(item.chainId);
            switchNetwork(`${item.chainId}`);
            window.location.reload();
          }}
        >
          <img src={item.imageUrl} width="24px" alt="" />
          <Spacer size="sm" />
          <span>{item.identifier}</span>
        </MenuItem>
      ))}
    </StyledChainMenu>
  );

  const symbolIconMap: { [key: string]: string } = {
    XNFT: xNFTIcon,
    XNP: XNPIcon,
  };
  const [symbol, setSymbol] = useState('XNP');
  const symbolMenus = (
    <StyledSymbolMenu mode="inline">
      <MenuItem
        key="XNP"
        onClick={() => {
          setSymbol('XNP');
        }}
      >
        <img src={symbolIconMap.XNP} width="24px" alt="" />
        <Spacer size="sm" />
        <span>XNP</span>
      </MenuItem>
      <MenuItem
        key="XNFT"
        onClick={() => {
          setSymbol('XNFT');
        }}
      >
        <img src={symbolIconMap.XNFT} width="24px" alt="" />
        <Spacer size="sm" />
        <span>XNFT</span>
      </MenuItem>
    </StyledSymbolMenu>
  );

  const luckyboxMenus = (
    <StyledSymbolMenu mode="inline">
      <MenuItem
        key="create_nft"
        onClick={() => {
          history.push(`/nft-card`);
        }}
      >
        {intl.formatMessage({ id: 'topbar.menu.item.create.nft' })}
      </MenuItem>
      {/* <MenuItem
        key="create_luckybox"
        onClick={() => {
          history.push(`/luckybox`);
        }}
      >
        {intl.formatMessage({ id: 'topbar.menu.item.create.luckybox' })}
      </MenuItem> */}
    </StyledSymbolMenu>
  );

  const langMenus = (
    <StyledSymbolMenu mode="inline">
      <MenuItem
        key="zh"
        onClick={() => {
          setLang('zh-CN');
          localStorage.setItem('language', 'zh-CN');
          window.location.reload();
        }}
      >
        简体中文
      </MenuItem>
      <MenuItem
        key="en"
        onClick={() => {
          setLang('en-US');
          localStorage.setItem('language', 'en-US');
          window.location.reload();
        }}
      >
        English
      </MenuItem>
    </StyledSymbolMenu>
  );

  useEffect(() => {
    const currentChainId = Number(window?.ethereum?.chainId);
    if (
      window?.ethereum &&
      chainId &&
      chainId !== currentChainId &&
      chains &&
      chains.length > 0
    ) {
      const currentChain = chains.find((item) => item.chainId === currentChainId);
      if (!currentChain) {
        //   localStorage.setItem('chainId', `${currentChainId}`);
        //   onSwitchChainId(currentChainId);
        //   setChainId(currentChainId);
        //   switchNetwork(`${currentChainId}`);
        // } else {
        if (window.location.pathname !== '/') {
          toggleChainModal();
        }
      }
    }
  }, [chains]);

  useEffect(() => {
    localStorage.setItem('chainId', chainId);
    switchNetwork(`${chainId}`);
  }, [chainId]);

  const awardIssuedAmount =
    userAwards?.find((item) => item.awardSymbol === symbol)?.awardIssuedAmount || 0;
  const awardUnissuedAmount =
    userAwards?.find((item) => item.awardSymbol === symbol)?.awardUnissuedAmount || 0;

  const userTotalAmount = new Decimal(awardIssuedAmount).add(awardUnissuedAmount).toFixed(4);

  if (isMobile) {
    return (
      <HeaderTopBar scrolled={isScrolled}>
        <img
          onClick={() => {
            history.push('/');
          }}
          className="xnft-logo"
          src={Xnftlogo}
          alt=""
        />
        <Dropdown
          trigger="click"
          overlay={chainMenus}
          placement="bottomCenter"
          onVisibleChange={(visible) => {
            setChainMenu(visible);
          }}
        >
          <StyledDropdownChainMenu
            borderRadius={20}
            onClick={() => {
              setChainMenu(!chainMenu);
            }}
          >
            {chains.find((item) => item.chainId === Number(chainId))?.identifier ||
              IdentifierMap[config.chainId]?.toUpperCase()}
            <Spacer size="sm" />
            {<img width="10px" src={chainMenu ? ArrowUp : ArrowDown} alt="" />}
          </StyledDropdownChainMenu>
        </Dropdown>
        <Spacer size="lg" />
        <img
          onClick={() => {
            history.push('/mobile-menu');
          }}
          className="open-logo"
          src={openlogo}
          alt=""
        />
        <StyledChainModal
          isOpen={chainModal}
          onBackgroundClick={() => {
            toggleChainModal();
          }}
          onEscapeKeydown={() => {
            toggleChainModal();
          }}
        >
          <Container flex direction="column" align="center" justify="center" padding="40px">
            <div className="title">
              <span>{intl.formatMessage({ id: 'wallet.switch.title' })}</span>
              <img
                className="close"
                src={CloseIcon}
                width="24px"
                alt=""
                onClick={() => {
                  toggleChainModal();
                }}
              />
            </div>
            <Spacer size="md" />
            <div
              className="message"
              dangerouslySetInnerHTML={{
                __html: intl.formatMessage(
                  { id: 'wallet.switch.content1' },
                  {
                    chainId: `<strong>${Number(window?.ethereum?.chainId || 1)}</strong>`,
                    chainName: `<strong>${IdentifierMap[chainId]?.toUpperCase()}</strong>`,
                  },
                ),
              }}
            />
            <Spacer size="md" />
            <div
              className="message"
              dangerouslySetInnerHTML={{
                __html: intl.formatMessage(
                  { id: 'wallet.switch.content2' },
                  {
                    metaMask: `<span onclick="window.open('${metaDownloadUrl}')">MetaMask</span>`,
                  },
                ),
              }}
            />
            <Spacer size="lg" />
            <div className="bottom">
              <Button
                onClick={() => {
                  onSwitchChainId(chainId);
                  setChainId(chainId);
                  switchNetwork(`${chainId}`);
                  toggleChainModal();
                }}
                size={'sm'}
                variant="primary"
                text={intl.formatMessage({ id: 'wallet.switch.button.switch' })}
              />
              <Button
                onClick={() => {
                  toggleChainModal();
                }}
                size={'sm'}
                variant="secondary"
                text={intl.formatMessage({ id: 'wallet.switch.button.ignore' })}
              />
            </div>
          </Container>
        </StyledChainModal>
      </HeaderTopBar>
    );
  } else {
    return (
      <StyledTopBar scrolled={isScrolled}>
        <Container padding="0">
          <StyledTopBarInner>
            <StyledNav exact to={`/`}>
              <div style={{ flex: 1 }}>
                <Logo />
              </div>
            </StyledNav>
            <Spacer size="lg" />
            <Spacer size="lg" />
            <Dropdown
              overlay={chainMenus}
              placement="bottomCenter"
              onVisibleChange={(visible) => {
                setChainMenu(visible);
              }}
            >
              <StyledDropdownChainMenu borderRadius={20}>
                {chains.find((item) => item.chainId === Number(chainId))?.identifier ||
                  IdentifierMap[config.chainId]?.toUpperCase()}
                <Spacer size="sm" />
                {<img width="10px" src={chainMenu ? ArrowUp : ArrowDown} alt="" />}
              </StyledDropdownChainMenu>
            </Dropdown>
            <Spacer size="md" />
            <StyledNav exact to={`/market-nft`} activeStyle={{ color: '#fff' }}>
              {intl.formatMessage({ id: 'market.nft.search.title' })}
            </StyledNav>
            <Spacer size="md" />
            {/* <StyledNav exact to={`/staking-nft`} activeStyle={{ color: '#fff' }}>
              {intl.formatMessage({ id: 'topbar.nft.staking.title' })}
            </StyledNav> */}
            <Spacer size="md" />
            {/* <StyledNav exact to={`/market-luckybox`} activeStyle={{ color: '#fff' }}>
              {intl.formatMessage({ id: 'market.luckybox.title' })}
            </StyledNav> */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
            >
              <Spacer size="lg" />
              <Dropdown
                align={{ targetOffset: [0, -4] }}
                overlay={symbolMenus}
                placement="bottomCenter"
              >
                <StyledAccount
                  onClick={() => {
                    toggleBalanceModal();
                  }}
                >
                  <img width="36px" src={symbolIconMap[symbol]} alt="" />
                  <Spacer size="sm" />
                  {userTotalAmount || '-'}
                </StyledAccount>
              </Dropdown>
              <Spacer size="md" />
              <StyledNav exact to={`/user/nfts`}>
                <StyledIcon icon={avatar || DefaultAvatar} />
              </StyledNav>
              <Spacer size="lg" />
              <Dropdown
                align={{ targetOffset: [0, -4] }}
                overlay={luckyboxMenus}
                placement="bottomCenter"
              >
                <StyledCreateBtn>
                  {intl.formatMessage({ id: 'topbar.button.create.luckybox' })}
                </StyledCreateBtn>
              </Dropdown>
              <Spacer size="md" />
              <Dropdown
                align={{ targetOffset: [0, -14] }}
                overlay={langMenus}
                placement="bottomCenter"
              >
                <StyledLanaugeMenu>
                  <span>{lang === 'zh-CN' ? '简体中文' : 'English'}</span>
                </StyledLanaugeMenu>
              </Dropdown>
            </div>
          </StyledTopBarInner>
        </Container>
        <StyledModal
          isOpen={balanceModal}
          onBackgroundClick={() => {
            toggleBalanceModal();
          }}
          onEscapeKeydown={() => {
            toggleBalanceModal();
          }}
        >
          <Container flex direction="column" align="center" justify="center" padding="40px">
            <div className="title">
              <span>{intl.formatMessage({ id: 'topbar.modal.balance.title' })}</span>
              <img
                className="close"
                src={CloseIcon}
                width="24px"
                alt=""
                onClick={() => {
                  toggleBalanceModal();
                }}
              />
            </div>
            <Spacer size="md" />
            <img src={symbolIconMap[symbol]} width="100px" alt="" />
            <Spacer size="lg" />
            <span className="balance">
              {userTotalAmount}
              {'  '}
              {symbol}
            </span>
            <Spacer size="lg" />
            <div className="bottom">
              <div className="item">
                <span>{intl.formatMessage({ id: 'topbar.modal.balance.wallet.label' })}</span>
                <Spacer size="sm" />
                <span>{new Decimal(awardIssuedAmount).toFixed(4)}</span>
              </div>
              <Spacer size="lg" />
              <div className="divider"></div>
              <Spacer size="lg" />
              <div className="item">
                <span>{intl.formatMessage({ id: 'topbar.modal.balance.unget.label' })}</span>
                <Spacer size="sm" />
                <span>{new Decimal(awardUnissuedAmount).toFixed(4)}</span>
              </div>
            </div>
            <Spacer size="lg" />
          </Container>
        </StyledModal>
        <StyledChainModal
          isOpen={chainModal}
          onBackgroundClick={() => {
            toggleChainModal();
          }}
          onEscapeKeydown={() => {
            toggleChainModal();
          }}
        >
          <Container flex direction="column" align="center" justify="center" padding="40px">
            <div className="title">
              <span>{intl.formatMessage({ id: 'wallet.switch.title' })}</span>
              <img
                className="close"
                src={CloseIcon}
                width="24px"
                alt=""
                onClick={() => {
                  toggleChainModal();
                }}
              />
            </div>
            <Spacer size="md" />
            <div
              className="message"
              dangerouslySetInnerHTML={{
                __html: intl.formatMessage(
                  { id: 'wallet.switch.content1' },
                  {
                    chainId: `<strong>${Number(window?.ethereum?.chainId || 1)}</strong>`,
                    chainName: `<strong>${IdentifierMap[chainId]?.toUpperCase()}</strong>`,
                  },
                ),
              }}
            />
            <Spacer size="md" />
            <div
              className="message"
              dangerouslySetInnerHTML={{
                __html: intl.formatMessage(
                  { id: 'wallet.switch.content2' },
                  {
                    metaMask: `<span onclick="window.open('${metaDownloadUrl}')">MetaMask</span>`,
                  },
                ),
              }}
            />
            <Spacer size="lg" />
            <div className="bottom">
              <Button
                onClick={() => {
                  onSwitchChainId(chainId);
                  setChainId(chainId);
                  switchNetwork(`${chainId}`);
                  toggleChainModal();
                }}
                size={'md'}
                variant="primary"
                text={intl.formatMessage({ id: 'wallet.switch.button.switch' })}
              />
              <Button
                onClick={() => {
                  toggleChainModal();
                }}
                size={'md'}
                variant="secondary"
                text={intl.formatMessage({ id: 'wallet.switch.button.ignore' })}
              />
            </div>
          </Container>
        </StyledChainModal>
      </StyledTopBar>
    );
  }
};

const StyledIcon = styled.div`
  width: 36px;
  height: 36px;
  background: url(${(props: { icon: string }) => props.icon});
  background-size: cover;
  border-radius: 50%;
`;
const StyledChainModal = Modal.styled`
  width: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background-color: #fff;
  .close {
    cursor: pointer;
  }
  .title {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    span {
      font-size: 24px;
      font-weight: 600;
      color: #000000;
      line-height: 36px;
    }
  }
  .bottom {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  span {
    cursor: pointer;
    color: ${(props: any) => props.theme.color.primary.main};
    font-weight: 600;
  }

  @media (max-width: 600px) {
    width: 90%;
  }
`;

const HeaderTopBar = styled.div`
  animation: ${(props: { scrolled: boolean; theme: any; hasBanner?: boolean }) =>
      props.scrolled ? bgKeyframes : unBgKeyframes}
    0.2s 1;
  animation-fill-mode: forwards;
  z-index: 10;
  .xnft-logo {
    width: 130px;
    height: 35px;
    padding-left: 20px;
  }
  .open-logo {
    width: 24px;
    height: 24px;
    margin-right: 20px;
  }
  @media (max-width: 600px) {
    width: 100%;
    height: 58px;
    box-shadow: 0px -1px 0px 0px #23273a;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;
const StyledChainMenu = styled(Menu)`
  .rc-dropdown-menu-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding-right: 32px;
    padding-left: 8px !important;
    min-width: 120px;
  }
`;

const StyledSymbolMenu = styled(Menu)`
  .rc-dropdown-menu-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding-right: 8px;
    padding-left: 8px !important;
    &::after {
      display: none !important;
    }
  }
`;

const StyledCreateBtn = styled.div`
  cursor: pointer;
  border-radius: 22px;
  border: 1px solid #fff;
  font-size: 16px;
  font-family: 'Noto Sans SC', sans-serif;
  font-weight: 600;
  color: #fff;
  line-height: 22px;
  padding: 8px 16px;
`;

const StyledAccount = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 22px;
  height: 40px;
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 2px;
  color: #ffffff;
  cursor: pointer;
  padding-right: 16px;
  font-family: 'Oswald', sans-serif;
`;

const StyledLanaugeMenu = styled.div`
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  line-height: 20px;
`;

const StyledDropdownChainMenu = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 500;
  min-width: 120px;
  color: #000;
  background: #fff;
  cursor: pointer;
  -webkit-text-decoration: none;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: ${(props: { borderRadius?: number }) => props.borderRadius || 4}px;
  @media (max-width: 600px) {
    padding: 4px 8px;
    min-width: auto;
    font-size: 12px;
  }
`;

const StyledModal = Modal.styled`
  width: 520px;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-radius: 8px;
  @media (max-width: 600px) {
    width: 90%;
  }
  .close {
    cursor: pointer;
  }
  .title {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    span {
      font-size: 24px;
      font-weight: 600;
      color: #000000;
      line-height: 36px;
    }
  }
  .balance {
    font-size: 28px;
    font-weight: 500;
    color: #000000;
    line-height: 41px;
    font-family: 'Oswald',sans-serif;
  }
  .bottom {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    .item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      span:last-child {
        font-size: 16px;
        font-weight: 600;
        color: #000000;
        line-height: 24px;
        font-family: 'Oswald',sans-serif;
      }
    }
    .divider {
      width: 1px;
      height: 48px;
      background: #D8D8D8;
    }
  }
`;

const bgKeyframes = keyframes`
  from {
    background-color: transparent;
  }
 to {
    background-color: rgba(35, 39, 58, 1);
    box-shadow: 0px -1px 0px 0px #23273A;
  }
`;

const unBgKeyframes = keyframes`
  from {
    background-color: rgba(35, 39, 58, 1);
    box-shadow: 0px -1px 0px 0px #23273A;
  }
 to {
    background-color: transparent;
    box-shadow: none;
  }
`;
const StyledTopBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  animation: ${(props: { scrolled: boolean; theme: any; hasBanner?: boolean }) =>
      props.scrolled ? bgKeyframes : unBgKeyframes}
    0.2s 1;
  animation-fill-mode: forwards;
  /* ${(props: { scrolled: boolean; theme: any; hasBanner?: boolean }) =>
    props.hasBanner ? '' : 'background: #151824 !important'} */
`;

const StyledTopBarInner = styled.div`
  width: 100%;
  align-items: center;
  display: flex;
  height: ${(props) => props.theme.topBarSize}px;
  justify-content: space-between;
  padding: 0 60px;
  margin: 0 auto;
  flex-wrap: wrap;
  box-sizing: border-box;
  @media (max-width: 600px) {
    height: auto;
  }
  @media (min-width: 2000px) {
    padding: 0 240px;
  }
  .user {
    width: 36px;
    height: 36px;
    cursor: pointer;
  }
`;

const animationShadow = keyframes`
 from {
      text-shadow: 0 0 10px #fff,
          0 0 20px #fff,
          0 0 30px #fff,
          0 0 40px #0080ff,
          0 0 70px #0080ff,
          0 0 80px #0080ff,
          0 0 100px #0080ff,
          0 0 150px #0080ff;
  }

  to {
      text-shadow: 0 0 0px #fff,
          0 0 5px #fff,
          0 0 10px #fff,
          0 0 15px #0080ff,
          0 0 20px #0080ff,
          0 0 30px #0080ff,
          0 0 40px #0080ff,
          0 0 50px #0080ff;
  }
`;

const StyledNav = styled(NavLink)`
  font-size: 18px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    cursor: pointer;
  }
  :hover {
    /* box-shadow: ${(props) => `${props.theme.color.primary.main} 0px 2px 10px 0px`}; */
    /* animation: ${animationShadow} 1.5s ease infinite alternate; */
  }
`;

const StyledMenuNav = styled(NavLink)`
  font-size: 16px;
  font-family: 'Noto Sans SC', sans-serif;
  font-weight: 600;
  color: #000000;
  line-height: 22px;
  text-decoration: none;
`;

export default TopBar;
