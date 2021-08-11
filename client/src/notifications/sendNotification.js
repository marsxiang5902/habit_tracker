function sendNotification(title, icon, body, callback) {
    let run = () => {
        const notification = new Notification(title, { icon, body })
        notification.onclick = () => {
            window.parent.parent.focus();
            callback()
        }
    }
    if (Notification.permission === 'granted') {
        run()
    }
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                run()
            }
        })
    }
}


export { sendNotification }