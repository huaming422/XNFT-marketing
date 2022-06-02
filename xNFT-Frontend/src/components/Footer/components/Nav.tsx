import React from 'react';
import styled from 'styled-components';

const Nav: React.FC = () => {
  return (
    <StyledNav>
      <StyledLink href="" target="_blank">
        GitHub
      </StyledLink>
      <StyledLink href="" target="_blank">
        Twitter
      </StyledLink>
      <StyledLink href="" target="_blank">
        Telegram
      </StyledLink>
      <StyledLink href="" target="_blank">
        Discord
      </StyledLink>
      <StyledLink href="" target="_blank">
        Medium
      </StyledLink>
    </StyledNav>
  );
};

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
`;

const StyledLink = styled.a`
  color: ${(props) => props.theme.color.grey[400]};
  padding-left: ${(props) => props.theme.spacing[3]}px;
  padding-right: ${(props) => props.theme.spacing[3]}px;
  text-decoration: none;
  &:hover {
    color: ${(props) => props.theme.color.grey[500]};
  }
`;
export default Nav;
