<script setup lang="ts">;
import { getRandomLightColors } from '@/utils/colors';

const depositStore = useDepositStore()
const uiStore = useUiStore()
const userStore = useUserStore()
const orderStore = useOrderStore()
const router = useRouter()
const bg = getRandomLightColors(100)
const loading = ref<boolean>(false)
const cartStore = useCartStore()

const props = defineProps<{
    product: any,
    index: number
}>()


const addExchangeCylinder = async() => {
    loading.value = true

    const data = ref<any>({
        product_style_id: depositStore.depositFromProducts ? depositStore.depositFromProducts?.id : JSON.parse(sessionStorage.getItem('deposit') ?? '{}')?.id,
        previous_product_style_id: props?.product?.id,
        order_type: orderStore.cylinderDeposit?.[0]?.id,
        is_self_pickup: `${false}`,
        quantity: 1,
        is_active: true,
        cart_type: 'product'
    })


    await postRequestHandler(`order/customers/${userStore.user?.id}/carts?customer_id=${userStore.user?.id}`, data.value, true)
        .then((res) => {
            uiStore.success = true
            uiStore.notifyTitle = "Success"
            uiStore.notifyMessage = `Added ${depositStore.depositFromProducts ? depositStore.depositFromProducts?.style_name : JSON.parse(sessionStorage.getItem('deposit') ?? '{}')?.style_name} to cart`
            uiStore.newCylinder = false
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

</script>

<template>
    <v-card>
        <v-card-text>
            <div class="pa-2 d-flex justify-center rounded-lg" :style="`background-color: ${bg?.[index]}; height: 190px;`">
                <img :src="product?.image_url" :alt="product?.name" width="139" class="cursor-pointer" />
            </div>

            <div class="d-flex align-center justify-space-between mt-3">
                <p class="font-weight-bold">{{ product?.name }}</p>
            </div>
            <div class="mt-3">
                <p class="text-info font-weight-bold">Deposit</p>
            </div>
            <v-btn text="Select" class="bg-black mt-9 text-capitalize" rounded="lg" block @click="addExchangeCylinder()" :loading="loading"/>
        </v-card-text>
    </v-card>
</template>