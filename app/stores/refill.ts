export const useRefillStore = defineStore('refill', () => {
    const uiStore = useUiStore()
    const refillCylinders = ref<any>([])
    const refillLoader = ref<boolean>(true)

    const getRefillCylindersByAdressId = async(customer_id: string, address_id:string) => {
        refillLoader.value = true  
        await getRequestHandler(`order/customer_deposit_token/${customer_id}/refill_cylinders?customer_address_id=${address_id}`, true)
        .then((res) => {
            refillCylinders.value = res.items
            refillLoader.value = false  
        }).catch((e) => {
            if (e === "Refill cylinder with the specified customer id and customer address does not exists") {
                refillCylinders.value = []
                refillLoader.value = false  
            } else {
                uiStore.success = false
                uiStore.notifyTitle = "Error"  
                uiStore.notifyMessage = e
                uiStore.notifyDialog = true
            }
        })
    }

    return { refillCylinders, refillLoader, getRefillCylindersByAdressId }
})