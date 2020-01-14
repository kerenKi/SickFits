import { mount } from "enzyme";
import wait from "waait";
import Router from 'next/router';
import Pagination, { PAGINATION_QUERY } from "../components/Pagination";
import { CURRENT_USER_QUERY } from "../components/User";
import { MockedProvider } from "react-apollo/test-utils";
import { fakeUser, fakeCartItem } from "../lib/testUtils";
import toJSON from "enzyme-to-json";

//mocking the router because we are using a link inside the pagination
// setting it up so push and prefetch does nothing
Router.router = {
  push() {},
  prefetch() {},
}

function MakeMocksFor(length) {
  return [
    {
      request: { query: PAGINATION_QUERY },
      result: {
        data: {
          itemsConnection: {
            __typename: 'aggregate',
            aggregate: {
              __typename: 'count',
              count: length,
            }
          }
        }
      }
    }
  ];
}

describe('<Pagination/>', () => {
  it('displays a loading message', () => {
    const wrapper = mount( 
      <MockedProvider mocks={MakeMocksFor(1)}>
        <Pagination page={1}/>
      </MockedProvider>
    )
    // console.log('wrapper.debug() :', wrapper.debug());
    const pagination = wrapper.find('[data-test="pagination"]')
    expect(wrapper.text()).toContain('Loading...')
  })

  it('renders pagination for 18 items', async () => {
    const wrapper = mount( 
      <MockedProvider mocks={MakeMocksFor(18)}>
        <Pagination page={1}/>
      </MockedProvider>
    )
    await wait()
    wrapper.update()
    const totalPages = wrapper.find('.totalPages')
    expect(totalPages.text()).toEqual('5')
    const pagination = wrapper.find('div[data-test="pagination"]')
      // console.log('pagination.debug() :', pagination.debug());
    expect(toJSON(pagination)).toMatchSnapshot()
  })
})

