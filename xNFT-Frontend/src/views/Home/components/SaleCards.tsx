import React, { useEffect, useState, useContext } from 'react';
import { useIntl } from 'react-intl';
import styled, { ThemeContext } from 'styled-components';
import Spacer from '@src/components/Spacer';
import useSaleCards from '@hooks/useSaleCards';
import Container from '@src/components/Container';
import Card from '@src/components/Card';
import Empty from '@components/Empty';
import MoreButton from '@src/components/MoreButton';
import { pageSize, platformContractType } from '@src/utils/constants';
import { Context } from '@src/contexts/provider/Provider';
import useMedia from 'use-media';
import { useHistory } from 'react-router-dom';

const SaleCards: React.FC = () => {
  const intl = useIntl();
  const { maxWidth } = useContext(ThemeContext);
  const { toggleLoading } = useContext(Context);
  const isMobile = useMedia({ maxWidth: '600px' });
  const history = useHistory();
  const fetchSaleCards = useSaleCards();
  const [fetching, setFetching] = useState(false);
  const [allCards, setAllCards] = useState({
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

  const fetchAllCardsData = async (page: number) => {
    toggleLoading(true);
    const saleCardsData = await fetchSaleCards(page, platformContractType.MARKET);
    setAllCards({
      ...saleCardsData,
      records: [...allCards?.records, ...saleCardsData?.records],
    });
    setFetching(false);
    toggleLoading(false);
  };

  useEffect(() => {
    fetchAllCardsData(1);
  }, []);

  if (isMobile) {
    return (
      <>
        <StyledTitle>
          <div className="cards-title">
            {intl.formatMessage({ id: 'home.hot.all.cards.title' })}
          </div>
          <StyledViewAll
            onClick={() => {
              history.push('/market-nft');
            }}
          >
            {intl.formatMessage({ id: 'market.home.view.all' })}
          </StyledViewAll>
        </StyledTitle>
        <Spacer size="md" />
        <Container
          flex
          direction="row"
          align="left"
          justify={'evenly'}
          background="transparent"
          boxShadow="none"
          maxWidth="100%"
          padding="16px 8px"
          wrap
        >
          {allCards?.records?.length === 0 && (
            <StyledEmpty>
              <Empty />
            </StyledEmpty>
          )}
          {allCards?.records?.map((item) => (
            <Card key={item.id} {...item} />
          ))}
        </Container>
        {/* <Spacer size="lg" /> */}
        {allCards?.current < allCards?.pages && (
          <MoreButton
            loading={fetching}
            disabled={allCards?.records.length === allCards?.total}
            onClick={() => {
              if (allCards?.current < allCards?.pages) {
                setFetching(true);
                fetchAllCardsData(allCards?.current + 1);
              }
            }}
          />
        )}
      </>
    );
  } else {
    return (
      <>
        <StyledTitle>
          <div className="cards-title">
            {intl.formatMessage({ id: 'home.hot.all.cards.title' })}
          </div>
          <StyledViewAll
            onClick={() => {
              history.push('/market-nft');
            }}
          >
            {intl.formatMessage({ id: 'market.home.view.all' })}
          </StyledViewAll>
        </StyledTitle>
        <Spacer size="md" />
        <Container
          flex
          direction="row"
          align="left"
          justify={allCards?.records?.length === 0 ? 'center' : 'left'}
          padding="24px 0"
          background="transparent"
          boxShadow="none"
          maxWidth={maxWidth + 24}
          wrap
        >
          {allCards?.records?.length === 0 && <Empty />}
          {allCards?.records?.map((item) => (
            <Card key={item.id} {...item} />
          ))}
        </Container>
        {/* <Spacer size="lg" /> */}
        {allCards?.current < allCards?.pages && (
          <StyledViewAll
            onClick={() => {
              history.push('/market-nft');
            }}
          >
            {intl.formatMessage({ id: 'market.home.view.all' })}
          </StyledViewAll>
          // <MoreButton
          //   loading={fetching}
          //   disabled={allCards?.records.length === allCards?.total}
          //   onClick={() => {
          //     if (allCards?.current < allCards?.pages) {
          //       setFetching(true);
          //       fetchAllCardsData(allCards?.current + 1);
          //     }
          //   }}
          // />
        )}
      </>
    );
  }
};

const StyledViewAll = styled.div`
  cursor: pointer;
  color: ${(props) => props.theme.color.primary.main};
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const StyledEmpty = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledTitle = styled.div`
  display: flex;
  width: 100%;
  max-width: ${(props) => props.theme.maxWidth}px;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  .cards-title {
    text-align: left;
    font-size: 32px;
    font-family: 'Noto Sans SC', sans-serif;
    font-weight: 600;
    color: #000000;
    line-height: 47px;
    @media (max-width: 600px) {
      font-size: 20px;
      font-weight: 600;
      color: #000000;
      line-height: 29px;
    }
  }
`;

export default SaleCards;
