export const useCartStore = defineStore('cart', () => {
  const uiStore = useUiStore()
  const cart = ref<any>()
  const orderTypes = ref<any>()
  const cartLoader = ref<boolean>(true)

  const getCustomerCart = async(customer_id:string) => {
    await getRequestHandler(`order/customers/${customer_id}/carts`, true)
    .then((res) => {
      cart.value = res.items
    }).catch((e) => {
        uiStore.success = false
        uiStore.notifyTitle = "Error"  
        uiStore.notifyMessage = e
        uiStore.notifyDialog = true
    })
  }

  return { cart, orderTypes, cartLoader, getCustomerCart }
})