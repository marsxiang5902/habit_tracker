import { updateEvent } from "../services/eventServices";

async function checkStack(context, id) {
    //loop through stacks
    let stacks = Object.values(context.timedEvents.stack)
    for (let i = 0; i < stacks.length; i++) {
        const element = stacks[i];
        let temp = [...element.eventList]
        for (let j = 0; j < element.eventList.length; j++) {
            const curr_id = element.eventList[j];
            if (curr_id === id) {
                temp.splice(j, 1)
            }
        }
        context = await updateEvent(context, element, { eventList: temp })
    }
    return context
}

async function checkGoal(context, id) {
    //loop through stacks
    let goals = Object.values(context.timedEvents.goal)
    for (let i = 0; i < goals.length; i++) {
        const element = goals[i];
        let temp = element.goalTarget
        if (temp.event_id === id) {
            temp.event_id = ""
            temp.formField = ""
            temp.value = 0
        }
        context = await updateEvent(context, element, { 'goalTarget': temp })
    }
    return context
}

export {checkStack, checkGoal};