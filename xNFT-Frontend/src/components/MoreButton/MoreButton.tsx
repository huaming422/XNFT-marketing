import React, { useContext, useMemo } from 'react';
import { useIntl } from 'react-intl';
import styled, { ThemeContext } from 'styled-components';
import Loading from '../Loading';
import useMedia from 'use-media';
interface ButtonProps {
  disabled?: boolean;
  onClick: Function;
  loading: boolean;
}

const MoreButton: React.FC<ButtonProps> = ({ onClick, disabled, loading = false }) => {
  const intl = useIntl();
  const isMobile = useMedia({ maxWidth: '600px' });
  return (
    <StyledLoadMoreButton
      disabled={disabled}
      onClick={() => {
        onClick();
      }}
    >
      {disabled ? (
        <span className="label">{intl.formatMessage({ id: 'common.no.more' })}</span>
      ) : loading ? (
        <Loading />
      ) : (
        <span className="label">{intl.formatMessage({ id: 'common.load.more' })}</span>
      )}
    </StyledLoadMoreButton>
  );
};

const StyledLoadMoreButton = styled.div`
  margin: 0 auto;
  .label {
    display: inline-block;
    height: 96px;
    line-height: 96px;
    font-size: 16px;
    font-family: 'Noto Sans SC', sans-serif;
    font-weight: 500;
    color: ${(props: { disabled: boolean }) => (props.disabled ? '#666' : '#0079ff')};
    cursor: ${(props: { disabled: boolean }) => (props.disabled ? 'not-allowed' : 'pointer')};
    @media (max-width: 600px) {
      display: inline-block;
      height: 18px;
      line-height: 18px;
      font-size: 12px;
      font-weight: 500;
      line-height: 18px;
      color: ${(props: { disabled: boolean }) => (props.disabled ? '#666' : '#0079ff')};
      cursor: ${(props: { disabled: boolean }) => (props.disabled ? 'not-allowed' : 'pointer')};
    }
  }
`;

export default MoreButton;
