import { eventIsActivated } from '../lib/eventIsActivated';
import { getDay, getMin } from '../lib/time';
import { sendNotification } from './sendNotification';

export default function subscribeToNotifications(dayStartTime, getAllEvents, notificationCallback) {
    let notified = new Set()
    let interval = setInterval(() => {
        let min = getMin(), day = getDay(dayStartTime)
        let allEvents = getAllEvents()
        for (let _id in allEvents) {
            let eventRecord = allEvents[_id]
            if (eventIsActivated(eventRecord, day, min, dayStartTime) &&
                min === eventRecord.activationTime && !notified.has(eventRecord._id)) {
                notified.add(eventRecord._id)
                sendNotification(eventRecord.name, '', '', notificationCallback)
            }
        }
    }, 1000 * 10)
    return () => clearInterval(interval)
}

// daystarttime, callback, getallEvents