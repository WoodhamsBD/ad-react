import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';

import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';
import { FieldsOnCorrectType } from 'graphql/validation/rules/FieldsOnCorrectType';


// Item query - find item that will be updated
const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id}) {
      id
      title
      description
      price
    }
  }
`


// Update Mutation
const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      price
      description
    }
  }
`;


class UpdateItem extends Component {
  state = {};

  // THis right here is nice - allows for multiple handlers for different states in a single function
  handleChange = (ev) => {
    const { name, type, value} = ev.target;
    const val = type === 'number' ? parseFloat(value): value;
    this.setState({ [name]: val}); // matches name to corresponding state and sets to value of target, computed property names
  };

  updateItem = async (e, updateItemMutation) => {
    e.preventDefault();
    const res = await updateItemMutation({
      variables: {
        id: this.props.id,
        ...this.state,
      }
    })
  }

  render() {
    return (
    // Here is the query to find the itme that we are updating on the page
    <Query query={SINGLE_ITEM_QUERY} variables={{id: this.props.id}}>
      {({data,loading}) => {
        if(loading) return <p>Loading....</p>;
        if(!data.item) return <p>No matching item found</p>
        return (
          // Wrap whole form in the mutation created above to expose it to the form
          <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>{(updateItem, {loading, error}) => (
            <Form onSubmit={e => this.updateItem(e, updateItem)}>
              <Error error={error}/>
              <fieldset disabled={loading} aria-busy={loading}>
                <label htmlFor="title">
                  Title
                  <input type="title" id="title" name="title" placeholder="Title" required defaultValue={data.item.title} onChange={this.handleChange}/>
                </label>
                <label htmlFor="price">
                  Price
                  <input type="number" id="price" name="price" placeholder="Price" required defaultValue={data.item.price} onChange={this.handleChange}/>
                </label>
                <label htmlFor="description">
                  Description
                  <textarea id="description" name="description" placeholder="Enter a Description" required defaultValue={data.item.description} onChange={this.handleChange}/>
                </label>
                <button type="submit">Save Changes</button>
              </fieldset>
            </Form>
            )}
          </Mutation>
          )
        }}
      </Query>
    )
  }
}

export default UpdateItem;
export { UPDATE_ITEM_MUTATION };