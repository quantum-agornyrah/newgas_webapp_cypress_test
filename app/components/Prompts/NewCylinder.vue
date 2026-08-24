<script setup lang="ts">

const uiStore = useUiStore()
const userStore = useUserStore()
const depositStore = useDepositStore()
const orderStore = useOrderStore()
const router = useRouter()
const { xs } = useDisplay()
const loading = ref<boolean>(false)
const cartStore = useCartStore()

const cashDeposit = async() => {
    loading.value = true

    const data = ref<any>({
        product_style_id: depositStore.depositFromProducts?.id,
        order_type: orderStore.cashDeposit?.[0]?.id,
        is_self_pickup: `${false}`,
        quantity: 1,
        is_active: true,
        cart_type: 'product'
    })

    await postRequestHandler(`order/customers/${userStore.user?.id}/carts?customer_id=${userStore.user?.id}`, data.value, true)
        .then((res) => {
            uiStore.success = true
            uiStore.newCylinder = false
            uiStore.notifyTitle = "Success"
            uiStore.notifyMessage = `Added ${depositStore.depositFromProducts?.style_name} to cart`
            uiStore.notifyDialog = true
            cartStore.getCustomerCart(userStore.user?.id)
        })
        .catch((error) => {
            uiStore.success = false
            uiStore.notifyTitle = "Error"
            uiStore.notifyMessage = error
            uiStore.notifyDialog = true
        })
        .finally(() => {
            loading.value = false
        })
}

const cylinderDeposit = () => {
    sessionStorage.setItem('deposit', JSON.stringify(depositStore.depositFromProducts))
    uiStore.newCylinder = false
    router.push('/cylinderdeposit')
}

</script>

<template>
    <v-dialog v-model="uiStore.newCylinder" max-width="450" persistent transition="dialog-top-transition">
        <v-card class="text-center">
            <v-card-text class="pt-5" :class="xs ? 'pa-5' : 'pa-7'">
                <div class="d-flex justify-end">
                    <v-btn icon="mdi-close" class="text-right" variant="text" @click="uiStore.newCylinder = false" />
                </div>

                <div class="text-center">
                    <img src="@/assets/addcylinder.png" alt="Add-more" :width="xs ? '55' : '75'" />
                </div>
                <p class="mt-4 text-h5 font-weight-black">Make a Deposit</p>
                <p class="mt-4">Make a deposit now to start your newgas experience. Ignite the Joy of cooking.</p>
                <v-row class="mt-5">
                    <v-col cols="12">
                        <v-card class="border" rounded="lg" elevation="2" @click="cashDeposit" :loading="loading">
                            <v-card-text>
                                <div class="d-flex align-center text-left" :class="xs ? 'ga-2' : 'ga-4'">
                                    <div>
                                        <v-img src="@/assets/cash.png" alt="Cash Deposit" width="48" />
                                    </div>
                                    <div>
                                        <p class="text-body-1 font-weight-bold">Cash Deposit</p>
                                        <p class="text-subtitle-2">Pay cash for your Newgas cylinder</p>
                                    </div>
                                    <v-icon icon="mdi-chevron-right" size="20" class="ml-auto" />
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12">
                        <v-card class="mb-2 border" rounded="lg" elevation="2" @click="cylinderDeposit">
                            <v-card-text>
                                <div class="d-flex align-center text-left" :class="xs ? 'ga-2' : 'ga-4'">
                                    <div>
                                        <v-img src="@/assets/deposit.png" alt="Cylinder Deposit" width="48" />
                                    </div>
                                    <div>
                                        <p class="text-body-1 font-weight-bold">Cylinder Deposit</p>
                                        <p class="text-subtitle-2">Exchange your current cylinder for a Newgas cylinder
                                        </p>
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