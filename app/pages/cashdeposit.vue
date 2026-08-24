<script setup lang="ts">
import { useUiStore } from '@/stores/ui';

definePageMeta({
    title: 'Cylinder Deposit',
    layout: 'user-layout'
})
const uiStore = useUiStore()
const userStore = useUserStore()
const productStore = useProductStore()
const orderStore = useOrderStore()

onMounted(async() => {
    Promise.all([
        await productStore.getAllProducts(),
        await orderStore.getOrderType(),
    ])

    productStore.products = productStore.products?.filter((item:any) => {
        return item.name === 'Cylinder'
    })        

    orderStore.orderType = orderStore.orderType?.filter((item:any) => {
        return item.name === 'new'
    })   
})
</script>

<template>
    <v-container max-width="1200">
        <p class="text-capitalize text-h6 font-weight-bold">Select your preferred cylinder type and size</p> 
        <v-skeleton-loader type="card,card,card" class="bg-transparent mt-4">
            <v-row class="mt-2">
                <v-col xs="12" sm="4" md="3" cols="12"  v-for="product,index in productStore?.products?.[0]?.products[0]?.styles" :key="index">
                   <DepositsNewgasCylinder :product="product" :index="index"/>
                </v-col>
            </v-row>
        </v-skeleton-loader>
        <PromptsAddMore v-if="uiStore.addMore"/>
        <PromptsAddProduct v-if="uiStore.addProduct" />
        <PromptsSuccess v-if="uiStore.notifyDialog"/>
    </v-container>
</template>