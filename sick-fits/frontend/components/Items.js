import React, { Component } from 'react';
// Imports for making a query
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';

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
        <Query query={ALL_ITEMS_QUERY}>
          {({data, error, loading}) => {
            console.log(data)
            if (loading) {
              return <p>Loading...</p>
            }
            if (error) {
            return <p> Error: {error.message}</p>
            }
            return <ItemsList>
              {data.items.map(item => <p> {item.title} </p>)}
            </ItemsList>
          }}
        </Query>
      </Center>
    );
  }
}

export default Items;