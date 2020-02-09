class Authenticator {
    constructor(auth = null){
        this.$auth = auth;
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
    async setContext({$auth, $axios}) {
        this.auth = $auth;
        this.axios = $axios
    }

    async loginWith( provider, user ) {
        await this.auth.loginWith(provider, { data: { provider: user.provider, user } })
            .catch(async (error) => {
                await this.auth.logout()
                throw this.getErrorMesssage(error)
            });
    }

    async register( user  ) {       
        localStorage.removeItem("isRegister")
        try {
            await this.axios.post('/register', user)
        } catch(e){
            throw this.getErrorMesssage(e)
        }
    }

    async setUserDataFromAuth( store, provider ) {
        let user = {
            email:      this.auth.user.email,
            first_name: this.auth.user.given_name,
            last_name:  this.auth.user.family_name,
            accessToken:this.auth.getToken(provider),
            password:   this.auth.getToken(provider).substr(7, 40),
            provider: provider
        }
        store.state.user.data = user
        return user
    }

    async callback(app) {
        try {
            const { token, error } = app.$route.query
            // Throw an error, if the backen reported one.
            if(error) {
                throw new Error(error)
            }
            // Update the token and fetch user details.
            app.$auth.setToken( 'local', token );
            app.$auth.setStrategy( 'local' );
            await app.$auth.fetchUser()                  
            app.$router.push( '/' )           
        } catch(error) {
            app.$auth.setToken( 'local', "" );  
            localStorage.setItem("errorMessage", this.getErrorMesssage(error.message || error))
            app.$router.push( '/login' )
        }
    }

    getErrorMesssage(error) {
        return this.readableErrorMessages[error] 
            ? this.readableErrorMessages[error]  
            : error
    }
}

export default new Authentication();