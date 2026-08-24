<script setup lang="ts">
import { useUiStore } from '@/stores/ui';

const uiStore = useUiStore()
const userStore = useUserStore()
const cartStore = useCartStore()
const loading = ref<boolean>(false)
const router = useRouter()

const checkoutCart = () => {
    router.push('/orderdetails')
    uiStore.clearCartDialog = false
}

const clearCart = async() => {
    loading.value = true

    await deleteRequestHandler(`order/customers/${userStore.user?.id}/clear_all_cart_items?cart_type=product`)
    .then(res => {
        uiStore.success = true
        uiStore.notifyTitle = "Success"
        uiStore.notifyMessage = "Cleared cart successfully."
        uiStore.notifyDialog = true
        cartStore.getCustomerCart(userStore.user?.id)
    })
    .catch(error => {
        uiStore.success = false
        uiStore.notifyTitle = "Error"
        uiStore.notifyMessage = "Failed to clear cart. Please try again."
        uiStore.notifyDialog = true
    })
    .finally(() => {
        loading.value = false
        uiStore.clearCartDialog = false
    })
}
</script>

<template>
    <v-dialog v-model="uiStore.clearCartDialog" max-width="410" transition="dialog-top-transition" persistent>
        <v-card class="text-center">
            <v-card-text class="pa-4 pb-4">
                <div class="text-right">
                    <v-btn icon="mdi-close"  variant="text" @click=" uiStore.clearCartDialog = false"/>
                </div>
                <v-icon icon="mdi-delete-outline" size="100px" color="redBtn" />
                <p class="mt-5 text-h6 font-weight-black">{{ uiStore.clearTitle }}</p>
                <p class="mt-5">{{ uiStore.clearPrompt }}</p>
            </v-card-text>
            <v-card-actions class="px-7 pb-5 mb-3 flex-column">
                <v-btn block class="text-capitalize mb-3" variant="outlined" size="large"
                    @click="checkoutCart">
                    Checkout Cart
                </v-btn>
                <v-btn block class="text-capitalize bg-black" @click="clearCart" size="large" :loading="loading">
                    Clear Cart
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>