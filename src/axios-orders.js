import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://my-burger-c496f.firebaseio.com/'
});

export default instance;