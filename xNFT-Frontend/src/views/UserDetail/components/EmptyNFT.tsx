import React, { createContext } from 'react';
import EmptyNFTIcon from '@assets/img/nft_empty.png';
import { useIntl } from 'react-intl';
import Spacer from '@components/Spacer';
import styled from 'styled-components';
import Button from '@components/Button';

const Card: React.FC<{
  width?: string;
  height?: string;
  buttonValue?: string;
  textValue?: string;
  index?: number;
}> = ({ index = 0, width = '100%', height = '100%', textValue = '暂无数据', buttonValue }) => {
  return (
    <StyledEmptyContainer>
      <img src={EmptyNFTIcon} width="200px" height="200px" alt="" />
      <Spacer size="sm"></Spacer>
      <div className="empty-value">{textValue}</div>
      <Spacer size="md"></Spacer>
      {/*{*/}
      {/*  buttonValue && <Button onClick={handleButtonClick}>{buttonValue}</Button>*/}
      {/*}*/}
    </StyledEmptyContainer>
  );
};

const StyledEmptyContainer = styled.div`
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 64px;
  color: #666;
  @media (max-width: 600px) {
    padding: 0;
  }
  .empty-value {
    font-size: 16px;
    font-family: 'Noto Sans SC', sans-serif;
    color: rgba(0, 0, 0, 0.6);
  }
`;

export default Card;
