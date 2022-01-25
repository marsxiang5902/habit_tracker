import makeRequest from './makeRequest';


export default async function fetchData(user, token) {
  let userRecord = (await makeRequest(`users/${user}`, 'get', {}, token)).data
  let session = {
    isAuthed: true,
    jwt: token,
    ...userRecord
  }
  let timedEvents = (await makeRequest(`users/${user}/events`, 'get', {}, token)).data

  return { session, timedEvents }
}
// app component mount: set context to FetchData