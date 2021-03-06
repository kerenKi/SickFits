import React, { Component } from 'react';
// Imports for making a query
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import styled from 'styled-components';
import Pagination from './Pagination';
import Item from './Item';
import { perPage } from '../config';


//It's best practice to put all queries in caps
//queries should be named so it is easy to call them the same as their variable
const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY (
    $skip: Int = 0,
    $first: Int = ${perPage}
    ) {
    items (first: $first, skip:$skip, orderBy: createdAt_DESC) {
      id
      title
      price
      description
      image
      largeImage
    }
  }
`;

const Center = styled.div`
  text-align: center;
`;

const ItemsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: ${ props => props.theme.maxWidth};
  margin: 0 auto;
`;

//we use the query through render props - we have a Query component that takes our ALL_ITEMS_QUERY as a prop
//The only child of a query component must be a function
class Items extends Component {
  render() {
    return (
      <Center>
        <Pagination page={this.props.page}/>
        <Query query={ALL_ITEMS_QUERY} variables={{
          skip: this.props.page * perPage - perPage,
        }}>
          {(payload) => {
            //Deconstruct the payload
            const {data, error, loading} = payload
            if (loading) {
              return <p>Loading...</p>
            }
            if (error) {
            return <p>Error: {error.message}</p>
            }
            return <ItemsList>
              {data.items.map(item => <Item item={item} key={item.id}></Item>)}
            </ItemsList>
          }}
        </Query>
        <Pagination page={this.props.page}/>
      </Center>
    );
  }
}

export default Items;
export { ALL_ITEMS_QUERY };