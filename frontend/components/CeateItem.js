import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';

import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';
import { FieldsOnCorrectType } from 'graphql/validation/rules/FieldsOnCorrectType';


const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;


class CeateItem extends Component {
  state = {
    title:'',
    description:'',
    image: '',
    largeImage: '',
    price: 0
  };

  // THis right here is nice - allows for multiple handlers for different states in a single function
  handleChange = (ev) => {
    const { name, type, value} = ev.target;
    const val = type === 'number' ? parseFloat(value): value;
    this.setState({ [name]: val}); // matches name to corresponding state and sets to value of target, computed property names
  };


  // Uploading of Images to Cloudinary
  uploadFile = async e => {
    console.log("Inside File upload");
    const files = e.target.files;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'sickfits2');

    const res = await fetch('https://api.cloudinary.com/v1_1/ddzewcsfg/image/upload', {
      method: 'POST',
      body: data,
    });
    const file = await res.json();
    console.log(file);
    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url
    })
  };

  render() {
    return (
    // Wrap whole form in the mutation created above to expose it to the form
    <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>{(createItem, {loading, error}) => (
      <Form onSubmit={ async (ev) => {
        // stop default submit
        ev.preventDefault();
        // call mutattion to create item
        const res = await createItem();
        // route to single item page post creation
          Router.push({
            pathname: '/item',
            query: {id: res.data.createItem.id}
          })
        }}>
        <Error error={error}/>
        <fieldset disabled={loading} aria-busy={loading}>
          <label htmlFor="file">
            Image
          <input type="file" id="file" name="file" placeholder="Upload an Image" required onChange={this.uploadFile}/>
          {this.state.image && <img src={this.state.image} alt="Upload Preview"/>}
          </label>
          <label htmlFor="title">
            Title
            <input type="title" id="title" name="title" placeholder="Title" required value={this.state.title} onChange={this.handleChange}/>
          </label>
          <label htmlFor="price">
            Price
            <input type="number" id="price" name="price" placeholder="Price" required value={this.state.price} onChange={this.handleChange}/>
          </label>
          <label htmlFor="description">
            Description
            <textarea id="description" name="description" placeholder="Enter a Description" required value={this.state.description} onChange={this.handleChange}/>
          </label>
          <button type="submit">Submit</button>
        </fieldset>
      </Form>
      )}
    </Mutation>
    )
  }
}

export default CeateItem;
export { CREATE_ITEM_MUTATION };