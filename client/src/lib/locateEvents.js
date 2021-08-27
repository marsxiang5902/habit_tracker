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
function getSomeEvents(context, types) {
    let ret = {}
    for (let type in context.timedEvents) {
        if (types.includes(type)){
            let ar = context.timedEvents[type]
            for (let _id in ar) {
                ret[_id] = ar[_id]
            }
        }
    } return ret
}

function getNumFormFields(context){
    let forms = getSomeEvents(context, ['form'])
    let ret = {}
    for (let form in forms){
        console.log(form)
        form = forms[form]
        for (let field in form.formLayout){
            console.log(field)
            let currFormField = form.formLayout[field]
            if (currFormField[1] === "num"){
                ret[currFormField[0]] = form.formData[currFormField[0]]
            }
        }
    }
    return ret
}
export { getEventById, getAllEvents, getSomeEvents, getNumFormFields }