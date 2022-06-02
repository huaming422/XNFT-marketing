import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';

interface DividerProps {
  backgroundColor?: string;
  lineSpacing?: number;
}

const Divider: React.FC<DividerProps> = ({ backgroundColor, lineSpacing }) => {
  const { color, spacing } = useContext(ThemeContext);

  return (
    <StyledLine
      color={backgroundColor || color.lineColor}
      spacing={lineSpacing === 0 ? 0 : spacing[2]}
    />
  );
};

const StyledLine = styled.div`
  width: 100%;
  height: 1px;
  margin: ${(props: { color: string; spacing: number }) => `${props.spacing}`}px 0;
  background-color: ${(props) => props.color};
`;

export default Divider;
