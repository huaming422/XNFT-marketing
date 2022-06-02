import React, { useEffect, useState, useContext } from 'react';
import SwiperCore, { Navigation, EffectFade, Autoplay, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useIntl } from 'react-intl';
import styled, { ThemeContext } from 'styled-components';
import useBlind from '@src/hooks/useBlind';
import LeftIcon from '@assets/img/left.png';
import RightIcon from '@assets/img/right.png';
import LeftHoverIcon from '@assets/img/left_hover.png';
import RightHoverIcon from '@assets/img/right_hover.png';
import GiftIcon from '@assets/img/gift.png';
import { NavLink, useHistory } from 'react-router-dom';
import Spacer from '@src/components/Spacer';
import Container from '@src/components/Container';
import Empty from '@components/Empty';
import Button from '@components/Button';
import LuckyBox from '@src/components/LuckyBox';
import LuckyBoxMobile from '@src/components/LuckBoxMobile';
import { useRouteMatch } from 'react-router-dom';
import { SWIPER_TIMER } from '@src/utils/constants';
import useMedia from 'use-media';
SwiperCore.use([Navigation, EffectFade, Autoplay, Pagination]);
const HotBoxs: React.FC = () => {
  const intl = useIntl();
  const isMobile = useMedia({ maxWidth: '600px' });
  const history = useHistory();
  const [swiper, setSwiper] = useState(null);
  const { maxWidth } = useContext(ThemeContext);
  const match: {
    params: {
      projectId: string;
    };
  } = useRouteMatch();
  const { projectId } = match.params;
  const hotBoxs = useBlind(projectId);
  useEffect(() => {
    if (swiper && hotBoxs?.length > 0) {
      swiper?.update();
      swiper?.autoplay?.run();
    }
  }, [swiper, hotBoxs]);

  if (hotBoxs?.records?.length === 0) {
    return <div></div>;
  }
  if (isMobile) {
    return (
      <>
        <Container
          flex
          direction="column"
          align="center"
          justify="center"
          padding="0"
          margin="0"
          background=" #FAFAFA"
          boxShadow="none"
          width="100%"
          height="670px"
        >
          <StyledTitle>
            {isMobile && <Spacer size="md" />}
            <div className="blind-box">
              {intl.formatMessage({ id: 'project.luckybox.title' })}
            </div>
            {/* <div className="view-all">查看全部</div> */}
          </StyledTitle>
          <Spacer size="md" />
          <Container
            flex
            direction="row"
            align="center"
            justify="center"
            padding="0"
            margin="0"
            background="transparent"
            boxShadow="none"
            width="100%"
            maxWidth="100%"
          >
            {hotBoxs?.records?.length > 0 && (
              <>
                {/* <StyledIcon
                  img={LeftIcon}
                  hoverImg={LeftHoverIcon}
                  position="left"
                  onClick={() => {
                    swiper?.slidePrev();
                  }}
                ></StyledIcon> */}
                <StyledSwiper
                  id="hotBoxs"
                  key="hotBoxs"
                  width={670}
                  slidesPerView={2}
                  onSwiper={setSwiper}
                  loopedSlides={6}
                  autoplay={{
                    delay: SWIPER_TIMER * 100,
                    disableOnInteraction: false,
                  }}
                  loop={true}
                  navigation
                  pagination={{ clickable: true }}
                >
                  {hotBoxs?.records?.map((item: any) => {
                    return (
                      <SwiperSlide key={item.boxTokenId}>
                        <LuckyBox {...item} />
                      </SwiperSlide>
                    );
                  })}
                </StyledSwiper>
                {/* <StyledIcon
                  img={RightIcon}
                  hoverImg={RightHoverIcon}
                  position="right"
                  onClick={() => {
                    swiper?.slideNext();
                  }}
                ></StyledIcon> */}
              </>
            )}
          </Container>
        </Container>
      </>
    );
  } else {
    return (
      <>
        <Container
          flex
          direction="column"
          align="center"
          justify="center"
          padding="0"
          margin="0"
          background=" #FAFAFA"
          boxShadow="none"
          width="100%"
          height="670px"
        >
          <StyledTitle>
            {isMobile && <Spacer size="md" />}
            <div className="blind-box">
              {intl.formatMessage({ id: 'project.luckybox.title' })}
            </div>
            {/* <div className="view-all">查看全部</div> */}
          </StyledTitle>
          <Spacer size="md" />
          <Container
            flex
            direction="row"
            align="center"
            justify="center"
            padding="0"
            margin="0"
            background="transparent"
            boxShadow="none"
            width={maxWidth + 72}
            maxWidth={maxWidth + 72}
          >
            {hotBoxs?.records?.length > 0 && (
              <>
                <StyledIcon
                  img={LeftIcon}
                  hoverImg={LeftHoverIcon}
                  position="left"
                  onClick={() => {
                    swiper?.slidePrev();
                  }}
                ></StyledIcon>
                <StyledSwiper
                  id="hotBoxs"
                  key="hotBoxs"
                  width={maxWidth}
                  spaceBetween={0}
                  slidesPerView={3}
                  onSwiper={setSwiper}
                  loopedSlides={2}
                  autoplay={{
                    delay: SWIPER_TIMER,
                    disableOnInteraction: false,
                  }}
                  loop={true}
                  navigation
                >
                  {hotBoxs?.records?.map((item: any) => {
                    return (
                      <SwiperSlide key={item.boxTokenId}>
                        <LuckyBox {...item} />
                      </SwiperSlide>
                    );
                  })}
                </StyledSwiper>
                <StyledIcon
                  img={RightIcon}
                  hoverImg={RightHoverIcon}
                  position="right"
                  onClick={() => {
                    swiper?.slideNext();
                  }}
                ></StyledIcon>
              </>
            )}
          </Container>
        </Container>
      </>
    );
  }
};
//盲盒名称、包含藏品数量、所属项目，以及一个开盲盒的按钮。
const StyledSwiper = styled(Swiper)`
  width: ${(props) => props.theme.maxWidth}px;
  max-width: ${(props) => props.theme.maxWidth}px;
  @media (max-width: 600px) {
    width: 100%;
    max-width: 100%;
    padding-bottom: 24px;
  }
`;

const StyledTitle = styled.div`
  width: 100%;
  max-width: ${(props) => props.theme.maxWidth}px;
  display: flex;
  // flex-direction: row;
  // justify-content: space-between;
  .blind-box {
    text-align: left;
    font-size: 36px;
    font-family: 'Noto Sans SC', sans-serif;
    font-weight: 500;
    color: #000000;
    line-height: 50px;
    @media (max-width: 600px) {
      font-size: 20px;
      font-weight: 500;
      color: #000000;
      line-height: 29px;
    }
  }
  .view-all {
    width: 69px;
    font-size: 16px;
    font-family: 'Noto Sans SC', sans-serif;
    font-weight: 500;
    color: #0079ff;
    line-height: 50px;
  }
`;

const StyledIcon = styled.div`
  cursor: pointer;
  width: 40px;
  height: 40px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: url(${(props: { img: string; position: string }) => props.img});
  background-size: 100% 100%;
  ${(props: { img: string; position: string }) =>
    props.position === 'left' ? `left: 28px` : 'right: 28px'};
  z-index: 2;
  :hover {
    background: url(${(props: { img: string; hoverImg: string; position: string }) =>
      props.hoverImg});
    background-size: 100% 100%;
  }
  @media (max-width: 600px) {
    width: 30px;
    height: 30px;
    ${(props: { img: string; position: string }) =>
      props.position === 'left' ? `left: 4px` : 'right: 10px'};
  }
`;
export default HotBoxs;
