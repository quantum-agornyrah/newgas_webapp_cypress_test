<script setup lang="ts">
import { useUiStore } from '@/stores/ui';
import { useDisplay } from 'vuetify';

definePageMeta({
    title: 'Products & Services',
    layout: 'user-layout'
})
const uiStore = useUiStore()
const productStore = useProductStore()
const orderStore = useOrderStore()
const { xs } = useDisplay()
const router = useRouter()

onMounted(async() => {
    await productStore.getAllProducts()
    await orderStore.getOrderType()

    orderStore.cashDeposit = orderStore.orderType?.filter((item:any) => {
        return item.name === 'new'
    })  

    orderStore.cylinderDeposit = orderStore.orderType?.filter((item:any) => {
        return item.name === 'exchange'
    })  

    orderStore.accessories = orderStore.orderType?.filter((item:any) => {
        return item.name === 'pay_at_once'
    })   
})

</script>

<template>
    <v-container class="pb-0">
        <v-btn text="Back" prepend-icon="mdi-arrow-left-top" variant="text" class="text-capitalize"
            :class="xs ? 'ml-0' : 'ml-5'" @click="router.back()" />
    </v-container>
    <v-container>
        <ProductsServices />
        <PromptsNewCylinder v-if="uiStore.newCylinder"/>
    </v-container>
</template>