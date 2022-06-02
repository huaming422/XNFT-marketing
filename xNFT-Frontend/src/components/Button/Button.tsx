import React, { useContext, useMemo } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { ReactComponent as LoadingIcon } from '@assets/img/loading.svg';
import { Link } from 'react-router-dom';

interface ButtonProps {
  children?: React.ReactNode;
  disabled?: boolean;
  href?: string;
  onClick?: (event: any) => void;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  to?: string;
  loading?: boolean;
  variant?: 'default' | 'secondary' | 'tertiary' | 'primary' | 'green' | 'blue';
}

const Button: React.FC<ButtonProps> = ({
  children,
  disabled,
  href,
  onClick,
  size,
  text,
  to,
  variant,
  loading,
}) => {
  const { color, spacing } = useContext(ThemeContext);
  let borderColor: string;
  let textColor: string;
  let backgroundColor: string;
  let hoverBackgroundColor: string;
  let hoverBorderColor: string;
  let hoverTextColor: string;
  const isBtnDisabled = disabled || loading;
  switch (variant) {
    case 'secondary':
      textColor = isBtnDisabled ? '#777' : color.primary.main;
      backgroundColor = isBtnDisabled ? '#f5f5f5' : color.white;
      hoverBackgroundColor = isBtnDisabled ? '#f5f5f5' : color.white;
      borderColor = color.primary.main;
      hoverBorderColor = isBtnDisabled ? '#d9d9d9' : color.primary.main;
      hoverTextColor = isBtnDisabled ? '#666' : color.primary.main;
      break;
    case 'primary':
      textColor = disabled ? '#666' : color.white;
      backgroundColor = disabled
        ? '#f5f5f5'
        : 'linear-gradient(90deg, #0079FF 0%, #00F364 100%)';
      hoverBackgroundColor = disabled
        ? '#f5f5f5'
        : 'linear-gradient(90deg, #0079FF 20%, #00F364 100%)';
      borderColor = disabled ? '#d9d9d9' : 'none';
      hoverBorderColor = disabled ? '#d9d9d9' : 'none';
      hoverTextColor = disabled ? '#666' : color.white;
      break;
    case 'green':
      textColor = disabled ? '#666' : color.white;
      backgroundColor = disabled ? '#f5f5f5' : '#05C382';
      hoverBackgroundColor = disabled ? '#f5f5f5' : '#05C382';
      borderColor = disabled ? '#d9d9d9' : 'none';
      hoverBorderColor = disabled ? '#d9d9d9' : 'none';
      hoverTextColor = disabled ? '#666' : color.white;
      break;
    case 'blue':
      textColor = disabled ? '#666' : color.white;
      backgroundColor = disabled ? '#f5f5f5' : '#0079FF';
      hoverBackgroundColor = disabled ? '#f5f5f5' : '#0079FF';
      borderColor = disabled ? '#d9d9d9' : 'none';
      hoverBorderColor = disabled ? '#d9d9d9' : 'none';
      hoverTextColor = disabled ? '#666' : color.white;
      break;
    case 'default':
      break;
  }

  let boxShadow: string;
  let buttonSize: number;
  let buttonPadding: number;
  let fontSize: number;
  let buttonWidth: number | string;
  switch (size) {
    case 'sm':
      buttonPadding = spacing[3];
      buttonSize = 28;
      fontSize = 12;
      buttonWidth = 80;
      break;
    case 'lg':
      buttonPadding = spacing[4];
      buttonSize = 58;
      fontSize = 18;
      buttonWidth = '100%';
      break;
    case 'md':
    default:
      buttonPadding = spacing[4];
      buttonSize = 40;
      fontSize = 16;
      buttonWidth = 160;
  }

  const ButtonChild = useMemo(() => {
    if (to) {
      return <StyledLink to={to}>{text}</StyledLink>;
    } else if (href) {
      return (
        <StyledExternalLink href={href} target="__blank">
          {text}
        </StyledExternalLink>
      );
    } else {
      return text;
    }
  }, [href, text, to]);
  return (
    <StyledButton
      loading={loading}
      variant={variant}
      boxShadow={boxShadow}
      color={textColor}
      disabled={isBtnDisabled}
      fontSize={fontSize}
      onClick={onClick}
      padding={buttonPadding}
      size={buttonSize}
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      width={buttonWidth}
      hoverBorderColor={hoverBorderColor}
      hoverTextColor={hoverTextColor}
      hoverBackgroundColor={hoverBackgroundColor}
      primaryColor={color.primary.main}
    >
      {loading && <LoadingIcon width="24px" />}
      {children}
      {ButtonChild}
    </StyledButton>
  );
};

interface StyledButtonProps {
  boxShadow: string;
  loading: boolean;
  color: string;
  variant: string;
  isBtnDisabled?: boolean;
  fontSize: number;
  padding: number;
  size: number;
  backgroundColor: string;
  borderColor: string;
  width: number | string;
  hoverTextColor: string;
  hoverBorderColor: string;
  hoverBackgroundColor: string;
  primaryColor: string;
}

const StyledButton = styled.button<StyledButtonProps>`
  align-items: center;
  background: ${(props) => props.backgroundColor || props.theme.color.white};
  border: ${(props) =>
    props.borderColor === 'none' ? 'none' : `1px solid ${props.borderColor}`};
  border-radius: 29px;
  box-shadow: ${(props) => props.boxShadow};
  color: ${(props) => props.color};
  cursor: ${(props) => (props.isBtnDisabled ? 'not-allowed' : 'pointer')};
  display: flex;
  font-size: ${(props) => props.fontSize}px;
  font-weight: 600;
  height: ${(props) => props.size}px;
  justify-content: center;
  outline: none;
  padding-left: 6px;
  padding-right: 6px;
  // padding-right: ${(props) => props.padding / 2}px;
  word-break: break-all;
  pointer-events: ${(props) => (!props.isBtnDisabled ? undefined : 'none')};
  min-width: ${(props) => (typeof props.width === 'number' ? `${props.width}px` : props.width)};
  &:hover {
    border-color: ${(props) => props.hoverBorderColor};
    color: ${(props) => props.hoverTextColor};
    background: ${(props) => props.hoverBackgroundColor};
  }
  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
    border-color: #d9d9d9;
    pointer-events: all !important;
  }
  &:active {
    transition: all 0.1s ease-in-out;
    transform: rotate(0deg) scale(0.9);
  }
  svg {
    fill: ${(props) => (props.variant === 'primary' ? '#fff' : props.primaryColor)};
    path {
      fill: ${(props) => (props.variant === 'primary' ? '#fff' : props.primaryColor)};
    }
  }
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const StyledLink = styled(Link)`
  align-items: center;
  color: inherit;
  display: flex;
  flex: 1;
  height: 56px;
  justify-content: center;
  margin: 0 ${(props) => -props.theme.spacing[4]}px;
  padding: 0 ${(props) => props.theme.spacing[4]}px;
  text-decoration: none;
`;

const StyledExternalLink = styled.a`
  align-items: center;
  color: inherit;
  display: flex;
  flex: 1;
  height: 56px;
  justify-content: center;
  margin: 0 ${(props) => -props.theme.spacing[4]}px;
  padding: 0 ${(props) => props.theme.spacing[4]}px;
  text-decoration: none;
`;

export default Button;
