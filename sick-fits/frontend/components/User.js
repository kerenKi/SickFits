import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import Error from './ErrorMessage';
import styled from 'styled-components';
import Head from 'next/head'


const CURRENT_USER_QUERY = gql`
  query CURRENT_USER_QUERY {
    me {
      id
      email
      name
      cart {
        id
        quantity
        item {
          id
          title
          image
          price
          description
        }
      }
    }
  }
`;

const User = (props) => (
  <Query  {...props} query={CURRENT_USER_QUERY}>
    {payload => props.children(payload) }
  </Query>
)

User.propTypes = {
  children: PropTypes.func.isRequired,
}
export default User;
export { CURRENT_USER_QUERY };