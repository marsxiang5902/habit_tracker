module.exports = {
    bit2obj: function bit2obj(bit, mx) {
        let obj = {}
        for (let i = 0; i < mx; i++) {
            obj[i] = (bit & 1 << i) > 0
        }
        return obj
    },
    obj2bit: function obj2bit(obj, mx) {
        let bit = 0
        for (let i = 0; i < mx; i++) {
            bit |= obj[i] << i
        }
        return bit
    }
}