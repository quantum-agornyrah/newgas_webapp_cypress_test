<script setup lang="ts">
const orderStore = useOrderStore()
const userStore = useUserStore()
const uiStore = useUiStore()
const router = useRouter()
const step = ref<number>(1);
const { smAndDown, sm } = useDisplay()
const loading = ref<boolean>(false)
const props = defineProps<{ status: string, order: any, refill_id:string }>();
const cartStore = useCartStore()

const viewOrder = (id: string) => {
    orderStore.orderStatusLoader = true
    router.push(`/orderstatus/${id}`)
}

const reOrder = async (product_id:string) => {
    loading.value = true;

    if (cartStore.cart?.cart_items.quantity > 0) {
        uiStore.clearCartDialog = true  
        loading.value = false
        return
    } else {
        await orderStore.getOrderDetails(userStore.user?.id, product_id)
    
        const data = ref<any>([])
        for (let product of orderStore.orderDetails?.order_items_details) {
            if (product?.product_data_details && product?.product_data_details?.category_name === "Cylinder") {
                data.value.push({
                    product_style_id: product?.product_style_id	,
                    previous_product_style_id: product?.product_style_id,
                    order_type: props.refill_id,
                    quantity: product?.quantity,
                    deposit_token_id: product?.deposit_token_id,
                    cart_type: product.cart_type ? product?.cart_type : 'product',
                    is_self_pickup: false,
                    is_active: true,
                    ...(product.service_id && { service_id: product.service_id })
                })
            }
        }
    
       await postRequestHandler(`order/customers/${userStore.user?.id}/carts_list?customer_id=${userStore.user?.id}`, {cart_list: data.value}, true)
        .then(res => {
           router.push(`/orderdetails/${product_id}`)
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
}

const updateStep = (status: string) => {
    switch (status) {
        case "created":
            step.value = 1;
            break;
        case "confirmed":
            step.value = 2;
            break;
        case "completed":
            step.value = 3;
            break;
        case "cancelled":
            step.value = 0;
            break;
        default:
            step.value;
    }
};

updateStep(props.status);

watch(() => props.status, (newStatus) => {
    updateStep(newStatus);
});
</script>

<template>
    <v-card class="mb-8 pa-2" rounded="lg" v-if="!smAndDown">
        <v-card-text>
            <v-row class="align-center">
                <v-col md="1">
                    <img src="@/assets/order-history.png" alt="Order History" width="90" />
                </v-col>
                <v-col md="3" sm="4" class="d-flex justify-center">
                    <div>
                        <p v-for="product in order?.products" class="mb-1">
                            {{ product?.style_name }}
                        </p>
                        <p class="mt-2 font-weight-bold">
                            {{ new Date(order?.created_at)?.toDateString() }}
                        </p>
                    </div>
                </v-col>
                <v-col md="2">
                    <p class="text-info font-weight-bold">GHS {{ order?.transactions?.[0]?.payable_amount }}</p>
                </v-col>
                <v-col md="2" sm="4" class="d-flex justify-center">
                    <div class="d-flex flex-column justify-center align-center" v-if="status === 'cancelled'">
                        <v-stepper v-model="step" elevation="0" mobile class="bg-transparent">
                            <v-stepper-header class="pa-0">
                                <v-stepper-item color="error" :value="1" :complete="step == 0"
                                    complete-icon="mdi-close">
                                </v-stepper-item>

                                <v-stepper-item color="error" :value="2" :complete="step == 0"
                                    complete-icon="mdi-close"></v-stepper-item>

                                <v-stepper-item color="error" :value="3" :complete="step == 0"
                                    complete-icon="mdi-close"></v-stepper-item>
                            </v-stepper-header>
                        </v-stepper>
                        <p class="text-capitalize"> {{ status }} </p>
                    </div>
                    <div v-else class="d-flex flex-column justify-center align-center">
                        <v-stepper v-model="step" elevation="0" mobile class="bg-transparent">
                            <v-stepper-header class="pa-0">
                                <v-stepper-item :color="step > 0 ? 'success' : 'stepper'" :value="1"
                                    :complete="step > 0" complete-icon="mdi-check">
                                </v-stepper-item>

                                <v-stepper-item :color="step > 1 ? 'success' : 'stepper'" :value="2"
                                    :complete="step >= 2"></v-stepper-item>

                                <v-stepper-item :color="step > 2 ? 'success' : 'stepper'" :value="3"
                                    :complete="step == 3"></v-stepper-item>
                            </v-stepper-header>
                        </v-stepper>
                        <p class="text-capitalize"> {{ status }} </p>
                    </div>
                </v-col>
                <v-col md="2">
                    <p class="text-right text-decoration-underline text-blue cursor-pointer"><a
                            @click="viewOrder(order?.id)">View Order</a></p>
                </v-col>
                <v-col md="2" class="text-right">
                    <v-btn text="Reorder" class="bg-black text-capitalize" @click="reOrder(order?.id)" :loading="loading"  :disabled="status != 'completed'"/>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>

    <v-card class="pa-3 pb-0 mb-10 elevation-2" rounded="lg" v-else>
        <v-card-text class="pa-2">
            <v-row class="align-center">
                <v-col cols="3">
                    <img src="@/assets/order-history.png" alt="Order History" :width="sm ? '90' : '60'" />
                </v-col>
                <v-col cols="6" :class="[sm ? 'd-flex' : '', sm ? 'justify-center' : '']">
                    <div>
                        <p v-for="product in order?.products" class="mb-2">
                            {{ product?.style_name }}
                        </p>
                        <div class="d-flex align-center justify-space-between">
                            <p class="mt-1 font-weight-bold text-subtitle-2 text-medium-emphasis">
                                {{ new Date(order?.created_at)?.toDateString() }}
                            </p>
                        </div>
                    </div>
                </v-col>
                <v-col cols="3" :class="[sm ? 'd-flex' : '', sm ? 'justify-center' : '']">
                    <p class="text-info font-weight-bold mt-1">GHS {{ order?.transactions?.[0]?.payable_amount }}</p>
                </v-col>
                <v-col class="d-flex justify-center pa-0" cols="12">
                    <div class="d-flex flex-column justify-center align-center" v-if="status === 'cancelled'">
                        <v-stepper v-model="step" elevation="0" mobile class="bg-transparent">
                            <v-stepper-header class="pa-0">
                                <v-stepper-item color="error" :value="1" :complete="step == 0"
                                    complete-icon="mdi-close">
                                </v-stepper-item>

                                <v-stepper-item color="error" :value="2" :complete="step == 0"
                                    complete-icon="mdi-close"></v-stepper-item>

                                <v-stepper-item color="error" :value="3" :complete="step == 0"
                                    complete-icon="mdi-close"></v-stepper-item>
                            </v-stepper-header>
                        </v-stepper>
                        <p class="text-capitalize">{{ status }} </p>
                    </div>
                    <div v-else class="d-flex flex-column justify-center align-center">
                        <v-stepper v-model="step" elevation="0" mobile class="bg-transparent pa-0">
                            <v-stepper-header class="pa-0">
                                <v-stepper-item :color="step > 0 ? 'success' : 'stepper'" :value="1"
                                    :complete="step > 0" complete-icon="mdi-check">
                                </v-stepper-item>

                                <v-stepper-item :color="step > 1 ? 'success' : 'stepper'" :value="2"
                                    :complete="step >= 2"></v-stepper-item>

                                <v-stepper-item :color="step > 2 ? 'success' : 'stepper'" :value="3"
                                    :complete="step == 3"></v-stepper-item>
                            </v-stepper-header>
                        </v-stepper>
                        <p class="text-capitalize mt-0">{{ status }} </p>
                    </div>
                </v-col>
                <v-col cols="12">
                    <v-divider></v-divider>
                    <div class="d-flex align-center justify-space-between pt-4">
                        <p class="text-right text-decoration-underline text-blue cursor-pointer"><a
                                @click="viewOrder(order?.id)">View Order</a></p>
                        <v-btn text="Reorder" class="bg-black text-capitalize" @click="reOrder(order?.id)" :loading="loading" :disabled="status != 'completed'" />
                    </div>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>