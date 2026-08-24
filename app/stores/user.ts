import { defineStore } from "pinia";
import { ref } from "vue";
import { useUiStore } from "./ui";


export const useUserStore = defineStore("userStore", () => {
    const user = ref()
    const uiStore = useUiStore()
    const uploadedPic = ref<any>()
    const userLoader = ref<boolean>(true)

    const getUserData = async () => {
        let session_user = JSON.parse(sessionStorage.getItem(import.meta.env.VITE_SESSION_USER) ?? "{}")
        await getRequestHandler(`nova_auth/customer/${session_user.id}/details`, true)
            .then(res => {
                user.value = res;
                sessionStorage.setItem(import.meta.env.VITE_SESSION_USER, JSON.stringify(res))
                userLoader.value = false
            }).catch((e) => {
                uiStore.success = false
                uiStore.notifyTitle = "Error"  
                uiStore.notifyMessage = e
                uiStore.notifyDialog = true
            })
    }



    return { user, uploadedPic, userLoader, getUserData };
})