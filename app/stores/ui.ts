import { defineStore } from "pinia";
import { ref, watchEffect } from "vue";
import { useDisplay } from "vuetify";

export const useUiStore = defineStore("uiStore", () => {
    const loading = ref<boolean>(false)
    const showNav = ref<boolean>(false)
    const toggle = ref<boolean>(false)
    const { mdAndDown } = useDisplay()
    const skeletonLoader = ref<boolean>(true)

    //  Notify dialog
    const notifyDialog = ref<boolean>(false)
    const notifyTitle = ref<string>('Success')
    const notifyMessage = ref<string>('Your order has been placed successfully.')
    const success = ref<boolean>(false)
    // const action = ref<string>('Ok')

    //Remcash Payment verify
    const remVerify = ref<boolean>(false)
    const verify = ref<boolean>(false)

    //Transactions dialog
    const transactionDialog = ref<boolean>(false)
    const transTitle = ref<string>('Cancel Order')
    const transError = ref<string>('Are you sure you want to cancel this order?.')

    //ActionPrompt dialog
    const actionDialog = ref<boolean>(false)
    const actionTitle = ref<string>('Removing  Product ?')
    const actionPrompt = ref<string>('Selecting ” yes , remove” will delete product selected from your order.')
    const actionSuccess = ref<boolean>(false)

    const clearCartDialog = ref<boolean>(false)
    const clearTitle = ref<string>('Reorder')
    const clearPrompt = ref<string>('You have items in your cart already. Checkout or clear cart before reordering.')
    const clearSuccess = ref<boolean>(false)


    //Delete account dialog
    const deleteDialog = ref<boolean>(false)
    const deleteTitle = ref<string>('Confirm Account Deletion')
    const deleteMessage = ref<string>(' Please provide your email address to confirm the account deletion request.')

    //Add cylinder from cart
    const addProduct = ref<boolean>(false)
    const newCylinder = ref<boolean>(false)
    const addMore = ref<boolean>(false)

    //Add location
    const addLocation = ref<boolean>(false)

    //Change location checkout
    const changeLocation = ref<boolean>(false)

    //Variable to hold order details in Continue adding
    const orderDetails = ref<any>()
    const selectedRefillAddress = ref<any>()

    watchEffect((newValue) => {
        showNav.value = !mdAndDown.value
        toggle.value = mdAndDown.value
    })






    return {
        loading,
        showNav,
        toggle,
        notifyDialog,
        notifyTitle,
        notifyMessage,
        remVerify,
        verify,
        transactionDialog,
        transTitle,
        transError,
        success,
        actionDialog,
        actionTitle,
        actionPrompt,
        actionSuccess,
        deleteDialog,
        deleteTitle,
        deleteMessage,
        addProduct,
        addLocation,
        changeLocation,
        skeletonLoader,
        newCylinder,
        addMore,
        orderDetails,
        selectedRefillAddress,
        clearCartDialog,
        clearTitle,
        clearPrompt,
        clearSuccess
    }
})