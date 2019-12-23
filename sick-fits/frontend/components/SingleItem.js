import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Error from './ErrorMessage';

const SINGE_ITEM_QUERY = gql`
  query SINGE_ITEM_QUERY ($id: ID!){
    item(where: { id : $id }) {
      id
      title
      description
      largeImage
    }
  }
`;

class SingleItem extends Component {
  render() {
    return (
      <Query 
        query={SINGE_ITEM_QUERY}
        variables={{
          id: this.props.id
        }}
        >
        {({error, loading, data}) => {
          if (error) {
            return <Error error={error}/>
          }
          if (loading) {
            return <p>Loading...</p>
          }
          if (!data.item) {
          return <p> No Item Found for {this.props.id}</p>
          }
          return <p> single item</p>
        }}
      </Query>
    );
  }
}

export default SingleItem;
