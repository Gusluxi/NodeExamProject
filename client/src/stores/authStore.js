import { writable } from "svelte/store";

export const user = writable(
    //{ name: "Jack", email: "jack@gmail.com", password: "jackpass"} 
    { loggedIn: false }
);