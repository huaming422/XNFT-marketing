import React, { useState, useContext, useEffect, useRef } from 'react';
import Spacer from '@components/Spacer';
import { useIntl } from 'react-intl';
import styled, { keyframes, ThemeContext } from 'styled-components';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Card from '@components/Card';
import Input from '@src/components/Input';
import { Context } from '@src/contexts/provider/Provider';
import useUserCards from '@hooks/useUserCards';
import useUserLuckyBoxes from '@hooks/useUserLuckyBoxes';
import EmptyNFT from '@src/views/UserDetail/components/EmptyNFT';
import Button from '@components/Button';
import deleteimg from '@assets/img/deleteimg.png';
import MoreButton from '@components/MoreButton';
import LuckyBox from '@src/components/LuckyBox';
import Container from '@src/components/Container';
import useMedia from 'use-media';
import Dropdown from 'rc-dropdown';
import useAllCollections from '@src/hooks/useAllCollections';
import useCategory from '@hooks/useCategory';
import searchIcon from '@assets/img/searchIcon.png';
import screen from '@assets/img/screen.png';
import ClearIcon from '@assets/img/clear.png';
import ArrowUpIcon from '@assets/img/arrow-up-light.png';
import ArrowDownIcon from '@assets/img/arrow-down-light.png';
import SortASC from '@assets/img/sort_asc.png';
import SortDESC from '@assets/img/sort_desc.png';
import SaleIcon from '@assets/img/SaleIcon.png';
import AuctionIcon from '@assets/img/AuctionIcon.png';
import { debounce } from 'throttle-debounce';
import Menu, { Item, Item as MenuItem } from 'rc-menu';
import {
  pageSize,
  ReadyState,
  SORT_STATUS,
  NFT_SORT_FIELD,
  SOCKET_BIZ,
  SOCKET_EVENT,
  SOCKET_TYPE,
  MARKET_STATUS,
  IdentifierMap,
} from '@utils/constants';
import 'react-tabs/style/react-tabs.css';
import { useMemo } from 'react';

const UserDetailTabs: React.FC<{
  account?: string;
  tab: number;
  refresh: boolean;
}> = ({ account, tab, refresh }) => {
  const intl = useIntl();
  const isMobile = useMedia({ maxWidth: '600px' });
  const pageSizeRef = useRef(null);
  const [tabIndex, setTabIndex] = useState(tab);
  const fetchUserCards = useUserCards();
  const { toggleLoading, getWebSocket, subscribe, unsubscribe, originChainId } =
    useContext(Context);
  const fetchUserLuckyBoxes = useUserLuckyBoxes();
  const [cardFetching, setCardFetching] = useState(false);
  const [userCards, setUserCards] = useState({
    countId: '',
    current: 1,
    hitCount: false,
    maxLimit: null,
    optimizeCountSql: true,
    orders: [],
    pages: 1,
    records: [],
    searchCount: true,
    size: pageSize,
    total: 0,
  });

  const [luckyBoxFetching, setLuckyBoxFetching] = useState(false);
  const [userLuckyBoxes, setUserLuckyBoxes] = useState({
    countId: '',
    current: 1,
    hitCount: false,
    maxLimit: null,
    optimizeCountSql: true,
    orders: [],
    pages: 1,
    records: [],
    searchCount: true,
    size: pageSize,
    total: 0,
  });

  // search key
  const [searchKey, setSearchKey] = useState('');
  const [boxSearchKey, setBoxSearchKey] = useState('');
  const [searchProject, setSearchProject] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [searchSort, setSearchSort] = useState('');
  const [boxSearchSort, setBoxSearchSort] = useState('');
  const [status, setStatus] = useState('');
  const [boxSortStatus, setBoxSortStatus] = useState('');
  // dropdown visible
  const [searchVisible, setSearchVisible] = useState(false);
  const [statusVisible, setStatusVisible] = useState(false);
  const [projectVisible, setProjectVisible] = useState(false);
  const [categoryVisible, setCategoryVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);
  const [boxSortVisible, setBoxSortVisible] = useState(false);
  const [boxSearchVisible, setBoxSearchVisible] = useState(false);
  // sort status
  const [sortStatus, setSortStatus] = useState(SORT_STATUS.ASC);

  // projects
  const allCollections = useAllCollections();
  // category
  const categorys = useCategory();
  const [showMore, setShowMore] = useState(false);
  // render overlays by type
  const renderOverlays = (type: string) => {
    switch (type) {
      //项目
      case 'project':
        return (
          <StyledOverlayMenu mode="inline">
            <MenuItem
              key={'project-all'}
              onClick={() => {
                setSearchProject('all');
              }}
            >
              <StyledMenuItem>
                <span>{intl.formatMessage({ id: 'market.nft.whole' })}</span>
              </StyledMenuItem>
            </MenuItem>
            {allCollections.map(
              (platform: {
                backgroundImageUrl: '';
                boxCount: 0;
                description: '';
                externalLink: '';
                favoriteCount: '';
                hidden: '';
                id: '';
                imageUrl: '';
                isAuthorized: '';
                name: '';
                nftCount: '';
                nftOwnerCount: '';
                nftTradeCount: '';
                ownerAddress: '';
                slug: '';
                socialChannel: '';
                tradeCount: '';
              }) => (
                <MenuItem
                  key={platform.slug}
                  onClick={() => {
                    setSearchProject(platform.slug);
                  }}
                >
                  <StyledMenuItem>
                    <img src={platform.imageUrl} alt="" />
                    <Spacer size="sm" />
                    <span>{platform.slug}</span>
                  </StyledMenuItem>
                </MenuItem>
              ),
            )}
          </StyledOverlayMenu>
        );
      //类型
      case 'category':
        return (
          <StyledOverlayMenu mode="inline">
            <MenuItem
              key={'category-all'}
              onClick={() => {
                setSearchCategory('all');
              }}
            >
              <StyledMenuItem>
                <span>{intl.formatMessage({ id: 'market.nft.whole' })}</span>
              </StyledMenuItem>
            </MenuItem>
            {categorys.map(
              (category: { langCode: string; langType: string; langValue: string }) => (
                <MenuItem
                  key={category.langCode}
                  onClick={() => {
                    setSearchCategory(category.langCode);
                  }}
                >
                  <StyledMenuItem>
                    <span>{category.langValue}</span>
                  </StyledMenuItem>
                </MenuItem>
              ),
            )}
          </StyledOverlayMenu>
        );
      case 'sort':
        return (
          <StyledOverlayMenu mode="inline">
            <MenuItem
              key={NFT_SORT_FIELD.MINT_TIME}
              onClick={() => {
                setSearchSort(NFT_SORT_FIELD.MINT_TIME);
              }}
            >
              <StyledMenuItem>
                <span>{intl.formatMessage({ id: 'market.nft.sort.mint.time' })}</span>
              </StyledMenuItem>
            </MenuItem>
            <MenuItem
              key={NFT_SORT_FIELD.UPDATE_TIME}
              onClick={() => {
                setSearchSort(NFT_SORT_FIELD.UPDATE_TIME);
              }}
            >
              <StyledMenuItem>
                <span>{intl.formatMessage({ id: 'market.nft.sort.update.time' })}</span>
              </StyledMenuItem>
            </MenuItem>
          </StyledOverlayMenu>
        );
      case 'boxSort':
        return (
          <StyledOverlayMenu mode="inline">
            <MenuItem
              key={NFT_SORT_FIELD.CREATE_TIME}
              onClick={() => {
                setBoxSearchSort(NFT_SORT_FIELD.CREATE_TIME);
              }}
            >
              <StyledMenuItem>
                <span>{intl.formatMessage({ id: 'user.luckybox.create.time' })}</span>
              </StyledMenuItem>
            </MenuItem>
            <MenuItem
              key={NFT_SORT_FIELD.UPDATE_TIME}
              onClick={() => {
                setBoxSearchSort(NFT_SORT_FIELD.UPDATE_TIME);
              }}
            >
              <StyledMenuItem>
                <span>{intl.formatMessage({ id: 'user.luckybox.open.time' })}</span>
              </StyledMenuItem>
            </MenuItem>
            <MenuItem
              key={NFT_SORT_FIELD.OPEN_COUNT}
              onClick={() => {
                setBoxSearchSort(NFT_SORT_FIELD.OPEN_COUNT);
              }}
            >
              <StyledMenuItem>
                <span>{intl.formatMessage({ id: 'user.luckybox.open.count' })}</span>
              </StyledMenuItem>
            </MenuItem>
          </StyledOverlayMenu>
        );
      //状态
      case 'status':
        return (
          <StyledOverlayMenu mode="inline">
            <MenuItem
              key={MARKET_STATUS.NORMAL}
              onClick={() => {
                setStatus(MARKET_STATUS.NORMAL);
              }}
            >
              <StyledMenuItem>
                <span>{intl.formatMessage({ id: 'market.nft.whole' })}</span>
              </StyledMenuItem>
            </MenuItem>
            <MenuItem
              key={MARKET_STATUS.MARKET_SALE}
              onClick={() => {
                setStatus(MARKET_STATUS.MARKET_SALE);
              }}
            >
              <StyledMenuItem>
                <img src={SaleIcon} alt="" />
                <Spacer size="sm" />
                <span>{intl.formatMessage({ id: 'market.nft.status.sale' })}</span>
              </StyledMenuItem>
            </MenuItem>
          </StyledOverlayMenu>
        );
    }
  };
  const SORT_FILED_MAP: { [key: string]: string } = {
    MINT_TIME: intl.formatMessage({ id: 'market.nft.sort.mint.time' }),
    UPDATE_TIME: intl.formatMessage({ id: 'market.nft.sort.update.time' }),
    CREATE_TIME: intl.formatMessage({ id: 'user.luckybox.create.time' }),
    OPEN_COUNT: intl.formatMessage({ id: 'user.luckybox.open.count' }),
  };

  const fetchUserCardsData = async (pageSizeNum: number, historyItem?: string) => {
    const myCards = await fetchUserCards(
      pageSizeNum,
      !status || status === MARKET_STATUS.NORMAL ? '' : MARKET_STATUS.MARKET_SALE,
      searchProject === 'all' ? '' : searchProject,
      searchCategory === 'all' ? '' : searchCategory,
      historyItem || searchKey,
      searchSort,
      sortStatus,
    );
    if (pageSizeNum === pageSizeRef.current.nft) {
      setUserCards(myCards);
    } else {
      setUserCards({
        ...myCards,
        records: [...userCards?.records, ...myCards?.records],
      });
    }
    setCardFetching(false);
  };

  useEffect(() => {
    if (pageSizeRef.current) {
      fetchUserCardsData(pageSizeRef.current.nft);
    }
  }, [status, searchProject, searchCategory, searchSort, sortStatus]);

  useEffect(() => {
    if ((!isMobile || !searchKey) && pageSizeRef.current) {
      fetchUserCardsData(pageSizeRef.current.nft);
      setSearchVisible(false);
    }
  }, [searchKey]);

  useEffect(() => {
    if (pageSizeRef.current) {
      fetchUserLuckyBoxesData(pageSizeRef.current.luckybox);
    }
  }, [boxSearchSort, boxSortStatus]);

  useEffect(() => {
    if ((!isMobile || !boxSearchKey) && pageSizeRef.current) {
      fetchUserLuckyBoxesData(pageSizeRef.current.luckybox);
      setBoxSearchVisible(false);
    }
  }, [boxSearchKey]);

  const fetchUserLuckyBoxesData = async (pageSizeNum: number, historyItem?: string) => {
    const myLuckyBoxes = await fetchUserLuckyBoxes(
      pageSizeNum,
      historyItem || boxSearchKey,
      boxSearchSort,
      boxSortStatus,
    );
    if (pageSizeNum === pageSizeRef.current.luckybox) {
      setUserLuckyBoxes(myLuckyBoxes);
    } else {
      setUserLuckyBoxes({
        ...myLuckyBoxes,
        records: [...userCards?.records, ...myLuckyBoxes?.records],
      });
    }
    setLuckyBoxFetching(false);
    toggleLoading(false);
  };

  useEffect(() => {
    pageSizeRef.current = {
      nft: pageSize,
      luckybox: pageSize,
    };
  }, []);

  useEffect(() => {
    if (account) {
      toggleLoading(true);
      fetchUserCardsData(pageSizeRef.current.nft);
      fetchUserLuckyBoxesData(pageSizeRef.current.luckybox);
      toggleLoading(false);
    }
  }, [account]);

  useEffect(() => {
    if (tabIndex === 0) {
      fetchUserCardsData(pageSizeRef.current.nft);
    } else {
      fetchUserLuckyBoxesData(pageSizeRef.current.luckybox);
    }
  }, [refresh, tabIndex]);
  const socket = getWebSocket();
  useEffect(() => {
    if (socket?.readyState === ReadyState.OPEN && account) {
      subscribe({
        event: SOCKET_EVENT.SUBSCRIBE,
        biz: SOCKET_BIZ.xNFT,
        type: SOCKET_TYPE.NFT,
      });
      subscribe({
        event: SOCKET_EVENT.SUBSCRIBE,
        biz: SOCKET_BIZ.xNFT,
        type: SOCKET_TYPE.BOX_PRIVATE,
      });
      subscribe({
        event: SOCKET_EVENT.SUBSCRIBE,
        biz: SOCKET_BIZ.xNFT,
        type: SOCKET_TYPE.MARKET_SALE,
      });
      socket.onmessage = (message: any) => {
        const originIdentifier = IdentifierMap[originChainId];
        try {
          const { type, data } = JSON.parse(message?.data || '{}');
          if (type === SOCKET_TYPE.NFT || type === SOCKET_TYPE.MARKET_SALE) {
            data?.forEach(
              (item: {
                identifier: string;
                nftTokenId: string;
                nftContractAddress: string;
                fromAddress: string;
                ownerAddress: string;
              }) => {
                if (originIdentifier?.toLowerCase() === item.identifier?.toLowerCase()) {
                  fetchUserCardsData(pageSizeRef.current.nft);
                }
              },
            );
          }
          if (type === SOCKET_TYPE.BOX_PRIVATE) {
            data?.forEach(
              (item: {
                identifier: string;
                nftTokenId: string;
                nftContractAddress: string;
                fromAddress: string;
                ownerAddress: string;
              }) => {
                if (
                  originIdentifier?.toLowerCase() === item.identifier?.toLowerCase() &&
                  item?.ownerAddress?.toLowerCase() === account?.toLowerCase()
                ) {
                  fetchUserLuckyBoxesData(pageSizeRef.current.luckybox);
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
        type: SOCKET_TYPE.NFT,
      });
      unsubscribe({
        event: SOCKET_EVENT.UNSUBSCRIBE,
        biz: SOCKET_BIZ.xNFT,
        type: SOCKET_TYPE.BOX_PRIVATE,
      });
    };
  }, [socket, account]);
  //搜索历史藏品
  const saveSearchKeys = () => {
    if (searchKey) {
      try {
        const searchKeysDB = localStorage.getItem('searchKeys');
        if (searchKeysDB) {
          const searchKeysObj = JSON.parse(searchKeysDB);
          searchKeysObj.unshift(searchKey);
          localStorage.setItem(
            'searchKeys',
            JSON.stringify(Array.from(new Set(searchKeysObj))?.slice(0, 10)),
          );
        } else {
          localStorage.setItem('searchKeys', JSON.stringify([searchKey]));
        }
      } catch (e) {
        console.error('failed to save search keys', e);
        localStorage.setItem('searchKeys', '');
      }
    }
  };
  //搜索历史盲盒
  const saveBoxSearchKeys = () => {
    if (boxSearchKey) {
      try {
        const searchKeysDB = localStorage.getItem('boxSearchKeys');
        if (searchKeysDB) {
          const searchKeysObj = JSON.parse(searchKeysDB);
          searchKeysObj.unshift(boxSearchKey);
          localStorage.setItem(
            'boxSearchKeys',
            JSON.stringify(Array.from(new Set(searchKeysObj))?.slice(0, 10)),
          );
        } else {
          localStorage.setItem('boxSearchKeys', JSON.stringify([boxSearchKey]));
        }
      } catch (e) {
        console.error('failed to save search keys', e);
        localStorage.setItem('boxSearchKeys', '');
      }
    }
  };
  // 搜索历史藏品
  const seachKeysStorage = JSON.parse(localStorage.getItem('searchKeys'));
  const SearchHistory = (
    <Menu mode="inline">
      <SearchTotal>
        <div className="search-title">
          <span> {intl.formatMessage({ id: 'market.nft.search.history' })}</span>
        </div>
        <div className="search-del">
          <img
            onClick={() => {
              localStorage.removeItem('searchKeys');
              setSearchVisible(false);
            }}
            src={deleteimg}
            alt=""
            width="16px"
          />
        </div>
      </SearchTotal>
      <Spacer size="md" />
      <HistoryContainer>
        {(!seachKeysStorage || seachKeysStorage?.length === 0) && (
          //暂无搜索记录
          <span>{intl.formatMessage({ id: 'market.nft.search.history.none' })}</span>
        )}
        {seachKeysStorage?.map((item: string) => (
          <HistoryItem
            onClick={() => {
              setSearchKey(item);
              fetchUserCardsData(pageSize, item);
              setSearchVisible(false);
            }}
          >
            {item}
          </HistoryItem>
        ))}
      </HistoryContainer>
    </Menu>
  );
  // 搜索历史盲盒
  const seachBoxKeysStorage = JSON.parse(localStorage.getItem('boxSearchKeys'));
  const SearchBoxHistory = (
    <Menu mode="inline">
      <SearchTotal>
        <div className="search-title">
          <span> {intl.formatMessage({ id: 'market.nft.search.history' })}</span>
        </div>
        <div className="search-del">
          <img
            onClick={() => {
              localStorage.removeItem('boxSearchKeys');
              setBoxSearchVisible(false);
            }}
            src={deleteimg}
            alt=""
            width="16px"
          />
        </div>
      </SearchTotal>
      <Spacer size="md" />
      <HistoryContainer>
        {(!seachBoxKeysStorage || seachBoxKeysStorage?.length === 0) && (
          //暂无搜索记录
          <span>{intl.formatMessage({ id: 'market.nft.search.history.none' })}</span>
        )}
        {seachBoxKeysStorage?.map((item: string) => (
          <HistoryItem
            onClick={() => {
              setBoxSearchKey(item);
              fetchUserLuckyBoxesData(pageSize, item);
              setBoxSearchVisible(false);
            }}
          >
            {item}
          </HistoryItem>
        ))}
      </HistoryContainer>
    </Menu>
  );

  if (isMobile) {
    return (
      <>
        <TabsContainer
          selectedIndex={tabIndex}
          onSelect={(index) => {
            setTabIndex(index);
          }}
        >
          <TabList>
            <Tab>{intl.formatMessage({ id: 'user.detail.myNFTEmptyTitle' })}</Tab>
            <Tab>{intl.formatMessage({ id: 'user.detail.myLuckyBoxEmptyTitle' })}</Tab>
          </TabList>
          {/* tab切换 */}
          <TabPanel>
            <SearchContainer>
              <Spacer size="md" />
              {/* 搜索 */}
              <Dropdown
                overlayStyle={{
                  width: '90%',
                  minWidth: '90%',
                }}
                trigger="click"
                overlay={SearchHistory}
                placement="bottomCenter"
                visible={searchVisible}
                onVisibleChange={(visible: boolean) => {
                  setSearchVisible(visible);
                }}
              >
                <SearchIpt>
                  <form
                    action=""
                    onSubmit={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                  >
                    <Input
                      type="text"
                      width="100%"
                      onKeyDown={(event: any) => {
                        if (event.keyCode === 13) {
                          event.currentTarget.blur();
                          setSearchVisible(false);
                          saveSearchKeys();
                          fetchUserCardsData(pageSizeRef.current.nft);
                        }
                      }}
                      onChange={(event: any) => {
                        setSearchKey(event.currentTarget.value);
                      }}
                      placeholder={intl.formatMessage({ id: 'market.nft.search.placeholder' })}
                      value={searchKey}
                      startAdornment={<img width="16px" src={searchIcon} alt="" />}
                      endAdornment={
                        <>
                          {searchKey && (
                            <img
                              onClick={() => {
                                searchKey && setSearchKey('');
                              }}
                              width="16px"
                              src={ClearIcon}
                              alt=""
                            />
                          )}
                          <Spacer size="sm" />
                        </>
                      }
                    />
                  </form>
                </SearchIpt>
              </Dropdown>
              <Spacer size="md" />
              <Screen>
                {/* 排序 */}
                <StyledSort selected={!!searchSort}>
                  <Dropdown
                    trigger="click"
                    align={{ targetOffset: [0, -8] }}
                    placement="bottomCenter"
                    onVisibleChange={(visible: boolean) => {
                      setSortVisible(visible);
                    }}
                    overlay={renderOverlays('sort')}
                  >
                    <StyledDropdownChainMenu>
                      <span className="mobile-selected">
                        {searchSort
                          ? SORT_FILED_MAP[searchSort]
                          : intl.formatMessage({ id: 'market.nft.sort' })}
                      </span>
                      <Spacer size="sm" />
                      <img
                        width="16px"
                        height="16px"
                        src={sortVisible ? ArrowUpIcon : ArrowDownIcon}
                        alt=""
                      />
                    </StyledDropdownChainMenu>
                  </Dropdown>
                  {searchSort ? (
                    <div
                      className="sort"
                      onClick={() => {
                        setSortStatus(
                          sortStatus === SORT_STATUS.ASC ? SORT_STATUS.DESC : SORT_STATUS.ASC,
                        );
                      }}
                    >
                      <img
                        src={sortStatus === SORT_STATUS.ASC ? SortASC : SortDESC}
                        alt=""
                        width="16px"
                        height="16px"
                      />
                    </div>
                  ) : (
                    ''
                  )}
                </StyledSort>
                {/* 筛选 */}
                <div
                  className="screenbtn"
                  onClick={() => {
                    setShowMore(!showMore);
                  }}
                >
                  <span>{intl.formatMessage({ id: 'market.nft.screen' })}</span>
                  <img src={screen} alt="" width="16px" height="16px" />
                </div>
              </Screen>
              {showMore && (
                <StyledChannelPop
                  onClick={() => {
                    setShowMore(!showMore);
                  }}
                >
                  <StyledChannels
                    // show={showMore}
                    onClick={(event) => {
                      event.stopPropagation();
                      event.preventDefault();
                    }}
                  >
                    <div className="ProjectText">
                      {intl.formatMessage({ id: 'market.nft.project' })}
                    </div>
                    <Spacer size="md" />
                    <div className="Projects">
                      <StyledButtonItem
                        selected={searchProject === 'all'}
                        onClick={() => {
                          setSearchProject('all');
                        }}
                      >
                        <span>{intl.formatMessage({ id: 'market.nft.project.all' })}</span>
                      </StyledButtonItem>
                      {allCollections.map(
                        (platform: {
                          backgroundImageUrl: '';
                          boxCount: 0;
                          description: '';
                          externalLink: '';
                          favoriteCount: '';
                          hidden: '';
                          id: '';
                          imageUrl: '';
                          isAuthorized: '';
                          name: '';
                          nftCount: '';
                          nftOwnerCount: '';
                          nftTradeCount: '';
                          ownerAddress: '';
                          slug: '';
                          socialChannel: '';
                          tradeCount: '';
                        }) => (
                          <StyledButtonItem
                            selected={searchProject === platform.slug}
                            onClick={() => {
                              setSearchProject(platform.slug);
                            }}
                          >
                            <img src={platform.imageUrl} alt="" />
                            <Spacer size="sm" />
                            <span>{platform.slug}</span>
                          </StyledButtonItem>
                        ),
                      )}
                    </div>
                    <Spacer size="md" />
                    <Spacer size="sm" />
                    <div className="ProjectText">
                      {intl.formatMessage({ id: 'market.nft.type' })}
                    </div>
                    <Spacer size="md" />
                    <div className="Projects">
                      <StyledButtonItem
                        selected={searchCategory === 'all'}
                        onClick={() => {
                          setSearchCategory('all');
                        }}
                      >
                        <span>{intl.formatMessage({ id: 'market.nft.type.all' })}</span>
                      </StyledButtonItem>
                      {categorys.map(
                        (category: {
                          langCode: string;
                          langType: string;
                          langValue: string;
                        }) => (
                          <StyledButtonItem
                            selected={searchCategory === category.langCode}
                            onClick={() => {
                              setSearchCategory(category.langCode);
                            }}
                          >
                            <span>{category.langValue}</span>
                          </StyledButtonItem>
                        ),
                      )}
                    </div>
                    <Spacer size="md" />
                    <Spacer size="sm" />
                    <div className="ProjectText">
                      {intl.formatMessage({ id: 'market.nft.status.normal' })}
                    </div>
                    <Spacer size="md" />
                    <div className="Projects">
                      <StyledButtonItem
                        selected={status === MARKET_STATUS.NORMAL}
                        onClick={() => {
                          setStatus(MARKET_STATUS.NORMAL);
                        }}
                      >
                        <span>{intl.formatMessage({ id: 'market.nft.status.normal' })}</span>
                      </StyledButtonItem>

                      <StyledButtonItem
                        selected={status === MARKET_STATUS.MARKET_SALE}
                        onClick={() => {
                          setStatus(MARKET_STATUS.MARKET_SALE);
                        }}
                      >
                        <img src={SaleIcon} alt="" />
                        <Spacer size="sm" />
                        <span>{intl.formatMessage({ id: 'market.nft.status.sale' })}</span>
                      </StyledButtonItem>
                    </div>

                    <Spacer size="lg" />
                    {/* 重置 */}
                    <ResetBtn>
                      <div
                        className="reset"
                        onClick={() => {
                          setSearchProject('all');
                          setSearchCategory('all');
                          setStatus(MARKET_STATUS.NORMAL);
                        }}
                      >
                        <span>{intl.formatMessage({ id: 'market.nft.resrt' })}</span>
                      </div>
                      <div
                        className="sureBtn"
                        onClick={() => {
                          setShowMore(!showMore);
                        }}
                      >
                        <span>{intl.formatMessage({ id: 'market.nft.sure' })}</span>
                      </div>
                    </ResetBtn>
                  </StyledChannels>
                </StyledChannelPop>
              )}

              {/* <Spacer size="md" />
              <WorksTotal>
                <span>
                  {intl.formatMessage(
                    { id: 'market.nft.works' },
                    {
                      count: userCards?.total ? Number(userCards.total).toLocaleString() : 0,
                    },
                  )}
                </span>
              </WorksTotal> */}
            </SearchContainer>
            <StyledCardList>
              {userCards?.records?.length === 0 && (
                <Container
                  flex
                  direction="column"
                  align="center"
                  justify="center"
                  background="transparent"
                  boxShadow="none"
                >
                  <EmptyNFT
                    index={0}
                    textValue={intl.formatMessage({ id: 'user.detail.myNFTEmptyText' })}
                  />
                </Container>
              )}
              {userCards?.records?.length > 0
                ? userCards?.records?.map((item: any) => <Card key={item.id} {...item} />)
                : ''}
            </StyledCardList>
            <ButtonContainer>
              {userCards?.total > pageSize && (
                <MoreButtonContainer>
                  <MoreButton
                    loading={cardFetching}
                    disabled={userCards?.current === userCards.pages}
                    onClick={() => {
                      if (userCards?.current < userCards.pages) {
                        setCardFetching(true);
                        pageSizeRef.current.nft = userCards.size + pageSize;
                        fetchUserCardsData(userCards.size + pageSize);
                      }
                    }}
                  />
                </MoreButtonContainer>
              )}
            </ButtonContainer>
            <StyledButton>
              <Button
                to={'/nft-card'}
                variant={'secondary'}
                text={intl.formatMessage({ id: 'user.detail.myNFTEmptyButtonValue' })}
              />
            </StyledButton>
            <Spacer size="md" />
          </TabPanel>
          <TabPanel>
            <SearchContainer>
              <Spacer size="md" />
              {/* 搜索 */}
              <Dropdown
                overlayStyle={{
                  width: '90%',
                  minWidth: '90%',
                }}
                trigger="click"
                overlay={SearchBoxHistory}
                placement="bottomCenter"
                visible={boxSearchVisible}
                onVisibleChange={(visible: boolean) => {
                  setBoxSearchVisible(visible);
                }}
              >
                <SearchIpt>
                  <form
                    action=""
                    onSubmit={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                  >
                    <Input
                      type="text"
                      width="100%"
                      onKeyDown={(event: any) => {
                        if (event.keyCode === 13) {
                          event.currentTarget.blur();
                          saveBoxSearchKeys();
                          setBoxSearchVisible(false);
                          fetchUserLuckyBoxesData(pageSizeRef.current.luckybox);
                        }
                      }}
                      onChange={(event: any) => {
                        setBoxSearchKey(event.currentTarget.value);
                      }}
                      placeholder={intl.formatMessage({ id: 'market.nft.search.placeholder' })}
                      value={boxSearchKey}
                      startAdornment={<img width="16px" src={searchIcon} alt="" />}
                      endAdornment={
                        <>
                          {boxSearchKey && (
                            <img
                              onClick={() => {
                                boxSearchKey && setBoxSearchKey('');
                              }}
                              width="16px"
                              src={ClearIcon}
                              alt=""
                            />
                          )}
                          <Spacer size="sm" />
                        </>
                      }
                    />
                  </form>
                </SearchIpt>
              </Dropdown>
              <Spacer size="md" />
              <Screen>
                {/* 排序 */}
                <StyledSort selected={!!boxSearchSort}>
                  <Dropdown
                    trigger="click"
                    align={{ targetOffset: [0, -8] }}
                    placement="bottomCenter"
                    onVisibleChange={(visible: boolean) => {
                      setBoxSortVisible(visible);
                    }}
                    overlay={renderOverlays('boxSort')}
                  >
                    <StyledDropdownChainMenu>
                      <span className="mobile-selected">
                        {boxSearchSort
                          ? SORT_FILED_MAP[boxSearchSort]
                          : intl.formatMessage({ id: 'market.nft.sort' })}
                      </span>
                      <Spacer size="sm" />
                      <img
                        width="16px"
                        height="16px"
                        src={boxSortVisible ? ArrowUpIcon : ArrowDownIcon}
                        alt=""
                      />
                    </StyledDropdownChainMenu>
                  </Dropdown>
                  {boxSortVisible ? (
                    <div
                      className="sort"
                      onClick={() => {
                        setBoxSortStatus(
                          boxSortStatus === SORT_STATUS.ASC
                            ? SORT_STATUS.DESC
                            : SORT_STATUS.ASC,
                        );
                      }}
                    >
                      <img
                        src={boxSortStatus === SORT_STATUS.ASC ? SortASC : SortDESC}
                        alt=""
                        width="16px"
                        height="16px"
                      />
                    </div>
                  ) : (
                    ''
                  )}
                </StyledSort>
              </Screen>
            </SearchContainer>
            {/* <WorksTotal>
              <span>
                {intl.formatMessage(
                  { id: 'market.nft.works' },
                  {
                    count: userLuckyBoxes?.total
                      ? Number(userLuckyBoxes.total).toLocaleString()
                      : 0,
                  },
                )}
              </span>
            </WorksTotal> */}
            <StyledCardList>
              {userLuckyBoxes?.records?.length === 0 && (
                <Container
                  flex
                  direction="column"
                  align="center"
                  justify="center"
                  background="transparent"
                  boxShadow="none"
                >
                  <EmptyNFT
                    index={0}
                    textValue={intl.formatMessage({ id: 'user.detail.myLuckyBoxEmptyText' })}
                  />
                </Container>
              )}
              {userLuckyBoxes?.records.length > 0 &&
                userLuckyBoxes?.records?.map((item: any, index: number) => (
                  <LuckyBox
                    key={`${item.nftTokenId}-${item.nftContractAddress}-${index}`}
                    {...item}
                  />
                ))}
            </StyledCardList>
            {/* <ButtonContainer>
              <Spacer size="md" />
              <Button
                to={'/luckybox'}
                variant={'secondary'}
                text={intl.formatMessage({ id: 'user.detail.myLuckyBoxButtonValue' })}
              />
            </ButtonContainer> */}
            <Spacer size="md" />
            {userLuckyBoxes?.total > pageSize && (
              <MoreButtonContainer>
                <MoreButton
                  loading={luckyBoxFetching}
                  disabled={userLuckyBoxes.current === userLuckyBoxes.pages}
                  onClick={() => {
                    if (userLuckyBoxes.current < userLuckyBoxes.pages) {
                      setLuckyBoxFetching(true);
                      pageSizeRef.current.luckybox = userLuckyBoxes.size + pageSize;
                      fetchUserLuckyBoxesData(userLuckyBoxes.size + pageSize);
                    }
                  }}
                />
              </MoreButtonContainer>
            )}
            <Spacer size="md" />
          </TabPanel>
        </TabsContainer>
        {!isMobile && <Spacer size="lg" />}
        {!isMobile && <Spacer size="lg" />}
      </>
    );
  }
  return (
    <>
      <TabsContainer
        selectedIndex={tabIndex}
        onSelect={(index) => {
          setTabIndex(index);
        }}
      >
        <TabList>
          <Tab>{intl.formatMessage({ id: 'user.detail.myNFTEmptyTitle' })}</Tab>
          <Tab>{intl.formatMessage({ id: 'user.detail.myLuckyBoxEmptyTitle' })}</Tab>
        </TabList>
        {/* tab切换 */}
        <TabPanel>
          <Spacer size="md" />
          <SearchContainer>
            {/* 状态 */}
            <Dropdown
              align={{ targetOffset: [0, -8] }}
              placement="bottomCenter"
              onVisibleChange={(visible: boolean) => {
                setStatusVisible(visible);
              }}
              overlay={renderOverlays('status')}
            >
              <StyledProjectSelected selected={!!status}>
                <span>
                  {!status || status === MARKET_STATUS.NORMAL
                    ? intl.formatMessage({ id: 'market.nft.status.normal' })
                    : intl.formatMessage({ id: 'market.nft.status.sale' })}
                </span>
                <img
                  onClick={() => {
                    status && setStatus('');
                  }}
                  width="16px"
                  src={status ? ClearIcon : statusVisible ? ArrowUpIcon : ArrowDownIcon}
                  alt=""
                />
              </StyledProjectSelected>
            </Dropdown>
            {/* 项目 */}
            <Dropdown
              align={{ targetOffset: [0, -8] }}
              placement="bottomCenter"
              onVisibleChange={(visible: boolean) => {
                setProjectVisible(visible);
              }}
              overlay={renderOverlays('project')}
            >
              <StyledProjectSelected selected={!!searchProject}>
                <span>
                  {!searchProject || searchProject === 'all'
                    ? intl.formatMessage({ id: 'market.nft.project.all' })
                    : searchProject}
                </span>
                <img
                  onClick={() => {
                    searchProject && setSearchProject('');
                  }}
                  width="16px"
                  src={searchProject ? ClearIcon : projectVisible ? ArrowUpIcon : ArrowDownIcon}
                  alt=""
                />
              </StyledProjectSelected>
            </Dropdown>
            {/* 类型 */}
            <Dropdown
              align={{ targetOffset: [0, -8] }}
              placement="bottomCenter"
              onVisibleChange={(visible: boolean) => {
                setCategoryVisible(visible);
              }}
              overlay={renderOverlays('category')}
            >
              <StyledCategorySelected selected={!!searchCategory}>
                <span>
                  {!searchCategory || searchCategory === 'all'
                    ? intl.formatMessage({ id: 'market.nft.type.all' })
                    : categorys.find((item) => item.langCode === searchCategory)?.langValue}
                </span>
                <img
                  onClick={() => {
                    searchCategory && setSearchCategory('');
                  }}
                  width="16px"
                  src={
                    searchCategory ? ClearIcon : categoryVisible ? ArrowUpIcon : ArrowDownIcon
                  }
                  alt=""
                />
              </StyledCategorySelected>
            </Dropdown>
            {/* 排序 */}
            <StyledSort selected={!!searchSort}>
              <Dropdown
                align={{ targetOffset: [0, -8] }}
                placement="bottomCenter"
                onVisibleChange={(visible: boolean) => {
                  setSortVisible(visible);
                }}
                overlay={renderOverlays('sort')}
              >
                <div className="select-container">
                  <span className="pc-selected">
                    {searchSort
                      ? SORT_FILED_MAP[searchSort]
                      : intl.formatMessage({ id: 'market.nft.sort' })}
                  </span>
                  <Spacer size="sm" />
                  <img width="16px" src={sortVisible ? ArrowUpIcon : ArrowDownIcon} alt="" />
                </div>
              </Dropdown>
              {searchSort ? (
                <img
                  onClick={() => {
                    setSortStatus(
                      sortStatus === SORT_STATUS.ASC ? SORT_STATUS.DESC : SORT_STATUS.ASC,
                    );
                  }}
                  src={sortStatus === SORT_STATUS.ASC ? SortASC : SortDESC}
                  width="24px"
                  height="24px"
                  alt=""
                />
              ) : (
                ''
              )}
            </StyledSort>
            {/* 搜索 */}
            <Input
              type="text"
              width="200px"
              onChange={(event: any) => {
                setSearchKey(event.currentTarget.value);
              }}
              placeholder={intl.formatMessage({ id: 'market.nft.search.placeholder' })}
              value={searchKey}
              startAdornment={<img width="16px" src={searchIcon} alt="" />}
              endAdornment={
                searchKey && (
                  <img
                    onClick={() => {
                      searchKey && setSearchKey('');
                    }}
                    width="16px"
                    src={ClearIcon}
                    alt=""
                  />
                )
              }
            />
          </SearchContainer>
          {/* <WorksTotal>
            <span>
              {intl.formatMessage(
                { id: 'market.nft.works' },
                {
                  count: userCards?.total ? Number(userCards.total).toLocaleString() : 0,
                },
              )}
            </span>
          </WorksTotal> */}
          {/* <Spacer size="sm" /> */}
          <StyledCardList>
            {userCards?.records?.length === 0 && (
              <Container
                flex
                direction="column"
                align="center"
                justify="center"
                background="transparent"
                boxShadow="none"
              >
                <EmptyNFT
                  index={0}
                  textValue={intl.formatMessage({ id: 'user.detail.myNFTEmptyText' })}
                />
              </Container>
            )}
            {userCards?.records?.length > 0
              ? userCards?.records?.map((item: any) => <Card key={item.id} {...item} />)
              : ''}
          </StyledCardList>
          <ButtonContainer>
            {userCards?.total > pageSize && (
              <MoreButtonContainer>
                <MoreButton
                  loading={cardFetching}
                  disabled={userCards?.current === userCards.pages}
                  onClick={() => {
                    if (userCards?.current < userCards.pages) {
                      setCardFetching(true);
                      pageSizeRef.current.nft = userCards.size + pageSize;
                      fetchUserCardsData(userCards.size + pageSize);
                    }
                  }}
                />
              </MoreButtonContainer>
            )}
          </ButtonContainer>
          <StyledButton>
            <Button
              to={'/nft-card'}
              variant={'secondary'}
              text={intl.formatMessage({ id: 'user.detail.myNFTEmptyButtonValue' })}
            />
          </StyledButton>
          <Spacer size="md" />
        </TabPanel>
        <TabPanel>
          <Spacer size="md" />
          <SearchContainer>
            {/* 排序 */}
            <StyledBoxSort selected={!!boxSearchSort}>
              <Dropdown
                align={{ targetOffset: [0, -8] }}
                placement="bottomCenter"
                onVisibleChange={(visible: boolean) => {
                  setBoxSortVisible(visible);
                }}
                overlay={renderOverlays('boxSort')}
              >
                <div className="select-container">
                  <span className="pc-selected">
                    {boxSearchSort
                      ? SORT_FILED_MAP[boxSearchSort]
                      : intl.formatMessage({ id: 'market.nft.sort' })}
                  </span>
                  <Spacer size="sm" />
                  <img width="16px" src={boxSortVisible ? ArrowUpIcon : ArrowDownIcon} alt="" />
                </div>
              </Dropdown>
              {boxSearchSort ? (
                <img
                  onClick={() => {
                    setBoxSortStatus(
                      boxSortStatus === SORT_STATUS.ASC ? SORT_STATUS.DESC : SORT_STATUS.ASC,
                    );
                  }}
                  src={boxSortStatus === SORT_STATUS.ASC ? SortASC : SortDESC}
                  width="24px"
                  height="24px"
                  alt=""
                />
              ) : (
                ''
              )}
            </StyledBoxSort>
            <Spacer size="md" />
            {/* 搜索 */}
            <Input
              type="text"
              width="200px"
              onChange={(event: any) => {
                setBoxSearchKey(event.currentTarget.value);
              }}
              placeholder={intl.formatMessage({ id: 'market.nft.search.placeholder' })}
              value={boxSearchKey}
              startAdornment={<img width="16px" src={searchIcon} alt="" />}
              endAdornment={
                boxSearchKey && (
                  <img
                    onClick={() => {
                      boxSearchKey && setBoxSearchKey('');
                    }}
                    width="16px"
                    src={ClearIcon}
                    alt=""
                  />
                )
              }
            />
          </SearchContainer>
          {/* <WorksTotal>
            <span>
              {intl.formatMessage(
                { id: 'market.nft.works' },
                {
                  count: userLuckyBoxes?.total
                    ? Number(userLuckyBoxes.total).toLocaleString()
                    : 0,
                },
              )}
            </span>
          </WorksTotal>
          <Spacer size="sm" /> */}
          <StyledCardList>
            {userLuckyBoxes?.records?.length === 0 && (
              <Container
                flex
                direction="column"
                align="center"
                justify="center"
                background="transparent"
                boxShadow="none"
              >
                <EmptyNFT
                  index={0}
                  textValue={intl.formatMessage({ id: 'user.detail.myLuckyBoxEmptyText' })}
                />
              </Container>
            )}
            {userLuckyBoxes?.records.length > 0 &&
              userLuckyBoxes?.records?.map((item: any, index: number) => (
                <LuckyBox
                  key={`${item.nftTokenId}-${item.nftContractAddress}-${index}`}
                  {...item}
                />
              ))}
          </StyledCardList>
          {/* <ButtonContainer>
            <Spacer size="md" />
            <Button
              to={'/luckybox'}
              variant={'secondary'}
              text={intl.formatMessage({ id: 'user.detail.myLuckyBoxButtonValue' })}
            />
          </ButtonContainer> */}
          <Spacer size="md" />
          {userLuckyBoxes?.total > pageSize && (
            <MoreButtonContainer>
              <MoreButton
                loading={luckyBoxFetching}
                disabled={userLuckyBoxes.current === userLuckyBoxes.pages}
                onClick={() => {
                  if (userLuckyBoxes.current < userLuckyBoxes.pages) {
                    setLuckyBoxFetching(true);
                    pageSizeRef.current.luckybox = userLuckyBoxes.size + pageSize;
                    fetchUserLuckyBoxesData(userLuckyBoxes.size + pageSize);
                  }
                }}
              />
            </MoreButtonContainer>
          )}
          <Spacer size="md" />
        </TabPanel>
      </TabsContainer>
      {!isMobile && <Spacer size="lg" />}
      {!isMobile && <Spacer size="lg" />}
    </>
  );
};
const WorksTotal = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  span {
    font-size: 16px;
    font-weight: 400;
    color: #000000;
    line-height: 24px;
    @media (max-width: 600px) {
      font-size: 14px;
    }
  }
`;
const HistoryContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  span {
    display: inline-block;
    width: 100%;
    text-align: center;
    color: rgba(0, 0, 0, 0.6);
  }
`;
const HistoryItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
  height: 28px;
  background: #f2f2f2;
  border-radius: 15px;
  font-size: 14px;
  font-weight: 400;
  color: #000000;
  line-height: 20px;
  margin: 0px 0px 12px 24px;
  padding: 10px;
`;
const SearchIpt = styled.div`
  width: 100%;
  padding: 0 16px;
  img {
    cursor: pointer;
  }
`;
const StyledChannelPop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 99;
`;
const StyledButtonItem = styled.div`
  padding: 4px 8px;
  background: #f4f4f4;
  border-radius: 16px 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  margin-bottom: 12px;
  border: ${(props: { selected: boolean }) =>
    props.selected ? `1px solid ${props.theme.color.primary.main}` : '1px solid #f4f4f4'};
  img {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }
  span {
    font-size: 14px;
    font-weight: 500;
    color: #000000;
    line-height: 20px;
  }
`;
const fadeInUpBig = keyframes`
  0%{opacity:0;
  -webkit-transform:translateY(-2000px)}
  100%{opacity:1;
  -webkit-transform:translateY(0)}
`;
const StyledChannels = styled.div`
  width: 100%;
  z-index: 101;
  background: #ffffff;
  border-radius: 0px 0px 20px 20px;
  position: absolute;
  top: 0;
  left: 0;
  padding: 24px;
  animation: ${fadeInUpBig} 0.2s ease both;
  display: flex;
  flex-direction: column;
  padding: 32px 24px 0 24px;
  .ProjectText {
    font-size: 16px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.6);
    line-height: 17px;
    text-align: left;
    width: 100%;
  }
  .Projects {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
`;
const ResetBtn = styled.div`
  height: 52px;
  width: 100%;
  z-index: 9999;
  border-top: solid 1px rgba(0, 0, 0, 0.4);
  display: flex;
  .reset {
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: solid 1px rgba(0, 0, 0, 0.4);
    span {
      font-size: 14px;
      font-weight: bold;
      color: #000000;
      line-height: 20px;
      // -webkit-text-stroke: 1px #979797;
      text-stroke: 1px #979797;
    }
  }
  .sureBtn {
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      font-size: 14px;
      font-weight: bold;
      color: #0079ff;
      line-height: 20px;
    }
  }
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
  // cursor: pointer;
  // -webkit-text-decoration: none;
  // text-decoration: none;
  padding: 8px 12px;
  @media (max-width: 600px) {
    width: auto;
    height: 28px;
    background: #f4f4f4;
    border-radius: 14px;
    font-size: 12px;
    font-weight: 400;
    color: #000000;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 28px;
  }
`;
const Screen = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  .screenbtn {
    width: 20%;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      font-size: 14px;
      font-weight: 400;
      color: #000000;
      line-height: 20px;
    }
    .sort {
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 20px;
        height: 20px;
      }
    }
  }
`;

const StyledBoxSort = styled.div`
  display: flex;
  flex:1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  img {
    cursor: pointer;
  }
  @media (max-width: 600px) {
    justify-content: flex-start;
    font-size: 12px;
  }
  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    &:hover {
      span {
        color: ${(props) => props.theme.color.primary.main};
      }
    }
    @media (max-width: 600px) {
      &:hover {
        span {
          color: #000000;
        }
      }
    }
    .mobile-selected {
      font-size: 12px;
      color: ${(props: { selected: boolean }) => (props.selected ? '#000' : '#000')};
    }
    .mobile-selected {
      font-size: 12px;
      /* color: ${(props: { selected: boolean }) =>
        props.selected ? props.theme.color.primary.main : 'rgba(0, 0, 0, 0.4)'}; */
      color: ${(props: { selected: boolean }) => (props.selected ? '#000' : '#000')};
    }
    .pc-selected {
      font-size: 14px;
      font-weight: 400;
      color: ${(props: { selected: boolean }) => (props.selected ? '#000000' : '#000000')};
      line-height: 20px;
        props.selected ? '#000' : 'rgba(0, 0, 0, 0.4)'};
    }
    .sort {
      margin: 4px;
      padding-top: 2px;
    }
  }
`;
const StyledSort = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  img {
    cursor: pointer;
  }
  @media (max-width: 600px) {
    justify-content: flex-start;
    font-size: 12px;
  }
  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    &:hover {
      span {
        color: ${(props) => props.theme.color.primary.main};
      }
    }
    @media (max-width: 600px) {
      &:hover {
        span {
          color: #000000;
        }
      }
    }
    .mobile-selected {
      font-size: 12px;
      color: ${(props: { selected: boolean }) => (props.selected ? '#000' : '#000')};
    }
    .mobile-selected {
      font-size: 12px;
      /* color: ${(props: { selected: boolean }) =>
        props.selected ? props.theme.color.primary.main : 'rgba(0, 0, 0, 0.4)'}; */
      color: ${(props: { selected: boolean }) => (props.selected ? '#000' : '#000')};
    }
    .pc-selected {
      font-size: 14px;
      font-weight: 400;
      color: ${(props: { selected: boolean }) => (props.selected ? '#000000' : '#000000')};
      line-height: 20px;
        props.selected ? '#000' : 'rgba(0, 0, 0, 0.4)'};
    }
    .sort {
      margin: 4px;
      padding-top: 2px;
    }
  }
`;

const StyledCategorySelected = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px;
  border: 1px solid #e4e4e4;
  width: 240px;
  height: 40px;
  padding: 10px 16px;
  &:hover {
    border: 1px solid #0079ff;
  }
  span {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    line-height: 20px;
    color: ${(props: { selected: boolean }) =>
      props.selected ? '#000' : 'rgba(0, 0, 0, 0.4)'};
  }
  img {
    cursor: pointer;
  }
`;

const StyledMenuItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }
`;

const StyledProjectSelected = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px;
  border: 1px solid #e4e4e4;
  // border: 1px solid ${(props) => props.theme.color.primary.main};
  width: 240px;
  height: 40px;
  padding: 10px 16px;
  &:hover {
    border: 1px solid ${(props) => props.theme.color.primary.main};
  }
  span {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    line-height: 20px;
    color: ${(props: { selected: boolean }) =>
      props.selected ? '#000' : 'rgba(0, 0, 0, 0.4)'};
    &:hover {
      color: ${(props) => props.theme.color.primary.main};
    }
  }
  img {
    cursor: pointer;
  }
`;

const StyledOverlayMenu = styled(Menu)`
  .rc-dropdown-menu-item {
    padding: 8px !important;
    ::after {
      display: none !important;
    }
  }
`;
const SearchTotal = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 24px;
  .search-title {
    span {
      font-size: 16px;
      font-weight: 500;
      color: #000000;
      line-height: 22px;
    }
  }
`;
const SearchContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  img {
    cursor: pointer;
  }
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0px;
  }
`;

const StyledButton = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const TabsContainer = styled(Tabs)`
  background: #ffffff;
  box-shadow: 0 1px 30px 0 rgba(31, 43, 77, 0.08);
  border-radius: 16px;
  width: 100%;
  max-width: ${(props) => props.theme.maxWidth + 24}px;
  padding: 16px 0;
  box-sizing: border-box;
  @media (max-width: 600px) {
    background: #ffffff;
    box-shadow: 0 1px 30px 0 rgba(31, 43, 77, 0.08);
    width: 100%;
    max-width: 100%;
    padding: 16px 0;
    border-radius: unset;
  }
  .react-tabs__tab,
  .react-tabs__tab-list {
    border: none;
  }

  .react-tabs {
    width: 100%;
    @media (max-width: 600px) {
      width: 100%;
    }
  }

  .react-tabs__tab-list {
    width: 600px;
    margin: 0 auto;
    border-bottom: 1px solid transparent;
    display: flex;
    @media (max-width: 600px) {
      width: 100%;
      margin: 0 auto;
      border-bottom: 1px solid transparent;
      display: flex;
    }

    .react-tabs__tab {
      text-align: center;
      flex: 1;
      line-height: 50px;
      font-size: 24px;
      font-family: 'Noto Sans SC', sans-serif;
      font-weight: 600;
      padding: 0;
      color: rgba(0, 0, 0, 0.5);
      margin: 0 40px;
      @media (max-width: 600px) {
        font-size: 16px;
        margin: 0px;
      }
    }
    .react-tabs__tab--selected {
      box-shadow: none;
      background: transparent !important;
      border-bottom: 1px solid ${(props) => props.theme.color.primary.main};
      color: #000000;
    }
  }

  .react-tabs__tab-panel--selected {
    position: relative;
    top: -1px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }
`;
const StyledCardList = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 24px 0;
  @media (max-width: 600px) {
    width: 100%;
    padding: 24px;
    // justify-content: space-around;
    ::after {
      content: '';
      flex: auto;
    }
  }
`;
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media (max-width: 600px) {
    width: 100%;
  }
`;
const MoreButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export default UserDetailTabs;
