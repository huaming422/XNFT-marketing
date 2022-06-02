import React, { useEffect, useState, useContext } from 'react';
import { useIntl } from 'react-intl';
import styled, { ThemeContext } from 'styled-components';
import Spacer from '@src/components/Spacer';
import useCollection from '@hooks/useCollection';
import Container from '@src/components/Container';
import Collections from '@assets/img/collection.png';
import BlindBox from '@assets/img/blind-box.png';
import Transaction from '@assets/img/transaction.png';
import User from '@assets/img/user.png';
import Follow from '@assets/img/follow.png';
//import Collection from '@src/components/Collection';
import Empty from '@components/Empty';
import { useRouteMatch } from 'react-router-dom';
const ProjectCollection: React.FC = () => {
  const intl = useIntl();
  const [swiper, setSwiper] = useState(null);
  const { maxWidth } = useContext(ThemeContext);
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
    const projectDetailData = await fetchProjectDetail();
    setProjectDetail(projectDetailData);
  };

  useEffect(() => {
    fetchProjectDetailData();
  }, []);
  // console.log('projectDetail',projectDetail);
  return (
    <>
      {/* <Collection/> */}
      <Container
        flex
        direction="row"
        align="center"
        justify="center"
        padding="0"
        margin="0"
        background="#FFFFFF"
        boxShadow="0px 1px 30px 0px rgba(31, 43, 77, 0.08)"
        border-radius="16px"
        width="1070px"
        maxWidth="1070px"
        height="178px"
      >
        {/* {nums?.boxPrivate?.map((item: any) => {
          return <> */}
        <ContainerSmall>
          <Spacer size="md" />
          <img src={Collections} alt="" />
          <Spacer size="sm" />
          {/* <span className="num">12324</span> */}
          <span className="name">{intl.formatMessage({ id: 'project.cards.title' })}</span>
        </ContainerSmall>
        <Lineborder></Lineborder>
        <ContainerSmall>
          <Spacer size="md" />
          <img src={BlindBox} alt="" />
          <Spacer size="sm" />
          {/* <span className="num">12324</span> */}
          <span className="name">{intl.formatMessage({ id: 'project.luckybox.title' })}</span>
        </ContainerSmall>
        <Lineborder></Lineborder>
        <ContainerSmall>
          <Spacer size="md" />
          <img src={Transaction} alt="" />
          <Spacer size="sm" />
          {/* <span className="num">12324</span> */}
          <span className="name">{intl.formatMessage({ id: 'project.trans.title' })}</span>
        </ContainerSmall>
        <Lineborder></Lineborder>
        <ContainerSmall>
          <Spacer size="md" />
          <img src={User} alt="" />
          <Spacer size="sm" />
          {/* <span className="num">12324</span> */}
          <span className="name">{intl.formatMessage({ id: 'project.user.title' })}</span>
        </ContainerSmall>
        <Lineborder></Lineborder>
        <ContainerSmall>
          <Spacer size="md" />
          <img src={Follow} alt="" />
          <Spacer size="sm" />
          {/* <span className="num">12324</span> */}
          <span className="name">{intl.formatMessage({ id: 'project.follow.title' })}</span>
        </ContainerSmall>
        {/* </>
        })} */}
      </Container>
    </>
  );
};

const Lineborder = styled.div`
  width: 1px;
  height: 80px;
  opacity: 0.3;
  border: 1px solid #979797;
`;
const ContainerSmall = styled.div`
  width: 100%;
  max-width: ${(props) => props.theme.maxWidth}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    width: 64px;
    height: 64px;
  }
  .num {
    font-size: 24px;
    font-family: 'Noto Sans SC', sans-serif;
    font-weight: 600;
    color: #000000;
    line-height: 28px;
  }
  .name {
    font-size: 14px;
    font-family: 'Noto Sans SC', sans-serif;
    font-weight: 600;
    color: #000000;
    line-height: 24px;
  }
`;

export default ProjectCollection;
