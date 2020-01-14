import { mount } from 'enzyme';
import wait from 'waait';
import PleaseSignIn from '../components/PleaseSignin';
import { CURRENT_USER_QUERY } from '../components/User';
import { MockedProvider } from 'react-apollo/test-utils';
import { fakeUser } from '../lib/testUtils';

const notSignedInMocks = [
  {
    request: {
      query: CURRENT_USER_QUERY,
    },
    result: {
      data: { me: null }
    },
  }
]

const SignedInMocks = [
  {
    request: {
      query: CURRENT_USER_QUERY,
    },
    result: {
      data: { me: fakeUser(),}
    }
  }
]

describe('<PleaseSignIn/>', () => {
  it('renders the signed in dialog to logged out users', async () => {
    const wrapper = mount(
      <MockedProvider mocks={notSignedInMocks}>
        <PleaseSignIn/>
      </MockedProvider>
    )
    // console.log(wrapper.debug());
    await wait()
    wrapper.update()
    expect(wrapper.text()).toContain('Please Sign In')
    expect(wrapper.find('Signin').exists()).toBe(true)
    // console.log(wrapper.text());
    // console.log(wrapper.debug());
  })

  it('renders the child component when the user is signed in', async () => {
    const ChildComponent = () => <p>This is the child component</p>
    
    const wrapper = mount(
      <MockedProvider mocks={SignedInMocks}>
        <PleaseSignIn>
          <ChildComponent/>
        </PleaseSignIn>
      </MockedProvider>
    )
    await wait()
    wrapper.update()
    // console.log(wrapper.debug());
    //giving a selector to find the component
    expect(wrapper.find('ChildComponent').exists()).toBe(true)
    //passing the component itself
    expect(wrapper.contains(<ChildComponent/>)).toBe(true)

  })
})