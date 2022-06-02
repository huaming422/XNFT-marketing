import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';

interface SwitchProps {
  width?: number;
  status: boolean;
  disabled?: boolean;
  onChange: Function;
}

const Switch: React.FC<SwitchProps> = ({ width, status, disabled = false, onChange }) => {
  const { color } = useContext(ThemeContext);
  return (
    <Container
      onClick={() => {
        !disabled && onChange();
      }}
      disabled={disabled}
      status={status}
      width={width}
      color={color.primary.main}
    >
      <Circle status={status} color={color.primary.main} />
    </Container>
  );
};

interface StyledSwitchProps {
  width?: number;
  color?: string;
  status: boolean;
  disabled?: boolean;
  onClick?: Function;
}

const Container = styled.div<StyledSwitchProps>`
  position: relative;
  width: ${(props) => (props.width ? `${props.width}px` : '48px')};
  height: 20px;
  border-radius: 20px;
  border: 1px solid ${(props) => (props.status ? props.color : '#ccc')};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  background: #fff;
  pointer-events: ${(props) => (props.disabled ? 'all !important' : 'initial')};
  /* top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); */
`;

const Circle = styled.div<StyledSwitchProps>`
  position: absolute;
  top: 1px;
  left: ${(props) => (props.status ? 'calc(100% - 17px)' : '1px')};
  width: 16px;
  height: 16px;
  border-radius: 16px;
  box-sizing: content-box;
  background-color: ${(props) => (props.status ? props.color : '#ccc')};
  transition: left ease 0.1s;
`;

export default Switch;
