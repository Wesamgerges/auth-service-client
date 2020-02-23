'use strict'

/*
|--------------------------------------------------------------------------
| Auth Configuration
|--------------------------------------------------------------------------
|
| This is general purpose file to define configuration for user Authentication.
|
|
*/
module.exports = {
        // plugins: ['~/plugins/auth.js'],
        cookie: false,
        scopeKey: 'role',
        tokenRequired: true,
        strategies: {
        local: {
            endpoints: {
                login:  { url: '/auth/login/', method: 'post', propertyName: 'data.token'  },
                user:   { url: 'auth/user' , method: 'get' , propertyName: 'data'        },
                logout: false
            }
        },
    },
    redirect: {
        logout: "/login", 
        home: '/',
        login: "/login"       
    },
    maxAge: 3600,
     // watchLoggedIn: true,
     // rewriteRedirects: true
     resetOnError: true   
}