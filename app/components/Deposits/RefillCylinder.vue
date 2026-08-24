<script setup lang="ts">
import { useUiStore } from '@/stores/ui';
import { useUserStore } from '@/stores/user';
import { getRandomLightColors } from '@/utils/colors';

const uiStore = useUiStore()
const userStore = useUserStore()
const bg = getRandomLightColors(100)
const loading = ref<boolean>(false)
const cartStore = useCartStore()
const refillStore = useRefillStore()

const props = defineProps<{
    product: any,
    index: any,
    selectedAddress: any
    refill: any
}>()


const addToCart = async() => {
    loading.value = true

   const data = ref<any>({
        product_style_id: props.product?.id,
        previous_product_style_id: props.product?.id,
        order_type: props.refill?.[0]?.id,
        is_self_pickup: `${false}`,
        quantity: 1,
        is_active: true,
        deposit_token_id: props.product?.customer_deposit_token_id,
        cart_type: 'product'
    })

    await postRequestHandler(`order/customers/${userStore.user?.id}/carts?customer_id=${userStore.user?.id}`, data.value, true)
    .then(res => {
        uiStore.success = true
        uiStore.notifyTitle = "Success"  
        uiStore.notifyMessage = `Refill of your ${props.product?.style_name} cylinder has been added to your cart`
        uiStore.notifyDialog = true
        cartStore.getCustomerCart(userStore.user?.id)
        refillStore.getRefillCylindersByAdressId(userStore.user?.id, props.selectedAddress)
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
            <div class="py-3 d-flex justify-center rounded-lg" :style="`background-color: ${bg?.[index]}; height: 172px;`">
                <img :src="product?.images?.[0]?.image_url" :alt="product?.style_description"/>
            </div>
            <div class="d-flex align-center ga-6 mt-2">
                <p class="font-weight-bold">{{ product?.style_name }}</p>
            </div>
            <div class="mt-2">
                <p class="mt-1">Gas cost: GHS {{ product?.gas_cost }}</p>
                <!-- <p class="text-info mt-1 font-weight-bold">GHS 120</p> -->
            </div>
            <v-btn :text="product?.deposit_token_in_cart? 'Refill Cylinder in cart' : 'Refill'" class="bg-black mt-3 text-capitalize" rounded="lg" block
                @click="addToCart" :loading="loading" :disabled="product?.deposit_token_in_cart"/>
        </v-card-text>
    </v-card>
</template>