import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://burger-builder-5c752.firebaseio.com/'
});

export default instance;