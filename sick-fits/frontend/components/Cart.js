import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { adopt } from 'react-adopt';
import User from './User';
import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import SickButton from './styles/CartStyles';
import CartItem from './CartItem';
import calcTotalPrice from '../lib/calcTotalPrice'
import formatMoney from '../lib/formatMoney';


const LOCAL_STATE_QUERY = gql`
  query LOCAL_STATE_QUERY {
    cartOpen @client
  }
`;

const TOGGLE_CART_MUTATION = gql`
  mutation TOGGLE_CART_MUTATION {
    toggleCart @client
  }
`;
// using react adopt to compose all the different components and avoid nesting
const Composed = adopt({
  user: <User/>,
  toggleCart: <Mutation mutation={ TOGGLE_CART_MUTATION }/>,
  localState: <Query query={ LOCAL_STATE_QUERY }/>
})

const Cart = (props) => {
    return (
      <Composed>
        {(payload) => {
          const { user, toggleCart, localState } = payload
          const me = user.data.me
          console.log(me)
          if(!me) {
            return null
          }
          return (
            <CartStyles open={localState.data.cartOpen}>
            <header>
              <CloseButton title="close" onClick={toggleCart}>&times;</CloseButton>
              <Supreme> {me.name}'s cart </Supreme>
              <p> You have {me.cart.length} item{me.cart.length == 1 ? '' : 's'} in your cart</p>
            </header>
            <ul>
              {me.cart.map(cartItem => <CartItem key={cartItem.id} cartItem={cartItem}/>)}
            </ul>
            <footer>
              <p>{formatMoney(calcTotalPrice(me.cart))}</p>
              <SickButton>Checkout</SickButton>
            </footer>
          </CartStyles>
          )
      }}
      </Composed>
    );

}

export default Cart;
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION };