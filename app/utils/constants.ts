const timerInterval = ref<any>()


export const formatPhoneNumber = (phone: string): string => {
    if (phone.startsWith('0')) {
        return phone.slice(1);
    } else if (phone.startsWith('+233')) {
        return phone.slice(4);
    }
    return phone;
};

export const convertToInternationalFormat = (phone: string): string => {
    if (phone.startsWith('0')) {
        return '+233' + phone.slice(1);
    }
    return phone;
};

const timer = () => {
    const profileStore = useProfileStore()

    if (timerInterval.value) {
        clearInterval(timerInterval.value)
    }

    let y = 5 * 60 * 1000
    let tokenExp = new Date().getTime()

    timerInterval.value = setInterval(() => {
        let now = new Date().getTime()
        profileStore.timeDiff = (tokenExp + y) - now

        if (profileStore.timeDiff < 0) {
            clearInterval(timerInterval.value)
            timerInterval.value = null
        }
    }, 1000)
}



export const changePhone = async () => {
    const profileStore = useProfileStore()
    const userStore = useUserStore()
    const uiStore = useUiStore()

    profileStore.loading = true
    await getRequestHandler(
        `nova_auth/customer/${userStore.user?.id}/phone/update_request?old_phone=${encodeURIComponent(userStore.user?.phone)}`,
        true
    )
    .then(() => {
        profileStore.selectedWindow = 'changePhone'
        timer()
    })
    .catch((error) => {
        uiStore.success = false
        uiStore.notifyTitle = "Error"
        uiStore.notifyMessage = error
        uiStore.notifyDialog = true
    })
    .finally(() => {
        profileStore.loading = false
    })
}

export const changePIn = async() => {
    const profileStore = useProfileStore()
    const userStore = useUserStore()
    const uiStore = useUiStore()

    profileStore.loading = true
    await getRequestHandler(`nova_auth/customer/send_otp?country_code=%2B233&phone_number=${formatPhoneNumber(userStore.user?.phone)}&purpose=change_pin`)
    .then(res => {
        profileStore.selectedWindow = 'changePin'
        timer()
    })
    .catch((error) => {
        uiStore.success = false
        uiStore.notifyTitle = "Error"  
        uiStore.notifyMessage = error
        uiStore.notifyDialog = true
    })
    .finally(() => {
        profileStore.loading = false
    })
}