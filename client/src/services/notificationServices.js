function checkNotification(title, icon, body, callback) {
    if (Notification.permission === 'granted') {
        newNotification(title, icon, body, callback)
    }
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                newNotification(title, icon, body, callback)
            }
        })
    }
    return
}

function newNotification(title, icon, body, callback) {
    // let title = "Habits"
    // let icon = "https://i.ytimg.com/vi/uwMGMEYYFZw/maxresdefault.jpg"
    // let body = "Push yourself to choose long term over short term"
    console.log(title, icon, body)
    const notification = new Notification(title, { title, icon, body })
    notification.onclick = (e) => {
        window.parent.parent.focus();
        callback()
    }
}

export { checkNotification }