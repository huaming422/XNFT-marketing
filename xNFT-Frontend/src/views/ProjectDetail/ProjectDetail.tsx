import React, { useState, useContext, useEffect } from 'react';
import Page from '@components/Page';
import HeadPortrait from './components/HeadPortrait';
import LuckyBoxes from './components/LuckyBoxes';
import ProjectCollection from './components/ProjectCollection';
import Transaction from './components/Transaction';
import Cards from './components/Cards';
import { useIntl } from 'react-intl';
import styled, { ThemeContext } from 'styled-components';
import { Context } from '@src/contexts/provider/Provider';
import Spacer from '@components/Spacer';
import useCollection from '@hooks/useCollection';
import { useRouteMatch } from 'react-router-dom';
import useMedia from 'use-media';
const LuckyBoxDetail: React.FC = () => {
  const intl = useIntl();
  const { maxWidth } = useContext(ThemeContext);
  const { toggleLoading } = useContext(Context);
  const isMobile = useMedia({ maxWidth: '600px' });
  const match: {
    params: {
      projectId: string;
    };
  } = useRouteMatch();
  const { projectId } = match.params;
  const fetchProjectDetail = useCollection(projectId);
  const [projectDetail, setProjectDetail] = useState({
    backgroundImageUrl: '',
    boxCount: '',
    description: '',
    externalLink: '',
    favoriteCount: '',
    hidden: '',
    imageUrl: '',
    name: '',
    nftCount: '',
    nftOwnerCount: '',
    nftTradeCount: '',
    ownerAddress: '',
    slug: '',
    socialChannel: '',
    tradeCount: '',
  });
  const fetchProjectDetailData = async () => {
    toggleLoading(true);
    const projectDetailData = await fetchProjectDetail();
    setProjectDetail(projectDetailData);
    toggleLoading(false);
  };

  useEffect(() => {
    fetchProjectDetailData();
  }, []);
  return (
    <Page>
      {/* 头像+昵称 */}
      <HeadPortrait />
      <Spacer size="md" />
      {/* 藏品*/}
      {/* <ProjectCollection />
      <Spacer size="md" />
      <Spacer size="md" /> */}
      {/* 文本 */}
      <StyledComments>{projectDetail.description}</StyledComments>
      <Spacer size="md" />
      {/* 盲盒 */}
      <LuckyBoxes />
      {/* 卡片 */}
      <Cards />
      {/* 交易记录 */}
      {/* <Transaction/> */}
    </Page>
  );
};
const StyledComments = styled.div`
  width: 1070px;
  /* height: 60px; */
  font-size: 16px;
  font-family: 'Noto Sans SC', sans-serif;
  font-weight: 400;
  color: #000000;
  line-height: 30px;
  text-align: center;
  @media (max-width: 600px) {
    width: 100%;
    font-size: 12px;
    font-weight: 400;
    color: #000000;
    line-height: 20px;
    padding: 0 16px;
  }
`;
export default LuckyBoxDetail;
