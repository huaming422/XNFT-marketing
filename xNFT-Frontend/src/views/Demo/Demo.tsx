import React, { useContext } from 'react';
import Page from '@components/Page';
import numeral from 'numeral';
import styled from 'styled-components';
import AnimatedNumber from '@jhonnold/react-animated-number';
import Humanize from 'humanize-plus';
import Button from '@src/components/Button';
import { Context } from '@src/contexts/provider/Provider';
import { ToastType } from '@utils/constants';

const Home: React.FC = () => {
  const { Toast } = useContext(Context);
  return (
    <Page>
      <StyledCard>
        <span className="title">数字动画+大数值格式化</span>
        <AnimatedNumber
          component="text"
          number={10000000}
          style={{
            transition: '0.8s ease-out',
            transitionProperty: 'background-color, color, opacity',
            transitionDelay: '3s',
          }}
          duration={300}
          format={(n: any) => numeral(n).format('0.a')}
        />
      </StyledCard>
      <StyledCard>
        <span className="title">千位符</span>
        {Humanize.formatNumber(1234567890.123456789, 4)}
      </StyledCard>
      <StyledCard>
        <span
          className="title"
          onClick={() => {
            window.open('https://www.npmjs.com/package/react-awesome-slider');
          }}
        >
          单个图片轮播
        </span>
      </StyledCard>
      <StyledCard>
        <span
          className="title"
          onClick={() => {
            window.open('https://github.com/Aljullu/react-lazy-load-image-component');
          }}
        >
          图片懒加载
        </span>
      </StyledCard>
      <StyledCard>
        <Button
          onClick={() => {
            Toast(ToastType.SENDED);
          }}
          size={'md'}
          variant="primary"
          text={'成功提示'}
        />
        <Button
          onClick={() => {
            Toast(ToastType.CANCEL);
          }}
          size={'md'}
          variant="primary"
          text={'交易取消提示'}
        />
        <Button
          onClick={() => {
            Toast(ToastType.LOADING);
          }}
          size={'md'}
          variant="primary"
          text={'交易发送中'}
        />
        <Button
          onClick={() => {
            Toast(ToastType.CLOSE);
          }}
          size={'md'}
          variant="primary"
          text={'关闭Toast'}
        />
      </StyledCard>
    </Page>
  );
};

const StyledImage = styled.div`
  background: url(https://digicenter-public.digicenter.top/nft/xnft/eda6964….png);
  background-size: cover;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background-repeat: round;
`;

const StyledCard = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: #eee;
  padding: 24px;
  width: 1200px;
  margin: 12px 0;
  .title {
    font-size: 24px;
    font-weight: 500;
    color: #333;
    display: inline-block;
    width: 400px;
  }
`;

export default Home;
