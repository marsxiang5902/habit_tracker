import makeRequest from "../api/makeRequest"

function updateTimedEvents(context, type, data){
    let timedEvents = {
      loading: true,
      habit: type === "habit" ? data : context.timedEvents.habit,
      todo: type === "todo" ? data : context.timedEvents.todo,
      cue: type === "cue" ? data : context.timedEvents.cue
    }
    let newContext = {
      session: context.session,
      timedEvents: timedEvents
    }
    return(newContext)
}

async function deleteData(context, index, type){
  console.log(context)
  let data = context.timedEvents[type]
    let id = data[index]._id
    const url = `events/${id}`
    await makeRequest(url, 'delete', {}, context.session.jwt)
    data.splice(index, 1)

    let newContext = updateTimedEvents(context, type, data)
    return newContext
  }

async function changeData(context, updatedValue, index, type){
  console.log(context)
  let data = context.timedEvents[type]
  let id = data[index]._id
  const url = `events/${id}`
  await makeRequest(url, 'put', updatedValue, context.session.jwt)
  if (type === 'cue') {
    for (let key in updatedValue) {
      data[index][key] = updatedValue[key]
    }
  }
  else{
    data[index].name = updatedValue.name
  }

  let newContext = updateTimedEvents(context, type, data)

  return newContext
}



async function addData(context, text, type, link){
  console.log(context)
  let newData;
  let data = context.timedEvents[type]
  if (type === 'cue') {
    newData = ({ user: context.session.user, name: text, type: type, args: { resourceURL: link } })
  }
  else {
    newData = ({ user: context.session.user, name: text, type: type})
  }
  const url = `events/`
  let newEvent = await makeRequest(url, 'post', newData, context.session.jwt)

  data.push(newEvent.data)

  let newContext = updateTimedEvents(context, type, data)

  return newContext
}


async function checkHabit(context, value, index){
  let habits = context.timedEvents.habit
  const url = `events/${habits[index]._id}/history`
  habits[index].history[0] = value
  await makeRequest(url, 'put', { 0: value }, context.session.jwt)

  let newContext = updateTimedEvents(context, 'habit', habits)
  return newContext
}

export{deleteData, addData, changeData, checkHabit}