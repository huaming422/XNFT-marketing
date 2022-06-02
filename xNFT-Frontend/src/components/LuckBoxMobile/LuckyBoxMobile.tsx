import React from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import Button from '@components/Button';
import { useHistory } from 'react-router-dom';
import Spacer from '../Spacer';
import GiftIcon from '@assets/img/gift.png';
import More from '@assets/img/pro-more.png';
import Dropdown from 'rc-dropdown';
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

  const isVideo =
    props.nftPriceHighImageUrl?.toUpperCase().endsWith('.MP4') ||
    props.nftPriceHighImageUrl?.toUpperCase().endsWith('.WEBM') ||
    props.nftPriceHighImageUrl?.toUpperCase().endsWith('.OGG');

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
          overlay={<StyledPopover>asdasdasdasdadads</StyledPopover>}
          placement="bottomCenter"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
        >
          <img src={More} alt="" onClick={() => {}} />
        </Dropdown>
      </div>
      <div className="img-container">
        {!isVideo && (
          <img
            className="card"
            src={`${props.nftPriceHighImageUrl}?x-oss-process=image/resize,m_pad,w_220`}
            alt=""
          />
        )}
        {isVideo && (
          <video
            className="card"
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
        <Button
          onClick={() => {
            history.push(`/luckybox-detail/${props.boxTokenId}/${props.boxContractAddress}`);
          }}
          size={'md'}
          variant="primary"
          text={intl.formatMessage({ id: 'nft.luckybox.detail.boxs.button' })}
        />
      </div>
      {/* <div className="hoverContent">
        <span className="title">{props.name}</span>
        <Spacer size="sm" />
        <span>
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
      </div> */}
    </StyledBox>
  );
};

const StyledPopover = styled.div`
  width: 200px;
  height: 240px;
  background: rgba(0, 0, 0, 0.8);
`;

const StyledBox = styled.div`
  position: relative;
  width: 335px;
  height: 420px;
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
  // margin-left: 20px;
  .gift {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    img {
      width: 36px;
      height: 36px;
    }
  }
  .img-container {
    width: 312px;
    height: 312px;
    display: flex;
    align-items: center;
    justify-content: center;
    @media (max-width: 600px) {
      width: 240px;
      height: 240px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card {
      max-width: 100%;
      max-height: 100%;
      transform-style: preserve-3d;
      transition: 1s transform;
      transform: rotateY(2turn);
    }
  }
  .card {
    max-width: 336px;
    max-height: 336px;
    transform-style: preserve-3d;
    transition: 1s transform;
    transform: rotateY(2turn);
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
      font-size: 18px;
      font-weight: 600;
      color: #000000;
      line-height: 27px;
    }
    .info {
      font-size: 16px;
      font-weight: 600;
      color: #ffffff;
      line-height: 24px;
      background: linear-gradient(270deg, #0079ff 0%, #00f364 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .amount {
      font-size: 12px;
      font-weight: 400;
      color: #000000;
      line-height: 18px;
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
      font-weight: 600;
      color: #000000;
      line-height: 33px;
    }
    .collection {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      img {
        border-radius: 50%;
      }
    }
  }
  // &:hover {
  //   border: none;
  //   .card {
  //     transform: rotateY(1.5turn);
  //   }
  //   .hoverContent {
  //     opacity: 0.97;
  //     transition: 0.5s opacity;
  //     background: #f0f2f5;
  //     border-radius: 16px;
  //   }
  // }
`;

export default LuckyBox;
