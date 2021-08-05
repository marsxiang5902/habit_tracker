'use strict'

const Trigger = require("./Trigger")
const TriggerAudio = require("./TriggerAudio")
const TriggerImage = require("./TriggerImage")
const TriggerLink = require("./TriggerLink")
const TriggerVideo = require("./TriggerVideo")

module.exports = {
    superclass: Trigger,
    subclasses: {
        image: TriggerImage,
        video: TriggerVideo,
        audio: TriggerAudio,
        link: TriggerLink
    }
}