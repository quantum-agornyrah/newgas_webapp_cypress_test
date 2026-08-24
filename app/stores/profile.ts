export const useProfileStore = defineStore('Profile', () => {
    const profilePic = ref<boolean>(false)
    const  imageDataUrl = ref()
    const timeDiff = ref<number>(0)
    const mins = ref<any>()
    const secs = ref<any>()
    const stopTimer = ref<boolean>(false)
    const forgotPin_phone = ref<string>('')
    const selectedWindow = ref<string>('profile')
    const loading = ref<boolean>(false)

    return { profilePic, imageDataUrl, mins, secs, timeDiff, forgotPin_phone, selectedWindow, stopTimer, loading }
})