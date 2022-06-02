import React from 'react';
import Page from '@components/Page';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import Spacer from '@components/Spacer';
import Banners from './components/Banners';
import HotBoxs from './components/HotBoxs';
import HotCards from './components/HotCards';
import SaleCards from './components/SaleCards';
import useMedia from 'use-media';

const Home: React.FC = () => {
  const intl = useIntl();
  const isMobile = useMedia({ maxWidth: '600px' });
  return (
    <Page page="home">
      {isMobile && <Spacer size="md" />}
      {!isMobile && <Spacer size="lg" />}
      <StyledTitle>{intl.formatMessage({ id: 'home.title' })}</StyledTitle>
      <Spacer size="sm" />
      {!isMobile && (
        <StyledSubTitle>{intl.formatMessage({ id: 'home.subtitle' })}</StyledSubTitle>
      )}
      {!isMobile && <Spacer size="lg" />}
      <Banners />
      {isMobile && <Spacer size="md" />}
      {!isMobile && <Spacer size="lg" />}
      <HotBoxs />
      {isMobile && <Spacer size="md" />}
      {!isMobile && <Spacer size="lg" />}
      <HotCards />
      {isMobile && <Spacer size="md" />}
      {!isMobile && <Spacer size="lg" />}
      <SaleCards />
      <Spacer size="lg" />
    </Page>
  );
};

const StyledTitle = styled.div`
  font-size: 48px;
  font-family: 'Noto Sans SC', sans-serif;
  font-weight: 600;
  color: #ffffff;
  line-height: 67px;
  @media (max-width: 600px) {
    font-size: 26px;
    font-weight: 600;
    color: #ffffff;
    line-height: 41px;
    padding: 0 16px;
    text-align: center;
  }
`;

const StyledSubTitle = styled.div`
  font-size: 24px;
  font-family: 'Noto Sans SC', sans-serif;
  font-weight: 500;
  color: #008ce6;
  line-height: 33px;
  background: linear-gradient(90deg, #007cfb 0%, #00f266 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  @media (max-width: 600px) {
    font-size: 15px;
    font-weight: 500;
    color: #008ce6;
    line-height: 22px;
    background: linear-gradient(90deg, #007cfb 0%, #00f266 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

export default Home;
