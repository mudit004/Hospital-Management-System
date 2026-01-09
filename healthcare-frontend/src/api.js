const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'


function getToken(){
return localStorage.getItem('access')
}


async function request(path, {method='GET', body=null, headers={}}={}){
const url = `${API_BASE}${path}`
const opts = { method, headers: {...headers} }
const token = getToken()
if(token) opts.headers['Authorization'] = `Bearer ${token}`
if(body && !(body instanceof FormData)){
opts.headers['Content-Type'] = 'application/json'
opts.body = JSON.stringify(body)
} else if(body instanceof FormData){
opts.body = body
}


const res = await fetch(url, opts)
const data = await res.json().catch(()=>null)
if(!res.ok) throw {status: res.status, data}
return data
}


export function api(path, options){ return request(path, options) }
export default { request }