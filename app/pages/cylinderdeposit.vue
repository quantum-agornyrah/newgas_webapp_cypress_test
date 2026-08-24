<script setup lang="ts">
definePageMeta({
    title: 'Cylinder Deposit',
    layout: 'user-layout'
})

const uiStore = useUiStore()
const router = useRouter()
const productStore = useProductStore()
const orderStore = useOrderStore()
const { xs } = useDisplay()

onMounted(async() => {
    Promise.all([
        await orderStore.getOrderType(),
        await productStore.getExchangeCylinders(),
    ])    

    orderStore.cylinderDeposit = orderStore.orderType?.filter((item:any) => {
        return item.name === 'exchange'
    })
})
</script>

<template>
     <v-container :class="xs ? 'pb-0' : ''">
        <v-btn text="Back" prepend-icon="mdi-arrow-left-top" variant="text" class="text-capitalize"
            :class="xs ? 'ml-0' : 'ml-5'" @click="router.back()" />
    </v-container>
    <v-container max-width="1200">
        <p class="text-capitalize text-h6 font-weight-bold">Please select the Type and Size of cylinder you want to use as deposit</p>
        <v-skeleton-loader type="card,card,card" class="bg-transparent mt-4" :loading="productStore.productLoader">
            <v-row class="mt-2">
                <v-col xs="12" sm="4" md="3" v-for="product, index in productStore?.exchangeCylinders" :key="index">
                    <DepositsExchangeCylinder :product="product" :index="index"/>
                </v-col>   
            </v-row>
        </v-skeleton-loader>
        <PromptsAddMore v-if="uiStore.addMore"/>
        <PromptsAddProduct v-if="uiStore.addProduct" />
        <PromptsSuccess v-if="uiStore.notifyDialog"/>
    </v-container>
</template>