import config from "../config";

function join_url(base, url) {
    if (base.endsWith('/')) {
        return url.startsWith('/') ? base + url.substring(1) : base + url;
    } else {
        return url.startsWith('/') ? base + url : base + '/' + url;
    }
}

export default async function makeRequest(url, verb = 'get', data = {}, bearer = "") {
    let init = {
        method: verb.toUpperCase(),
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'authorization': `Bearer ${bearer || config.default_bearer}`
        }
    }
    if (verb.toUpperCase() !== 'GET') {
        init.body = JSON.stringify(data)
    }
    let res = await fetch(join_url(config.api_domain, url), init)
    let ret = {
        ...(await res.json()),
        status: res.status,
        statusText: res.statusText,
    }
    return ret;
}