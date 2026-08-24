export const useOrderStore = defineStore('Orders',() => {
    const uiStore = useUiStore()
    const orderHistory = ref<any>()
    const orderDetails = ref<any>()
    const orderLoader = ref<boolean>(true)
    const orderStatusLoader = ref<boolean>(true)
    const orderType = ref<any>()
    const delivery_details_id = ref<string | null>('')
    const cashDeposit = ref<any>()
    const cylinderDeposit = ref<any>()
    const accessories = ref<any>()
    const pagination = ref<any>()
    const page = ref<number>(1)


    const getOrderHistory = async(customer_id:string, address_id:string) => {
        orderLoader.value = true
        await getRequestHandler(`order/customer/${customer_id}/orders/v2?customer_id=${customer_id}&page=${page.value}&size=25&address_id=${address_id}`, true)
        .then((res) => {
            orderHistory.value = res.items
            pagination.value = res
            orderLoader.value = false
        }).catch((e) => {
            uiStore.success = false
            uiStore.notifyTitle = "Error"  
            uiStore.notifyMessage = e
            uiStore.notifyDialog = true
        })
    }

    const getFilteredOrderHistory = async(customer_id:string, address_id:string, start_date:string, end_date:string) => {
        orderLoader.value = true
        await getRequestHandler(`order/customer/${customer_id}/orders/v2?customer_id=${customer_id}&start_date=${start_date}&end_date=${end_date}&page=${page.value}
            &size=25&address_id=${address_id}`, true)
        .then((res) => {
            orderHistory.value = res.items
            pagination.value = res
            orderLoader.value = false
        }).catch((e) => {
            uiStore.success = false
            uiStore.notifyTitle = "Error"  
            uiStore.notifyMessage = e
            uiStore.notifyDialog = true
        })
    }


    const getOrderDetails = async(customer_id: string, order_id:string) => {
        orderStatusLoader.value = true
        await getRequestHandler(`order/customer/${customer_id}/order/${order_id}/v2`, true)
        .then(res => {
            orderDetails.value = res
            orderStatusLoader.value = false
        })
        .catch((error) => {
            uiStore.success = false
            uiStore.notifyTitle = "Error"
            uiStore.notifyMessage = error
            uiStore.notifyDialog = true
        })
    }

    const getOrderType = async() => {
        await getRequestHandler('order/order_type', true)
        .then(res => {
            orderType.value = res.items
        })
        .catch((error) => {
            uiStore.success = false
            uiStore.notifyTitle = "Error"
            uiStore.notifyMessage = error
            uiStore.notifyDialog = true
        })
    }

    return { orderHistory, orderDetails, orderLoader, orderStatusLoader, orderType,delivery_details_id, cashDeposit, cylinderDeposit, accessories,
        pagination, page, getOrderHistory,getFilteredOrderHistory, getOrderDetails, getOrderType }
})