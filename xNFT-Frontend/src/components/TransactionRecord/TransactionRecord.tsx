import React from 'react';
import styled from 'styled-components';
import Spacer from '../Spacer';
import { ossSizeMap, NFT_EVENT, zeroAddress } from '@src/utils/constants';
import moment from 'moment';
import ViewIcon from '@assets/img/view.png';
import config from '@src/config';
import { formatAddress } from '@src/utils/tools';
import { useIntl } from 'react-intl';
import useMedia from 'use-media';

interface TransactionRecordProps {
  width: string;
  imageUrl: string;
  eventName: string;
  createTime: string;
  toAddress: string;
  nftTokenId: string;
  nftName: string;
  txHash: string;
  fromAddress: string;
  price: string;
  symbol: string;
  nftAmount: string;
  nftContractAddress: string;
  userInfoMap: {
    [key: string]: {
      address: string;
      description: string;
      nickname: string;
      profileImageUrl: string;
    };
  };
}

const TransactionRecord: React.FC<TransactionRecordProps> = (props) => {
  const isVideo =
    props.imageUrl?.toUpperCase().endsWith('.MP4') ||
    props.imageUrl?.toUpperCase().endsWith('.WEBM') ||
    props.imageUrl?.toUpperCase().endsWith('.OGG');

  const intl = useIntl();

  const renderMessage = () => {
    const {
      eventName,
      fromAddress,
      toAddress,
      nftTokenId,
      nftName,
      price,
      symbol,
      nftContractAddress,
    } = props;
    switch (eventName) {
      case NFT_EVENT.TRANSFER:
      case NFT_EVENT.TRANSFER_SINGLE:
      case NFT_EVENT.TRANSFER_BATCH:
        if (fromAddress === zeroAddress) {
          return (
            <div
              className="message"
              dangerouslySetInnerHTML={{
                __html: intl.formatMessage(
                  { id: 'transaction.mint.message' },
                  {
                    miner: `<span>${renderNickname(toAddress)}</span>&nbsp;`,
                    nftName: `&nbsp;<span onclick="window.open('${config.etherscanUrl}/token/${nftContractAddress}?a=${nftTokenId}')">${nftName}&nbsp;#${nftTokenId}</span>`,
                  },
                ),
              }}
            />
          );
        }
        return (
          <div
            className="message"
            dangerouslySetInnerHTML={{
              __html: intl.formatMessage(
                { id: 'transaction.transfer.message' },
                {
                  from: `<span>${renderNickname(fromAddress)}</span>&nbsp;`,
                  to: `<span>${renderNickname(toAddress)}</span>&nbsp;`,
                  nftName: `&nbsp;<span onclick="window.open('${config.etherscanUrl}/token/${nftContractAddress}?a=${nftTokenId}')">${nftName}&nbsp;#${nftTokenId}</span>`,
                },
              ),
            }}
          />
        );
      case NFT_EVENT.NORMAL_PURCHASE:
        return (
          <div
            className="message"
            dangerouslySetInnerHTML={{
              __html: intl.formatMessage(
                { id: 'transaction.buy.card.message' },
                {
                  buyer: `<span>${renderNickname(toAddress)}</span>&nbsp;`,
                  price: `&nbsp;<span>${price}${symbol}</span>`,
                  seller: `&nbsp;<span>${renderNickname(fromAddress)}</span>`,
                  nftName: `&nbsp;<span onclick="window.open('${config.etherscanUrl}/token/${nftContractAddress}?a=${nftTokenId}')">${nftName}&nbsp;#${nftTokenId}</span>`,
                },
              ),
            }}
          />
        );
      case NFT_EVENT.BATCH_ADD:
        return (
          <div
            className="message"
            dangerouslySetInnerHTML={{
              __html: intl.formatMessage(
                { id: 'transaction.luckybox.add.card.message' },
                {
                  miner: `<span>${renderNickname(fromAddress)}</span>&nbsp;`,
                  nftName: `<span onclick="window.open('${config.etherscanUrl}/token/${nftContractAddress}?a=${nftTokenId}')">${nftName} #${nftTokenId}</span>&nbsp;`,
                },
              ),
            }}
          />
        );
      case NFT_EVENT.PURCHASE_BOX_NFT:
        return (
          <div
            className="message"
            dangerouslySetInnerHTML={{
              __html: intl.formatMessage(
                { id: 'transaction.luckybox.open.message' },
                {
                  buyer: `<span>${renderNickname(toAddress)}</span>&nbsp;`,
                  price: `<span>${price}&nbsp;${symbol}</span>&nbsp;`,
                  nftName: `<span onclick="window.open('${config.etherscanUrl}/token/${nftContractAddress}?a=${nftTokenId}')">${nftName} #${nftTokenId}</span>&nbsp;`,
                },
              ),
            }}
          />
        );
      case NFT_EVENT.BATCH_REMOVE:
        return (
          <div
            className="message"
            dangerouslySetInnerHTML={{
              __html: intl.formatMessage(
                { id: 'transaction.luckybox.remove.message' },
                {
                  owner: `<span>${renderNickname(toAddress)}</span>&nbsp;`,
                  nftName: `<span onclick="window.open('${config.etherscanUrl}/token/${nftContractAddress}?a=${nftTokenId}')">${nftName} #${nftTokenId}</span>&nbsp;`,
                },
              ),
            }}
          />
        );
    }
  };

  const { txHash, width } = props;

  const renderNickname = (address: string) => {
    const userInfoMap: {
      [key: string]: {
        address: string;
        description: string;
        nickname: string;
        profileImageUrl: string;
      };
    } = props.userInfoMap;
    if (userInfoMap && userInfoMap[address] && userInfoMap[address].nickname) {
      return userInfoMap[address].nickname;
    } else {
      return formatAddress(address);
    }
  };

  const isMobile = useMedia({ maxWidth: '600px' });
  if (isMobile) {
    return (
      <StyledContainer width={width || '100%'}>
        <div className="image">
          {!isVideo && <img src={`${props.imageUrl}${ossSizeMap[200]}`} alt="" />}
          {isVideo && (
            <video
              src={props.imageUrl}
              controls
              poster={`${props.imageUrl}?x-oss-process=video/snapshot,t_7000,f_jpg,m_fast`}
            ></video>
          )}
        </div>
        <Spacer size="sm" />
        <div className="detail-info">
          {renderMessage()}
          <div className="operation-date">
            <span>{moment(props.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>
            <Spacer size="sm" />
            <img
              src={ViewIcon}
              width={isMobile ? '20px' : '24px'}
              height={isMobile ? '20px' : '24px'}
              onClick={() => {
                window.open(`${config.etherscanUrl}/tx/${txHash}`);
              }}
              alt=""
            />
          </div>
        </div>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer width={width || '100%'}>
      <div className="image">
        {!isVideo && <img src={`${props.imageUrl}${ossSizeMap[200]}`} alt="" />}
        {isVideo && (
          <video
            src={props.imageUrl}
            controls
            poster={`${props.imageUrl}?x-oss-process=video/snapshot,t_7000,f_jpg,m_fast`}
          ></video>
        )}
      </div>
      <Spacer size="md" />
      <div className="detail-info">
        {renderMessage()}
        <Spacer size="sm" />
        <div className="operation-date">
          <span>{moment(props.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>
          <Spacer size="md" />
          <img
            src={ViewIcon}
            width="24px"
            height="24px"
            onClick={() => {
              window.open(`${config.etherscanUrl}/tx/${txHash}`);
            }}
            alt=""
          />
        </div>
      </div>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  width: ${(props: { width: string }) => props.width};
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 48px;
  @media (max-width: 600px) {
    flex-direction: row;
    padding: 16px 8px;
    margin-bottom: 0;
    border-bottom: 1px solid #dcdcdc;
    border-radius: 0;
    .image {
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        max-width: 100%;
        max-height: 100%;
      }
      video {
        max-width: 100%;
        max-height: 100%;
      }
    }
  }
  .image {
    width: 88px;
    height: 88px;
    min-width: 88px;
    min-height: 88px;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      max-width: 100%;
      max-height: 100%;
      border-radius: 8px;
    }
    video {
      max-width: 100%;
      max-height: 100%;
      border-radius: 8px;
    }
  }
  .detail-info {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    @media (max-width: 600px) {
      flex-direction: column;
      width: 100%;
      height: 80px;
      align-items: center;
      justify-content: space-around;
    }
    .image {
      width: 64px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        max-width: 100%;
        max-height: 100%;
      }
      video {
        max-width: 100%;
        max-height: 100%;
      }
    }
    .message {
      display: flex;
      width: 100%;
      flex-direction: row;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      font-size: 16px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.6);
      line-height: 24px;
      @media (max-width: 600px) {
        width: 100%;
        font-size: 14px;
        line-height: 20px;
        word-break: break-all;
      }
      span {
        font-weight: 600;
        color: #000;
        cursor: pointer;
      }
    }
  }
  .operation-date {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    span {
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.6);
      line-height: 20px;
      @media (max-width: 600px) {
        font-size: 12px;
        line-height: 18px;
      }
    }
    img {
      cursor: pointer;
    }
  }
`;

export default TransactionRecord;
