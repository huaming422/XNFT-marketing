import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch, useLocation } from 'react-router-dom';
import '@ethersproject/shims';
import styled, { ThemeProvider } from 'styled-components';
import { UseWalletProvider } from 'use-wallet';
import { ToastContainer } from 'react-toastify';
import BaseProvider from './contexts/provider';
import { ModalProvider } from 'styled-react-modal';
// import Home from './views/Home';
import theme from './theme';
import config from './config';
import Loading from './components/Loading';
import { retry } from './utils/tools';
declare global {
  interface window {
    ethereum?: any;
    location?: any;
  }
}

const Home = lazy(() => retry(() => import('./views/Home')));
const LuckyBox = lazy(() => retry(() => import('./views/LuckyBox')));
const LuckyBoxEdit = lazy(() => retry(() => import('./views/LuckyBoxEdit')));
const NFTCard = lazy(() => retry(() => import('./views/NFTCard')));
const LuckyBoxDetail = lazy(() => retry(() => import('./views/LuckyBoxDetail')));
const CardDetail = lazy(() => retry(() => import('./views/CardDetail')));
const ProjectDetail = lazy(() => retry(() => import('./views/ProjectDetail')));
const NoWallet = lazy(() => retry(() => import('./views/NoWallet')));
const MobileMenu = lazy(() => retry(() => import('./views/MobileMenu')));
const UserDetail = lazy(() => retry(() => import('./views/UserDetail')));
const MarketNFT = lazy(() => retry(() => import('./views/MarketNFT')));
const MarketLuckyBox = lazy(() => retry(() => import('./views/MarketLuckyBox')));

const Demo = lazy(() => import('./views/Demo'));

const StyledLoadingContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
`;
const LoadingComp = () => (
  <StyledLoadingContainer>
    <Loading />
  </StyledLoadingContainer>
);

const App: React.FC = () => {
  return (
    <Providers>
      <Router>
        <Switch>
          <Route exact path="/">
            <Suspense fallback={<LoadingComp />}>
              <Home />
            </Suspense>
          </Route>
          <Route exact path="/luckybox">
            <Suspense fallback={<LoadingComp />}>
              <LuckyBox />
            </Suspense>
          </Route>
          <Route exact path="/luckybox/edit/:tokenId/:boxContractAddress">
            <Suspense fallback={<LoadingComp />}>
              <LuckyBoxEdit />
            </Suspense>
          </Route>
          <Route exact path="/nft-card">
            <Suspense fallback={<LoadingComp />}>
              <NFTCard />
            </Suspense>
          </Route>
          <Route exact path="/luckybox-detail/:tokenId/:boxContractAddress">
            <Suspense fallback={<LoadingComp />}>
              <LuckyBoxDetail />
            </Suspense>
          </Route>
          <Route
            exact
            path="/luckybox-detail/:tokenId/:boxContractAddress/:inviterAddress/:refId"
          >
            <Suspense fallback={<LoadingComp />}>
              <LuckyBoxDetail />
            </Suspense>
          </Route>
          <Route exact path="/card-detail/:nftContractAddress/:ownerAddress/:tokenId">
            <Suspense fallback={<LoadingComp />}>
              <CardDetail />
            </Suspense>
          </Route>
          <Route
            exact
            path="/card-detail/:nftContractAddress/:ownerAddress/:tokenId/:inviterAddress/:refId"
          >
            <Suspense fallback={<LoadingComp />}>
              <CardDetail />
            </Suspense>
          </Route>
          <Route
            exact
            path="/card-detail/:nftContractAddress/:ownerAddress/:tokenId/:boxAddress/:boxTokenId"
          >
            <Suspense fallback={<LoadingComp />}>
              <CardDetail />
            </Suspense>
          </Route>
          <Route
            exact
            path="/card-detail/:nftContractAddress/:ownerAddress/:tokenId/:boxAddress/:boxTokenId/:inviterAddress/:refId"
          >
            <Suspense fallback={<LoadingComp />}>
              <CardDetail />
            </Suspense>
          </Route>
          <Route exact path="/collection/:projectId">
            <Suspense fallback={<LoadingComp />}>
              <ProjectDetail />
            </Suspense>
          </Route>
          <Route exact path="/user/:tab">
            <Suspense fallback={<LoadingComp />}>
              <UserDetail />
            </Suspense>
          </Route>
          <Route exact path="/mobile-menu">
            <Suspense fallback={<LoadingComp />}>
              <MobileMenu />
            </Suspense>
          </Route>
          <Route exact path="/nowallet">
            <Suspense fallback={<LoadingComp />}>
              <NoWallet />
            </Suspense>
          </Route>
          <Route exact path="/market-nft">
            <Suspense fallback={<LoadingComp />}>
              <MarketNFT />
            </Suspense>
          </Route>
          <Route exact path="/market-luckybox">
            <Suspense fallback={<LoadingComp />}>
              <MarketLuckyBox />
            </Suspense>
          </Route>
          <Route exact path="/demo">
            <Suspense fallback={<LoadingComp />}>
              <Demo />
            </Suspense>
          </Route>
          <Route component={Home} />
        </Switch>
      </Router>
    </Providers>
  );
};

const Providers: React.FC = ({ children }) => {
  console.debug('location', window.location);
  const search = window.location.search;
  let originChainId = '';
  if (search) {
    const searchArr = search.split('network=');
    if (searchArr.length > 0) {
      originChainId = searchArr[1];
    }
  }
  const [chainId, setChainId] = useState(
    originChainId || localStorage.getItem('chainId') || config.chainId,
  );
  return (
    <ThemeProvider theme={theme}>
      <UseWalletProvider chainId={Number(chainId)}>
        <BaseProvider originChainId={Number(chainId)} onSwitchChainId={setChainId}>
          <ModalProvider>{children}</ModalProvider>
          <ToastContainer />
        </BaseProvider>
      </UseWalletProvider>
    </ThemeProvider>
  );
};

export default App;
