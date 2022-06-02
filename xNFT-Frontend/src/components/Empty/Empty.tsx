import React from 'react';
import EmptyIcon from '@assets/img/empty.png';
import { useIntl } from 'react-intl';
import Spacer from '@components/Spacer';
import styled from 'styled-components';

const Card: React.FC<{
  width?: string;
  height?: string;
}> = ({ width = '100%', height = '100%' }) => {
  const intl = useIntl();
  return (
    <StyledEmptyContainer>
      <img src={EmptyIcon} width="64px" height="64px" alt="" />
      <Spacer size="md"></Spacer>
      {intl.formatMessage({ id: 'common.data.empty' })}
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
`;

export default Card;
