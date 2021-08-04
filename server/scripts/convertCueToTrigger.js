/*
    for each event, if it is not a cue:
        add a triggerList

    for each event e, if it is a cue:
        t := trigger(e)
        add(t)

    for each user:
        delete user.eventLists.cue
    
    clean up unused events and triggers
*/


const { do_db_setup, get_events_col, get_users_col, get_triggers_col } = require('../database/db_setup')
const { updateEvent, getEvent } = require('../database/interactEvent');
const { getUserEvents, updateUser } = require('../database/interactUser');
const { cleanEvents, cleanTriggers } = require('../database/cleanUnused');
const { removeEvent } = require('../services/eventServices');
const { addTrigger } = require('../services/triggerServices');

function memegen2data(url) {
    let s = url.substring(39)
    let tt = '', bt = ''
    for (let i = 0; true; i++) {
        if (s[i] == '/') {
            s = s.substring(i + 1);
            break;
        }
        tt += s[i]
    }
    for (let i = 0; true; i++) {
        if (s[i] == '.') {
            s = s.substring(i + 16);
            break;
        }
        bt += s[i]
    }
    return [tt, bt, s]
}

let t2t = {
    image: "image",
    video: "video",
    music: "audio",
    call: "link",
    "": "link"
}

function cue2trigger(cueRecord) {
    //cue: id, user, type, name, historymanager, resourceURL (url, type, eventid)
    //trigger: _id, user, type, name, event_id, resourceURL
    let [url, cue_type, event_id] = cueRecord.resourceURL.split(' ')
    let triggerRecord = {
        _id: cueRecord._id,
        user: cueRecord.user,
        type: t2t[cue_type],
        name: cueRecord.name,
        event_id: event_id,
        resourceURL: url
    }
    if (cue_type == 'image') {
        if (url.startsWith('https://api.memegen.link/')) {
            let [tt, bt, s] = memegen2data(url)
            triggerRecord.resourceURL = s
            triggerRecord.topText = tt
            triggerRecord.bottomText = bt
        } else {
            triggerRecord.topText = ""
            triggerRecord.bottomText = ""

        }
    }
    return triggerRecord
}

async function getAllEvents() {
    return await (await get_events_col().find({})).toArray()
}

(async () => {
    await do_db_setup()
    let ar = await getAllEvents()
    for (let i = 0; i < ar.length; i++) {
        let eventRecord = ar[i]
        if (eventRecord.type != 'cue') {
            await updateEvent(eventRecord._id, eventRecord, { triggerList: [] })
        }
    }
    for (let i = 0; i < ar.length; i++) {
        let eventRecord = ar[i]
        if (eventRecord.type == 'cue') {
            let t = cue2trigger(eventRecord)
            let args = {
                resourceURL: t.resourceURL
            }
            if (t.type == 'image') {
                args.topText = t.topText
                args.bottomText = t.bottomText
            }
            t.args = args
            try {
                await addTrigger(t)
                await removeEvent(eventRecord._id, eventRecord)
            } catch (err) {
                console.log("error:", err, "\n\n", t, "\n\n", eventRecord, "\n\n\n\n")
            }
        }
    }
    await get_users_col().updateMany({}, { "$unset": { "eventLists.cue": "" } })
    await cleanEvents()
    await cleanTriggers()
    console.log('done')
})()