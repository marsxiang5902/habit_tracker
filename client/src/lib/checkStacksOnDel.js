import { updateEvent } from "../services/eventServices";

async function checkStack(context, id) {
    //loop through stacks
    let stacks = Object.values(context.timedEvents.stack)
    for (let i = 0; i < stacks.length; i++) {
        const element = stacks[i];
        let temp = [...element.eventList]
        for (let j = 0; j < element.eventList.length; j++) {
            const curr_id = element.eventList[j];
            console.log(curr_id)
            console.log(id)
            if (curr_id === id) {
                temp.splice(j, 1)
            }
        }
        context = await updateEvent(context, element, { eventList: temp })
    }
    return context
}

export default checkStack