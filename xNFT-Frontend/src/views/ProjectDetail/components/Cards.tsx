import React, { useEffect, useState, useContext } from 'react';
import { useIntl } from 'react-intl';
import styled, { ThemeContext } from 'styled-components';
import Spacer from '@components/Spacer';
import useProCollection from '@hooks/useProCollection';
import Container from '@src/components/Container';
import Card from '@src/components/Card';
import { pageSize } from '@src/utils/constants';
import MoreButton from '@src/components/MoreButton';
import { useRouteMatch } from 'react-router-dom';
import { Context } from '@src/contexts/provider/Provider';
import useMedia from 'use-media';
const HotCards: React.FC = () => {
  const intl = useIntl();
  const isMobile = useMedia({ maxWidth: '600px' });
  const { maxWidth } = useContext(ThemeContext);
  const { toggleLoading } = useContext(Context);
  const [fetching, setFetching] = useState(false);
  const match: {
    params: {
      projectId: string;
    };
  } = useRouteMatch();
  const { projectId } = match.params;

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

  const fetchCollectionNums = useProCollection();

  const fetchProjectCardsData = async (projectId: string, pageSizeNum: number) => {
    toggleLoading(true);
    const allCardsData = await fetchCollectionNums(projectId, pageSizeNum);
    setAllCards(allCardsData);
    setFetching(false);
    toggleLoading(false);
  };

  useEffect(() => {
    fetchProjectCardsData(projectId, pageSize);
  }, []);

  if (allCards?.records?.length === 0) {
    return <Spacer size="lg" />;
  }

  if (isMobile) {
    return (
      <>
        <StyledTitle>
          {isMobile && <Spacer size="md" />}
          <div className="cardsTitle">{intl.formatMessage({ id: 'project.cards.title' })}</div>
        </StyledTitle>
        <Spacer size="md" />
        <Container
          flex
          direction="row"
          align="left"
          justify={allCards?.records?.length === 0 ? 'center' : 'between'}
          padding="8px"
          background="transparent"
          boxShadow="none"
          maxWidth={maxWidth + 24}
          wrap
        >
          {allCards?.records?.map((item) => (
            <Card key={item.id} {...item} />
          ))}
        </Container>
        <MoreButton
          loading={fetching}
          disabled={allCards?.current === allCards.pages}
          onClick={() => {
            if (allCards?.current < allCards.pages) {
              setFetching(true);
              fetchProjectCardsData(projectId, allCards.size + pageSize);
            }
          }}
        />
        <Spacer size="md" />
      </>
    );
  } else {
    return (
      <>
        <StyledTitle>
          {isMobile && <Spacer size="md" />}
          <div className="cardsTitle">{intl.formatMessage({ id: 'project.cards.title' })}</div>
        </StyledTitle>
        <Spacer size="md" />
        <Container
          flex
          direction="row"
          align="left"
          justify={allCards?.records?.length === 0 ? 'center' : 'left'}
          padding="0"
          background="transparent"
          boxShadow="none"
          maxWidth={maxWidth + 24}
          wrap
        >
          {allCards?.records?.map((item) => (
            <Card key={item.id} {...item} />
          ))}
        </Container>
        <MoreButton
          loading={fetching}
          disabled={allCards?.current === allCards.pages}
          onClick={() => {
            if (allCards?.current < allCards.pages) {
              setFetching(true);
              fetchProjectCardsData(projectId, allCards.size + pageSize);
            }
          }}
        />
        <Spacer size="md" />
      </>
    );
  }
};

const StyledTitle = styled.div`
  display: flex;
  width: 100%;
  max-width: ${(props) => props.theme.maxWidth}px;
  .cardsTitle {
    text-align: left;
    font-size: 36px;
    font-family: 'Noto Sans SC', sans-serif;
    font-weight: 600;
    color: #000000;
    line-height: 50px;
    @media (max-width: 600px) {
      font-size: 20px;
      font-weight: 600;
      color: #000000;
      line-height: 29px;
    }
  }
`;
export default HotCards;
