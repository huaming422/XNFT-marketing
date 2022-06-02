import React, { useContext, useEffect } from 'react';
import Page from '@components/Page';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { Context } from '@src/contexts/provider/Provider';
import { useHistory } from 'react-router-dom';
import MetaMaskIcon from '@assets/img/metamask.png';
import { useWallet } from 'use-wallet';
import Spacer from '@src/components/Spacer';
import { isChrome } from '@utils/tools';
import DigiCenterQR from '@assets/img/DIGICENTERQR.png';
import XNFTQR from '@assets/img/XNFTQR.png';
import { chromeDownloadUrl, digiCenterUrl, metaDownloadUrl } from '@utils/constants';

const NoWallet: React.FC = () => {
  const intl = useIntl();
  const { toggleLoading } = useContext(Context);
  const { Toast } = useContext(Context);
  const { account, connect } = useWallet();
  const history = useHistory();

  const isChromeBroswer = isChrome();

  useEffect(() => {
    return () => {
      history.push('/');
    };
  }, []);

  return (
    <Page>
      <Spacer size="lg" />
      <StyleContainer>
        <div className="title">{intl.formatMessage({ id: 'nowallet.title' })}</div>
        <Spacer size="lg" />
        <div className="subtitle">{intl.formatMessage({ id: 'nowallet.subtitle1' })}</div>
        <Spacer size="sm" />
        {isChromeBroswer && !window.ethereum ? (
          <>
            <div
              className="subtitle"
              dangerouslySetInnerHTML={{
                __html: intl.formatMessage(
                  { id: 'nowallet.subtitle2' },
                  {
                    chrome: `<a style="color: #0079FF;font-weight: 600;cursor: pointer;text-decoration: none" href=${chromeDownloadUrl} target="_blank"> Chrome </a>`,
                    metamask: `<a style="color: #0079FF;font-weight: 600;cursor: pointer;text-decoration: none" href=${metaDownloadUrl} target="_blank"> MetaMask </a>`,
                  },
                ),
              }}
            />
            <Spacer size="sm" />
          </>
        ) : (
          ''
        )}
        {isChromeBroswer ? (
          <>
            <Spacer size="md" />
            <div
              className="metamask"
              onClick={() => {
                window.open(metaDownloadUrl);
              }}
            >
              <span>{intl.formatMessage({ id: 'nowallet.install.metamask' })}</span>
              <img src={MetaMaskIcon} width="48px" alt="" />
            </div>
            <Spacer size="md" />
          </>
        ) : (
          ''
        )}
        <div
          className="subtitle"
          dangerouslySetInnerHTML={{
            __html: intl.formatMessage(
              { id: 'nowallet.subtitle3' },
              {
                digiCenter: `<a style="color: #0079FF;font-weight: 600;cursor: pointer;text-decoration: none" href=${digiCenterUrl} target="_blank"> DigiCenter </a>`,
              },
            ),
          }}
        />
        <Spacer size="md" />
        <div className="qrCode">
          <img src={DigiCenterQR} width="140px" alt="" />
          <img src={XNFTQR} width="140px" alt="" />
        </div>
      </StyleContainer>
      <Spacer size="lg" />
      <StyledWalletComments>
        <div className="title">{intl.formatMessage({ id: 'nowallet.comments.title' })}</div>
        <Spacer size="md" />
        <div className="comments">{intl.formatMessage({ id: 'nowallet.comments.detail' })}</div>
      </StyledWalletComments>
      <Spacer size="lg" />
    </Page>
  );
};

const StyledWalletComments = styled.div`
  width: 600px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  .title {
    font-size: 20px;
    font-weight: 600;
    color: #000000;
    line-height: 29px;
  }
  .comments {
    font-size: 16px;
    font-weight: 400;
    color: #000000;
    line-height: 26px;
  }
  @media (max-width: 600px) {
    width: 100%;
    padding: 24px;
    margin: 8px;
  }
`;

const StyleContainer = styled.div`
  width: 600px;
  background: #ffffff;
  box-shadow: 0px 1px 30px 0px rgba(31, 43, 77, 0.08);
  border-radius: 20px;
  padding: 68px 80px 40px 80px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  .title {
    font-size: 36px;
    font-weight: 600;
    color: #000000;
    line-height: 54px;
  }
  .subtitle {
    font-size: 16px;
    font-weight: 600;
    color: #000000;
    line-height: 24px;
  }
  .metamask {
    width: 100%;
    background: rgba(255, 104, 0, 0.1);
    border-radius: 8px;
    padding: 12px 16px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    span {
      font-size: 20px;
      font-weight: 500;
      color: #ff6800;
      line-height: 29px;
    }
  }
  .qrCode {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
  }
  @media (max-width: 600px) {
    width: 100%;
    padding: 24px;
    margin: 8px;
  }
`;
export default NoWallet;
