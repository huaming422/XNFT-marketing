import React, { useState, useContext, useEffect } from 'react';
import Page from '@components/Page';
import { useIntl } from 'react-intl';
import styled, { ThemeContext, keyframes } from 'styled-components';
import { Context } from '@src/contexts/provider/Provider';
import Spacer from '@components/Spacer';
import ArrowUpIcon from '@assets/img/arrow-up.png';
import ArrowDownIcon from '@assets/img/arrow-down.png';
import loadErrorImg from '@assets/img/loadError.png';
import Container from '@src/components/Container';
import Dropdown from 'rc-dropdown';
import Menu, { Item as MenuItem } from 'rc-menu';
import Button from '@src/components/Button';
import { useHistory } from 'react-router-dom';
import { useRouteMatch } from 'react-router-dom';
import useCardDetail from '@hooks/useCardDetail';
import Modal from 'styled-react-modal';
import usePaymentSymbols from '@hooks/usePaymentSymbols';
import CopyToClipboard from 'react-copy-to-clipboard';
import ShareIcon from '@assets/img/share.png';
import ShareMobileIcon from '@assets/img/share_mobile.png';
import ShareHoverIcon from '@assets/img/share_hover.png';
import genuine from '@assets/img/genuine.png';
import CloseIcon from '@assets/img/close.png';
import CategoryIcon from '@assets/img/category.png';
import Input from '@src/components/Input';
import Skeleton from 'react-loading-skeleton';
import useNFTBills from '@hooks/useNFTBills';
import ProtocolIcon from '@assets/img/protocol.png';
import NormalIcon from '@assets/img/normalIcon.png';
import DateIcon from '@assets/img/dateIcon.png';
import NumberIcon from '@assets/img/numberIcon.png';
import InvalidIcon from '@assets/img/invalid.png';
import numeral from 'numeral';
import useMedia from 'use-media';
import { ethers } from 'ethers';
import {
  digits,
  ERRORMSG,
  LUCKYBOXMAXPRICE,
  mainChainAddress,
  MARKET_STATUS,
  maxDigits,
  platformContractType,
  saleType,
  schemaMap,
  ToastType,
  IdentifierMap,
  ACTIVITY_TYPE,
} from '@src/utils/constants';
import { formatAddress } from '@src/utils/tools';
import { useWallet } from 'use-wallet';
import Decimal from 'decimal.js';
import useOperation from '@hooks/useOperation';
import moment from 'moment';
import TransactionRecord from '@src/components/TransactionRecord';
import {
  ReadyState,
  SOCKET_BIZ,
  SOCKET_EVENT,
  SOCKET_TYPE,
  // SOCKET_ACTION,
} from '@utils/constants';
import config from '@src/config';

const platformIconMap: { [key: string]: string } = {
  ERC721: ProtocolIcon,
  ERC1155: ProtocolIcon,
};

const LuckyBoxDetail: React.FC = () => {
  const intl = useIntl();
  const { connectWallet } = useContext(Context);
  const { maxWidth } = useContext(ThemeContext);
  const paymentSymbols = usePaymentSymbols();
  const fetchCardDetail = useCardDetail();
  const fetchNFTBills = useNFTBills();
  const { account } = useWallet();
  const history = useHistory();
  const isMobile = useMedia({ maxWidth: '600px' });
  const { doOrder, approveNFT, cancelOrder, buyCard, uploadInviteInfo } = useOperation();

  const {
    Toast,
    toggleLoading,
    getWebSocket,
    subscribe,
    unsubscribe,
    readyState,
    originChainId,
  } = useContext(Context);

  const [cardDetail, setCardDetail] = useState({});

  useEffect(() => {
    if (!cardDetail) {
      toggleNoDataModal();
    }
  }, [cardDetail]);

  useEffect(() => {
    if (paymentList && paymentList.length > 0) {
      setSymbol(paymentList[0].paymentContractSymbol);
    }
  }, [paymentSymbols]);

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      subscribe({
        event: SOCKET_EVENT.SUBSCRIBE,
        biz: SOCKET_BIZ.xNFT,
        type: SOCKET_TYPE.MARKET_SALE,
      });
      subscribe({
        event: SOCKET_EVENT.SUBSCRIBE,
        biz: SOCKET_BIZ.xNFT,
        type: SOCKET_TYPE.NFT,
      });
      const socket = getWebSocket();
      socket.onmessage = (message: any) => {
        try {
          const originIdentifier = IdentifierMap[originChainId];
          const { type, action, data } = JSON.parse(message?.data || '{}');
          if (type === SOCKET_TYPE.MARKET_SALE) {
            data?.forEach(
              (item: {
                identifier: string;
                nftTokenId: string;
                nftContractAddress: string;
                fromAddress: string;
                ownerAddress: string;
              }) => {
                if (
                  item?.nftTokenId === tokenId &&
                  item?.nftContractAddress === nftContractAddress &&
                  originIdentifier?.toLowerCase() === item.identifier?.toLowerCase()
                ) {
                  if (item?.fromAddress?.toLowerCase() === item.ownerAddress?.toLowerCase()) {
                    fetchData();
                    fetchNFTBillsData(1);
                  } else {
                    if (item?.fromAddress?.toLowerCase() === ownerAddress?.toLowerCase()) {
                      window.location.href = window.location.href.replace(
                        ownerAddress,
                        item?.ownerAddress,
                      );
                    } else {
                      fetchData();
                      fetchNFTBillsData(1);
                    }
                  }
                }
              },
            );
          }
          if (type === SOCKET_TYPE.NFT) {
            data?.forEach(
              (item: {
                identifier: string;
                nftTokenId: string;
                nftContractAddress: string;
                fromAddress: string;
                ownerAddress: string;
              }) => {
                if (
                  item?.nftTokenId === tokenId &&
                  item?.nftContractAddress?.toLowerCase() ===
                    nftContractAddress?.toLowerCase() &&
                  originIdentifier?.toLowerCase() === item.identifier?.toLowerCase()
                ) {
                  fetchData();
                  fetchNFTBillsData(1);
                }
              },
            );
          }
        } catch (e) {
          console.error('failed to onmessage', e);
        }
      };
    }
    return () => {
      unsubscribe({
        event: SOCKET_EVENT.UNSUBSCRIBE,
        biz: SOCKET_BIZ.xNFT,
        type: SOCKET_TYPE.MARKET_SALE,
      });
    };
  }, [readyState]);

  useEffect(() => {
    toggleLoading(true);
    fetchData();
    fetchNFTBillsData(1);
  }, []);

  // pc share modal
  const [shareModal, setShareModal] = useState(false);
  const toggleShareModal = () => {
    setShareModal(!shareModal);
  };

  // nft invalid
  const [noDataModal, setNoDataModal] = useState(false);
  const toggleNoDataModal = () => {
    setNoDataModal(!noDataModal);
  };

  // mobile share bottom content
  const [showShareInfo, setShowShareInfo] = useState(false);

  // 支付币种
  const [symbolVisible, setSymbolVisible] = useState(false);
  const [symbol, setSymbol] = useState('');

  // 价格
  const [price, setPrice] = useState('');

  // 数量
  const [amount, setAmount] = useState('');

  // 图片加载
  const [loaded, setLoaded] = useState(false);

  const match: {
    params: {
      tokenId: string;
      ownerAddress: string;
      nftContractAddress: string;
      boxAddress?: string;
      boxTokenId?: string;
      inviterAddress?: string;
      refId?: string;
    };
  } = useRouteMatch();

  // 售卖Modal
  const [sellModal, setSellModal] = useState<boolean>(false);
  const toggleSellModal = () => {
    setSellModal(!sellModal);
    if (sellModal) {
      setPrice('');
      setAmount('');
    }
  };

  const paymentList =
    paymentSymbols.filter(
      (item) => item.platformContractType === platformContractType.MARKET,
    )[0]?.paymentList || [];

  const symbolMenus = (
    <StyledSymbolMenu mode="inline">
      {paymentList.map(
        (payment: {
          id: number;
          paymentContractAddress: string;
          paymentContractDecimals: number;
          paymentContractImageUrl: string;
          paymentContractSymbol: string;
        }) => (
          <MenuItem
            key={payment.paymentContractSymbol}
            onClick={() => {
              setSymbol(payment.paymentContractSymbol);
            }}
          >
            <StyledSymbol>
              <div className="icon">
                <img src={payment.paymentContractImageUrl} alt="" />
              </div>
              <div>
                <span className="contract-symbol">{payment.paymentContractSymbol}</span>
                {payment.paymentContractAddress?.toUpperCase() !==
                mainChainAddress.toUpperCase() ? (
                  <span className="contract-address">
                    {formatAddress(payment.paymentContractAddress, 5)}
                  </span>
                ) : (
                  ''
                )}
              </div>
            </StyledSymbol>
          </MenuItem>
        ),
      )}
    </StyledSymbolMenu>
  );

  const {
    tokenId,
    ownerAddress,
    nftContractAddress,
    boxAddress,
    boxTokenId,
    inviterAddress,
    refId,
  } = match.params;

  const fetchData = async () => {
    const cardDetailData = await fetchCardDetail(
      tokenId,
      nftContractAddress,
      ownerAddress,
      boxAddress,
      boxTokenId,
    );
    setCardDetail(cardDetailData);
    toggleLoading(false);
  };

  const [bills, setBills] = useState({
    countId: '',
    current: 1,
    hitCount: false,
    maxLimit: null,
    optimizeCountSql: true,
    orders: [],
    pages: 0,
    records: [],
    searchCount: true,
    size: 12,
    total: 0,
  });
  const fetchNFTBillsData = async (page: number) => {
    const billsData = await fetchNFTBills(nftContractAddress, tokenId, page);
    setBills(billsData);
  };

  // NORMAL正常状态，BOX_PRIVATE在私有盲盒中，BOX_PUBLIC在公共盲盒中，MARKET_SALE在售卖市场中一口价的
  // 是自己的卡，状态是NORMAL，已授权-售卖， 未授权-授权
  // 是自己的卡，状态是MARKET_SALE，已授权-取消售卖， 未授权-授权
  // 不是自己的卡，状态是MARKET_SALE，显示 购买
  // 不是自己的卡，状态是NORMAL，什么都不显示
  const { nftStatus, isApprove } = cardDetail || {};
  const isOwnCard = account?.toUpperCase() === ownerAddress?.toUpperCase();

  // 扩展属性
  const allTraits: any = cardDetail?.tokenTraitResponseList || [];
  const normalTraits =
    allTraits.filter(
      (item: {
        collectionSlug: string;
        displayType: string;
        id: number;
        nftContractAddress: string;
        nftTokenId: string;
        recordType: string;
        seq: number;
        traitType: string;
        traitValue: string;
      }) => item.displayType === '',
    ) || [];
  const numberTraits =
    allTraits.filter(
      (item: {
        collectionSlug: string;
        displayType: string;
        id: number;
        nftContractAddress: string;
        nftTokenId: string;
        recordType: string;
        seq: number;
        traitType: string;
        traitValue: string;
      }) => item.displayType === 'number',
    ) || [];
  const dateTraits =
    allTraits.filter(
      (item: {
        collectionSlug: string;
        displayType: string;
        id: number;
        nftContractAddress: string;
        nftTokenId: string;
        recordType: string;
        seq: number;
        traitType: string;
        traitValue: string;
      }) => item.displayType === 'date',
    ) || [];

  // 展示方式
  const showTypeMap: { [key: string]: string } = {
    normal: intl.formatMessage({ id: 'nft.create.modal.type.normal' }),
    number: intl.formatMessage({ id: 'nft.create.modal.type.number' }),
    date: intl.formatMessage({ id: 'nft.create.modal.type.date' }),
  };
  const typeIconMap: { [key: string]: string } = {
    normal: NormalIcon,
    date: DateIcon,
    number: NumberIcon,
  };

  const renderButton = () => {
    if (isOwnCard) {
      if (nftStatus === MARKET_STATUS.NORMAL) {
        // 售卖
        return (
          <Button
            onClick={() => {
              toggleSellModal();
            }}
            size={isMobile ? 'md' : 'lg'}
            variant="secondary"
            text={intl.formatMessage({ id: 'card.detail.sell.button' })}
          />
        );
      } else if (nftStatus === MARKET_STATUS.MARKET_SALE) {
        if (isApprove === 'Y') {
          // 取消售卖
          return (
            <Button
              onClick={() => {
                toggleLoading(true);
                cancelOrder(cardDetail?.orderAsk?.orderBizId)
                  .then((responseData: any) => {
                    toggleLoading(false);
                    const response = responseData?.data;
                    if (response.code === 0) {
                      Toast(
                        ToastType.SENDED,
                        intl.formatMessage({ id: 'common.msg.ok' }),
                        () => {
                          fetchData();
                        },
                      );
                    } else {
                      Toast(ToastType.WARNING, response.msg, () => {
                        fetchData();
                      });
                    }
                  })
                  .catch(() => {
                    toggleLoading(false);
                    Toast(
                      ToastType.WARNING,
                      intl.formatMessage({ id: 'common.msg.error' }),
                      () => {
                        fetchData();
                      },
                    );
                  });
              }}
              size={isMobile ? 'md' : 'lg'}
              variant="secondary"
              text={intl.formatMessage({ id: 'card.detail.cancel.button' })}
            />
          );
        } else {
          // 去授权
          return (
            <>
              <Button
                onClick={() => {
                  toggleLoading(true);
                  approveNFT(cardDetail?.nftContractAddress, cardDetail?.schemaName).then(
                    () => {
                      toggleLoading(false);
                      fetchData();
                    },
                  );
                }}
                size={isMobile ? 'md' : 'lg'}
                variant="primary"
                text={intl.formatMessage({ id: 'card.detail.approval' })}
              />
              <Spacer size="sm" />
              <span>{intl.formatMessage({ id: 'card.detail.approval.comments' })}</span>
            </>
          );
        }
      }
    } else {
      if (nftStatus === MARKET_STATUS.MARKET_SALE) {
        // 购买
        return (
          <Button
            onClick={() => {
              toggleLoading(true);
              // 上报邀请信息
              if (inviterAddress) {
                uploadInviteInfo(refId, ACTIVITY_TYPE.NFT, inviterAddress);
              }
              buyCard(
                cardDetail?.orderAsk?.orderBizId,
                () => {
                  toggleLoading(true, intl.formatMessage({ id: 'modal.cancel.approving' }));
                },
                () => {
                  toggleLoading(true, intl.formatMessage({ id: 'modal.approving' }));
                },
              )
                .then(() => {
                  toggleLoading(false);
                  history.push('/user/nfts');
                })
                .catch((e) => {
                  if (e === ERRORMSG.INSUFFICIENT) {
                    Toast(
                      ToastType.WARNING,
                      intl.formatMessage({ id: 'insufficient.balance' }),
                    );
                  } else {
                    Toast(ToastType.WARNING, intl.formatMessage({ id: 'common.msg.error' }));
                  }
                  toggleLoading(false);
                  fetchData();
                });
            }}
            size={isMobile ? 'md' : 'lg'}
            variant="primary"
            text={intl.formatMessage({ id: 'card.detail.buy' })}
          />
        );
      } else if (nftStatus === MARKET_STATUS.NORMAL) {
        // 空的
      }
    }
  };

  const fee = cardDetail?.platformFeeRatio;

  const decimals = paymentList.find(
    (item: {
      id: number;
      paymentContractAddress: string;
      paymentContractDecimals: number;
      paymentContractImageUrl: string;
      paymentContractSymbol: string;
    }) => item.paymentContractSymbol === symbol,
  )?.paymentContractDecimals;

  // 成交后将得到
  const willGet =
    fee &&
    price &&
    new Decimal(price).mul(new Decimal(1).sub(fee).toFixed(maxDigits)).toFixed(maxDigits);

  const isVideo =
    cardDetail?.imageUrl?.toUpperCase().endsWith('.MP4') ||
    cardDetail?.imageUrl?.toUpperCase().endsWith('.WEBM') ||
    cardDetail?.imageUrl?.toUpperCase().endsWith('.OGG');

  const handleOrder = () => {
    const paymentTokenContractAddress = paymentList.find(
      (item: {
        id: number;
        paymentContractAddress: string;
        paymentContractDecimals: number;
        paymentContractImageUrl: string;
        paymentContractSymbol: string;
      }) => item.paymentContractSymbol === symbol,
    )?.paymentContractAddress;

    const paymentTokenContractAmountRaw = ethers.utils.parseUnits(price, decimals).toString();
    toggleLoading(true);
    setAmount('');
    setPrice('');
    doOrder(
      saleType.SALE,
      cardDetail?.nftContractAddress,
      cardDetail?.nftTokenId,
      cardDetail?.ownerAddress,
      paymentTokenContractAddress,
      cardDetail?.schemaName === schemaMap.ERC721 ? 1 : Number(amount),
      paymentTokenContractAmountRaw,
      cardDetail?.schemaName,
    )
      .then((responseData: any) => {
        toggleLoading(false);
        const response = responseData?.data;
        if (response.code === 0) {
          Toast(ToastType.SENDED, intl.formatMessage({ id: 'common.msg.ok' }), () => {
            fetchData();
          });
        } else {
          Toast(ToastType.WARNING, response.msg, () => {
            fetchData();
          });
        }
      })
      .catch(() => {
        toggleLoading(false);
        Toast(ToastType.WARNING, intl.formatMessage({ id: 'common.msg.error' }), () => {
          fetchData();
        });
      });
    toggleSellModal();
    setAmount('');
  };

  const renderNickname = (address: string) => {
    const userInfoMap: {
      [key: string]: {
        address: string;
        description: string;
        nickname: string;
        profileImageUrl: string;
      };
    } = cardDetail?.userInfoMap;
    if (userInfoMap && userInfoMap[address] && userInfoMap[address].nickname) {
      return `${
        userInfoMap[address].nickname
      }<span style="color: rgba(0, 0, 0, .6)">(${formatAddress(address)})</span>`;
    } else {
      return `${formatAddress(address)}`;
    }
  };

  // share link url
  let shareUrl = '';
  if (boxTokenId) {
    shareUrl = `/card-detail/${nftContractAddress}/${ownerAddress}/${tokenId}/${boxAddress}/${boxTokenId}/${account?.toLowerCase()}/${
      cardDetail?.orderAsk?.id
    }?network=${Number(window?.ethereum?.chainId)}`;
  } else {
    shareUrl = `/card-detail/${nftContractAddress}/${ownerAddress}/${tokenId}/${account?.toLowerCase()}/${
      cardDetail?.orderAsk?.id
    }?network=${Number(window?.ethereum?.chainId)}`;
  }

  return (
    <Page>
      {isMobile ? (
        ''
      ) : (
        <>
          <Spacer size="lg" />
        </>
      )}
      <Spacer size="md" />
      <Container
        flex
        direction="row"
        align="left"
        justify="center"
        maxWidth={maxWidth}
        padding={isMobile ? '0' : '96px 0 48px 24px'}
        background={isMobile ? 'transparent' : '#fff'}
        boxShadow="none"
      >
        {isVideo ? (
          <StyledVideo>
            <video
              src={cardDetail?.imageUrl}
              controls
              poster={`${cardDetail?.imageUrl}?x-oss-process=video/snapshot,t_7000,f_jpg,m_fast`}
            ></video>
          </StyledVideo>
        ) : (
          <Dropdown
            trigger="click"
            align={{ targetOffset: [0, -12] }}
            placement="topRight"
            overlay={
              <StyledGlobalPopover>
                <img src={cardDetail?.imageUrl} alt="" />
              </StyledGlobalPopover>
            }
          >
            <StyledImg loaded={loaded}>
              <img
                src={cardDetail?.imageUrl || loadErrorImg}
                onLoad={() => {
                  setLoaded(true);
                }}
                alt=""
              />
              <Spacer size={isMobile ? 'sm' : 'lg'} />
            </StyledImg>
          </Dropdown>
        )}
        <Spacer size={isMobile ? 'sm' : 'lg'} />
        <StyledContainer>
          {isMobile && (
            <>
              {cardDetail?.collectionInfo?.isAuthorized === 'Y' ? (
                <StyledAuthorizeMobile>
                  <span>{intl.formatMessage({ id: 'project.authorized' })}</span>
                </StyledAuthorizeMobile>
              ) : (
                ''
              )}
            </>
          )}
          <Spacer size="sm" />
          <div
            className={`genuine-container ${
              !isMobile && cardDetail?.collectionInfo?.isAuthorized === 'N'
                ? 'no-authorized'
                : ''
            }`}
          >
            <div className="title">
              <div className="content">{cardDetail?.name || <Skeleton />}</div>
            </div>
            {isMobile && cardDetail?.orderAsk && account && (
              <img
                onClick={() => {
                  setShowShareInfo(!showShareInfo);
                }}
                src={ShareMobileIcon}
                width="32px"
                alt=""
              />
            )}
            {!isMobile && cardDetail?.collectionInfo?.isAuthorized === 'Y' ? (
              <div className="genuine">
                <StyledAuthorize>
                  <span>{intl.formatMessage({ id: 'project.authorized' })}</span>
                </StyledAuthorize>
              </div>
            ) : (
              ''
            )}
          </div>
          <Spacer size="sm" />
          <div className="collection">
            {cardDetail?.collectionInfo?.name && (
              <div className="collection-item">
                {cardDetail?.collectionInfo?.imageUrl && (
                  <img
                    src={cardDetail?.collectionInfo?.imageUrl}
                    width="24px"
                    height="24px"
                    alt=""
                  />
                )}
                <Spacer size="sm" />
                <span>{cardDetail?.collectionInfo?.name}</span>
              </div>
            )}
            <Spacer size="sm" />
            {cardDetail?.categoryName && (
              <div className="collection-item">
                <img src={CategoryIcon} width="24px" height="24px" alt="" />
                <Spacer size="sm" />
                <span>{cardDetail?.categoryName}</span>
              </div>
            )}
            <Spacer size="sm" />
            <div className="collection-item">
              <img
                src={platformIconMap[cardDetail?.schemaName]}
                width="24px"
                height="24px"
                alt=""
              />
              <Spacer size="sm" />
              <span>{cardDetail?.schemaName}</span>
            </div>
          </div>
          <Spacer size="lg" />
          <Container
            flex
            direction="column"
            align="center"
            padding="16px 24px"
            margin="0"
            background="rgba(0, 0, 0, 0.05)"
            boxShadow="none"
          >
            <StyledItemContainer>
              <div className="item">
                <span className="label">{intl.formatMessage({ id: 'card.detail.owner' })}</span>
                {cardDetail?.ownerAddress && (
                  <div
                    className="value clickable"
                    onClick={() => {
                      window.open(`${config.etherscanUrl}/address/${cardDetail?.ownerAddress}`);
                    }}
                    dangerouslySetInnerHTML={{
                      __html: renderNickname(cardDetail?.ownerAddress),
                    }}
                  />
                )}
              </div>
              <div className="item">
                <span className="label">
                  {intl.formatMessage({ id: 'card.detail.creator' })}
                </span>
                {cardDetail?.minterAddress && (
                  <div
                    className="value clickable"
                    onClick={() => {
                      window.open(
                        `${config.etherscanUrl}/address/${cardDetail?.minterAddress}`,
                      );
                    }}
                    dangerouslySetInnerHTML={{
                      __html: renderNickname(cardDetail?.minterAddress),
                    }}
                  />
                )}
              </div>
            </StyledItemContainer>
            <Spacer size="md" />
            <StyledItemContainer>
              <div className="item">
                <span className="label">
                  {intl.formatMessage({ id: 'card.detail.contract.address' })}
                </span>
                {cardDetail?.nftContractAddress && (
                  <div
                    className="value clickable"
                    onClick={() => {
                      window.open(
                        `${config.etherscanUrl}/address/${cardDetail?.nftContractAddress}`,
                      );
                    }}
                    dangerouslySetInnerHTML={{
                      __html: cardDetail?.nftContractAddress,
                    }}
                  />
                )}
              </div>
              <Spacer size="sm" />
              <div className="item">
                <span className="label">{intl.formatMessage({ id: 'card.detail.chain' })}</span>
                {cardDetail?.nftTokenId && (
                  <span
                    className="value clickable"
                    onClick={() => {
                      window.open(
                        `${config.etherscanUrl}/token/${cardDetail?.nftContractAddress}?a=${cardDetail?.nftTokenId}`,
                      );
                    }}
                  >
                    #{cardDetail?.nftTokenId}
                  </span>
                )}
              </div>
            </StyledItemContainer>
            {cardDetail?.schemaName === schemaMap.ERC1155 ? (
              <>
                <Spacer size="md" />
                <StyledItemContainer>
                  <div className="item">
                    <span className="label">
                      {intl.formatMessage({ id: 'card.detail.amount' })}
                    </span>
                    <span className="value">{numeral(cardDetail?.amount).format('0,0')}</span>
                  </div>
                </StyledItemContainer>
              </>
            ) : (
              ''
            )}
          </Container>
          <Spacer size="md" />
          {cardDetail?.description ? (
            <>
              <div className="subtitle">
                {intl.formatMessage({ id: 'card.detail.comments' })}
              </div>
              <Spacer size="sm" />
              <div className="comments">{cardDetail?.description}</div>
            </>
          ) : (
            ''
          )}
          {cardDetail?.externalLink ? (
            <>
              <Spacer size="sm" />
              <a href={cardDetail?.externalLink} target="_blank" rel="noreferrer">
                {intl.formatMessage({ id: 'card.detail.more' })}
              </a>
            </>
          ) : (
            ''
          )}
          <Spacer size="md" />
          {cardDetail?.schemaName === schemaMap.ERC1155 &&
          cardDetail?.orderAsk &&
          Number(cardDetail?.salePaymentContractAmount) ? (
            <StyledAmountAndPrice>
              <div className="amount">
                <div className="subtitle">
                  {intl.formatMessage({ id: 'card.detail.dealing' })}
                </div>
                <Spacer size="sm" />
                <span>{cardDetail?.orderAsk?.nftCount}</span>
              </div>
              <div className="price">
                <div className="subtitle">
                  {intl.formatMessage({ id: 'card.detail.price' })}
                </div>
                <Spacer size="sm" />
                <div className="detail">
                  <span>
                    {cardDetail?.salePaymentContractAmount}
                    {'  '}
                    {cardDetail?.salePaymentContractSymbol}
                  </span>
                  <span>
                    ${' '}
                    {cardDetail?.saleSymbolUsdPrice
                      ? numeral(cardDetail?.saleSymbolUsdPrice)
                          .multiply(cardDetail?.salePaymentContractAmount)
                          .format(digits)
                      : '-'}
                  </span>
                </div>
              </div>
            </StyledAmountAndPrice>
          ) : (
            ''
          )}
          {cardDetail?.schemaName === schemaMap.ERC721 &&
          Number(cardDetail?.salePaymentContractAmount) ? (
            <StyledAmountAndPrice>
              <div className="price">
                <div className="subtitle">
                  {intl.formatMessage({ id: 'card.detail.price' })}
                </div>
                <Spacer size="sm" />
                <div className="detail">
                  <span>
                    {cardDetail?.salePaymentContractAmount}
                    {'  '}
                    {cardDetail?.salePaymentContractSymbol}
                  </span>
                  <span>
                    ${' '}
                    {cardDetail?.saleSymbolUsdPrice
                      ? numeral(cardDetail?.saleSymbolUsdPrice)
                          .multiply(cardDetail?.salePaymentContractAmount)
                          .format(digits)
                      : '-'}
                  </span>
                </div>
              </div>
            </StyledAmountAndPrice>
          ) : (
            ''
          )}
          {cardDetail?.lastPaymentContractAmount &&
          Number(cardDetail?.lastPaymentContractAmount) &&
          !Number(cardDetail?.salePaymentContractAmount) ? (
            <StyledAmountAndPrice>
              <div className="price">
                <div className="subtitle">
                  {intl.formatMessage({ id: 'card.detail.price.nearby' })}
                </div>
                <Spacer size="sm" />
                <div className="detail">
                  <span>
                    {cardDetail?.lastPaymentContractAmount}
                    {'  '}
                    {cardDetail?.lastPaymentContractSymbol}
                  </span>
                  {cardDetail?.lastSaleSymbolUsdPrice && (
                    <span>
                      $
                      {numeral(cardDetail?.lastSaleSymbolUsdPrice)
                        .multiply(cardDetail?.lastPaymentContractAmount)
                        .format(digits)}
                    </span>
                  )}
                </div>
              </div>
            </StyledAmountAndPrice>
          ) : (
            ''
          )}
          <Spacer size={isMobile ? 'md' : 'lg'} />
          <div className="button">{renderButton()}</div>
          <Spacer size="md" />
        </StyledContainer>
        {!isMobile && cardDetail?.orderAsk && (
          <StyledShare image={ShareIcon} hoverImage={ShareHoverIcon}>
            <span>{intl.formatMessage({ id: 'share.has.gift' })}</span>
            <div
              onClick={() => {
                if (!account) {
                  connectWallet();
                } else {
                  toggleShareModal();
                }
              }}
            ></div>
          </StyledShare>
        )}
      </Container>
      <Spacer size={isMobile ? 'sm' : 'lg'} />
      {cardDetail?.tokenTraitResponseList?.length > 0 && (
        <StyledTrait>
          <div className="title">{intl.formatMessage({ id: 'card.detail.props.title' })}</div>
          <Spacer size={isMobile ? 'sm' : 'lg'} />
          {normalTraits.length > 0 && (
            <>
              <img src={typeIconMap['normal']} width="40px" alt="" />
              <Spacer size="sm" />
              <div className="block">
                {normalTraits.map(
                  (item: {
                    collectionSlug: string;
                    displayType: string;
                    id: number;
                    nftContractAddress: string;
                    nftTokenId: string;
                    recordType: string;
                    seq: number;
                    traitType: string;
                    traitValue: string;
                  }) => (
                    <div className="item" key={item.id}>
                      {item.traitType.length > 12 ? (
                        <Dropdown
                          align={{ targetOffset: [0, -12] }}
                          placement="bottomCenter"
                          overlayStyle={{
                            width: '173px',
                            minWidth: '173px',
                          }}
                          overlay={<StyledPopover>{item.traitType}</StyledPopover>}
                        >
                          <span>{item.traitType}</span>
                        </Dropdown>
                      ) : (
                        <span>{item.traitType}</span>
                      )}
                      {item.traitValue.length > 12 ? (
                        <Dropdown
                          align={{ targetOffset: [0, -12] }}
                          placement="bottomCenter"
                          overlayStyle={{
                            width: '212px',
                            minWidth: '212px',
                          }}
                          overlay={<StyledPopover>{item.traitValue}</StyledPopover>}
                        >
                          <span>{item.traitValue}</span>
                        </Dropdown>
                      ) : (
                        <span>{item.traitValue}</span>
                      )}
                    </div>
                  ),
                )}
              </div>
            </>
          )}
          {numberTraits.length > 0 && (
            <>
              <Spacer size="lg" />
              <img src={typeIconMap['number']} width="40px" alt="" />
              <Spacer size="sm" />
              <div className="block">
                {numberTraits.map(
                  (item: {
                    collectionSlug: string;
                    displayType: string;
                    id: number;
                    nftContractAddress: string;
                    nftTokenId: string;
                    recordType: string;
                    seq: number;
                    traitType: string;
                    traitValue: string;
                  }) => (
                    <div className="item" key={item.id}>
                      {item.traitType.length > 12 ? (
                        <Dropdown
                          align={{ targetOffset: [0, -12] }}
                          placement="bottomCenter"
                          overlayStyle={{
                            width: '173px',
                            minWidth: '173px',
                          }}
                          overlay={<StyledPopover>{item.traitType}</StyledPopover>}
                        >
                          <span>{item.traitType}</span>
                        </Dropdown>
                      ) : (
                        <span>{item.traitType}</span>
                      )}
                      {item.traitValue.length > 12 ? (
                        <Dropdown
                          align={{ targetOffset: [0, -12] }}
                          placement="bottomCenter"
                          overlayStyle={{
                            width: '212px',
                            minWidth: '212px',
                          }}
                          overlay={<StyledPopover>{item.traitValue}</StyledPopover>}
                        >
                          <span>{item.traitValue}</span>
                        </Dropdown>
                      ) : (
                        <span>{item.traitValue}</span>
                      )}
                    </div>
                  ),
                )}
              </div>
            </>
          )}
          {dateTraits.length > 0 && (
            <>
              <Spacer size="lg" />
              <img src={typeIconMap['date']} width="40px" alt="" />
              <Spacer size="sm" />
              <div className="block">
                {dateTraits.map(
                  (item: {
                    collectionSlug: string;
                    displayType: string;
                    id: number;
                    nftContractAddress: string;
                    nftTokenId: string;
                    recordType: string;
                    seq: number;
                    traitType: string;
                    traitValue: string;
                  }) => (
                    <div className="date" key={item.id}>
                      {item.traitType.length > 12 ? (
                        <Dropdown
                          align={{ targetOffset: [0, -12] }}
                          placement="bottomCenter"
                          overlayStyle={{
                            width: '173px',
                            minWidth: '173px',
                          }}
                          overlay={<StyledPopover>{item.traitType}</StyledPopover>}
                        >
                          <span>{item.traitType}</span>
                        </Dropdown>
                      ) : (
                        <span>{item.traitType}</span>
                      )}
                      {isMobile ? (
                        <Dropdown
                          align={{ targetOffset: [0, -12] }}
                          placement="bottomCenter"
                          overlayStyle={{
                            width: '173px',
                            minWidth: '173px',
                          }}
                          overlay={
                            <StyledPopover>
                              {moment(Number(item.traitValue)).format('YYYY-MM-DD HH:mm:ss')}
                            </StyledPopover>
                          }
                        >
                          <span>
                            {moment(Number(item.traitValue)).format('YYYY-MM-DD HH:mm:ss')}
                          </span>
                        </Dropdown>
                      ) : (
                        <span>
                          {moment(Number(item.traitValue)).format('YYYY-MM-DD HH:mm:ss')}
                        </span>
                      )}
                    </div>
                  ),
                )}
              </div>
            </>
          )}
          <Spacer size="lg" />
        </StyledTrait>
      )}
      <StyledRecordsTitle>
        <span>{intl.formatMessage({ id: 'transaction.title' })}</span>
        <Spacer size="sm" />
        <span>
          {intl.formatMessage({ id: 'transaction.subtitle' }, { count: bills?.total })}
        </span>
      </StyledRecordsTitle>
      <Spacer size={isMobile ? 'sm' : 'md'} />
      {bills?.records?.length > 0 ? (
        <Container
          flex
          direction="row"
          wrap
          align="center"
          justify="between"
          width="100%"
          padding={isMobile ? '16px' : '0'}
          maxWidth={maxWidth}
          boxShadow="none"
        >
          {bills?.records?.map((bill, index) => (
            <TransactionRecord
              key={`$bill.txHash}-${index}`}
              {...bill}
              width={isMobile ? '100%' : '48%'}
            />
          ))}
        </Container>
      ) : (
        ''
      )}
      <Spacer size="lg" />
      <StyledModal
        isOpen={sellModal}
        onBackgroundClick={() => {
          toggleSellModal();
        }}
        onEscapeKeydown={() => {
          toggleSellModal();
        }}
      >
        <Container flex direction="column" align="center" justify="center" padding="40px">
          <div className="title">
            <span>{intl.formatMessage({ id: 'card.detail.modal.title' })}</span>
            <img
              className="close"
              src={CloseIcon}
              width="24px"
              alt=""
              onClick={() => {
                toggleSellModal();
              }}
            />
          </div>
          <Spacer size="md" />
          <div className="title">
            <span>{cardDetail?.name}</span>
          </div>
          <Spacer size="sm" />
          <div className="title">
            <span># {cardDetail?.nftTokenId}</span>
          </div>
          {cardDetail?.schemaName === schemaMap.ERC1155 && (
            <>
              <Spacer size="md" />
              <div className="subtitle">
                {intl.formatMessage({ id: 'card.detail.modal.amount.title' })}
              </div>
              <Input
                width="100%"
                onChange={(event) => {
                  const inputVal = event.currentTarget.value;
                  if (inputVal && !Number.isInteger(Number(inputVal))) {
                    setAmount(`${Math.floor(Number(inputVal))}`);
                  } else if (inputVal && Number(inputVal) > Number(cardDetail?.amount)) {
                    setAmount(cardDetail?.amount);
                  } else {
                    setAmount(`${Number(event.currentTarget.value) || ''}`);
                  }
                }}
                placeholder={intl.formatMessage(
                  { id: 'card.detail.modal.amount.placeholder' },
                  { amount: cardDetail?.amount },
                )}
                value={amount}
                padding="0"
                variant="inline"
                background="transparent"
                endAdornment={
                  <StyledAllBtn
                    onClick={() => {
                      setAmount(cardDetail?.amount);
                    }}
                  >
                    {intl.formatMessage({ id: 'common.all' })}
                  </StyledAllBtn>
                }
              />
            </>
          )}
          <Spacer size="md" />
          <div className="subtitle">
            {intl.formatMessage({ id: 'card.detail.modal.price.title' })}
          </div>
          <Input
            width="100%"
            onChange={(event) => {
              const inputVal = event.currentTarget.value;
              if (!inputVal) {
                setPrice('');
              } else if (Number(inputVal) > LUCKYBOXMAXPRICE) {
                setPrice(`${LUCKYBOXMAXPRICE}`);
              } else {
                // 判断小数位
                if (inputVal.includes('.')) {
                  const valArr = inputVal.split('.');
                  setPrice(
                    `${Number(valArr[0])}.${valArr[1].slice(
                      0,
                      Math.min(maxDigits, decimals || 0),
                    )}`,
                  );
                } else {
                  setPrice(`${Number(inputVal)}`);
                }
              }
            }}
            placeholder={intl.formatMessage({ id: 'card.detail.modal.price.placeholder' })}
            value={price}
            padding="0"
            variant="inline"
            background="transparent"
            endAdornment={
              <Dropdown
                overlayStyle={{
                  width: '220px',
                  minWidth: '220px',
                }}
                overlay={symbolMenus}
                placement="bottomRight"
                onVisibleChange={(visible: boolean) => {
                  setSymbolVisible(visible);
                }}
              >
                <StyledSelect>
                  <span>{symbol}</span>
                  <Spacer size="lg" />
                  <img width="20px" src={symbolVisible ? ArrowUpIcon : ArrowDownIcon} alt="" />
                </StyledSelect>
              </Dropdown>
            }
          />
          <Spacer size="md" />
          <div className="subtitle">
            {intl.formatMessage({ id: 'card.detail.modal.sell.detail.title' })}
          </div>
          <Spacer size="md" />
          <div className="detail">
            <div className="item">
              <span>
                {intl.formatMessage({ id: 'card.detail.modal.sell.detail.platform' })}
              </span>
              <span>{fee ? numeral(fee).multiply(100).value() : 0}%</span>
            </div>
          </div>
          {willGet ? (
            <>
              <Spacer size="sm" />
              <div className="deal">
                <span>
                  {intl.formatMessage({ id: 'card.detail.modal.sell.detail.fee.deal' })}
                </span>
                <span>
                  {'  '}
                  {willGet} {symbol}
                </span>
              </div>
            </>
          ) : (
            ''
          )}
          <Spacer size="lg" />
          <Button
            disabled={
              cardDetail?.schemaName === schemaMap.ERC721
                ? !price || !Number(price) || !symbol
                : !amount || !Number(price) || !symbol
            }
            onClick={handleOrder}
            size={isMobile ? 'md' : 'lg'}
            variant="primary"
            text={intl.formatMessage({ id: 'card.detail.modal.sell.button' })}
          />
        </Container>
      </StyledModal>
      <StyledModal
        isOpen={shareModal}
        onBackgroundClick={() => {
          toggleShareModal();
        }}
        onEscapeKeydown={() => {
          toggleShareModal();
        }}
      >
        <Container flex direction="column" align="center" justify="center" padding="40px">
          <div className="title">
            <span>{intl.formatMessage({ id: 'share.nft.title' })}</span>
            <img
              className="close"
              src={CloseIcon}
              width="24px"
              alt=""
              onClick={() => {
                toggleShareModal();
              }}
            />
          </div>
          <Spacer size="lg" />
          <div className="share-link">{`${window.location.origin}${shareUrl}`}</div>
          <Spacer size="lg" />
          <CopyToClipboard text={`${window.location.origin}${shareUrl}`}>
            <Button
              onClick={() => {
                toggleShareModal();
              }}
              size={'lg'}
              variant="primary"
              text={intl.formatMessage({ id: 'common.copy' })}
            />
          </CopyToClipboard>
        </Container>
      </StyledModal>
      <StyledModal
        isOpen={noDataModal}
        onBackgroundClick={() => {
          toggleNoDataModal();
        }}
        onEscapeKeydown={() => {
          toggleNoDataModal();
        }}
      >
        <Container flex direction="column" align="center" justify="center" padding="40px">
          <div className="title">
            <span>{intl.formatMessage({ id: 'nodata.title' })}</span>
            <img
              className="close"
              src={CloseIcon}
              width="24px"
              alt=""
              onClick={() => {
                toggleNoDataModal();
              }}
            />
          </div>
          <Spacer size="lg" />
          <img src={InvalidIcon} width="160px" alt="" />
          <Spacer size="md" />
          <div>{intl.formatMessage({ id: 'nodata.nft.content' })}</div>
          <Spacer size="lg" />
          <Button
            onClick={() => {
              toggleNoDataModal();
              history.push('/');
            }}
            size={'md'}
            variant="primary"
            text={intl.formatMessage({ id: 'nodata.back.button' })}
          />
        </Container>
      </StyledModal>
      {showShareInfo && (
        <StyledShareInfo
          onClick={() => {
            setShowShareInfo(!showShareInfo);
          }}
        >
          <StyleContent show={showShareInfo}>
            <div>{intl.formatMessage({ id: 'share.nft.title' })}</div>
            <Spacer size="md" />
            <span>{`${window.location.origin}${shareUrl}`}</span>
            <Spacer size="md" />
            <CopyToClipboard text={`${window.location.origin}${shareUrl}`}>
              <span className="copy-button">{intl.formatMessage({ id: 'common.copy' })}</span>
            </CopyToClipboard>
            <Spacer size="sm" />
          </StyleContent>
        </StyledShareInfo>
      )}
    </Page>
  );
};

const fadeInUpBig = keyframes`
  0%{opacity:0;
  -webkit-transform:translateY(2000px)}
  100%{opacity:1;
  -webkit-transform:translateY(0)}
`;

const StyledShareInfo = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1;
`;

const StyleContent = styled.div`
  animation: ${(props: { show: boolean }) => (props.show ? fadeInUpBig : fadeOutDownBig)} 0.2s
    ease both;
  width: 100%;
  // height: 220px;
  position: absolute;
  bottom: 32px;
  padding: 32px;
  z-index: 2;
  background: #ffffff;
  border-radius: 20px 20px 0px 0px;
  .copy-button {
    font-size: 16px;
    font-weight: 600;
    color: #0079ff;
    line-height: 24px;
    width: 100%;
    text-align: center;
    display: inline-block;
  }
  div {
    font-size: 16px;
    font-weight: bold;
    color: #000000;
    line-height: 24px;
  }
  span {
    font-size: 12px;
    font-weight: 400;
    color: #000000;
    line-height: 18px;
    word-break: break-all;
    overflow: hidden;
  }
`;

const StyledShare = styled.div`
  position: absolute;
  top: 32px;
  right: 40px;
  div {
    width: 40px;
    height: 40px;
    background: url(${(props: { image: string; hoverImage: string }) => props.image});
    background-size: 100% 100%;
    cursor: pointer;
    :hover {
      background: url(${(props: { image: string; hoverImage: string }) => props.hoverImage});
      background-size: 100% 100%;
    }
  }
  span {
    position: absolute;
    display: flex;
    padding: 2px 4px;
    background: linear-gradient(336deg, #fa5400 0%, #ff8400 100%);
    border-radius: 9px;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    align-items: center;
    justify-content: center;
    flex-direction: row;
    color: #fff;
    font-size: 12px;
    // word-break: keep-all;
    white-space: nowrap;
  }
`;

const StyledItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
`;

const StyledRecordsTitle = styled.div`
  width: 100%;
  max-width: ${(props) => props.theme.maxWidth}px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 0;
  @media (max-width: 600px) {
    padding: 0 20px;
  }
  span:first-child {
    font-size: 36px;
    line-height: 47px;
    font-weight: 600;
    color: #000000;
    @media (max-width: 600px) {
      font-size: 20px;
      line-height: 29px;
    }
  }
  span:last-child {
    font-size: 16px;
    font-weight: 400;
    color: #000000;
    line-height: 24px;
    @media (max-width: 600px) {
      font-size: 12px;
      line-height: 18px;
    }
  }
`;

const StyledAllBtn = styled.div`
  cursor: pointer;
  padding: 4px;
  font-size: 14px;
  color: #000;
  width: 60px;
`;
const StyledAuthorizeMobile = styled.div`
  padding: 2px 4px;
  background: #0079ff;
  border-radius: 0px 21px 21px 0px;
  position: absolute;
  top: 12px;
  left: 10%;
  span {
    font-size: 12px;
    font-weight: 500;
    color: #ffffff;
  }
`;
const StyledAuthorize = styled.div`
  width: 63px;
  height: 64px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 3px 6px;
  // min-width: 100px;
  background: url(${genuine});
  background-size: 100% 100%;
  span {
    font-size: 16px;
    font-weight: bold;
    color: #ffffff;
    line-height: 24px;
    letter-spacing: 1px;
    margin-bottom: 6px;
  }
`;

const StyledVideo = styled.div`
  width: 500px;
  // height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  video {
    max-width: 100%;
    max-height: 100%;
    border-radius: 8px;
  }
`;

const StyledPricePopover = styled.div`
  background: #eee;
  border-radius: 8px;
  padding: 24px;
  color: #0079ff;
  font-weight: 600;
  font-size: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledGlobalPopover = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 24px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  img {
    max-width: 100%;
    max-height: 100%;
  }
`;

const StyledPopover = styled.div`
  display: flex;
  border-radius: 8px;
  background: #eee;
  padding: 8px;
  font-size: 14px;
  color: #000;
  text-align: center;
  overflow: auto;
  word-break: break-word;
  word-wrap: break-word;
`;

const StyledTrait = styled.div`
  width: 100%;
  max-width: ${(props) => props.theme.maxWidth}px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  .title {
    font-size: 32px;
    font-weight: 600;
    color: #000000;
    line-height: 47px;
  }
  .block {
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: flex-start;
    @media (max-width: 600px) {
      justify-content: space-between;
    }
    .item {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      width: 30%;
      padding: 8px 16px;
      background: #f6f6f6;
      border-radius: 4px;
      margin-top: 16px;
      margin-right: 38px;
      @media (max-width: 600px) {
        width: 45%;
        margin-right: 0;
      }
      span:first-child {
        font-size: 16px;
        font-weight: 400;
        color: #000000;
        line-height: 24px;
        display: inline-block;
        width: 43%;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      span:last-child {
        font-size: 16px;
        font-weight: 600;
        color: #000000;
        line-height: 24px;
        display: inline-block;
        width: 55%;
        text-align: right;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .date {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      width: 30%;
      padding: 8px 16px;
      background: #f6f6f6;
      border-radius: 4px;
      margin-top: 16px;
      margin-right: 38px;
      @media (max-width: 600px) {
        width: 45%;
        margin-right: 0;
      }
      span:first-child {
        font-size: 16px;
        font-weight: 400;
        color: #000000;
        line-height: 24px;
        display: inline-block;
        width: 43%;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      span:last-child {
        font-size: 16px;
        font-weight: 600;
        color: #000000;
        line-height: 24px;
        display: inline-block;
        width: 55%;
        text-align: right;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  @media (max-width: 600px) {
    padding: 0 16px;
  }
`;

const StyledAmountAndPrice = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: ${(props: { justify?: string }) => props.justify || 'space-between'};
  .amount {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    span {
      font-size: 32px;
      font-family: 'Oswald', sans-serif;
      font-weight: 600;
      color: #000;
      line-height: 56px;
    }
  }
  .price {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    span:first-child {
      font-size: 32px;
      font-family: 'Noto Sans SC', sans-serif;
      font-weight: 600;
      color: #0079ff;
      line-height: 56px;
    }
    span:last-child {
      font-family: 'Noto Sans SC', sans-serif;
      font-weight: 400;
      font-size: 18px;
      color: rgba(0, 0, 0, 0.4);
      line-height: 28px;
    }
    .detail {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      span {
        font-family: 'Oswald', sans-serif;
      }
    }
  }
`;

const StyledImg = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 500px;
  height: 600px;
  cursor: pointer;
  position: relative;
  img {
    max-width: 100%;
    max-height: 100%;
    border-radius: 8px;
    opacity: ${(props: { loaded: boolean }) => (props.loaded ? 1 : 0)};
    transition: all 0.2s ease-in-out;
  }
  video {
    max-width: 100%;
    max-height: 100%;
    cursor: pointer;
  }
  @media (max-width: 600px) {
    width: 100%;
    height: auto;
    padding: 0 10%;
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
  .subtitle {
    width: 100%;
    text-align: left;
    font-size: 16px;
    font-weight: 600;
    color: #000000;
    line-height: 24px;
  }
  .detail {
    width: 100%;
    padding: 12px;
    background: rgba(0, 0, 0, .05);
    border-radius: 8px;
    .item {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }
  .deal {
    width: 100%;
    text-align: left;
    font-size: 16px;
    font-weight: 600;
    color: #000000;
    line-height: 24px;
    span:last-child {
      color: #0079FF;
    }
  }
  .share-link {
    width: 100%;
    word-break: break-all;
    overflow: hidden;
    font-size: 16px;
    font-weight: 400;
    color: #000000;
    line-height: 24px;
  }
`;

const StyledSymbolMenu = styled(Menu)`
  .rc-dropdown-menu-item {
    padding: 8px !important;
  }
`;

const StyledSymbol = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  div {
    width: 100%;
    margin-left: 8px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    .contract-symbol {
      font-size: 16px;
      font-family: 'Noto Sans SC', sans-serif;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.8);
      line-height: 24px;
    }
    .contract-address {
      font-size: 14px;
      font-family: 'Noto Sans SC', sans-serif;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.8);
      line-height: 24px;
    }
  }
  .icon {
    width: 32px;
    height: 32px;
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
`;

const StyledSelect = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 40px;
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 50%;
  .refresh {
    position: absolute;
    top: 32px;
    right: 32px;
    cursor: pointer;
  }
  .genuine-container {
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    .title {
      width: calc(100% - 90px);
      font-size: 36px;
      font-family: 'Noto Sans SC', sans-serif;
      font-weight: 600;
      color: #000000;
      line-height: 50px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      @media (max-width: 600px) {
        width: calc(100% - 48px);
      }
      .content {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        word-break: break-all;
        @media (max-width: 600px) {
          font-size: 24px;
          font-weight: bold;
          color: #000000;
          line-height: 36px;
        }
      }
    }
    .genuine {
      width: 70px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 4px;
    }
  }
  .no-authorized {
    .title {
      width: 100%;
    }
  }

  .item {
    width: 45%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    .label {
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.6);
      line-height: 24px;
      @media (max-width: 600px) {
        font-weight: 500;
      }
    }
    .value {
      font-size: 14px;
      font-weight: 500;
      color: #000000;
      line-height: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      width: 100%;
      word-wrap: break-word;
      @media (max-width: 600px) {
        font-size: 12px;
        font-weight: 400;
        color: #000000;
        line-height: 18px;
      }
    }
    .clickable {
      cursor: pointer;
    }
  }
  .subtitle {
    font-size: 16px;
    font-family: 'Noto Sans SC', sans-serif;
    font-weight: 500;
    color: #000000;
    line-height: 22px;
  }
  .comments {
    font-size: 14px;
    font-family: 'Noto Sans SC', sans-serif;
    font-weight: 400;
    color: #000000;
    line-height: 20px;
  }
  a {
    text-decoration: none;
    font-size: 14px;
    font-weight: 400;
    color: #0079ff;
    line-height: 20px;
  }
  .button {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    span {
      font-size: 14px;
      font-weight: 400;
      color: #0079ff;
      line-height: 20px;
    }
  }
  .collection {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    .collection-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      border-radius: 21px;
      border: 1px solid rgba(0, 0, 0, 0.2);
      padding: 2px 8px 2px 2px;

      img {
        border-radius: 50%;
      }
      span {
        font-size: 16px;
        font-weight: 500;
        color: #000000;
        line-height: 24px;
        @media (max-width: 600px) {
          font-size: 14px;
        }
      }
    }
  }
  @media (max-width: 600px) {
    width: 100%;
    padding: 16px;
  }
`;

export default LuckyBoxDetail;
