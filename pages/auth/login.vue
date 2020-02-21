<template>
<div>
    <div v-if="!loading">
        <login :register="isRegister" :errorMessage="errorMessage" @dismissed="errorMessage=''" @login="login" @register="register"></login>
        <div class="row">
            <div style="max-width: 400px;" class="col d-flex justify-content-end mt-2 mx-auto">
                <a :href="'login?' + (isRegister? 'register=1': 'login=1')" @click.prevent="isRegister=!isRegister"> {{ message }} </a>
            </div>
        </div>
    </div>
   <div v-else> 
        <loading ></loading>
    </div>
</div>
</template>

<script>
import Authenticator from '~/services/Authenticator.js'
import login from '~/components/Login.vue'
import loading from '~/components/Loading.vue'

import { mapMutations, mapGetters, mapState } from 'vuex'
export default {
    layout: 'plain',
    components: {
        login,
        loading
    },
    data() {
        return {
            isRegister: false,
            message: "Not registered yet?",
            errorMessage: "",
            loading: false,
        }
    },
    mounted() {
        this.isRegister = this.$route.query.register
        this.errorMessage = localStorage.getItem("errorMessage")
        localStorage.removeItem("errorMessage")
    },
    watch: {
        isRegister(v) {
            this.errorMessage = ""
            localStorage.removeItem("errorMessage")
            this.message = v ? "Already registered?" : "Not registered yet?"
        }
    },
    methods: {
        async register( { user } ) {           
           const authenticator = new Authenticator(this)          
            try {
                await authenticator.register( user )
                this.$router.push('/')
            } catch( error ) {
                this.errorMessage = error
                return;
            }
        },

        async login( { user } ) {
            const authenticator = new Authenticator(this)
            await authenticator.loginWith(user)
            .catch( error => {
                this.errorMessage = error
            })
            this.loading = false
            this.$router.push('/')
        },
    }
}
</script>