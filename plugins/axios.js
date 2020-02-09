export default function ({ $axios, redirect }) {  
    $axios.onError(error => {      
      const code = parseInt(error.response && error.response.status)
      if (code === 401) {
          throw new Error( "E_OAUTH_STATE_MISMATCH" )
      } else {
        throw new Error( error )
      }
    })
  }