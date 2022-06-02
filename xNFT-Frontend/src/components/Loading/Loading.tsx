import React from 'react';
import styled from 'styled-components';
import LoadingSVG from '@assets/img/loading.svg';

const Loading: React.FC = (size?: number) => {
  const width = `${size || 24}px`;
  return (
    <StyledWrapper>
      <img src={LoadingSVG} width={width} alt="" />
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: ${(props: { size?: number }) => `${props.size || 96}px`};
  }
`;

export default Loading;
