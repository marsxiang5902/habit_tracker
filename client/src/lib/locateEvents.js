function getEventById(context, _id) {
    for (let type in context.timedEvents) {
        let ar = context.timedEvents[type]
        if (_id in ar) {
            return ar[_id]
        }
    } return null
}
function getAllEvents(context) {
    let ret = {}
    for (let type in context.timedEvents) {
        let ar = context.timedEvents[type]
        for (let _id in ar) {
            ret[_id] = ar[_id]
        }
    } return ret
}
export { getEventById, getAllEvents }