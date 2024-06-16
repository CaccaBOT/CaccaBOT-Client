<script setup lang="ts">
import router from "../router/router"
import noPfp from "../assets/no_pfp.webp"
import { ref } from "vue"
import { useSessionStore } from "../stores/session"
import { useAPIStore } from "../stores/api"
const sessionStore = useSessionStore()
const {client} = useAPIStore()

const username = ref('')
const password = ref('')

async function login() {
    const response = await client.login(username.value, password.value)
    const body = await response.json()

    if (!response.ok) {
        username.value = ''
        password.value = ''
        document.querySelectorAll('input').forEach(x => x.classList.add('input-bordered','input-error'))
    }

    sessionStore.session = body
}

function test() {
    //hide modal
}

</script>

<template>
    <div class="login-panel-wrapper w-full h-[100vh] fixed top-0 left-0 flex items-center justify-center z-10" @click="test">
        <div class="bg-base-300 xl:w-[30vw] lg:w-[40vw] md:w-[50vw] sm:w-2/3 w-[85vw] h-2/3 mx-auto rounded-2xl shadow-xl text-center flex flex-col items-center gap-4 p-4">
            <div class="prose my-4 mx-auto">
                <h1>Authentication</h1>
            </div>
            <div class="avatar mt-5">
                <div class="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img :src="noPfp" />
                </div>
            </div>
            <div class="inputs flex flex-col w-3/4 h-[100px] flex-grow my-5 gap-4 items-center justify-center">
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">Username</span>
                    </div>
                    <input v-model="username" type="text" placeholder="PooperTrooper69" class="input input-bordered w-full" />
                </label>
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">Password</span>
                    </div>
                    <input v-model="password" type="password" placeholder="PoopIsMyBae987@#" class="input input-bordered w-full" />
                </label>
            </div>
            <button :disabled="username.length == 0 || password.length == 0" class="btn btn-primary w-2/3 mt-auto mb-4 text-lg" @click="login">Login</button>
        </div>
    </div>
</template>

<style scoped>
.login-panel-wrapper {
    background: #000A;
}
</style>
