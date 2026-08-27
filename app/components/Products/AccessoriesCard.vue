<script setup lang="ts">
import { useUiStore } from '@/stores/ui';
import { useUserStore } from '@/stores/user';
import { getRandomLightColors } from '@/utils/colors';

const userStore = useUserStore()
const uiStore = useUiStore()
const orderStore = useOrderStore()
const locationStore = useLocationStore()
const bg = getRandomLightColors(100)
const quantity = ref<number>(1)
const loading = ref<boolean>(false)
const cartStore = useCartStore()

const add = () => {
    if(quantity.value >= 1) {
        quantity.value++
    }
}

const subtract = () => {
    if(quantity.value > 1) {
        quantity.value--
    }
}

const addToCart = async(item:any) => {
    loading.value = true

    const data = ref<any>({
        product_style_id: item.id,
        order_type: orderStore.accessories?.[0].id,
        is_self_pickup: `${false}`,
        quantity: quantity.value,
        is_active: true,
        cart_type: 'product'
    })

    await postRequestHandler(`order/customers/${userStore.user?.id}/carts?customer_id=${userStore.user?.id}`, data.value, true)
        .then((res) => {
          uiStore.success = true
          uiStore.notifyTitle = "Success"
          uiStore.notifyMessage = "Added to cart"
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

defineProps<{
    product:any,
    index:any
}>()
</script>

<template>
    <v-card>
        <v-card-text>
            <div class="py-3 d-flex justify-center rounded-lg" :style="`background-color: ${bg?.[index]}; height: 172px;`">
                <v-img :src="product?.thumbnail_image" :alt="product?.style_description	"/>
            </div> 
            <div class="d-flex align-center justify-space-between my-2">
                <div class="justify-space-between mt-2">
                    <p class="font-weight-bold">{{ product?.style_name }}</p>
                </div>
                <v-btn class="bg-cart" size="small">
                    <template #append>
                        <v-icon icon="mdi-plus" @click="add" />
                    </template>
                    {{ quantity }}
                    <template #prepend>
                        <v-icon icon="mdi-minus" @click="subtract" />
                    </template>
                </v-btn>
            </div>
            <!-- <p>{{ product?.style_description }}</p> -->
            <div class="mt-2">
                <p class="text-info mt-1 font-weight-bold">GHS {{ product?.total_cost }}</p>
            </div>
            <v-btn text="Select" class="bg-black mt-3 text-capitalize" rounded="lg" block  @click="addToCart(product)" :loading="loading" :disabled="locationStore.userAddress?.length == 0"/>
        </v-card-text>
    </v-card>
</template>