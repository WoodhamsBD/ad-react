import React, { Component } from 'react';
import { Mutation} from 'react-apollo';
import gql from 'graphql-tag';

import { ALL_ITEMS_QUERY } from './Items';

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

class DeleteItem extends Component {
  update = (cache, payload) => {
    // manually update cache to match server
    //First find all of the items in cache
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY});
    // now filter out delted item
    data.items = data.items.filter(item => item.id !== payload.data.deleteItem.id);
    // put items back
    cache.writeQuery({query: ALL_ITEMS_QUERY, data});
  }
  render() {
    return (
      <Mutation mutation={DELETE_ITEM_MUTATION} variables={{id: this.props.id}} update={this.update}>
        {(deleteItem, {error }) => (
          <button onClick={() => {
            if(confirm("Are you sure you want to delete this")) {
              deleteItem();
            }
          }}>Delete item</button>
        )}
      </Mutation>
    );
  }
}

export default DeleteItem;