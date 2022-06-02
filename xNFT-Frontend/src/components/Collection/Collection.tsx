import React from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import Button from '@components/Button';
import { useHistory } from 'react-router-dom';
import MultiBottomIcon from '@assets/img/multiBottom.png';
import Spacer from '../Spacer';
import Collections from '@assets/img/collection.png';
import BlindBox from '@assets/img/blind-box.png';
import Transaction from '@assets/img/transaction.png';
import User from '@assets/img/user.png';
import Follow from '@assets/img/follow.png';

interface CollectionProps {
  collections: string;
  blindsbox: string;
  transactions: string;
  users: string;
}

const Collection: React.FC<CollectionProps> = (props) => {
  const intl = useIntl();
  const history = useHistory();
  return (
    <>
      <ContainerTotal>
        <Container>
          <Spacer size="md" />
          <img src={Collections} alt="" />
          <Spacer size="sm" />
          <span className="num">12324</span>
          <span className="name">藏品</span>
        </Container>
        <Container>
          <Spacer size="md" />
          <img src={BlindBox} alt="" />
          <Spacer size="sm" />
          <span className="num">12324</span>
          <span className="name">藏品</span>
        </Container>
        <Container>
          <Spacer size="md" />
          <img src={Transaction} alt="" />
          <Spacer size="sm" />
          <span className="num">12324</span>
          <span className="name">藏品</span>
        </Container>
        <Container>
          <Spacer size="md" />
          <img src={User} alt="" />
          <Spacer size="sm" />
          <span className="num">12324</span>
          <span className="name">藏品</span>
        </Container>
        <Container>
          <Spacer size="md" />
          <img src={Follow} alt="" />
          <Spacer size="sm" />
          <span className="num">12324</span>
          <span className="name">藏品</span>
        </Container>
      </ContainerTotal>
    </>
  );
};
const ContainerTotal = styled.div`
  display:flex;
  flex-deirection:row;
  width: 1070px;
  height: 178px;
  background: #FFFFFF;
  box-shadow: 0px 1px 30px 0px rgba(31, 43, 77, 0.08);
  border-radius: 16px;
  }
`;

const Container = styled.div`
  width: 100%;
  max-width: ${(props) => props.theme.maxWidth}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    width: 64px;
    height: 64px;
  }
  .num {
    font-size: 24px;
    font-family: 'Noto Sans SC', sans-serif;
    font-weight: 600;
    color: #000000;
    line-height: 28px;
  }
  .name {
    font-size: 14px;
    font-family: 'Noto Sans SC', sans-serif;
    font-weight: 600;
    color: #000000;
    line-height: 24px;
  }
`;
export default Collection;
