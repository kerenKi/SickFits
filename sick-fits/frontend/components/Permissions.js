import React, { Component } from 'react';
import { Query } from 'react-apollo';
import Error from './ErrorMessage';
import gql from 'graphql-tag';
import  Signin  from './Signin'

const ALL_USERS_QUERY = gql`
  query ALL_USERS_QUERY {
    users {
      id
      name
      email
      permissions
    }
  }
`;

const Permissions = props => {
  return (
    <Query query={ ALL_USERS_QUERY }>
      { payload => {
        const { data, loading, error } = payload
        // if(loading) { return <p>Loading...</p>}
        // if(!data.me) {
        //   return (
        //     <div>
        //       <p> Please Sign In </p>
        //       <Signin/>
        //     </div>
        //   )
        // }
        return (
          <div>
            <Error error={error}/>
            <p>Hey</p>
          </div>
        )
      }}
    </Query>
  )
}

export default Permissions;

