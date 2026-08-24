<script setup lang="ts">

const uiStore = useUiStore()
const userStore = useUserStore()
const refillStore = useRefillStore()
const productStore = useProductStore()
const router = useRouter()
const orderStore = useOrderStore()
const loading = ref<boolean>(false)
const load = ref<boolean>(false)
const { xs } = useDisplay()
const route = useRoute()

const ProceedCheckout = async() => {
    load.value = true

    const data = ref<any>({
        product_style_id: uiStore.orderDetails?.id,
        previous_product_style_id: productStore.exchange?.id,
        order_type: orderStore.orderType?.[0].id,
        is_self_pickup: `${false}`,
        quantity: 1,
        is_active: true,
        deposit_token_id: uiStore.orderDetails?.customer_deposit_token_id,
        cart_type: 'product'
    })

    await postRequestHandler(`order/customers/${userStore.user?.id}/carts?customer_id=${userStore.user?.id}`, data.value, true)
    .then(res => {
        uiStore.addMore = false
        router.push('/orderdetails')
        console.log(res);
    })
    .catch((error) => {
        uiStore.success = false
        uiStore.addMore = false
        uiStore.notifyTitle = "Error"  
        uiStore.notifyMessage = error
        uiStore.notifyDialog = true
    })
    .finally(() => {
        load.value = false
    })  
}

const continueAdding = async() => {
    loading.value = true

    const data = ref<any>({
        product_style_id: uiStore.orderDetails?.id,
        previous_product_style_id: productStore.exchange?.id,
        order_type: orderStore.orderType?.[0].id,
        is_self_pickup: `${false}`,
        is_active: true,
        deposit_token_id: uiStore.orderDetails?.customer_deposit_token_id,
        cart_type: 'product'
    }) 

    await postRequestHandler(`order/customers/${userStore.user?.id}/carts?customer_id=${userStore.user?.id}`, data.value, true)
    .then(async(res) => {
        if(route.path == '/refill') {
            await refillStore.getRefillCylindersByAdressId(userStore.user?.id, uiStore.selectedRefillAddress)
        }
        uiStore.addMore = false
        uiStore.addProduct = true
    })
    .catch((error) => {
        uiStore.success = false
        uiStore.addMore = false
        uiStore.notifyTitle = "Error"  
        uiStore.notifyMessage = error
        uiStore.notifyDialog = true
    })
    .finally(() => {
        loading.value = false
    })
}
</script>

<template>
    <v-dialog v-model="uiStore.addMore" max-width="450" persistent transition="dialog-top-transition">
        <v-card class="text-center">
            <v-card-text class="pa-7 pt-5">
                <div class="d-flex justify-end">
                    <v-btn icon="mdi-close" class="text-right" variant="text" @click=" uiStore.addMore = false"/>
                </div>

                <div class="text-center">
                    <img src="@/assets/addcylinder.png" alt="Add-more" width="75" />
                </div>
                <p class="mt-4">Select an <span class="font-weight-bold">option</span> to complete order process</p>
                <v-row class="mt-5">
                    <v-col cols="12">
                        <v-card class="border" rounded="lg" elevation="2" @click="continueAdding" :loading="loading">
                            <v-card-text>
                                <div class="d-flex align-center text-left" :class="xs ? 'ga-2' : 'ga-4'">
                                    <div>
                                        <v-img src="@/assets/continue.png" alt="Add more" width="48" />
                                    </div>
                                    <div>
                                        <p class="text-body-1 font-weight-bold">Continue Adding</p>
                                        <p class="text-subtitle-2">Added products will update order details</p>
                                    </div>
                                    <v-icon icon="mdi-chevron-right" size="20" class="ml-auto" />
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12">
                        <v-card class="mb-2 border" rounded="lg" elevation="2" @click="ProceedCheckout" :loading="load">
                            <v-card-text>
                                <div class="d-flex align-center text-left" :class="xs ? 'ga-2' : 'ga-4'">
                                    <div>
                                        <v-img src="@/assets/cylinder.png" alt="Cylinder Deposit" width="48" />
                                    </div>
                                    <div>
                                        <p class="text-body-1 font-weight-bold">Proceed to Checkout</p>
                                        <p class="text-subtitle-2">Takes you to your updated order Details</p>
                                    </div>
                                    <v-icon icon="mdi-chevron-right" size="20" class="ml-auto" />
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>