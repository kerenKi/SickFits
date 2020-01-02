import React, { Component } from 'react';
import { CURRENT_USER_QUERY } from './User';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION ($id: ID!) {
    removeFromCart (id: $id) {
      id
    }
  }
`;

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: ${ props => props.theme.red };
    cursor: pointer;
  }
`;

class RemoveFromCart extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
  }

  // update gets called when the response coe back from the server after a nutation
  update =  (cache, payload) => {
    //read the cache
    const data = cache.readQuery({ query : CURRENT_USER_QUERY })
    console.log(data)
    //remove item from cart
    const itemToRemoveId = payload.data.removeFromCart.id
    data.me.cart = data.me.cart.filter( item => item.id !== itemToRemoveId)
    //write back to cache
    cache.writeQuery({ query : CURRENT_USER_QUERY, data: data })
  }

  render() {
    return (
      <Mutation
        mutation={ REMOVE_FROM_CART_MUTATION }
        variables={{ id: this.props.id }}
        update={this.update}
        optimisticResponse={{
          __typename: 'Mutation',
          removeFromCart: {
            __typename: 'CartItem',
            id: this.props.id,
          }
        }}
        >
        {(removeFromCart, { loading }) => (
          <BigButton
            title="Delete Item"
            onClick={()=> {
              removeFromCart().catch(err => alert(err.message))
            }}
            disabled={loading}
          >&times;</BigButton>
        )}
      </Mutation>
    );
  }
}

export default RemoveFromCart;