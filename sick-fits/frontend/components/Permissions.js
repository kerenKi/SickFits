import React, { Component } from 'react';
import { Query } from 'react-apollo';
import Error from './ErrorMessage';
import gql from 'graphql-tag';
import Table from './styles/Table';
import SickButton from './styles/SickButton';
import PropTypes from 'prop-types';


const possiblePermissions = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE',
]

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
        console.log(data)

        return (
          <div>
            <Error error={error}/>
            <div>
              <h2>Manage Permissions</h2>
              <Table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    {possiblePermissions.map(
                      permission => <th key={permission}>{permission}</th>
                    )}
                    <th>👇🏻</th>
                  </tr>
                </thead>
                <tbody>
                  {data.users.map(user => <UserPermissions key={user.id} user={user}/>)}
                </tbody>
              </Table>
            </div>
          </div>
        )
      }}
    </Query>
  )
}

class UserPermissions extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      id: PropTypes.string,
      permissions: PropTypes.array,
    }).isRequired
  }

  state= {
    permissions: this.props.user.permissions,
  }

  handlePermissionChange = (event) => {
    const checkbox = event.target
    let updatedPermissions = [...this.state.permissions]
    if(checkbox.checked) {
      //add in the value to permissions list
      updatedPermissions.push(checkbox.value)
    } else {
      //remove the permission from the list
      updatedPermissions = updatedPermissions.filter( permission => permission !== checkbox.value)
    }

    this.setState({
      permissions: updatedPermissions,
    })
  }

  render() {
    const user = this.props.user
    return (
      <tr>
        <td>{user.name}</td>
        <td>{user.email}</td>
        {possiblePermissions.map( permission => (
          <td key={permission}>
            <label htmlFor={`${user.id}-permission-${permission}`}>
              <input
                id={`${user.id}-permission-${permission}`}
                type="checkbox"
                checked={this.state.permissions.includes(permission)}
                value={permission}
                onChange={this.handlePermissionChange}
              />
            </label>
          </td>
          ))}
          <td>
            <SickButton> Update</SickButton>
          </td>
      </tr>
    )
  }

}

export default Permissions;

