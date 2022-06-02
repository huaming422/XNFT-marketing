import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import Button from '@components/Button';
import { useHistory } from 'react-router-dom';
import MultiBottomIcon from '@assets/img/multiBottom.png';
import Spacer from '../Spacer';
import { formatAddress } from '@utils/tools';
import { ossSizeMap, schemaMap } from '@src/utils/constants';
import useMedia from 'use-media';
import AnimatedNumber from '@jhonnold/react-animated-number';
import More from '@assets/img/pro-more.png';
import loadErrorImg from '@assets/img/loadError.png';
import AuthorizedIcon from '@assets/img/authorized.png';
import authorizeBG from '@assets/img/authorizeBG.png';
import numeral from 'numeral';
import Dropdown from 'rc-dropdown';
interface CardProps {
  imageUrl: string;
  nftTokenId: string;
  salePaymentContractAmount: string;
  salePaymentContractSymbol: string;
  name: string;
  icon: string;
  amount: string;
  ownerAddress: string;
  minterAddress: string;
  nftContractAddress: string;
  schemaName: string;
  nftCount?: string;
  boxContractAddress?: string;
  boxOwnerAddress?: string;
  boxTokenId?: string;
  openNftCount: number;
  isAuthorized: 'Y' | 'N';
  collectionInfo: {
    imageUrl: string;
    name: string;
  };
  userInfoMap: {
    [key: string]: {
      address: string;
      description: string;
      nickname: string;
      profileImageUrl: string;
    };
  };
}
const Card: React.FC<CardProps> = (props) => {
  const intl = useIntl();
  const history = useHistory();
  const isMobile = useMedia({ maxWidth: '600px' });
  const isVideo =
    props.imageUrl?.toUpperCase().endsWith('.MP4') ||
    props.imageUrl?.toUpperCase().endsWith('.WEBM') ||
    props.imageUrl?.toUpperCase().endsWith('.OGG');

  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const renderImage = () => {
    if (isVideo) {
      return (
        <video
          className="card"
          // autoplay="autoplay"
          width="220px"
          height="220px"
          src={props.imageUrl}
          controls
          poster={`${props.imageUrl}?x-oss-process=video/snapshot,t_7000,f_jpg,m_fast`}
        ></video>
      );
    } else if (props.imageUrl?.toLowerCase().includes('.svg')) {
      // return <StyledImage className="card" img={`${props.imageUrl}${ossSizeMap[200]}`} />
      return (
        <img
          className="card"
          onLoad={() => {
            setLoaded(true);
          }}
          src={`${props.imageUrl}`}
          alt=""
        />
      );
    } else if (props.imageUrl) {
      return (
        <img
          className="card"
          onLoad={() => {
            setLoaded(true);
          }}
          src={`${props.imageUrl}${ossSizeMap[200]}` || loadErrorImg}
          alt=""
        />
      );
    } else {
      return (
        <img
          className="card"
          onLoad={() => {
            setLoaded(true);
          }}
          src={loadErrorImg}
          alt=""
        />
      );
    }
  };

  const handleClickImage = () => {
    if (props.boxContractAddress && props.boxTokenId) {
      history.push(
        `/card-detail/${props.nftContractAddress}/${props.boxContractAddress}/${props.nftTokenId}/${props.boxContractAddress}/${props.boxTokenId}`,
      );
    } else {
      history.push(
        `/card-detail/${props.nftContractAddress}/${props.ownerAddress}/${props.nftTokenId}`,
      );
    }
  };

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

  if (isMobile) {
    return (
      <Tcard>
        <StyledCard
          key={props.nftTokenId}
          schemaName={props.schemaName}
          onClick={handleClickImage}
        >
          <div className={`img-container ${loaded || loadError ? 'loaded' : ''}`}>
            {renderImage()}
          </div>
          {/* <Spacer size="sm" /> */}
          <div className="detail">
            <Spacer size="sm" />
            <div className="main">{props.name}</div>
            {/* <Spacer size="sm" /> */}
            <div className="comments">
              {props.salePaymentContractAmount && Number(props.salePaymentContractAmount)
                ? `${props.salePaymentContractAmount} ${props.salePaymentContractSymbol}`
                : ''}
            </div>
            <Spacer size="sm" />
            <div className="more-total"></div>
          </div>

          {Number(props.nftCount) >= 1 && props.schemaName === schemaMap.ERC1155 ? (
            <span className="amount">
              {Number(props.nftCount) > 10000 ? (
                <AnimatedNumber
                  component="text"
                  number={numeral(props.nftCount)
                    .subtract(props.openNftCount || 0)
                    .value()}
                  style={{
                    transition: '0.8s ease-out',
                    transitionProperty: 'background-color, color, opacity',
                    transitionDelay: '3s',
                  }}
                  duration={300}
                  format={(n: any) => numeral(n).format('0.00a')}
                />
              ) : (
                numeral(props.nftCount)
                  .subtract(props.openNftCount || 0)
                  .value()
              )}
            </span>
          ) : (
            props.schemaName === schemaMap.ERC1155 && (
              <span className="amount">
                {Number(props.amount) > 10000 ? (
                  <AnimatedNumber
                    component="text"
                    number={Number(props.amount)}
                    style={{
                      transition: '0.8s ease-out',
                      transitionProperty: 'background-color, color, opacity',
                      transitionDelay: '3s',
                    }}
                    duration={300}
                    format={(n: any) => numeral(n).format('0.00a')}
                  />
                ) : (
                  props.amount
                )}
              </span>
            )
          )}
          {props.isAuthorized === 'Y' ? (
            <div className="authorized">
              {/* <img src={AuthorizedIcon} width="20px" alt="" /> */}
              {/* <Spacer size="sm" /> */}
              <span>{intl.formatMessage({ id: 'project.authorized' })}</span>
            </div>
          ) : (
            ''
          )}
        </StyledCard>
      </Tcard>
    );
  } else {
    return (
      <StyledCard
        key={props.nftTokenId}
        schemaName={props.schemaName}
        onClick={handleClickImage}
      >
        <div className={`img-container ${loaded || loadError ? 'loaded' : ''}`}>
          {renderImage()}
        </div>
        <Spacer size="md" />
        <div className="detail">
          <div className="main">{props.name}</div>
          <Spacer size="sm" />
          <div className="comments">
            {props.salePaymentContractAmount && Number(props.salePaymentContractAmount)
              ? `${props.salePaymentContractAmount} ${props.salePaymentContractSymbol}`
              : ''}
          </div>
        </div>
        <div className="hoverContent">
          <span className="title">{`${props.name} #${props.nftTokenId}`}</span>
          <Spacer size="md" />
          <span className="collection">
            <img src={props?.collectionInfo?.imageUrl} width="28px" alt="" />
            <Spacer size="sm" />
            <span>{props?.collectionInfo?.name}</span>
          </span>
          {/* <Spacer size="md" />
            <span className="title">#{props.nftTokenId}</span> */}
          <Spacer size="md" />
          <span className="owner">
            {intl.formatMessage({ id: 'card.detail.owner' })}:
            {renderNickname(props.ownerAddress)}
          </span>
          <Spacer size="sm" />
          <span className="author">
            {intl.formatMessage({ id: 'card.detail.creator' })}:
            {renderNickname(props.minterAddress)}
          </span>
          <Spacer size="md" />
          <Spacer size="md" />
          <Button
            onClick={() => {
              if (props.boxContractAddress && props.boxTokenId) {
                history.push(
                  `/card-detail/${props.nftContractAddress}/${props.ownerAddress}/${
                    props.nftTokenId
                  }/${props.boxContractAddress || ''}/${props.boxTokenId || ''}`,
                );
              } else {
                history.push(
                  `/card-detail/${props.nftContractAddress}/${props.ownerAddress}/${props.nftTokenId}`,
                );
              }
            }}
            size={'md'}
            variant="primary"
            text={intl.formatMessage({ id: 'common.button.view' })}
          />
        </div>
        {Number(props.nftCount) >= 1 && props.schemaName === schemaMap.ERC1155 ? (
          <span className="amount">
            {Number(props.nftCount) > 10000 ? (
              <AnimatedNumber
                component="text"
                number={numeral(props.nftCount)
                  .subtract(props.openNftCount || 0)
                  .value()}
                style={{
                  transition: '0.8s ease-out',
                  transitionProperty: 'background-color, color, opacity',
                  transitionDelay: '3s',
                }}
                duration={300}
                format={(n: any) => numeral(n).format('0.00a')}
              />
            ) : (
              numeral(props.nftCount)
                .subtract(props.openNftCount || 0)
                .value()
            )}
          </span>
        ) : (
          props.schemaName === schemaMap.ERC1155 && (
            <span className="amount">
              {Number(props.amount) > 10000 ? (
                <AnimatedNumber
                  component="text"
                  number={Number(props.amount)}
                  style={{
                    transition: '0.8s ease-out',
                    transitionProperty: 'background-color, color, opacity',
                    transitionDelay: '3s',
                  }}
                  duration={300}
                  format={(n: any) => numeral(n).format('0.00a')}
                />
              ) : (
                props.amount
              )}
            </span>
          )
        )}
        {props.isAuthorized === 'Y' ? (
          <div className="authorized">
            {/* <img src={AuthorizedIcon} width="20px" alt="" /> */}
            {/* <Spacer size="sm" /> */}
            <span>{intl.formatMessage({ id: 'project.authorized' })}</span>
          </div>
        ) : (
          ''
        )}
      </StyledCard>
    );
  }
};
const Tcard = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 8px 0;
`;
// const StyledPopover = styled.div`
//   width: 125px;
//   height: 122px;
//   border-radius: 8px;
//   background: rgba(0, 0, 0, 0.8);
//   position: absolute;
//   bottom: 40px;
//   right: -15px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   .triangle {
//     position: absolute;
//     top: 122px;
//     left: 90px;
//     width: 0;
//     height: 0;
//     overflow: hidden;
//     font-size: 0;
//     line-height: 0;
//     border-width: 10px;
//     border-style: solid dashed dashed dashed;
//     border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
//   }
//   .activeContent {
//     width: 94px;
//     height: 90px;
//     span {
//       font-size: 12px;
//       font-weight: 600;
//       color: #ffffff;
//       line-height: 18px;
//     }
//     .owner,
//     .author {
//       width: 100%;
//       overflow: hidden;
//       text-overflow: ellipsis;
//       white-space: nowrap;
//     }
//   }
// `;

const StyledCard = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${(props: { schemaName: string }) =>
    props.schemaName === schemaMap.ERC721 ? '24px 24px 15px 24px' : `24px`};
  width: 275px;
  height: ${(props: { schemaName: string }) =>
    props.schemaName === schemaMap.ERC721 ? '350px' : `359px`};
  background: ${(props: { schemaName: string }) =>
    props.schemaName === schemaMap.ERC721 ? '#fff' : `url(${MultiBottomIcon})`};
  background-size: 100% 100%;
  border-radius: ${(props: { schemaName: string }) =>
    props.schemaName === schemaMap.ERC721 ? '12px' : `none`};
  border: ${(props: { schemaName: string }) =>
    props.schemaName === schemaMap.ERC721 ? '1px solid #e4e4e4' : `none`};
  margin: 15px;
  text-decoration: none;
  cursor: pointer;

  @media (max-width: 600px) {
    width: 160px;
    height: ${(props: { schemaName: string }) =>
      props.schemaName === schemaMap.ERC721 ? '236px' : `240px`};
    padding: 12px;
    margin: 8px;
    margin-top: ${(props: { schemaName: string }) =>
      props.schemaName === schemaMap.ERC721 ? '5px' : `5px`};
  }
  .img-container {
    width: 100%;
    height: 220px;
    display: flex;
    align-items: center;
    justify-content: center;
    img{
      max-width:100%;
      max-height:100%;
    }
    @media (max-width: 600px) {
      width: 100%;
      height: 130px;
      display: flex;
      align-items: center;
      justify-content: center;
      img{
        max-width:100%;
        max-height:100%;
      }
    }
    video {
      cursor: pointer;
      max-width: 100%;
      max-height: 100%;
      object-fit: cover;
      border-radius: 8px;
      width: 100%;
      height: 100%;
    }
    img {
      border-radius: 8px;
      opacity: 0;
      transition: all 0.2s ease-in-out;
      max-width: 100%;
      max-height: 100%;
    }
  }
  .loaded {
    img {
      opacity: 1;
    }
  }
  .detail {
    width: 100%;
    display: flex;
    flex-direction: column;
    // align-items: flex-start;
    // justify-content: center;
    position: relative;
    .main {
      font-size: 20px;
      font-family: 'Noto Sans SC', sans-serif;
      font-weight: 600;
      color: #000000;
      line-height: 28px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
      @media (max-width: 600px) {
        width: 75%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 14px;
        font-weight: 600;
        color: #000000;
        line-height: 40px;
        z-index：999；
      }
    }
    .comments {
      font-size: 16px;
      color: ${(props) => props.theme.color.primary.main};
      font-weight: 500;
      height: 28px;
      line-height: 28px;
      /* background: linear-gradient(270deg, #0079ff 0%, #00f364 100%); */
      /* -webkit-background-clip: text; */
      /* -webkit-text-fill-color: transparent; */
      font-family: 'Oswald', sans-serif;
      @media (max-width: 600px) {
        font-size: 12px;
        font-weight: 600;
        color: #0079ff;
        height: 14px;
        // line-height: 18px;
        // -webkit-background-clip: text;
        // -webkit-text-fill-color: transparent;
      }
    }
    .more-total {
      @media (max-width: 600px) {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: space-between;
      }
      img {
        @media (max-width: 600px) {
          width: 20px;
          height: 20px;
        }
      }
    }
    .total {
      font-size: 14px;
      font-family: 'Noto Sans SC', sans-serif;
      font-weight: 400;
      color: #000000;
      line-height: 20px;
    }
  }
  .authorized {
    width: 40px;
    height: 22px;
    position: absolute;
    right: 0;
    bottom: 15px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding-left: 2px;
    // padding: 2px 4px;
    /* min-width: 100px; */
    /* background: url(${authorizeBG}); */
    /* background-size: 100% 100%; */
    color: #fff;
    background: linear-gradient(122deg, #0079ff 0%, #00f364 100%);
    border-radius: 21px 0px 0px 21px;
    span {
      font-size: 13px;
      font-weight: 600;
      color: #fff;
      line-height: 19px;
      /* background: linear-gradient(90deg, #0079ff 0%, #00f364 100%); */
      /* -webkit-background-clip: text; */
      /* -webkit-text-fill-color: transparent; */
    }
    @media (max-width: 600px) {
      position: absolute;
      right: 0;
      bottom: 18px;
      padding: 2px 4px;
      // width: 30px;
      // height: 18px;
      span {
        font-size: 10px;
        line-height: 14px;
      }
    }
  }
  .hoverContent {
    padding: 24px;
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    border-radius: 8px;
    z-index: 2;
    span {
      font-size: 16px;
      font-family: 'Noto Sans SC', sans-serif;
      font-weight: 600;
      color: #000000;
      line-height: 22px;
    }
    .title {
      font-size: 24px;
      font-family: 'Noto Sans SC', sans-serif;
      font-weight: 600;
      color: #000000;
      line-height: 33px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      word-break: break-all;
      /* overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap; */
      width: 220px;
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
    .owner,
    .author {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .bottom {
    position: absolute;
    z-index: -1;
    bottom: -9px;
  }
  .amount {
    position: absolute;
    z-index: 3;
    top: -16px;
    right: 8px;
    background: #fb6000;
    font-weight: 500;
    border-radius: 17px;
    padding: 4px 8px;
    color: #fff;
    min-width: 32px;
    text-align: center;
    font-family: 'Oswald', sans-serif;
    @media (max-width: 600px) {
      position: absolute;
      z-index: 1;
      top: -16px;
      right: 8px;
      background: #fb6000;
      border-radius: 17px;
      padding: 4px 8px;
      color: #fff;
      // width: 24px;
      // height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    }
  }
  &:hover {
    border: none;
    @media (max-width: 600px) {
      // border: solid 1px #e4e4e4;
    }
    .card {
      transform: scale(1.1);
    }
    .hoverContent {
      opacity: 0.97;
      transition: 0.5s opacity;
      background: #f0f2f5;
      border-radius: 16px;
    }
  }
`;

export default Card;
