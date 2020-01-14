import { mount } from "enzyme";
import wait from "waait";
import Nav from "../components/Nav";
import { CURRENT_USER_QUERY } from "../components/User";
import { MockedProvider } from "react-apollo/test-utils";
import { fakeUser, fakeCartItem } from "../lib/testUtils";
import toJSON from 'enzyme-to-json'


const notSignedInMocks = [
  {
    request: {
      query: CURRENT_USER_QUERY
    },
    result: {
      data: { me: null }
    }
  }
];

const SignedInMocks = [
  {
    request: {
      query: CURRENT_USER_QUERY
    },
    result: {
      data: { me: fakeUser() }
    }
  }
];

const SignedInMocksWithCartItems = [
  {
    request: {
      query: CURRENT_USER_QUERY
    },
    result: {
      data: { me: {
        ...fakeUser(),
        cart: [fakeCartItem(), fakeCartItem(), fakeCartItem(), fakeCartItem()]
      } }
    }
  }
];

describe('<Nav/>', () => {
  it('should render signin link if user is not logged in', async () => {
    const wrapper = mount(
      <MockedProvider mocks={notSignedInMocks}>
        <Nav/>
      </MockedProvider>
    )
    await wait()
    wrapper.update()
    // console.log('wrapper :', wrapper.debug());
    const link = wrapper.find('a')
    // console.log('link', link.debug())
    //check if there are 2 links when not signed in
    expect(wrapper.find('a')).toHaveLength(2)

    const nav = wrapper.find('ul[data-test="nav"]')
    // console.log('nav :', nav.debug()); 
    //screenshot test
    expect(toJSON(nav)).toMatchSnapshot()
  })

  it('renders full nav links when user is signed in', async () => {
    const wrapper = mount(
      <MockedProvider mocks={SignedInMocks}>
        <Nav/>
      </MockedProvider>
    )
    await wait()
    wrapper.update()
    // console.log('wrapper :', wrapper.debug());
    const nav = wrapper.find('ul[data-test="nav"]')
    // expect(toJSON(nav)).toMatchSnapshot()
    expect(nav.children().length).toBe(6)
    expect(nav.text()).toContain('Sign Out')

  })

  it('renders the amount of items in the cart', async () => {
    const wrapper = mount(
      <MockedProvider mocks={SignedInMocksWithCartItems}>
        <Nav/>
      </MockedProvider>
    )
    await wait()
    wrapper.update()
    // console.log('wrapper :', wrapper.debug());
    const nav = wrapper.find('[data-test="nav"]')
    const count = nav.find('div.count')
    // console.log('count :', count.text());
    expect(toJSON(count)).toMatchSnapshot()
  })
})