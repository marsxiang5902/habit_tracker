function getURL(trigger) {
    if (trigger.type == 'image' && (trigger.topText || trigger.bottomText)) {
        return `https://api.memegen.link/images/custom/${trigger.topText.replace(" ", "_")}/${trigger.bottomText.replace(" ", "_")}.png?background=${trigger.resourceURL}`
    } return trigger.resourceURL
}

const renderer = {
    link: trigger => {
        return (
            <div className="blank">
                <a href={trigger.resourceURL}><h3 style={{ color: "white" }}>Link to {trigger.name}</h3></a>
            </div>
        )
    },
    video: trigger => {
        if (trigger.resourceURL.includes('youtube')) {
            let request = trigger.resourceURL;
            if (!request.includes('embed')) {
                request = `https://youtube.com/embed/${request.replace('https://www.youtube.com/watch?v=', '')}?theme=0`;
            }
            return (
                <div className="parent">
                    <iframe width="100%" height="200" src={request} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                </div>
            )
        }
        return (
            <div className="parent">
                <iframe width="100%" height="200" src={trigger.resourceURL} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
        )
    },
    audio: trigger => {
        if (trigger.resourceURL.includes('spotify')) {
            let request;
            if (!trigger.resourceURL.includes('embed')) {
                request = `https://open.spotify.com/embed/track/${trigger.resourceURL.replace('https://open.spotify.com/track/', '')}?theme=0`;
            }
            return (
                <div className="parent">
                    <iframe src={request} width="100%" height="80" frameBorder="0" allowtransparency="true" allow="encrypted-media" title="spotify"></iframe>
                </div>
            )
        }
        if (trigger.resourceURL.includes('w.soundcloud')) {
            return (
                <div className="parent">
                    <iframe src={trigger.resourceURL} width="100%" height="200" frameBorder="0" allowtransparency="true" allow="encrypted-media" title="spotify"></iframe>
                </div>
            )
        }
        return (
            <audio controls>
                <source src={trigger.resourceURL} />
            </audio>
        )
    },
    image: trigger => {
        return (
            <div className="parent">
                <img src={getURL(trigger)} alt={trigger.name}></img>
            </div>
        )
    }
}

export default function renderTrigger(trigger) {
    return (trigger.type in renderer) && renderer[trigger.type](trigger)
}