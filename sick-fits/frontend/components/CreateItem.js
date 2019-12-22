import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';
import { fil } from 'date-fns/locale';

//query for the mutation
const CREATE_ITEM_MUTATION = gql`
mutation CREATE_ITEM_MUTATION (
    $title: String!,
    $description: String!,
    $image: String,
    $largeImage: String,
    $price: Int!
) {
  createItem(
    title: $title,
    description: $description,
    image: $image,
    largeImage: $largeImage,
    price: $price
  ) {
    id
  }
}
`;

class CreateItem extends Component {
  state = {
    title: '',
    description: '',
    image: '',
    largeImage: '',
    price: 0,
  }
  handleChange = (event) => {
    const { name, type, value } = event.target
    const val = type === 'number' ? parseFloat(value) : value
    this.setState({
      ...this.state,
      [name]: val
    })
  }

  uploadFile = async (e) => {
    console.log('uploading file')
    const files = e.target.files
    const data = new FormData()
    data.append('file', files[0])
    //the preset from cloudinary:
    data.append('upload_preset', 'sickfits')

    //using the cloudinary api to upload an image
    const res = await fetch
    ('https://api.cloudinary.com/v1_1/kerenscloud/image/upload',
      {
      method: 'POST',
      body: data
    })
    const file =  await res.json()
    console.log(file)
    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url
    })
  }
  render() {
    return <Mutation mutation={ CREATE_ITEM_MUTATION } variables={this.state}> 
      { (createItem, {loading, error}) => (
        <Form onSubmit={ async (e) => {
          //stop the form from reloading
          e.preventDefault()
          //call the mutation
          const res = await createItem()
          console.log(res)
          //change them to the single item page
          Router.push({
            pathname:'/item',
            query: {id: res.data.createItem.id }
          })

        }}>
          <h2>Sell an Item</h2>
          <Error error={error}/>
          <fieldset disabled={loading} aria-busy={loading}>
            <label htmlFor="file">
              Image
              <input 
                type="file" 
                id="file" 
                name="file" 
                placeholder="Upload an image" 
                required
                onChange={this.uploadFile}
                />
                {this.state.image && <img src={this.state.image} alt="Upload preview"/>}
            </label>           
            <label htmlFor="title">
              Title
              <input 
                type="text" 
                id="title" 
                name="title" 
                placeholder="Title" 
                required
                value={this.state.title}
                onChange={this.handleChange}
                />
            </label>

            <label htmlFor="price">
              Price
              <input 
                type="number" 
                id="price" 
                name="price" 
                placeholder="Price" 
                required
                value={this.state.price}
                onChange={this.handleChange}
                />
            </label>

            <label htmlFor="description">
              Description
              <textarea 
                type="text" 
                id="description" 
                name="description" 
                placeholder="Enter A Description" 
                required
                value={this.state.description}
                onChange={this.handleChange}
                />
            </label>
            <button type="submit"> Submit</button>
          </fieldset>
        </Form>
    )}
    </Mutation> 
  }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };