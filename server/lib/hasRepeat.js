module.exports = function hasRepeat(ar) {
    return (new Set(ar)).size < ar.length
}