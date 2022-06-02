import React from 'react';
import useMedia from 'use-media';
import styled from 'styled-components';
import LogoWhite from '@assets/img/logo.png';
import LogoBlack from '@assets/img/logo-mobile.png';
import { useHistory } from 'react-router';

interface LogoProps {
  color?: 'white' | 'black';
}

const Logo: React.FC = (props: LogoProps) => {
  const isMobile = useMedia({ maxWidth: '600px' });
  const history = useHistory();
  return (
    <StyledLogo
      onClick={() => {
        history.push('/');
      }}
    >
      <img src={props.color === 'black' ? LogoBlack : LogoWhite} height="48px" alt="" />
      {/* <StyledLink href="/">{PLATFORM_SYMBOL}</StyledLink> */}
    </StyledLogo>
  );
};

const StyledLogo = styled.div`
  align-items: center;
  display: flex;
  /* img {
    &:hover {
      transform: rotate(-5deg);
      cursor: pointer;
      transition: all 0.5s;
    }
  } */
`;

export default Logo;
