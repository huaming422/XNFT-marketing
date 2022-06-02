import React, { useEffect, useState, useContext } from 'react';
import SwiperCore, { Navigation, EffectFade, Autoplay, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useIntl } from 'react-intl';
import styled, { ThemeContext } from 'styled-components';
import useHotBoxes from '@src/hooks/useHotBoxes';
import LeftIcon from '@assets/img/left.png';
import RightIcon from '@assets/img/right.png';
import LeftHoverIcon from '@assets/img/left_hover.png';
import RightHoverIcon from '@assets/img/right_hover.png';
import Spacer from '@src/components/Spacer';
import Container from '@src/components/Container';
import LuckyBox from '@src/components/LuckyBox';
import { SWIPER_TIMER } from '@src/utils/constants';
import useMedia from 'use-media';
SwiperCore.use([Navigation, EffectFade, Autoplay, Pagination]);

const HotBoxs: React.FC = () => {
  const intl = useIntl();
  const [swiper, setSwiper] = useState(null);
  const { maxWidth } = useContext(ThemeContext);
  const isMobile = useMedia({ maxWidth: '600px' });
  const hotBoxs = useHotBoxes();
  useEffect(() => {
    if (swiper && hotBoxs?.length > 0) {
      swiper?.update();
      swiper?.autoplay?.run();
    }
  }, [swiper, hotBoxs]);
  if (isMobile) {
    return (
      hotBoxs?.boxPrivate?.length > 0 && (
        <>
          <StyledTitle>
            <Spacer size="md" />
            <div className="hoxsTitle">
              {intl.formatMessage({ id: 'home.hot.luckybox.title' })}
            </div>
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
            {hotBoxs?.boxPrivate?.length > 0 && (
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
                    delay: SWIPER_TIMER,
                    disableOnInteraction: false,
                  }}
                  loop={true}
                  navigation
                  pagination={{ clickable: true }}
                >
                  {hotBoxs?.boxPrivate?.map((item: any) => {
                    return (
                      <SwiperSlide key={`${item.boxTokenId}`}>
                        <LuckyBox key={`${item.boxTokenId}`} hasNav {...item} />
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
        </>
      )
    );
  } else {
    return (
      hotBoxs?.boxPrivate?.length > 0 && (
        <>
          <StyledTitle>
            <div className="hoxsTitle">
              {intl.formatMessage({ id: 'home.hot.luckybox.title' })}
            </div>
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
            {hotBoxs?.boxPrivate?.length > 0 && (
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
                  spaceBetween={36}
                  slidesPerView={3}
                  onSwiper={setSwiper}
                  loopedSlides={12}
                  autoplay={{
                    delay: SWIPER_TIMER,
                    disableOnInteraction: false,
                  }}
                  loop={true}
                  navigation
                >
                  {hotBoxs?.boxPrivate?.map((item: any) => {
                    return (
                      <SwiperSlide
                        key={`${item.id}-${item.boxContractAddress}-${Math.random()}`}
                      >
                        <LuckyBox key={item.id} hasNav {...item} />
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
        </>
      )
    );
  }
};

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
  display: flex;
  width: 100%;
  max-width: ${(props) => props.theme.maxWidth}px;
  .hoxsTitle {
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
    props.position === 'left' ? `left: 16px` : 'right: 18px'};
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
      props.position === 'left' ? `left: 25px` : 'right: 25px'};
  }
`;

export default HotBoxs;
