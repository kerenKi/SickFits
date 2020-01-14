import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import SingleItem, { SINGE_ITEM_QUERY } from '../components/SingleItem';
import { MockedProvider } from 'react-apollo/test-utils';
import { fakeItem } from '../lib/testUtils';

describe('<SingleItem/>', () => {
  it('renders with proper data', async () => {
      const mocks = [
        {
          //when someone makes a request with this data combo 
          request: {
            query: SINGE_ITEM_QUERY,
            variables: { id: '123'},
          },
          //return this data (which is mocked)
          result: {
            data: {
              item: fakeItem(),
            },
          },
        },
      ]
      const wrapper = mount(
        //Mock the apollo provider that wraps the entire app
          <MockedProvider mocks={mocks}>
            <SingleItem id="123"/>
          </MockedProvider>
      )

      expect(wrapper.text()).toContain('Loading...')
      await wait()
      wrapper.update()
      // console.log(wrapper.debug());
      expect(wrapper.text()).toContain(fakeItem().title)
      expect(toJSON(wrapper.find('h2'))).toMatchSnapshot()
      expect(toJSON(wrapper.find('img'))).toMatchSnapshot()
      expect(toJSON(wrapper.find('p'))).toMatchSnapshot()
  })

  it('Errors when item was not found', async () => {
    const mocks = [
      {
        request: {
          query: SINGE_ITEM_QUERY,
          variables: { id: '123'},
        },
        result: {
          errors: [ 
            {message: 'Item Not Found'}
          ]
        }
      }
    ]

    const wrapper = mount(
      //Mock the apollo provider that wraps the entire app
        <MockedProvider mocks={mocks}>
          <SingleItem id="123"/>
        </MockedProvider>
    )
    
    await wait()
    wrapper.update()
    // console.log(wrapper.debug());
    const item = wrapper.find('[data-test="graphql-error"]')  
    // console.log(item.debug());
    expect(item.text()).toContain('Item Not Found')
    expect(toJSON(item)).toMatchSnapshot()
  })

 
})