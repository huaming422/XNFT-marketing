import React from 'react';
import styled from 'styled-components';

interface ContainerProps {
  children?: React.ReactNode;
  flex?: boolean;
  direction?: 'row' | 'column';
  align?: 'left' | 'center' | 'right';
  justify?: 'left' | 'center' | 'right' | 'between' | 'around' | 'evenly';
  margin?: string;
  padding?: string;
  height?: string;
  width?: string;
  maxWidth?: number | string;
  background?: string;
  boxShadow?: string;
  wrap?: any;
  overflow?: string;
}

const Container: React.FC<ContainerProps> = ({
  children,
  flex,
  direction = 'column',
  align = 'center',
  justify = 'center',
  margin = 'auto',
  height = 'auto',
  padding,
  width = '100%',
  maxWidth = '100%',
  background = 'transparent',
  boxShadow = '0px 1px 30px 0px rgba(31, 43, 77, 0.08)',
  wrap,
  overflow = 'auto',
}) => {
  return (
    <StyledContainer
      display={flex ? 'flex' : 'block'}
      direction={direction}
      align={align}
      justify={justify}
      margin={margin}
      height={height}
      padding={padding}
      width={width}
      maxWidth={maxWidth}
      background={background}
      boxShadow={boxShadow}
      wrap={wrap}
      overflow={overflow}
    >
      {children}
    </StyledContainer>
  );
};

interface StyledContainerProps {
  display: string;
  direction: 'column' | 'row';
  align?: 'left' | 'center' | 'right';
  justify?: 'left' | 'center' | 'right' | 'between' | 'around';
  margin?: string;
  height?: number | string;
  padding?: string;
  width?: string;
  maxWidth?: number | string;
  background?: string;
  boxShadow?: string;
  wrap?: any;
  overflow?: string;
}

const getFlexParams = (position: string) => {
  switch (position) {
    case 'left':
      return 'flex-start';
    case 'center':
      return 'center';
    case 'right':
      return 'flex-end';
    case 'between':
      return 'space-between';
    case 'around':
      return 'space-around';
    case 'evenly':
      return 'space-evenly';
  }
};

const StyledContainer = styled.div<StyledContainerProps>`
  position: relative;
  box-sizing: border-box;
  margin: ${(props) => props.margin};
  padding: ${(props) => props.padding || `${props.theme.spacing[6]}px`};
  width: ${(props: any) =>
    typeof props.width === 'number' ? `${props.width}px` : props.width};
  height: ${(props) => props.height};
  background: ${(props) => props.background};
  max-width: ${(props) =>
    typeof props.maxWidth === 'number' ? `${props.maxWidth}px` : props.maxWidth};
  display: ${(props: { children?: React.ReactNode; flex?: boolean; display?: string }) =>
    props.display};
  flex-direction: ${(props: {
    children?: React.ReactNode;
    flex?: boolean;
    direction?: 'row' | 'column';
  }) => props.direction || ''};
  flex-wrap: ${(props) => (props.wrap ? 'wrap' : 'no-wrap')};
  align-items: ${(props) => getFlexParams(props.align)};
  justify-content: ${(props) => getFlexParams(props.justify)};
  border-radius: 8px;
  box-shadow: ${(props) => props.boxShadow};
  overflow: ${(props) => props.overflow};
  @media (max-width: 600px) {
    flex-wrap: wrap;
    /* padding: 4px; */
    border-radius: unset;
    width: 100%;
  }
  // ::after {
  //   content: '';
  //   flex: auto;
  // }
`;

export default Container;
