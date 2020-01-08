describe('sample test 101', () => {
    console.log('running test now');
    it('works as expected', () => {
        const age = 100
        expect(1).toEqual(1)
        expect(age).toEqual(100)
    })

    it('handles ranges', () => {
        const age = 200
        expect(age).toBeGreaterThan(100)
    })

    it('test some dogs arrays', () => {
        const dogs = ['Berta', 'Archi']
        expect(dogs).toHaveLength(2)
        expect(dogs).toContain('Berta')
    })
})