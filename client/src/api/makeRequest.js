'use strict'

import axios from "axios";
import config from "../config";

export default async function makeRequest(url, verb = 'get', data = {}, bearer = "") {
    let res = await axios({
        url: url,
        baseURL: config.api_domain,
        method: verb,
        headers: {
            'Content-Type': 'application/json',
            Authorization: bearer || config.default_bearer
        },
        data: data,
    })
    return {
        ...res.data,
        status: res.status,
        statusText: res.statusText,

    }
}