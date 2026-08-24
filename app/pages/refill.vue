<script setup lang="ts">
definePageMeta({
    title: 'Refill',
    layout: 'user-layout'
})

const uiStore = useUiStore()
const orderStore = useOrderStore()
const userStore = useUserStore()
const locationStore = useLocationStore()
const refillStore = useRefillStore()
const selectAddress = ref<any>()
// const { smAndDown } = useDisplay()
const { xs } = useDisplay()
const router = useRouter()

// const updateAddress = async() => {
//     await refillStore.getRefillCylindersByAdressId(userStore.user?.id, selectAddress.value)
// }

onMounted(async() => {
    await userStore.getUserData()
    await locationStore.getAllCustomerAddress(userStore.user?.id)
    await orderStore.getOrderType()

    selectAddress.value = locationStore.userAddress?.length > 0 ? locationStore.userAddress?.filter((item:any) => (item.is_default == true))[0].id : ''
    await refillStore.getRefillCylindersByAdressId(userStore.user?.id, selectAddress.value)
    // if(!refillStore.refillCylinders) {
    // }

    orderStore.orderType = orderStore.orderType?.filter((item:any) => {
        return item.name === 'refill'
    })   
})
</script>

<template>
     <v-container :class="xs ? 'pb-0' : ''">
        <v-btn text="Back" prepend-icon="mdi-arrow-left-top" variant="text" class="text-capitalize"
            :class="xs ? 'ml-0' : 'ml-0'" @click="router.back()" />
    </v-container>
    <v-container max-width="1200">
        <v-row>
            <v-col cols="12" md="6">
                <p class="text-capitalize text-h6 font-weight-bold">List of your available cylinders for refill</p> 
            </v-col>
            <!-- <v-col cols="12" md="6" class="d-flex justify-end" v-if="locationStore.userAddress?.length > 1">
                <div :class="smAndDown ? 'w-100' : 'w-75'">
                    <p class="mb-2">Select Address</p>
                    <v-select variant="outlined" density="comfortable" :items="locationStore.userAddress" item-title="ghana_post_address?.street" item-value="id" v-model="selectAddress" :return-object="false"
                    @update:model-value="updateAddress">
                        <template v-slot:selection="{ item }: any">
                            <span>{{ item.raw?.ghana_post_address?.street }} - {{ item.raw?.ghana_post_address?.address_code }}</span>
                        </template>
                        <template v-slot:item="{ props, item }:any">
                                <v-list-item v-bind="props"
                                    :title="item.raw?.ghana_post_address?.street + ' - ' + item.raw?.ghana_post_address?.address_code"></v-list-item>
                        </template> 
                    </v-select>
                </div>
            </v-col> -->
        </v-row>
        <v-skeleton-loader type="card,card,card" :loading="refillStore.refillLoader" class="bg-transparent mt-4">
        <p class="text-capitalize text-body-1 text-info" v-if="refillStore.refillCylinders.length === 0">No cylinders available for refill</p>
            <v-row class="mt-2">
                <v-col cols="12" sm="4" md="3" v-for="(product,index) in refillStore.refillCylinders" v-if="refillStore.refillCylinders" :key="index">
                    <DepositsRefillCylinder :product="product" :index="index" :refill="orderStore.orderType" :selected-address="selectAddress" v-if="refillStore.refillCylinders"/>
                </v-col>
                <v-col v-else>
                    <p>You have no refill cylinders</p>
                </v-col>
            </v-row>
        </v-skeleton-loader>
    </v-container>
    <PromptsAddMore v-if="uiStore.addMore"/>
    <PromptsAddProduct v-if="uiStore.addProduct" />
    <PromptsSuccess v-if="uiStore.notifyDialog" />
</template>