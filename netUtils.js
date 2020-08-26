const axios = require('axios').default
const https = require('https');
const http = require('http'); 
const get = (endpointURL, bearer_token = null, basic_token = null) => requestWithAxios('GET', endpointURL, null, {}, bearer_token, basic_token)
const post = (endpointURL, params, headers = {}, bearer_token = null, basic_token = null) => requestWithAxios('POST', endpointURL, params, headers, bearer_token, basic_token)
const requestWithAxios = (method, url, params, headers, bearer_token, basic_token) => new Promise((resolve, reject) => {
    const options = {
        httpsAgent: new https.Agent({ keepAlive: true }),
        httpAgent: new http.Agent({ keepAlive: true }),
        method,
        url,
        headers: {
            Accept: 'application/json',
            'Accept-Encoding': 'application/json',
            'Accept-Language': 'EN',
            'Content-Type': 'application/json'
        },
    }
    if (params) options.data = params
    if (headers) options.headers = {...options.headers,...headers}
    if (bearer_token) options.headers.Authorization = `Bearer ${bearer_token}`
    if (basic_token) options.headers.Authorization = `Basic ${basic_token}`
    // console.log('RWA_FUNC => Outgoing Options: ',options)
    axios(options)
    .then((response) => resolve({ statusCode: response.status, body: response.data }) )
    .catch((error) => {
        if (error.response !== undefined) {
            resolve({ statusCode: error.response.status, body: error.response.data, error })
        } else if (error.isAxiosError) {
            resolve({ statusCode: 999, body: { message: error.request.response || 'HTTP Client Error', error } })
        } else {
        // eslint-disable-next-line prefer-promise-reject-errors
            reject({ statusCode: 999, body: { message: 'message' in error ? error.message : 'Error did not have a message', error } })
        }
    })
})
module.exports={get,post}