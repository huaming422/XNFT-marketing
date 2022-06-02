import React, { useEffect, useState, useContext } from 'react';
import SwiperCore, { Navigation, EffectFade, Autoplay, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import styled, { ThemeContext } from 'styled-components';
import useBanners from '@hooks/useBanners';
import { NavLink, useHistory } from 'react-router-dom';
import { SWIPER_TIMER } from '@src/utils/constants';
import useMedia from 'use-media';
import Spacer from '@components/Spacer';

SwiperCore.use([Navigation, EffectFade, Autoplay, Pagination]);

const Banners: React.FC = () => {
  const [swiper, setSwiper] = useState(null);
  const { maxWidth } = useContext(ThemeContext);
  const banners = useBanners();
  const history = useHistory();
  const isMobile = useMedia({ maxWidth: '600px' });
  useEffect(() => {
    if (swiper && banners?.length > 0) {
      swiper?.update();
      swiper?.autoplay?.run();
    }
  }, [swiper, banners]);

  if (!banners || banners.length === 0) {
    return (
      <>
        <Spacer size="lg" />
        <Spacer size="lg" />
      </>
    );
  }

  if (isMobile) {
    return (
      <StyledSwpier
        id="banners"
        key="banners"
        width={720}
        spaceBetween={24}
        slidesPerView={2}
        onSwiper={setSwiper}
        loopedSlides={6}
        autoplay={{
          delay: SWIPER_TIMER,
          disableOnInteraction: false,
        }}
        loop={true}
        // navigation
        // pagination={{ clickable: true }}
      >
        {banners.map(
          (item: {
            bannerCode: string;
            externalLink: string;
            imageUrl: string;
            seq: number;
          }) => {
            if (item.externalLink.includes('http')) {
              return (
                <SwiperSlide key={item.bannerCode}>
                  <img
                    onClick={() => {
                      window.open(item.externalLink);
                    }}
                    key={item.bannerCode}
                    src={item.imageUrl}
                    alt=""
                  />
                </SwiperSlide>
              );
            }
            return (
              <SwiperSlide key={item.bannerCode}>
                <StyledSlide
                  exact
                  onClick={() => {
                    history.push(`/collection/${item.externalLink}`);
                  }}
                  to={item.externalLink ? `/collection/${item.externalLink}` : ''}
                >
                  <img
                    key={item.bannerCode}
                    src={item.imageUrl}
                    width="335px"
                    height="130px"
                    alt=""
                  />
                </StyledSlide>
              </SwiperSlide>
            );
          },
        )}
      </StyledSwpier>
    );
  } else {
    return (
      <StyledSwpier
        id="banners"
        key="banners"
        width={maxWidth}
        spaceBetween={16}
        slidesPerView={2}
        onSwiper={setSwiper}
        loopedSlides={2}
        autoplay={{
          delay: SWIPER_TIMER,
          disableOnInteraction: false,
        }}
        loop={true}
        navigation
        pagination={{ clickable: true }}
      >
        {banners.map(
          (item: {
            bannerCode: string;
            externalLink: string;
            imageUrl: string;
            seq: number;
          }) => {
            if (item.externalLink.includes('http')) {
              return (
                <SwiperSlide
                  key={item.bannerCode}
                  onClick={() => {
                    window.open(item.externalLink);
                  }}
                >
                  <img
                    onClick={() => {
                      window.open(item.externalLink);
                    }}
                    key={item.bannerCode}
                    src={item.imageUrl}
                    height="230px"
                    alt=""
                  />
                </SwiperSlide>
              );
            }
            return (
              <SwiperSlide key={item.bannerCode}>
                <StyledSlide
                  exact
                  to={item.externalLink ? `/collection/${item.externalLink}` : ''}
                >
                  <img key={item.bannerCode} src={item.imageUrl} height="230px" alt="" />
                </StyledSlide>
              </SwiperSlide>
            );
          },
        )}
      </StyledSwpier>
    );
  }
};

const StyledSwpier = styled(Swiper)`
  padding: 32px 0;
  @media (max-width: 600px) {
    padding: 20px 20px;
    width: 100%;
  }
`;

const StyledSlide = styled(NavLink)`
  text-decoration: none;
`;

export default Banners;
