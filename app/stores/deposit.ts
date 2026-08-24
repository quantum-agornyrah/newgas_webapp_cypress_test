export const useDepositStore = defineStore('depositStore', () => {
    const fromOrderDetails = ref<boolean>(false)
    const depositFromProducts = ref<any>(false)

    return { fromOrderDetails, depositFromProducts }
})