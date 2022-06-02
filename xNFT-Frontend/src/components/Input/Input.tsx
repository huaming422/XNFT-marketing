import React, { useState } from 'react';
import styled from 'styled-components';
export interface InputProps {
  endAdornment?: React.ReactNode;
  onChange: (e: React.FormEvent<HTMLInputElement>) => void;
  onBlur?: () => any;
  onFocus?: () => any;
  placeholder?: string;
  startAdornment?: React.ReactNode;
  value: string;
  inputSize?: string;
  margin?: string;
  padding?: string;
  width?: number | string;
  borderColor?: string;
  color?: string;
  type?: string;
  background?: string;
  variant?: string;
  autoFocus?: boolean;
  onKeyDown?: Function;
}

interface StyledInputProps {
  inputSize?: string;
  color?: string;
}

interface StyledInputWrapperProps {
  margin?: string;
  padding?: string;
  width?: string | number;
  borderColor?: string;
  background?: string;
  inputSize: string;
  variant?: string;
  focus: boolean;
}

const Input: React.FC<InputProps> = ({
  endAdornment,
  onChange,
  placeholder,
  startAdornment,
  value,
  inputSize,
  margin,
  padding,
  width,
  color,
  borderColor,
  type,
  background,
  variant,
  onBlur,
  onFocus,
  autoFocus,
  onKeyDown,
}) => {
  const [focus, setFocus] = useState(false);
  if (variant === 'inline') {
    return (
      <StyledInlineContainer
        padding={padding}
        width={width}
        borderColor={borderColor}
        background={background}
        focus={focus}
      >
        <StyledStartAdornment>{startAdornment}</StyledStartAdornment>
        <div className="innerContainer">
          <StyledInnerInput
            inputSize={inputSize}
            placeholder={placeholder}
            value={value}
            autoFocus={autoFocus}
            onFocus={(event: any) => {
              setFocus(true);
              onFocus && onFocus(event);
            }}
            onBlur={(event: any) => {
              setFocus(false);
              onBlur && onBlur(event);
            }}
            onKeyDown={(event: any) => {
              onKeyDown && onKeyDown(event);
            }}
            onChange={(event: any) => {
              const inputVal = event?.currentTarget?.value;
              if (type === 'text' || type === 'search') {
                onChange(event);
              } else {
                if (isNaN(Number(inputVal)) || Number(inputVal) < 0) {
                  const e: any = { currentTarget: { value: '' } };
                  onChange(e);
                } else {
                  onChange(event);
                }
              }
            }}
            color={color}
          />
          {!!endAdornment && endAdornment}
        </div>
      </StyledInlineContainer>
    );
  }
  return (
    <StyledInputWrapper
      margin={margin}
      padding={padding}
      width={width}
      borderColor={borderColor}
      background={background}
      inputSize={inputSize}
      variant={variant}
      focus={focus}
    >
      {!!startAdornment && startAdornment}
      <StyledInput
        type={type || 'text'}
        inputSize={inputSize}
        placeholder={placeholder}
        value={value}
        autoFocus={autoFocus}
        onFocus={() => {
          setFocus(true);
          onFocus && onFocus();
        }}
        onBlur={() => {
          setFocus(false);
          onBlur && onBlur();
        }}
        onKeyDown={(event) => {
          onKeyDown && onKeyDown(event);
        }}
        onChange={(event) => {
          const inputVal = event?.currentTarget?.value;
          if (type === 'text' || type === 'search') {
            onChange(event);
          } else {
            if (isNaN(Number(inputVal)) || Number(inputVal) < 0) {
              const e: any = { currentTarget: { value: '' } };
              onChange(e);
            } else {
              onChange(event);
            }
          }
        }}
        color={color}
      />
      {!!endAdornment && endAdornment}
    </StyledInputWrapper>
  );
};

const getWidth = (size: string) => {
  switch (size) {
    case 'sm':
      return '80px';
    case 'md':
      return '240px';
    default:
      return '100%';
  }
};

const getHeight = (size: string) => {
  switch (size) {
    case 'sm':
      return '24px';
    case 'md':
      return '32px';
    default:
      return '40px';
  }
};

const getLineHeight = (size: string) => {
  switch (size) {
    case 'sm':
      return '32px';
    case 'md':
      return '40px';
    default:
      return '48px';
  }
};
const StyledInputWrapper = styled.div<StyledInputWrapperProps>`
  /* background-color: ${(props) => props.theme.color.grey[200]};*/
  width: ${(props) => props.width || '100%'};
  height: ${(props) => getHeight(props.inputSize)};
  background: #f2f2f2;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.1);
  border-radius: 24px;
  padding: ${(props) => props.padding || '0 8px'};
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid
    ${(props: { focus: boolean; margin: string }) =>
      props.focus ? props.theme.color.primary.main : props.borderColor || '#eee'};
  button {
    margin: auto;
  }
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const StyledInput = styled.input<StyledInputProps>`
  background: none;
  border-radius: ${(props) => (props.inputSize === 'sm' ? '4px' : '8px')};
  border: 0;
  /* color: ${(props) => props.theme.color.grey[600]}; */
  color: #666;
  font-size: 16px;
  /* width: ${(props) => getWidth(props.inputSize)}; */
  width: 100%;
  height: ${(props) => getHeight(props.inputSize)};
  line-height: ${(props) => getLineHeight(props.inputSize)};
  @media (max-width: 600px) {
    width: 100%;
  }
  margin: 0;
  // padding: ${(props) => (props.inputSize === 'sm' ? '0 4px' : '0 16px')};
  outline: none;
  ::-webkit-input-placeholder {
    color: #999;
    font-size: 16px;
    @media (max-width: 600px) {
      font-size: 14px;
    }
  }
  @media (max-width: 600px) {
    font-size: 14px;
    padding-left: 4px;
    padding-right: 4px;
  }
`;

const StyledInnerInput = styled.input<StyledInputProps>`
  background: none;
  border-radius: 8px;
  border: 0;
  /* color: ${(props) => props.theme.color.grey[600]}; */
  color: #000;
  font-weight: 500;
  font-size: 16px;
  width: ${(props) => getWidth(props.inputSize)};
  height: ${(props) => getHeight(props.inputSize)};
  line-height: ${(props) => getHeight(props.inputSize)};
  outline: none;
  ::-webkit-input-placeholder {
    color: #999;
    font-size: 16px;
    @media (max-width: 600px) {
      font-size: 14px;
    }
  }
  @media (max-width: 600px) {
    width: 100%;
    font-size: 14px;
    padding: 0;
    padding-left: 4px;
    padding-right: 4px;
  }
`;

const StyledInlineContainer = styled.div`
  width: ${(props: {
    padding: string;
    width: string;
    borderColor: string;
    margin: string;
    focus: boolean;
  }) => (typeof props.width === 'number' ? `${props.width}px` : props.width)};
  background: transparent;
  padding: ${(props) => props.padding || '0 8px'};
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid
    ${(props) => (props.focus ? '#fff' : props.borderColor || 'rgba(0, 0, 0, .1)')};
  margin: ${(props) => props.margin};
  button {
    margin: auto;
  }
  @media (max-width: 600px) {
    font-size: 14px;
  }
  .innerContainer {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    position: relative;
    ::before {
      left: 0;
      right: 0;
      bottom: 0;
      content: ' ';
      position: absolute;
      transition: border-bottom-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
      border-bottom: 1px solid ${(props) => (props.focus ? '#fff' : 'rgba(255, 255, 255, 0.7)')};
      pointer-events: none;
      width: 100%;
    }
    ::after {
      left: 0;
      right: 0;
      bottom: 0;
      content: ' ';
      position: absolute;
      transform: ${(props) => (props.focus ? 'scaleX(1)' : 'scaleX(0)')};
      transition: transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
      border-bottom: 2px solid ${(props) => props.theme.color.primary.main};
      pointer-events: none;
      width: 100%;
    }
  }
`;

const StyledStartAdornment = styled.div`
  width: 100%;
  text-align: left;
  font-size: 16px;
  font-family: 'Noto Sans SC', sans-serif;
  font-weight: 600;
  color: #000000;
  line-height: 22px;
`;

export default Input;
