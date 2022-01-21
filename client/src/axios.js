import axios from 'axios'
const instance = axios.create({
    // baseURL: 'https://pomotodoro-b1f0b-default-rtdb.europe-west1.firebasedatabase.app/'
    // baseURL: 'http://localhost:4000'
    baseURL: 'http://123.56.107.143:3000'
})

export default instance