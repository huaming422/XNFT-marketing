import React, { useEffect, useState, useContext } from 'react';
import { useIntl } from 'react-intl';
import styled, { ThemeContext } from 'styled-components';
import Spacer from '@src/components/Spacer';
import useHotBoxes from '@hooks/useHotBoxes';
import Container from '@src/components/Container';
import Banner1 from '@src/assets/img/banner1.png';
import Card from '@src/components/Card';
import Empty from '@components/Empty';
import useMedia from 'use-media';
const HotCards: React.FC = () => {
  const intl = useIntl();
  const { maxWidth } = useContext(ThemeContext);
  const hotBoxs = useHotBoxes();
  const isMobile = useMedia({ maxWidth: '600px' });

  if (isMobile) {
    return (
      hotBoxs?.nft?.length > 0 && (
        <>
          <StyledTitle>
            <Spacer size="md" />
            <div className="cardsTitle">
              {intl.formatMessage({ id: 'home.hot.cards.title' })}
            </div>
          </StyledTitle>
          {/* <Spacer size="md" /> */}
          <Container
            flex
            direction="row"
            align="left"
            background="transparent"
            boxShadow="none"
            maxWidth={maxWidth + 24}
            padding="16px 8px"
            wrap
          >
            {hotBoxs?.nft?.map((item) => (
              // <Tcard>
              <Card key={item.id} {...item} />
              // </Tcard>
            ))}
          </Container>
        </>
      )
    );
  } else {
    return (
      hotBoxs?.nft?.length > 0 && (
        <>
          <StyledTitle>
            <div className="cardsTitle">
              {intl.formatMessage({ id: 'home.hot.cards.title' })}
            </div>
          </StyledTitle>
          <Spacer size="md" />
          <Container
            flex
            direction="row"
            align="left"
            justify={hotBoxs?.nft?.length === 0 ? 'center' : 'left'}
            background="transparent"
            boxShadow="none"
            maxWidth={maxWidth + 24}
            padding="12px 0"
            wrap
          >
            {hotBoxs?.nft?.map((item) => (
              <Card key={item.id} {...item} />
            ))}
          </Container>
        </>
      )
    );
  }
};
// const Tcard = styled.div`
//   width: 50%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;
const StyledTitle = styled.div`
  display: flex;
  width: 100%;
  max-width: ${(props) => props.theme.maxWidth}px;
  .cardsTitle {
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

export default HotCards;
