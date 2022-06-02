import React from 'react';
import styled from 'styled-components';

interface PageHeaderProps {
  icon: React.ReactNode;
  subtitle?: string;
  title?: string;
  endComponent?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ icon, subtitle, title, endComponent }) => {
  return (
    <StyledPageHeader>
      <StyledIcon>{icon}</StyledIcon>
      <StyledTitle>{title}</StyledTitle>
      <StyledSubtitle>{subtitle}</StyledSubtitle>
      <div
        style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}
      >
        {endComponent}
      </div>
    </StyledPageHeader>
  );
};

const StyledPageHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  /* padding-bottom: ${(props) => props.theme.spacing[6]}px; */
  /* padding-top: ${(props) => props.theme.spacing[6]}px; */
  /* max-width: 512px; */
  width: 100%;
  margin: 0 auto;
  padding: 16px;
`;

const StyledIcon = styled.div`
  /* font-size: 96px; */
  /* height: 96px;
  line-height: 96px; */
  text-align: center;
  margin-right: 12px;
  /* width: 96px; */
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledTitle = styled.h1`
  color: #666;
  font-size: 36px;
  font-weight: 600;
  margin: 0;
  padding: 0;
`;

const StyledSubtitle = styled.h3`
  color: #666;
  font-size: 18px;
  font-weight: 400;
  margin: 0;
  padding: 0;
  text-align: center;
`;

export default PageHeader;
