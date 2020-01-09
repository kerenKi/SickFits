import ItemComponent from '../components/Item';
import { shallow } from 'enzyme';

const fakeItem = {
    id: 'ABC123',
    title: 'test item',
    description: 'An item for testing',
    image: 'image.jpg',
    price: 5000,
    largeImage: 'largeImage.jpg',
}

describe('<Item/>', () => {

    it('renders the priceTag and title properly', () => {
        const wrapper = shallow(<ItemComponent item={fakeItem}/>)
        // console.log(wrapper.debug());
        const PriceTag = wrapper.find('PriceTag')
        // console.log('PriceTag.text()', PriceTag.text());
        // console.log('PriceTag.dive().text()', PriceTag.dive().text());
        // console.log({
        //     children: PriceTag.children().debug()
        // });
        expect(PriceTag.children().text()).toBe('$50')
        expect(wrapper.find('Title a').text()).toBe(fakeItem.title)
    
    })

    it('renders the image properly', () => {
        const wrapper = shallow(<ItemComponent item={fakeItem}/>)
        const image = wrapper.find('img')
        // console.log(image.props());
        expect(image.props().alt).toBe(fakeItem.title)
    })

    it('renders the buttons properly', () => {
        const wrapper = shallow(<ItemComponent item={fakeItem}/>)
        const buttonList = wrapper.find('.buttonList')
        console.log(buttonList.debug());
        console.log(buttonList.children().debug());
        //check that buttonList has 3 buttons
        expect(buttonList.children()).toHaveLength(3)
        //check that Link is one of the buttons on buttonList
        expect(buttonList.find('Link')).toHaveLength(1)

        //check that AddToCart is one of the buttons on buttonList
        expect(buttonList.find('AddToCart').exists()).toBe(true)

        //check that DeleteItem is one of the buttons on buttonList
        expect(buttonList.find('DeleteItem').exists()).toBe(true)
    })
})