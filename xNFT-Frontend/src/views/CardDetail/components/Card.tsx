import React, { useEffect, useState, useContext } from 'react';
import { useIntl } from 'react-intl';
import styled, { ThemeContext } from 'styled-components';
import Spacer from '@src/components/Spacer';

interface CardProps {
  imgUrl: string;
  name: string;
  price: string;
  unit: string;
  amount: string;
}

const Card: React.FC<CardProps> = (props) => {
  const intl = useIntl();
  useEffect(() => {}, []);

  return <StyledTitle>卡片</StyledTitle>;
};

const StyledTitle = styled.div`
  width: 100%;
  max-width: ${(props) => props.theme.maxWidth}px;
  text-align: left;
  font-size: 36px;
  font-family: 'Noto Sans SC', sans-serif;
  font-weight: 500;
  color: #000000;
  line-height: 50px;
`;

export default Card;
