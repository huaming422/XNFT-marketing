import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import HomeBanner from '@assets/img/home_banner.png';
import LuckBoxBanner from '@assets/img/luckyBox.png';
import nftCardBanner from '@assets/img/nftCard.png';
import TopBar from '../TopBar';
import Footer from '../Footer';

const BannerMap: {
  [key: string]: string;
} = {
  home: HomeBanner,
  luckyBox: LuckBoxBanner,
  nftCard: nftCardBanner,
  none: '',
};

const Page: React.FC<{ page?: string; children: any }> = ({ page, children }) => {
  const history = useHistory();
  useEffect(() => {
    window?.scrollTo({
      left: 0,
      top: 0,
      behavior: 'smooth',
    });
  }, [history?.location?.pathname]);
  return (
    <StyledPage page={BannerMap[page || 'none']}>
      <TopBar hasBanner={page && page !== 'none'} />
      <StyledMain>{children}</StyledMain>
      <Footer />
    </StyledPage>
  );
};

const StyledPage = styled.div`
  width: 100%;
  min-width: ${(props) => props.theme.maxWidth}px;
  height: 484px;
  padding-top: ${(props) => props.theme.topBarSize}px;
  background: url(${(props: { page?: string }) => props.page});
  background-size: 100% 100%;
  background-position: center;
  @media (max-width: 600px) {
    width: 100%;
    min-width: 100%;
    padding-top: 48px;
    height: 300px;
  }
`;

const StyledMain = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: calc(100vh - ${(props) => props.theme.topBarSize + props.theme.footerSize}px);
  /* padding-bottom: ${(props) => props.theme.spacing[5]}px; */
  margin-top: 2px;
`;

export default Page;
