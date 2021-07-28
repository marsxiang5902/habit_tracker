'use strict'
import makeRequest from './makeRequest';


export default async function fetchData(session) {
  let response = await makeRequest(`users/${session.user}/events`, 'get', {}, session.jwt)
  if(response.error){
    console.log(response.error);
  }
  return response.data
}
// app component mount: set context to FetchData