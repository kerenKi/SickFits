import formatMoney from '../lib/formatMoney';

describe('formatMoney function', () => {
    it('Works with fractional dollars', () => {
        expect(formatMoney(1)).toEqual('$0.01');
        expect(formatMoney(10)).toEqual('$0.10');
        expect(formatMoney(9)).toEqual('$0.09');
        expect(formatMoney(40)).toEqual('$0.40');
    })

    it('Leaves cents off for whole dollars', () => {
        expect(formatMoney(900)).toEqual('$9');
        expect(formatMoney(5000)).toEqual('$50');
        expect(formatMoney(3000000)).toEqual('$30,000');
    })

    it('Works with whole and fractional dollars', () => {
        expect(formatMoney(50430)).toEqual('$504.30');
        expect(formatMoney(101)).toEqual('$1.01');
        expect(formatMoney(2345)).toEqual('$23.45');
    })
})