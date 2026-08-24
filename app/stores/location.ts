export const useLocationStore = defineStore('location', () => {
    const uiStore = useUiStore()
    const customerAddress = ref<any>()
    const userAddress = ref<any>()
    const addressLoader = ref<boolean>(true)
    const route = useRoute()

    const getAddressById = async(customer_id:string, address_id:string | null) => {
        await getRequestHandler(`location/customer/${customer_id}/address/${address_id}`, true)
        .then((res) => {
            customerAddress.value = res
        }).catch((e) => {
            uiStore.success = false
            uiStore.notifyTitle = "Error"  
            uiStore.notifyMessage = e
            uiStore.notifyDialog = true
        })
    }

    const getAllCustomerAddress = async(customer_id:string) => {
        // if(route.path === '/refill'){
        //   await getRequestHandler(`location/customer/${customer_id}/address?is_refill=true`, true)
        //   .then((res) => {
        //     userAddress.value = res.items;
        //     addressLoader.value = false
        //   })
        //   .catch((error) => {
        //     uiStore.success = false
        //     uiStore.notifyTitle = "Error"
        //     uiStore.notifyMessage = error || 'Failed to load location'
        //     uiStore.notifyDialog = true
        //   });   
        // } else {
        // }
        await getRequestHandler(`location/customer/${customer_id}/address`, true)
        .then((res) => {
          userAddress.value = res.items;
        })
        .catch((error) => {
          uiStore.success = false
          uiStore.notifyTitle = "Error"
          uiStore.notifyMessage = error || 'Failed to load location'
          uiStore.notifyDialog = true
        });   
      }

    return { customerAddress, userAddress, addressLoader, getAddressById, getAllCustomerAddress }
})