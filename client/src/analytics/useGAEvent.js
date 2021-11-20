import React from 'react'
import ReactGA from 'react-ga'

const useGAEvent = (category = "Event Ctaegory") => {
    const trackEvent = (action = "actions", label = "label") => {
        ReactGA.event({category, action, label})
    }
    return trackEvent;
}

export default useGAEvent