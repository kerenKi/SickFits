import React, { Component } from 'react';
import formatMoney from '../lib/formatMoney';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const CartItemStyles = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid ${props => props.theme.lightgrey};
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto;
  img {
    margin-right: 10px;
  }
  h3, p {
    margin: 0;
  }
`;

const CartItem = (props) => {
  const { item } = props.cartItem
    return (
      <CartItemStyles>
        <img width="100" src={item.image} alt={item.title}/>
        <div className="cart-item-details">
          <h3>{item.title}</h3>
          <p>
            {formatMoney(item.price * props.cartItem.quantity)}
            {' - '}
            <em>
              {props.cartItem.quantity} &times; {formatMoney(item.price)} each
            </em>
          </p>
        </div>
      </CartItemStyles>
    )
}

CartItem.propTypes = {
  cartItem: PropTypes.object.isRequired,
}

export default CartItem;