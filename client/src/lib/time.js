function getMin() {
    let d = new Date()
    return d.getMinutes() + d.getHours() * 60
}
function getDay() {
    return (new Date().getDay() + 6) % 7
}
export { getMin, getDay }