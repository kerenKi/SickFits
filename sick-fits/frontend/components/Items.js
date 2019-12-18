import React, { Component } from 'react';
// Imports for making a query
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

//It's best practice to put all queries in caps
//queries should be named so it is easy to call them the same as their variable
const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY {
    items {
      id
      title
      price
      description
      image
      largeImage
    }
  }
`;

//we use the query through render props - we have a Query component that takes our ALL_ITEMS_QUERY as a prop
//The only child of a query component must be a function
class Items extends Component {
  render() {
    return (
      <div>
        <p>Items!</p>
        <Query query={ALL_ITEMS_QUERY}>
          {(payload) => {
            console.log(payload)
            return <p>Hi! Query</p>
          }}
        </Query>
      </div>
    );
  }
}

export default Items;