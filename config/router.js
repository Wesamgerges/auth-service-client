'use strict'

/*
|--------------------------------------------------------------------------
| Router Configuration
|--------------------------------------------------------------------------
|
| This is general purpose file to define configuration for router.
| The below config is for the ally provider.
|
|
*/
// only add `router.base = '/<repository-name>/'` if `DEPLOY_ENV` is `GH_PAGES`
const routerBase = process.env.DEPLOY_ENV === 'GH_PAGES' ? {
    base: '/auth-service-client/'  
} : {}

module.exports = {
    middleware: ['auth'],
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'login',
        path: '/login',
        component: resolve(__dirname, '../pages/auth/login.vue')
      },{
        path: '/register',
        redirect: { name: 'login', query: { register: '1' } },      
        component: resolve(__dirname, '../pages/auth/login.vue')
      })
    },
    ...routerBase
}
