
function Person (name, foods) {
    this.name = name
    this.foods = foods
}

Person.prototype.fetchFavFood = function() {
    return new Promise((resolve, reject) => {
        setTimeout(()=>{resolve(this.foods)}, 2000)
    })
}

describe('mocking learning', () => {
    it('Mocks a reg function', () => {
        const fetchDogs = jest.fn()
        fetchDogs('snickers')
        expect(fetchDogs).toHaveBeenCalledTimes(1)
        expect(fetchDogs).toHaveBeenCalledWith('snickers')

        fetchDogs('Berta')
        expect(fetchDogs).toHaveBeenCalledTimes(2)
        expect(fetchDogs).toHaveBeenLastCalledWith('Berta')
    })

    it('can create a person', () => {
        const me = new Person('Wes', ['pizza', 'burgs'])
        expect(me.name).toBe('Wes')
    })

    it('can fetch food', async () => {
        const me = new Person('Wes', ['pizza', 'burgs'])
        //mock the fetchFavFood function 
        me.fetchFavFood = jest.fn().mockResolvedValue(['sushi', 'ramen', 'pizza'])
        const favFoods = await me.fetchFavFood()
        // console.log(favFoods);
        expect(favFoods).toContain('pizza')
    })
})