import axios from 'axios';

// 1. إنشاء نسخة مخصصة من Axios بإعدادات ثابتة
const apiClient = axios.create({
  baseURL: 'http://192.168.1.6:8000/api', 
  
  timeout: 10000, 
  
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export default apiClient;