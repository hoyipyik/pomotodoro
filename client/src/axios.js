import axios from 'axios'
const instance = axios.create({
    baseURL: 'https://pomotodoro-b1f0b-default-rtdb.europe-west1.firebasedatabase.app/'
})

export default axios