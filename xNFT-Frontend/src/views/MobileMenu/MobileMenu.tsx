import React, { useEffect, useState, useContext } from 'react';
import Page from '@components/Page';
import { useIntl } from 'react-intl';
import { Context } from '@src/contexts/provider/Provider';
import styled from 'styled-components';
import Logo from '@components/Logo';
import Spacer from '@components/Spacer';
import Dropdown from 'rc-dropdown';
import Modal from 'styled-react-modal';
import Menu, { Item as MenuItem } from 'rc-menu';
import Container from '@components/Container';
import CloseIcon from '@assets/img/close.png';
import xNFTIcon from '@assets/img/xNFTLogo.png';
import XNPIcon from '@assets/img/XNPLogo.png';
import BoyIcon from '@assets/img/boy.png';
import RightIcon from '@assets/img/user-right.png';
import { useHistory } from 'react-router';
import { useWallet } from 'use-wallet';
import useUserRewards from '@hooks/useUserRewards';
import useOperation from '@hooks/useOperation';
import { formatAddress } from '@src/utils/tools';
import Decimal from 'decimal.js';
import Button from '@src/components/Button';

const MobileMenu: React.FC = () => {
  const intl = useIntl();

  const history = useHistory();
  const { account } = useWallet();

  // 余额Modal
  const [balanceModal, setBalanceModal] = useState<boolean>(false);
  const toggleBalanceModal = () => {
    setBalanceModal(!balanceModal);
  };

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

  const symbolIconMap: { [key: string]: string } = {
    xNFT: xNFTIcon,
    XNP: XNPIcon,
  };
  const [symbol, setSymbol] = useState('xNFT');
  const symbolMenus = (
    <StyledSymbolMenu mode="inline">
      <MenuItem
        key="xNFT"
        onClick={() => {
          setSymbol('xNFT');
          toggleBalanceModal();
        }}
      >
        <img src={symbolIconMap.xNFT} width="24px" alt="" />
        <Spacer size="sm" />
        <span>xNFT</span>
      </MenuItem>
      <MenuItem
        key="XNP"
        onClick={() => {
          setSymbol('XNP');
          toggleBalanceModal();
        }}
      >
        <img src={symbolIconMap.XNP} width="24px" alt="" />
        <Spacer size="sm" />
        <span>XNP</span>
      </MenuItem>
    </StyledSymbolMenu>
  );

  const { lang, setLang, connectWallet, avatar, setAvatar } = useContext(Context);

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

  const [showNickname, setShowNickname] = useState('');

  const { saveUserAddress } = useOperation();

  const fetchUserRewards = useUserRewards();
  const fetchData = async () => {
    const userRewards = await fetchUserRewards();
    setUserAwards(userRewards || []);

    const userInfo = await saveUserAddress();
    const { data } = userInfo;
    const { nickname, profileImageUrl } = data || {};
    if (profileImageUrl && !avatar) {
      setAvatar(`${profileImageUrl}?x-oss-process=image/resize,s_120`);
    }
    if (nickname) {
      setShowNickname(nickname);
    }
  };
  const [userAwards, setUserAwards] = useState([]);
  useEffect(() => {
    if (account) {
      fetchData();
    }
  }, [account]);

  useEffect(() => {
    if (!account) {
      connectWallet();
    }
  }, [account]);

  const awardIssuedAmount =
    userAwards?.find((item) => item.awardSymbol === symbol)?.awardIssuedAmount || 0;
  const awardUnissuedAmount =
    userAwards?.find((item) => item.awardSymbol === symbol)?.awardUnissuedAmount || 0;
  const userTotalAmount = new Decimal(awardIssuedAmount).add(awardUnissuedAmount).toFixed(4);

  const xnftAwardIssuedAmount =
    userAwards?.find((item) => item.awardSymbol === 'XNFT')?.awardIssuedAmount || 0;
  const xnftAwardUnissuedAmount =
    userAwards?.find((item) => item.awardSymbol === 'XNFT')?.awardUnissuedAmount || 0;
  const xnftTotal = new Decimal(xnftAwardIssuedAmount).add(xnftAwardUnissuedAmount).toFixed(4);

  const xnpAwardIssuedAmount =
    userAwards?.find((item) => item.awardSymbol === 'XNP')?.awardIssuedAmount || 0;
  const xnpAwardUnissuedAmount =
    userAwards?.find((item) => item.awardSymbol === 'XNP')?.awardUnissuedAmount || 0;
  const xnpTotal = new Decimal(xnpAwardIssuedAmount).add(xnpAwardUnissuedAmount).toFixed(4);

  return (
    <Container
      flex
      direction="column"
      align="center"
      justify="center"
      padding="0"
      margin="0"
      background="transparent"
      boxShadow="none"
    >
      <StyledTopBar>
        <Logo color="black" />
        <Spacer size="md" />
        <Dropdown
          trigger="click"
          align={{ targetOffset: [0, -8] }}
          overlay={langMenus}
          placement="bottomCenter"
        >
          <StyledLanaugeMenu>
            <span>{lang === 'zh-CN' ? '简体中文' : 'English'}</span>
          </StyledLanaugeMenu>
        </Dropdown>
        <div className="close">
          <img
            src={CloseIcon}
            onClick={() => {
              history.push('/');
            }}
            width="16px"
            height="16px"
            alt=""
          />
        </div>
      </StyledTopBar>
      <Spacer size="sm" />
      <StyledUser
        onClick={() => {
          history.push('/user/nfts');
        }}
      >
        <img className="avatar" src={avatar || BoyIcon} alt="" />
        <Spacer size="sm" />
        <span>{showNickname || (account ? formatAddress(account) : '-')}</span>
        <div className="icon">
          <img src={RightIcon} width="16px" height="16px" alt="" />
        </div>
      </StyledUser>
      <StyledDivider />
      <StyledBalance>
        <div
          className="item"
          onClick={() => {
            setSymbol('XNFT');
            toggleBalanceModal();
          }}
        >
          <div className="icon">
            <img src={symbolIconMap.xNFT} width="24px" alt="" />
            <Spacer size="sm" />
            <span>XNFT</span>
          </div>
          <div>{xnftTotal}</div>
        </div>
        <div
          className="item"
          onClick={() => {
            setSymbol('XNP');
            toggleBalanceModal();
          }}
        >
          <div className="icon">
            <img src={symbolIconMap.XNP} width="24px" alt="" />
            <Spacer size="sm" />
            <span>XNP</span>
          </div>
          <div>{xnpTotal}</div>
        </div>
      </StyledBalance>
      <StyledBlank />
      <StyledMenu
        onClick={() => {
          history.push('/market-nft');
        }}
      >
        <span>{intl.formatMessage({ id: 'market.nft.search.title' })}</span>
      </StyledMenu>
      {/* <StyledMenu
        onClick={() => {
          history.push('/market-luckybox');
        }}
      >
        <span>{intl.formatMessage({ id: 'market.luckybox.title' })}</span>
      </StyledMenu> */}
      <StyledBottom>
        <Button
          onClick={() => {
            history.push('/nft-card');
          }}
          size={'md'}
          variant="green"
          text={intl.formatMessage({ id: 'user.detail.myNFTEmptyButtonValue' })}
        />
        {/* <Button
          onClick={() => {
            history.push('/luckybox');
          }}
          size={'md'}
          variant="blue"
          text={intl.formatMessage({ id: 'user.detail.myLuckyBoxButtonValue' })}
        /> */}
      </StyledBottom>
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
          <img src={symbolIconMap[symbol]} width="100px" />
          <Spacer size="md" />
          <span className="balance">
            {userTotalAmount}
            {'  '}
            {symbol}
          </span>
          <Spacer size="md" />
          <div className="bottom">
            <div className="item">
              <span>{intl.formatMessage({ id: 'topbar.modal.balance.wallet.label' })}</span>
              <Spacer size="sm" />
              <span>{awardIssuedAmount}</span>
            </div>
            <Spacer size="md" />
            <div className="divider"></div>
            <Spacer size="md" />
            <div className="item">
              <span>{intl.formatMessage({ id: 'topbar.modal.balance.unget.label' })}</span>
              <Spacer size="sm" />
              <span>{awardUnissuedAmount}</span>
            </div>
          </div>
          <Spacer size="lg" />
        </Container>
      </StyledModal>
    </Container>
  );
};
const StyledMenu = styled.div`
  width: 100%;
  padding-left: 20px;
  span {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 12px 20px;
    border-bottom: 1px solid #f0f0f0;
  }
`;

const StyledBlank = styled.div`
  width: 100%;
  height: 10px;
  background: #f0f0f0;
`;

const StyledDivider = styled.div`
  width: calc(100% - 16px);
  margin-left: 16px;
  height: 1px;
  background: rgba(0, 0, 0, 0.06);
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
    img{
      width:16px;
      display:inline-block;
      @media (max-width: 600px) {
        width:16px;
      }
    }
    
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
      @media (max-width: 600px) {
        font-size: 18px;
      }
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

const StyledCreateBtn = styled.div`
  cursor: pointer;
  border-radius: 22px;
  border: 1px solid #fff;
  font-size: 16px;
  font-family: 'Noto Sans SC', sans-serif;
  font-weight: 600;
  color: #fff;
  background: ${(props) => props.theme.color.primary.main};
  line-height: 22px;
  padding: 8px 16px;
`;
const StyledAccount = styled.div`
  background: rgba(0, 121, 255, 0.1);
  border-radius: 22px;
  height: 40px;
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 2px;
  color: #000;
  cursor: pointer;
  padding-right: 16px;
  font-family: 'Oswald', sans-serif;
`;

const StyledBottom = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const StyledBalance = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-left: 24px;
  .item {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-bottom: 1px solid #e4e4e4;
    .icon {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
    }
    :last-child {
      border-bottom: none;
    }
  }
`;

const StyledUser = styled.div`
  width: 100%;
  padding: 8px 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  .avatar {
    border-radius: 50%;
    width: 48px;
    height: 48px;
  }
  .icon {
    display: flex;
    flex: 1;
    justify-content: flex-end;
  }
`;

const StyledLanaugeMenu = styled.div`
  cursor: pointer;
  border-radius: 20px;
  padding: 4px 8px;
  border: 1px solid rgba(0, 0, 0, 0.6);
  span {
    font-size: 14px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.6);
    line-height: 20px;
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

const StyledTopBar = styled.div`
  width: 100%;
  padding: 8px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #e4e4e4;
  .close {
    display: flex;
    flex: 1;
    justify-content: flex-end;
  }
`;

export default MobileMenu;
