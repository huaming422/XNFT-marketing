import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import Nav from './components/Nav';
import { useIntl } from 'react-intl';
import Logo from '../Logo';
import Container from '../Container';
import Dropdown from 'rc-dropdown';
import Menu, { Item as MenuItem } from 'rc-menu';
import Spacer from '@components/Spacer';
import { Context } from '@src/contexts/provider/Provider';
import BackToTopIcon from '@assets/img/backTop.png';
import BackToTopHoverIcon from '@assets/img/backTopHover.png';
import ArrowUp from '@assets/img/arrow-up.png';
import ArrowDown from '@assets/img/arrow-down.png';
import WechatIcon from '@assets/img/channel/officialIcon.png';
import TelegramIcon from '@assets/img/channel/telegram.png';
import TwitterIcon from '@assets/img/channel/twitter.png';
import MediumIcon from '@assets/img/channel/medium.png';
import GithubIcon from '@assets/img/channel/gitHub.png';
import WikiIcon from '@assets/img/channel/wiki.png';
import FacebookIcon from '@assets/img/channel/facebook.png';
import LinkedinIcon from '@assets/img/channel/linkedIn.png';
import DiscardIcon from '@assets/img/channel/discard.png';
import WeiboIcon from '@assets/img/channel/weibo.png';
import useMedia from 'use-media';
import {
  wechatUrl,
  telegramurl,
  twitterurl,
  mediumurl,
  gitHuburl,
  wikiurl,
  facebookurl,
  linkedInurl,
  discardurl,
  weibourl,
  digiCenterUrl,
  bscUrl,
  hecoUrl,
} from '@src/utils/constants';
const Footer: React.FC = () => {
  const intl = useIntl();
  const { lang, setLang } = useContext(Context);
  const [langMenu, setLangMenu] = useState(false);
  const isMobile = useMedia({ maxWidth: '600px' });
  const langMenus = (
    <Menu mode="inline">
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
    </Menu>
  );
  return (
    <StyledFooter>
      <Container padding="0">
        <StyledFooterInner>
          <StyledNav>
            <div style={{ flex: 1 }}>
              <Logo />
            </div>
          </StyledNav>
          {/* <Language>{intl.formatMessage({ id: 'common.languae' })}</Language> */}
          {/* <Nav /> */}
          <Dropdown
            overlay={langMenus}
            placement="bottomCenter"
            onVisibleChange={(visible) => {
              setLangMenu(visible);
            }}
          >
            <StyledDropdownChainMenu>
              <span>{lang === 'zh-CN' ? '简体中文' : 'English'}</span>
              <Spacer size="sm" />
              {<img width="20px" src={langMenu ? ArrowUp : ArrowDown} alt="" />}
            </StyledDropdownChainMenu>
          </Dropdown>
        </StyledFooterInner>
        <StyledEmail>
          <div className="contact-us">
            <span>{intl.formatMessage({ id: 'common.contact.us' })}</span>
            <Spacer size="sm" />
            <a href="mailto:support@xnft.net">
              {intl.formatMessage({ id: 'common.please.email' })}
            </a>
          </div>
          <div className="business">
            <span>{intl.formatMessage({ id: 'common.business.cooperation' })}</span>
            <Spacer size="sm" />
            <a href="mailto:bd@xnft.net">{intl.formatMessage({ id: 'common.email' })}</a>
          </div>
          <div className="more-icon">
            <img
              src={WechatIcon}
              alt=""
              onClick={() => {
                window.open(wechatUrl);
              }}
            />
            <Spacer size="sm" />
            <img
              src={TelegramIcon}
              alt=""
              onClick={() => {
                window.open(telegramurl);
              }}
            />
            <Spacer size="sm" />
            <img
              src={TwitterIcon}
              alt=""
              onClick={() => {
                window.open(twitterurl);
              }}
            />
            <Spacer size="sm" />
            {/* <img
              src={MediumIcon}
              alt=""
              onClick={() => {
                window.open(mediumurl);
              }}
            />
            <Spacer size="sm" />
            <img
              src={GithubIcon}
              alt=""
              onClick={() => {
                window.open(gitHuburl);
              }}
            />
            <Spacer size="sm" />

            <img
              src={FacebookIcon}
              alt=""
              onClick={() => {
                window.open(facebookurl);
              }}
            />
            <Spacer size="sm" />
            <img
              src={LinkedinIcon}
              alt=""
              onClick={() => {
                window.open(linkedInurl);
              }}
            />
            <Spacer size="sm" /> */}

            <img
              src={WeiboIcon}
              alt=""
              onClick={() => {
                window.open(weibourl);
              }}
            />
          </div>
        </StyledEmail>
        <Spacer size="md" />
        <LowerHorizontalLine></LowerHorizontalLine>
        <StyledLinks>
          <div className="links">
            <span>{intl.formatMessage({ id: 'common.links' })}</span>
            <Spacer size="md" />
            <a href={digiCenterUrl} target="_blank" rel="noreferrer">
              DigiCenter
            </a>
            <Spacer size="md" />
            <a href={bscUrl} target="_blank" rel="noreferrer">
              BSC
            </a>
            <Spacer size="md" />
            <a href={hecoUrl} target="_blank" rel="noreferrer">
              HECO
            </a>
          </div>
          <div className="reserved">
            <span>{intl.formatMessage({ id: 'common.reserved' })}</span>
          </div>
        </StyledLinks>
      </Container>
      <StyledBackToTop
        onClick={() => {
          window?.scrollTo({
            left: 0,
            top: 0,
            behavior: 'smooth',
          });
        }}
      ></StyledBackToTop>
    </StyledFooter>
  );
};
const StyledBackToTop = styled.div`
  cursor: pointer;
  width: 66px;
  height: 66px;
  background: url(${BackToTopIcon});
  background-size: 100% 100%;
  position: absolute;
  bottom: ${(props) => props.theme.footerSize - 33}px;
  right: 33px;
  :hover {
    background: url(${BackToTopHoverIcon});
    background-size: 100% 100%;
  }
  @media (max-width: 600px) {
    display: none;
  }
`;

const StyledLinks = styled.div`
  width: ${(props) => props.theme.maxWidth}px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${(props) => props.theme.topBarSize}px;
  max-width: ${(props) => props.theme.maxWidth}px;
  padding: 0 12px;
  margin: 0 auto;
  box-sizing: border-box;
  @media (max-width: 600px) {
    width: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .links {
    display: flex;
    @media (max-width: 600px) {
      width: 100%;
    }
    span {
      text-decoration: none;
      font-size: 12px;
      font-weight: 600;
      color: #ffffff;
      line-height: 17px;
    }
    a {
      text-decoration: none;
      font-size: 12px;
      font-weight: 600;
      color: #ffffff;
      line-height: 17px;
    }
    .hreflink {
      cursor: pointer;
    }
  }
  .reserved {
    @media (max-width: 600px) {
      width: 100%;
    }
    span {
      font-size: 12px;
      font-weight: 400;
      color: #ffffff;
      line-height: 17px;
      @media (max-width: 600px) {
        font-size: 10px;
      }
    }
  }
`;
const LowerHorizontalLine = styled.footer`
  width: ${(props) => props.theme.maxWidth}px;
  max-width: ${(props) => props.theme.maxWidth}px;
  margin: 0 auto;
  height: 1px;
  background: #ffffff;
  opacity: 0.2;
  @media (max-width: 600px) {
    width: 100%;
    margin: 0 auto;
    height: 1px;
    background: #ffffff;
    opacity: 0.2;
  }
`;
const Language = styled.footer`
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  line-height: 22px;
  position: absolute;
  top: 35px;
  right: 415px;
`;
const StyledFooter = styled.footer`
  width: 100%;
  z-index: 10;
  height: 328px;
  // display: flex;
  background: #151824;
  box-shadow: 0px 1px 0px 0px rgba(255, 255, 255, 0.1);
  position: relative;
  @media (max-width: 600px) {
    width: 100%;
    height: 343px;
    background: #151824;
    // position: fixed;
    // bottom: 0;
  }
`;
const StyledEmail = styled.div`
  width: ${(props) => props.theme.maxWidth}px;
  display: flex;
  justify-content: space-between;
  height: ${(props) => props.theme.topBarSize}px;
  max-width: ${(props) => props.theme.maxWidth}px;
  padding: 0 12px;
  margin: 0 auto;
  box-sizing: border-box;
  @media (max-width: 600px) {
    width: 100%;
    flex-direction: column;
    height: 160px;
    padding: 0 12px;
  }
  .contact-us,
  .business {
    display: flex;
    flex-direction: column;
    span {
      font-size: 16px;
      font-weight: 600;
      color: #ffffff;
      line-height: 22px;
      @media (max-width: 600px) {
        font-size: 14px;
      }
    }
    a {
      font-size: 16px;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.6);
      line-height: 22px;
      @media (max-width: 600px) {
        font-size: 14px;
      }
    }
    a,
    a:link,
    a:visited,
    a:hover,
    a:active {
      text-decoration: none;
      // color:inherit;
    }
  }
  .more-icon {
    display: flex;
    flex-direction: raw;
    // justify-content: center;
    align-items: center;
    img {
      width: 24px;
      height: 24px;
      cursor: pointer;
      @media (max-width: 600px) {
        margin-right: 12px;
      }
    }
  }
`;
const StyledFooterInner = styled.div`
  width: ${(props) => props.theme.maxWidth}px;
  display: flex;
  height: ${(props) => props.theme.topBarSize + 60}px;
  max-width: ${(props) => props.theme.maxWidth}px;
  padding: 0 12px;
  margin: 0 auto;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;
  @media (max-width: 600px) {
    width: 100%;
    height: 80px;
  }
`;
const StyledNav = styled.div`
  font-size: 18px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
`;
const StyledDropdownChainMenu = styled.div`
  width: 144px;
  height: 42px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  line-height: 22px;
  background: #ffffff;
  border-radius: 21px;
  cursor: pointer;
  -webkit-text-decoration: none;
  text-decoration: none;
  padding: 8px 12px;
  @media (max-width: 600px) {
    width: 120px;
    height: 40px;
  }
`;
export default Footer;
