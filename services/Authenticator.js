export default class Authenticator {
    constructor(app){
        // this.$auth = auth;
        this.app = app
        this.readableErrorMessages = {
            E_PASSWORD_MISMATCH:        "Invalid email or password.",
            E_USER_NOT_FOUND:           "It seems you didn't register yet.",
            E_MISSING_DATABASE_ROW:     "It seems you didn't register yet.",
            ER_NO_DEFAULT_FOR_FIELD:    "You already registered. Please login",
            ER_DUP_ENTRY:               "You already registered. Please login.",
            ER_BAD_NULL_ERROR:          "Email and Password are required.",
            E_OAUTH_STATE_MISMATCH:     "Something went wrong. Please re-login"
        };
    }

    async loginWith( user ) {
        await this.app.$auth.loginWith("local",  {
            data: {
              email: user.email,
              password: user.password
            }
          } )
            .catch(async (error) => {
                await this.app.$auth.logout()
                throw this.getErrorMesssage(error)
            });
    }

    async register( user ) {       
        // localStorage.removeItem("isRegister")
        try {
            const { data, status } = await this.app.$axios.post('/auth/register', user)  

            if(status !== "success") {
                throw new Error(data.token)
            }       
            this.app.$auth.setToken( 'local', data.token );
            this.app.$auth.setStrategy( 'local' );
            await this.app.$auth.fetchUser()                  
            this.app.$router.push( '/' )  
        } catch (error ){
            throw this.getErrorMesssage( error.message || error )
        }
    }

    async callback() {        
        try {
            const { token, type, message, status } = this.app.$route.query
            // Throw an error, if the backen reported one.
            if(status) {
                throw new Error(message)
            }
            // Update the token and fetch user details.
            this.app.$auth.setToken( 'local', type + " " + token );
            this.app.$auth.setStrategy( 'local' );
            await this.app.$auth.fetchUser()                  
            this.app.$router.push( '/' )           
        } catch( error ) {
            this.app.$auth.setToken( 'local', "" );  
            localStorage.setItem("errorMessage", this.getErrorMesssage(error.message || error))
            this.app.$router.push( '/login' )
        }
    }

    getErrorMesssage(error) {
        return this.readableErrorMessages[error] 
            ? this.readableErrorMessages[error]  
            : error
    }
}

// export default new Authenticator();