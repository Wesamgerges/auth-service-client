export default function ({ $axios, redirect }) {  
    $axios.onError(error => {      
        throw error.response.data.message || error 
    })
  }