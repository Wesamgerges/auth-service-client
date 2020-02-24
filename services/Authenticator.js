export default class Authenticator {
    constructor(app){
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
        }).catch((error) => {
            this.reset(error)
        });
    }

    async setAuthUser({token, type}) {   
        this.app.$auth.setToken( 'local', type + " " + token );
        this.app.$auth.setStrategy( 'local' );
        await this.app.$auth.fetchUser()                  
        this.app.$router.push( '/' )  
    }

    reset(error) {
        this.app.$auth.setToken( 'local', "" );  
        localStorage.setItem("errorMessage", this.getErrorMesssage(error.message || error))
        
        this.app.$router.push( '/login' )
        throw this.getErrorMesssage(error.message || error)
    }

    async register(user){
        try {
            const {data} = await this.app.$axios.post('/auth/register', user)  
            await this.setAuthUser(data)
        } catch(error) {
            this.reset(error)
        }
    }

    async callback() {
        try {
            const data = this.app.$route.query
            if(data.status == "error") {
                throw new Error(data.message)
            }    
            await this.setAuthUser(data)
        } catch(e) {
            this.reset(e)
        }
    }

    getErrorMesssage(error) {
        return this.readableErrorMessages[error] 
            ? this.readableErrorMessages[error]  
            : error
    }
}
