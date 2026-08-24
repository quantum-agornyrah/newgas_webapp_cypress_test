<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

const userStore = useUserStore()
const uiStore = useUiStore()
const orderStore = useOrderStore()
const locationStore = useLocationStore()
const orderType = ref<any>()
const defaultAddress = ref<any>()
const filter = ref<any>()

definePageMeta({
    title: 'Order History',
    layout: 'user-layout'
})

const filterOrders = async () => {
    const days = filter.value;
    if (days) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);

        await orderStore.getFilteredOrderHistory(
            userStore.user?.id,
            defaultAddress.value,
            startDate.toISOString().split('T')[0] ?? '',
            endDate.toISOString().split('T')[0] ?? ''
        );
    } else {
        await orderStore.getOrderHistory(userStore.user?.id, defaultAddress.value);
    }
};

watch(() => orderStore.page, async () => {
    await orderStore.getOrderHistory(userStore.user?.id, defaultAddress.value)
})

onMounted(async () => {
    await userStore.getUserData()
    await locationStore.getAllCustomerAddress(userStore.user?.id)
    defaultAddress.value = locationStore.userAddress?.length > 0 ? locationStore.userAddress?.filter((item: any) => (item.is_default == true))[0].id : ''
    await orderStore.getOrderHistory(userStore.user?.id, defaultAddress.value)
    // if(!orderStore.orderHistory) {
    // }
    await orderStore.getOrderType()
    orderType.value = orderStore.orderType?.filter((item: any) => item?.name === "refill")
})
</script>

<template>
    <v-container max-width="1200">
        <v-row class="align-center">
            <v-col md="6" sm="12" cols="12">
                <p class="text-h6 font-weight-bold mt-2">Order History</p>
                <p class="mt-2" v-if="orderStore.orderHistory?.length > 0">Reordering adds a refill cylinder to your
                    cart, but you’ll need to complete that order first.</p>
            </v-col>
            <v-col md="6" sm="12" cols="12" v-if="orderStore.orderHistory?.length > 1">
                <!-- <p class="text-h6 mb-1">Filter</p> -->
                <v-select variant="outlined" placeholder="Select Filter" v-model="filter" density="comfortable"
                    rounded="lg" :items="[
                        { title: 'Last 7 Days', value: 7 },
                        { title: 'Last 1 Month', value: 30 },
                        { title: 'Last 3 Months', value: 90 },
                        { title: 'Last 1 Year', value: 365 }
                    ]" @update:model-value="filterOrders" clearable/>
            </v-col>
        </v-row>
        <v-skeleton-loader type="card" :loading="orderStore.orderLoader" class="pt-2 bg-transparent">
            <div class="w-100 mt-2 overflow-auto" style="max-height: 75vh;">
                <OrdersOrderHistoryCard v-for="order in orderStore.orderHistory" :order="order"
                    v-if="orderStore.orderHistory?.length > 0" :status="order?.order_status"
                    :refill_id="orderType ? orderType?.[0].id : ''" />
                <p v-else>You have no order history</p>
            </div>
            <div class="w-100" v-if="orderStore.orderHistory?.length > 0">
                <v-pagination v-model="orderStore.page" :length="orderStore.pagination?.pages" rounded="circle"
                    :total-visible="7" class="mt-2" />
            </div>
        </v-skeleton-loader>
        <PromptsSuccess v-if="uiStore.notifyDialog" />
        <PromptsClearCart v-if="uiStore.clearCartDialog" />
    </v-container>
</template>
