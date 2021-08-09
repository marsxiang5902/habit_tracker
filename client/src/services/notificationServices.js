function checkNotification(context){
    console.log(context)
    if (Notification.permission === 'granted'){
        newNotification(context)
    }
    else if (Notification.permission !== 'denied'){
        Notification.requestPermission().then(permission => {
            if (permission === 'granted'){
                newNotification(context)
            }
        })
    }
    return
}

function newNotification(context){
    let title = "Habits"
    let icon = "https://i.ytimg.com/vi/uwMGMEYYFZw/maxresdefault.jpg"
    let body = "Push yourself to choose long term over short term"
    const notification = new Notification(title, {
        icon: icon,
        body: body
    })

    notification.onclick = (e) => {
        window.open(icon)
    }
}

export {checkNotification}