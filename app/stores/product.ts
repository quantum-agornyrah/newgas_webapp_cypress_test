export const useProductStore = defineStore('product', () => {
    const uiStore = useUiStore()
    const activeView = ref<string>('cylinders')
    const products = ref<any>()
    const exchangeCylinders = ref<any>()
    const accessories = ref<any>()
    const exchange = ref<any>()
    const cylinders = ref<any>()
    const productLoader = ref<boolean>(true)

    const getAllProducts = async () => {

        await getRequestHandler('product/productcategories/?sort_order=desc&sort_by=created_at&is_deleted=false&is_active=true', true)
            .then(res => {
                products.value = res?.items
            })
            .catch((error) => {
                uiStore.success = false
                uiStore.notifyTitle = "Error"
                uiStore.notifyMessage = error
                uiStore.notifyDialog = true
            })
    }

    const getExchangeCylinders = async () => {
        productLoader.value = true
        await getRequestHandler('product/customers/exchange_cylinder', true)
            .then(res => {
                exchangeCylinders.value = res.data
                productLoader.value = false
            })
            .catch((error) => {
                uiStore.success = false
                uiStore.notifyTitle = "Error"
                uiStore.notifyMessage = error
                uiStore.notifyDialog = true
            })
    }

    const getAccessories = async(accessories_id: string) => {
        productLoader.value = true
        await getRequestHandler(`product/customers/products/?category_id=${accessories_id}`, true)
            .then(res => {
                accessories.value = res?.items
                productLoader.value = false
            })
            .catch((error) => {
                uiStore.success = false
                uiStore.notifyTitle = "Error"
                uiStore.notifyMessage =error 
                uiStore.notifyDialog = true
            })
    
    }

    const getCylinders = async(cylinders_id: string) => {
        productLoader.value = true
        await getRequestHandler(`product/customers/products/?category_id=${cylinders_id}`, true)
            .then(res => {
                cylinders.value = res?.items
                productLoader.value = false
            })
            .catch((error) => {
                uiStore.success = false
                uiStore.notifyTitle = "Error"
                uiStore.notifyMessage = error 
                uiStore.notifyDialog = true
            })
    
    }

    return { activeView, products, exchangeCylinders, exchange, accessories, cylinders, productLoader, getCylinders, getExchangeCylinders, getAllProducts, getAccessories }
})