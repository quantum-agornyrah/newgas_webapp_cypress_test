<script setup lang="ts">
definePageMeta({
  title: 'Order Details',
  layout: 'user-layout'
})
const userStore = useUserStore()
const cartStore = useCartStore()
const orderStore = useOrderStore()
const locationStore = useLocationStore() 
const route = useRoute()
const params = ref<any>()
const router = useRouter()
const { xs } = useDisplay()

watchEffect(() => {
  if(cartStore.orderTypes) {
    cartStore.cartLoader = false
  }
})

onMounted(async () => {
  cartStore.cartLoader = true
  params.value = route.params?.orderdetails as string
  Promise.all([
    await userStore.getUserData(),
    await cartStore.getCustomerCart(userStore.user?.id),
    await locationStore.getAllCustomerAddress(userStore.user?.id),
    await orderStore.getOrderType()
  ])

  cartStore.orderTypes = cartStore.cart?.cart_items?.product?.map((item: any) => {
    return { ...item, orderTypeName: orderStore.orderType?.filter((type: any) => type.id == item.order_type)[0].name }
  })
})
</script>

<template>
   <v-container :class="xs ? 'pb-0' : ''">
        <v-btn text="Back" prepend-icon="mdi-arrow-left-top" variant="text" class="text-capitalize"
            :class="xs ? 'ml-0' : 'ml-5'" @click="router.back()" />
    </v-container>
  <OrdersOrderInfo :params="params ? params : ''" />
</template>
