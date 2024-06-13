<script setup lang="ts">
import router from "../router/router"
</script>

<template>
    <div class="header-wrapper w-full">
        <div class="navbar w-11/12 mt-4 mx-auto rounded-2xl bg-base-300">
            <div>
                <div class="dropdown">
                    <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul tabindex="0"
                        class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        <li><a>Item 1</a></li>
                        <li>
                            <a>Parent</a>
                            <ul class="p-2">
                                <li><a>Submenu 1</a></li>
                                <li><a>Submenu 2</a></li>
                            </ul>
                        </li>
                        <li><a>Item 3</a></li>
                    </ul>
                </div>
                <a class="btn btn-ghost text-2xl mr-6" @click="router.push('/')">CaccaBOT</a>
            </div>
            <div class="navbar-start hidden lg:flex">
                <button class="btn w-36 mx-2" @click="router.push('/leaderboard')">Rankings</button>
                <button class="btn w-36 mx-2">Manual</button>
                <button class="btn w-36 mx-2">Stats</button>
                <button class="btn w-36 mx-2">Users</button>
            </div>

            <div class="navbar-end">
                <button class="btn w-36 mx-2">GitHub</button>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
