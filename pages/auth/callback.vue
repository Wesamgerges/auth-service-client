<template>
<div class="container d-flex align-items-center justify-content-center flex-column">
    <img src="~/assets/loading.svg" alt="Loading..." width="80px" />
    Logging in...
</div>
</template>
<script>
import Authenticator from '~/services/Authenticator.js'
export default {
    auth: false,
    layout: 'plain',
    async mounted() {
        const authenticator = new Authenticator(this)
        authenticator.callback()
    },
}
</script>
<style scoped>
.container {
    min-height: 70vh;
}
</style>
