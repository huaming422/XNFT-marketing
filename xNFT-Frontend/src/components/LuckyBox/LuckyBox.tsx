import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import Button from '@components/Button';
import { useHistory } from 'react-router-dom';
import Spacer from '../Spacer';
import GiftIcon from '@assets/img/gift.png';
import More from '@assets/img/pro-more.png';
import useMedia from 'use-media';
import Dropdown from 'rc-dropdown';
import { ossSizeMap } from '@src/utils/constants';
interface LuckyBoxProps {
  backgroundUrl: '';
  boxContractAddress: '';
  boxTokenId: '';
  categoryCode: '';
  categoryName: '';
  collectionInfoList: Array<{
    backgroundImageUrl: '';
    boxCount: 0;
    description: '';
    externalLink: '';
    favoriteCount: 0;
    hidden: '';
    id: 0;
    imageUrl: '';
    name: '';
    nftCount: 0;
    nftOwnerCount: 0;
    nftTradeCount: 0;
    ownerAddress: '';
    slug: '';
    socialChannel: '';
    tradeCount: 0;
  }>;
  collectionSlug: '';
  description: '';
  externalLink: '';
  favoriteCount: 0;
  id: 0;
  mintTxHash: '';
  name: '';
  nftCount: 0;
  nftPriceHigh: '';
  nftPriceHighImageUrl: '';
  nftPriceLow: '';
  nftPriceLowImageUrl: '';
  openNftCount: 0;
  ownerAddress: '';
  ownerNickname: '';
  paymentContractAddress: '';
  paymentContractAmount: '';
  paymentContractAmountRaw: '';
  paymentContractSymbol: '';
  paymentSymbolUsdPrice: '';
  platformFeeRatio: '';
  startOpenTime: '';
  tokenUri: '';
  totalAmount: '';
  hasNav?: boolean;
}

const LuckyBox: React.FC<LuckyBoxProps> = (props) => {
  const intl = useIntl();
  const history = useHistory();
  const isMobile = useMedia({ maxWidth: '600px' });
  const isVideo =
    props.nftPriceHighImageUrl?.toUpperCase().endsWith('.MP4') ||
    props.nftPriceHighImageUrl?.toUpperCase().endsWith('.WEBM') ||
    props.nftPriceHighImageUrl?.toUpperCase().endsWith('.OGG');

  const [mobileMoreVisible, setMobileMoreVisible] = useState(false);
  if (isMobile) {
    return (
      <StyledBox
        key={props.boxTokenId}
        hasNav={props.hasNav}
        onClick={() => {
          history.push(`/luckybox-detail/${props.boxTokenId}/${props.boxContractAddress}`);
        }}
      >
        <div className="gift">
          <img src={GiftIcon} alt="" />
          <Dropdown
            trigger="click"
            visible={mobileMoreVisible}
            overlay={
              <StyledPopover>
                <div className="triangle"></div>
                <div className="activeContent">
                  <Spacer size="sm" />
                  <span className="numCollection">
                    {intl.formatMessage(
                      { id: 'nft.luckybox.nfts.count' },
                      { amount: props.nftCount - props.openNftCount },
                    )}
                  </span>
                  <Spacer size="md" />
                  {props.collectionInfoList?.slice(0, 3).map(
                    (
                      item: {
                        backgroundImageUrl: '';
                        boxCount: 0;
                        description: '';
                        externalLink: '';
                        favoriteCount: 0;
                        hidden: '';
                        id: 0;
                        imageUrl: '';
                        name: '';
                        nftCount: 0;
                        nftOwnerCount: 0;
                        nftTradeCount: 0;
                        ownerAddress: '';
                        slug: '';
                        socialChannel: '';
                        tradeCount: 0;
                      },
                      index,
                    ) => (
                      <>
                        <span className="collection">
                          <img src={item?.imageUrl} width="28px" alt="" />
                          <Spacer size="sm" />
                          <span>{item?.name}</span>
                        </span>
                        <Spacer size="md" />
                      </>
                    ),
                  )}
                </div>
              </StyledPopover>
            }
            placement="bottomCenter"
          >
            <img
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setMobileMoreVisible(!mobileMoreVisible);
              }}
              src={More}
              alt=""
            />
          </Dropdown>
        </div>
        <div className="img-container">
          {!isVideo && <img src={props.nftPriceHighImageUrl} alt="" />}
          {isVideo && (
            <video
              src={props.nftPriceHighImageUrl}
              controls
              poster={`${props.nftPriceHighImageUrl}?x-oss-process=video/snapshot,t_7000,f_jpg,m_fast`}
            ></video>
          )}
        </div>
        <Spacer size="md" />
        <div className="name">{props.name}</div>
        <div className="content">
          <div className="detail">
            <Spacer size="sm" />
            <span className="info">
              {props.paymentContractAmount} {props.paymentContractSymbol}
            </span>
            <Spacer size="sm" />
            <span className="amount">
              {intl.formatMessage(
                { id: 'nft.luckybox.detail.info' },
                { price: props.nftPriceHigh, unit: props.paymentContractSymbol },
              )}
            </span>
          </div>
          <Spacer size="md" />
          {/* <Button
            onClick={() => {
              history.push(`/luckybox-detail/${props.boxTokenId}/${props.boxContractAddress}`);
            }}
            size={'sm'}
            variant="primary"
            text={intl.formatMessage({ id: 'nft.luckybox.detail.boxs.button' })}
          /> */}
        </div>
      </StyledBox>
    );
  } else {
    return (
      <StyledBox
        key={props.boxTokenId}
        hasNav={props.hasNav}
        onClick={() => {
          history.push(`/luckybox-detail/${props.boxTokenId}/${props.boxContractAddress}`);
        }}
      >
        <div className="img-container">
          {!isVideo && (
            // <StyledImage
            //   className="card"
            //   img={`${props.nftPriceHighImageUrl}${ossSizeMap[312]}`}
            // />
            <img
              src={
                props.nftPriceHighImageUrl?.toLocaleLowerCase()?.includes('.svg')
                  ? props.nftPriceHighImageUrl
                  : `${props.nftPriceHighImageUrl}${ossSizeMap[312]}`
              }
              alt=""
            />
          )}
          {isVideo && (
            <video
              src={props.nftPriceHighImageUrl}
              controls
              poster={`${props.nftPriceHighImageUrl}?x-oss-process=video/snapshot,t_7000,f_jpg,m_fast`}
            ></video>
          )}
        </div>
        <Spacer size="md" />
        <div className="content">
          <div className="detail">
            <span className="name">{props.name}</span>
            <Spacer size="sm" />
            <div className="info">
              <span>
                {props.paymentContractAmount} {props.paymentContractSymbol}
              </span>
              <Spacer size="sm" />
              <span className="amount">
                {intl.formatMessage(
                  { id: 'nft.luckybox.detail.info' },
                  { price: props.nftPriceHigh, unit: props.paymentContractSymbol },
                )}
              </span>
            </div>
          </div>
          <Spacer size="md" />
          <img src={GiftIcon} width="60px" alt="" />
        </div>
        <div className="hoverContent">
          <span className="title">{props.name}</span>
          <Spacer size="sm" />
          <span>
            {intl.formatMessage(
              { id: 'nft.luckybox.nfts.count' },
              { amount: props.nftCount - props.openNftCount },
            )}
          </span>
          <Spacer size="md" />
          {props.collectionInfoList?.slice(0, 3)?.map(
            (
              item: {
                backgroundImageUrl: '';
                boxCount: 0;
                description: '';
                externalLink: '';
                favoriteCount: 0;
                hidden: '';
                id: 0;
                imageUrl: '';
                name: '';
                nftCount: 0;
                nftOwnerCount: 0;
                nftTradeCount: 0;
                ownerAddress: '';
                slug: '';
                socialChannel: '';
                tradeCount: 0;
              },
              index,
            ) => (
              <div key={item.id}>
                <span className="collection">
                  <img src={item?.imageUrl} width="28px" alt="" />
                  <Spacer size="sm" />
                  <span>{item?.name}</span>
                </span>
                <Spacer size="md" />
              </div>
            ),
          )}
          <Spacer size="md" />
          <Spacer size="md" />
          <Button
            onClick={() => {
              history.push(`/luckybox-detail/${props.boxTokenId}/${props.boxContractAddress}`);
            }}
            size={'md'}
            variant="primary"
            text={intl.formatMessage({ id: 'nft.luckybox.detail.boxs.button' })}
          />
        </div>
      </StyledBox>
    );
  }
};

const StyledImage = styled.div`
  background: url(${(props: { img: string }) => props.img});
  background-size: cover;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  transform-style: preserve-3d;
  transition: 1s transform;
  transform: rotateY(2turn);
  background-repeat: round;
`;

const StyledPopover = styled.div`
  width: 200px;
  height: 240px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.8);
  // margin-top: 10px;
  // margin-right: 24px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 10px;
  right: -12px;
  .triangle {
    position: absolute;
    top: -20px;
    left: 160px;
    width: 0;
    height: 0;
    overflow: hidden;
    font-size: 0;
    line-height: 0;
    border-width: 10px;
    border-style: solid dashed dashed dashed;
    border-color: transparent transparent rgba(0, 0, 0, 0.8) transparent;
  }
  .activeContent {
    width: 150px;
    height: 180px;
    .numCollection {
      font-size: 16px;
      font-weight: 500;
      color: #ffffff;
      line-height: 24px;
    }
    .collection {
      display: flex;
      width: 100%;
      img {
        @media (max-width: 600px) {
          display: inline-block;
          width: 28px;
          height: 28px;
          border-radius: 50%;
        }
        border-radius: 50%;
      }
      span {
        font-size: 15px;
        font-weight: 500;
        color: #ffffff;
        line-height: 22px;
      }
    }
  }
`;
const StyledBox = styled.div`
  position: relative;
  width: 374px;
  height: 474px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  padding: 24px;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e4e4e4;
  cursor: pointer;
  margin: ${(props: { hasNav: boolean }) => (props.hasNav ? '16px 0' : '16px')};
  @media (max-width: 600px) {
    position: relative;
    width: 320px;
    height: 420px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    padding: 12px;
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid #e4e4e4;
    cursor: pointer;
    margin: ${(props: { hasNav: boolean }) => (props.hasNav ? '16px 0' : '16px')};
  }
  .gift {
    @media (max-width: 600px) {
      width: 100%;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    img {
      @media (max-width: 600px) {
        width: 36px;
        height: 36px;
      }
    }
  }
  .img-container {
    width: 312px;
    height: 312px;
    display: flex;
    align-items: center;
    justify-content: center;
    @media (max-width: 600px) {
      width: 180px;
      height: 270px;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        max-width: 100%;
        max-height: 100%;
        transition: all 0.2s ease-in-out;
        border-radius: 8px;
      }
    }
    img {
      max-width: 100%;
      max-height: 100%;
      transition: all 0.2s ease-in-out;
      border-radius: 8px;
    }
    video {
      cursor: pointer;
      max-width: 100%;
      max-height: 100%;
      border-radius: 8px;
      object-fit: cover;
    }
  }
  .card {
    max-width: 336px;
    max-height: 336px;
    transform-style: preserve-3d;
    transition: 1s transform;
    transform: rotateY(2turn);
  }
  .name {
    width: 100%;
    font-size: 18px;
    font-family: SourceHanSansSC-Bold, SourceHanSansSC;
    font-weight: bold;
    color: #000000;
    line-height: 27px;
    @media (max-width: 600px) {
      width: 100%;
      font-size: 18px;
      font-family: SourceHanSansSC-Bold,SourceHanSansSC;
      font-weight: bold;
      color: #000000;
      line-height: 30px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      height: 80px;
  }
    }
  }
  .content {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .detail {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    .name {
      font-size: 20px;
      font-family: 'Noto Sans SC', sans-serif;
      font-weight: 600;
      color: #000000;
      line-height: 28px;
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
    }
    .info {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      @media (max-width: 600px) {
        font-size: 16px;
        font-weight: bold;
        color: #ffffff;
        line-height: 24px;
        background: linear-gradient(270deg, #0079ff 0%, #00f364 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        display: inline;
        width: auto;
      }

      span:first-child {
        font-size: 24px;
        font-family: 'Noto Sans SC', sans-serif;
        font-weight: 500;
        color: #ffffff;
        line-height: 28px;
        background: linear-gradient(270deg, #0079ff 0%, #00f364 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-family: 'Oswald', sans-serif;
      }
      span:last-child {
        font-size: 14px;
        font-family: 'Noto Sans SC', sans-serif;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.6);
        line-height: 20px;
      }
    }
    .amount {
      @media (max-width: 600px) {
        font-size: 12px;
        font-weight: 400;
        color: #000000;
        line-height: 18px;
      }
    }
  }
  .hoverContent {
    padding: 40px;
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-align-items: flex-start;
    -webkit-box-align: flex-start;
    -ms-flex-align: flex-start;
    align-items: flex-start;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
    border-radius: 8px;
    span {
      font-size: 16px;
      font-family: 'Noto Sans SC', sans-serif;
      font-weight: 500;
      color: #000000;
      line-height: 22px;
    }
    .title {
      font-size: 24px;
      font-family: 'Noto Sans SC', sans-serif;
      font-weight: 500;
      color: #000000;
      line-height: 33px;
    }
    .collection {
      display: flex;
      width: 100%;
      img {
        display: inline-block;
        width: 28px;
        height: 28px;
        border-radius: 50%;
      }
    }
  }
  &:hover {
    border: none;
    @media (max-width: 600px) {
      border: 1px solid #e4e4e4;
    }
    img {
      transform: scale(1.1);
      @media (max-width: 600px) {
        transform: scale(1);
      }
    }
    .hoverContent {
      opacity: 0.97;
      transition: 0.5s opacity;
      background: #f0f2f5;
      border-radius: 16px;
    }
  }
`;

export default LuckyBox;
