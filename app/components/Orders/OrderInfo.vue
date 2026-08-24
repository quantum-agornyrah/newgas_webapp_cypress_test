<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

const uiStore = useUiStore()
const userStore = useUserStore()
const depositStore = useDepositStore()
const orderStore = useOrderStore()
const locationStore = useLocationStore()
const cartStore = useCartStore()
const { xs } = useDisplay()
const loading = ref<boolean>(false)
const router = useRouter()
const bg = getRandomLightColors(100)
const deliveryAddress = ref<any>()
const date = ref<string>('')
const deliveryTime = ref<any>()
const deleteItem = ref<any>()
const deliveryType = ref<any>()
const fastDelivery = ref<any>()
const regularDelivery = ref<any>()
const timeItems = ref<any>()
const load = ref<boolean>(false)
const reorderAddress = ref<any>()
const props = defineProps<{ params: string }>()
const form = ref<boolean>(false)
const rules = ref({
    required: (val: string) => {
        if (val) {
            return true;
        }
        return "Field is required";
    },
});


const getDeliveryTypes = async () => {
    await getRequestHandler('order/delivery_type?is_active=true&is_deleted=false', true)
        .then(res => {
            regularDelivery.value = res.items[0]
            fastDelivery.value = res.items[1]
        })
        .catch((error) => {
            console.error(error)
        })
}

const getTimeSlots = async () => {
    await getRequestHandler(`location/timeslots`)
        .then(res => timeItems.value = res.items)
        .catch((error) => {
            console.error(error)
        })
}

const removeFromCart = (item: any) => {
    uiStore.actionTitle = "Remove Product?"
    uiStore.actionPrompt = `Are you sure you want to remove ${item?.style_name} from your cart?`
    uiStore.actionDialog = true
    deleteItem.value = item
}

const deleteFromCart = async () => {
    loading.value = true

    await deleteRequestHandler(`order/customers/${userStore.user?.id}/carts/${deleteItem.value?.id}`, true)
        .then(async (res) => {
            uiStore.actionDialog = false
            // uiStore.success = true
            // uiStore.notifyTitle = "Success"
            // uiStore.notifyMessage = `Successfully removed ${deleteItem.value?.name} from your cart`
            // uiStore.notifyDialog = true
            Promise.all([
                await cartStore.getCustomerCart(userStore.user?.id),
                await orderStore.getOrderType()
            ])
            cartStore.orderTypes = cartStore.cart?.cart_items?.product?.map((item: any) => {
                return { ...item, orderTypeName: orderStore.orderType?.filter((type: any) => type.id == item.order_type)[0].name }
            })
        })
        .catch((error) => {
            uiStore.actionDialog = false
            uiStore.success = false
            uiStore.notifyTitle = "Error"
            uiStore.notifyMessage = error || 'Failed to remove from cart'
            uiStore.notifyDialog = true
        })
        .finally(() => {
            loading.value = false
        })
}

const confirmOrder = async () => {
    load.value = true

    const data = ref<any>({
        customer_id: userStore.user?.id,
        receiver_contact: userStore.user?.phone,
        delivery_address_id: deliveryAddress.value?.id,
        delivery_cost_to_company: deliveryType.value?.delivery_cost,
        delivery_status: 'created',
        preferred_delivery_date: new Date(date.value)?.toISOString(),
        preferred_delivery_slot: deliveryTime.value,
        delivery_type_id: deliveryType.value?.id,
        cart_type: cartStore.orderTypes?.some((item: any) => item.style_name?.toLowerCase().includes('cylinder') || item.category?.toLowerCase().includes('accessories')) ? 'product' : 'service'
    })

    await postRequestHandler(`order/webapp/customer`, data.value, true)
        .then(res => {
            uiStore.success = true
            uiStore.notifyTitle = "Success"
            uiStore.notifyMessage = `Order successfully created`
            uiStore.notifyDialog = true
            cartStore.getCustomerCart(userStore.user?.id)
        })
        .catch((error) => {
            uiStore.success = false
            uiStore.notifyTitle = "Error"
            uiStore.notifyMessage = error || 'Failed to create order'
            uiStore.notifyDialog = true
        })
        .finally(() => {
            load.value = false
        })
}

watchEffect(() => {
    deliveryAddress.value = locationStore.userAddress?.filter((item: any) => (item.is_default == true))[0]
    reorderAddress.value = `${deliveryAddress.value?.ghana_post_address?.street} - ${deliveryAddress.value?.ghana_post_address?.address_code}`
})

onMounted(async () => {
    depositStore.fromOrderDetails = true
    Promise.all([
        await getDeliveryTypes(),
        await getTimeSlots(),
    ])
    deliveryAddress.value = locationStore.userAddress?.filter((item: any) => (item.is_default == true))[0]
    reorderAddress.value = `${deliveryAddress.value?.ghana_post_address?.street} - ${deliveryAddress.value?.ghana_post_address?.address_code}`
})
</script>

<template>
    <v-container max-width="1200">
        <p class="text-h6 font-weight-bold">Order Details</p>
        <p class=" mt-4">Please check to confirm order before you confirm payment</p>

        <v-skeleton-loader type="card,card,card" class="bg-transparent mt-5 w-100" :loading="cartStore.cartLoader">
            <v-form v-model="form" @submit.prevent="confirmOrder">
                <v-card class="pa-2 w-100" rounded="lg">
                    <v-card-text>
                        <p class="text-h6 font-weight-bold" v-if="!xs">Product Details</p>
                        <p class="font-weight-black" v-if="xs">Product Details</p>

                        <v-row class="mt-1 align-center justify-space-between" v-if="!xs"
                            v-for="(product, index) in cartStore.orderTypes">
                            <v-col>
                                <div class="pa-2 rounded-lg" :style="`background-color: ${bg?.[Number(index)]}; width: 90px;`">
                                    <v-img :src="product?.thumbnail_image" :alt="product?.style_description"
                                        height="60px" />
                                </div>
                            </v-col>
                            <v-col>
                                <div>
                                    <v-img src="@/assets/cart-cashdepo.png" alt="cash deposit" width="88"
                                        v-if="product?.orderTypeName == 'new'" />
                                    <v-img src="@/assets/cart-exchange.png" alt="cylinder deposit" width="88"
                                        v-else-if="product?.orderTypeName == 'exchange'" />
                                    <v-img src="@/assets/cart-refill.png" alt="refill" width="88"
                                        v-else-if="product?.orderTypeName == 'refill'" />
                                    <v-img src="@/assets/cart-accessories.png" alt="accessories" width="88"
                                        v-else-if="product?.orderTypeName == 'pay_at_once'" />
                                </div>
                            </v-col>
                            <v-col>
                                <p class="">{{ product?.style_name }}</p>
                            </v-col>
                            <v-col class="text-center">
                                <p v-if="product?.orderTypeName !== 'pay_at_once'">Cylinder Cost: {{
                                    product?.deposit_cost }}</p>
                                <p v-else>Cylinder Cost: 0</p>
                            </v-col>
                            <v-col class="text-center">
                                <p v-if="product?.orderTypeName !== 'pay_at_once'">Gas Cost: {{ product?.gas_cost }}</p>
                                <p v-else>Gas Cost: 0</p>
                            </v-col>
                            <v-col class="text-center">
                                <p>Quantity: {{ product?.quantity }}</p>
                            </v-col>
                            <v-col class="text-center">
                                <p class="font-weight-black  text-info">GHS {{ product?.payable_amount * product?.quantity }}</p>
                            </v-col>
                            <v-col class="text-center">
                                <v-btn icon="mdi-delete-outline" color="error" variant="text"
                                    @click="removeFromCart(product)" />
                            </v-col>
                        </v-row>

                        <v-row class="mt-3 align-center" v-if="xs" v-for="(product, index) in cartStore.orderTypes">
                            <v-col>
                                <div class="pa-2 rounded-lg" :style="`background-color: ${bg?.[Number(index)]}; width: 70px;`">
                                    <v-img :src="product?.thumbnail_image" :alt="product?.style_description"
                                        height="40px" />
                                </div>
                            </v-col>
                            <v-col>
                                <p>{{ product?.style_name }}</p>
                            </v-col>
                            <v-col>
                                <div>
                                    <v-img src="@/assets/cart-cashdepo.png" alt="cash deposit" width="88"
                                        v-if="product?.orderTypeName == 'new'" />
                                    <v-img src="@/assets/cart-exchange.png" alt="cylinder deposit" width="88"
                                        v-else-if="product?.orderTypeName == 'exchange'" />
                                    <v-img src="@/assets/cart-refill.png" alt="refill" width="88"
                                        v-else-if="product?.orderTypeName == 'refill'" />
                                    <v-img src="@/assets/cart-accessories.png" alt="accessories" width="88"
                                        v-else-if="product?.orderTypeName == 'pay_at_once'" />
                                </div>
                            </v-col>
                            <v-col cols="12">
                                <div class="d-flex justify-space-between">
                                    <div>
                                        <p v-if="product?.orderTypeName !== 'pay_at_once'">Cylinder Cost: {{
                                            product?.deposit_cost }}</p>
                                        <p v-else>Cylinder Cost: 0</p>
                                    </div>
                                    <div>
                                        <p v-if="product?.orderTypeName !== 'pay_at_once'">Gas Cost: {{
                                            product?.gas_cost }}</p>
                                        <p v-else>Gas Cost: 0</p>
                                    </div>
                                    <div>
                                        <p>Quantity: {{ product?.quantity }}</p>
                                    </div>
                                </div>
                            </v-col>
                            <v-col cols="12" class="pt-0">
                                <div class="d-flex align-center justify-space-between">
                                    <p class="font-weight-black text-info">GHS {{ product?.payable_amount * product?.quantity }}</p>
                                    <v-btn icon="mdi-delete-outline" color="error" variant="text"
                                        @click="removeFromCart(product)" />
                                </div>
                                <v-divider class="mt-4" opacity="0.4" v-if="!params" />
                            </v-col>
                        </v-row>

                        <p class="my-5" v-if="cartStore.orderTypes?.length == 0">Your Cart is empty</p>

                        <v-divider class="mt-4" opacity="0.4" v-if="!params && !xs" />

                        <v-row class="mt-3 justify-center">
                            <v-col cols="12" sm="5" md="4" v-if="!params">
                                <v-btn v-if="!xs" :text="cartStore.orderTypes?.length == 0 ? 'Add Product' : 'Add More'"
                                    class="text-capitalize" variant="outlined" prepend-icon="mdi-plus" size="large"
                                    block @click="uiStore.addProduct = true" />
                                <v-btn v-if="xs" :text="cartStore.orderTypes?.length == 0 ? 'Add Product' : 'Add More'"
                                    class="text-capitalize" variant="outlined" prepend-icon="mdi-plus" block
                                    @click="uiStore.addProduct = true" />
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>

                <v-card class="mt-5 pa-2 w-100" rounded="lg" v-if="!xs">
                    <v-card-text>
                        <p class="text-h6 font-weight-bold">Delivery Details</p>
                        <v-row class="mt-2 justify-space-between">
                            <v-col md="5">
                                <div>
                                    <p>Delivery Address</p>
                                    <v-text-field variant="outlined" rounded="lg" class="mt-2" v-model="reorderAddress"
                                        readonly />
                                </div>
                            </v-col>
                            <v-col md="5" class="justify-end">
                                <div></div>
                                <p class="">Please select delivery time slot</p>
                                <v-select variant="outlined" v-model="deliveryTime" hide-details :items="timeItems"
                                    item-title="start_time" item-value="id" placeholder="Select Time"
                                    :return-object="false" class="mt-2" rounded="lg" :rules="[rules.required]">
                                    <template v-slot:selection="{ item }: any">
                                        <span>{{ item.raw?.start_time }} - {{ item.raw?.end_time }}</span>
                                    </template>
                                    <template v-slot:item="{ props, item }: any">
                                        <v-list-item v-bind="props"
                                            :title="item.raw?.start_time + ' - ' + item.raw?.end_time"></v-list-item>
                                    </template>
                                </v-select>
                            </v-col>
                        </v-row>

                        <v-radio-group class="mt-3" v-model="deliveryType" :rules="[rules.required]">
                            <v-row>
                                <v-col md="7">
                                    <div class="font-weight-black d-flex">
                                        <div class="w-25">
                                            <v-radio label="Free delivery" :value="regularDelivery" />
                                        </div>
                                        <v-radio label="Fast delivery(Prime delivery)" :value="fastDelivery" />
                                    </div>
                                </v-col>
                            </v-row>
                        </v-radio-group>

                        <v-row class="justify-space-between">
                            <v-col md="5">
                                <p class="">Delivery Date</p>
                                <VueDatePicker placeholder="Select Date" class="mt-2" :teleport="true"
                                    :min-date="new Date()" :enable-time-picker="false" auto-apply required
                                    :ui="{ input: 'date' }" v-model="date" />
                            </v-col>
                            <v-col md="5" class="d-flex justify-start">
                                <div class=" d-flex align-center ga-4">
                                    <p class="font-weight-bold">Your phone number: </p>
                                    <p>{{ userStore.user?.phone }}</p>
                                </div>
                            </v-col>
                        </v-row>
                        <v-divider class="mt-3" opacity="0.3" />
                        <div class="mt-3  ">
                            <p>
                                <span class="font-weight-black">Delivery Instructions:</span>
                                Please be with your phone to make reaching you easy for delivery persons. Regular
                                delivery will
                                be between 24 to 48 hrs after placing the order .Thank You!
                            </p>
                        </div>
                    </v-card-text>
                </v-card>

                <v-card class="mt-5 pa-2 w-100" rounded="lg" v-else>
                    <v-card-text>
                        <p class="font-weight-black">Delivery Details</p>
                        <v-row>
                            <v-col cols="12">
                                <div class="mt-4">
                                    <p>Delivery Address</p>
                                    <v-text-field variant="outlined" rounded="lg" class="mt-2" v-model="reorderAddress" density="comfortable"
                                        readonly />
                                </div>
                            </v-col>
                        </v-row>

                        <v-radio-group class="mt-3" v-model="deliveryType" :rules="[rules.required]">
                            <v-row>
                                <v-col cols="6">
                                    <div class="d-flex align-center ga-1">
                                        <v-radio :value="regularDelivery" />
                                        <p>Free delivery</p>
                                    </div>
                                </v-col>
                                <v-col cols="6" class="d-flex justify-end">
                                    <div class="d-flex align-center ga-1">
                                        <v-radio :value="fastDelivery" />
                                        <p>Fast delivery</p>
                                    </div>
                                </v-col>
                            </v-row>
                        </v-radio-group>

                        <v-row class="justify-space-between">
                            <v-col cols="12">
                                <p class="">Delivery Date</p>
                                <VueDatePicker placeholder="Select Date" class="mt-2" :teleport="true"
                                    :min-date="new Date()" :enable-time-picker="false" auto-apply required
                                    :ui="{ input: 'date' }" v-model="date" />
                            </v-col>
                            <v-col cols="12" class="justify-end">
                                <div></div>
                                <p class="">Please select delivery time slot</p>
                                <v-select variant="outlined" v-model="deliveryTime" hide-details :items="timeItems"
                                    item-title="start_time" item-value="id" placeholder="Select Time"
                                    :return-object="false" density="comfortable" rounded="lg" class="mt-2"
                                    :rules="[rules.required]">
                                    <template v-slot:selection="{ item }: any">
                                        <span>{{ item.raw?.start_time }} - {{ item.raw?.end_time }}</span>
                                    </template>
                                    <template v-slot:item="{ props, item }: any">
                                        <v-list-item v-bind="props"
                                            :title="item.raw?.start_time + ' - ' + item.raw?.end_time"></v-list-item>
                                    </template>
                                </v-select>
                            </v-col>
                            <v-col cols="12">
                                <div class=" d-flex align-center justify-space-between">
                                    <p>Your phone number: </p>
                                    <p>{{ userStore.user?.phone }}</p>
                                </div>
                            </v-col>
                        </v-row>
                        <v-divider class="mt-3" opacity="0.3" />
                        <div class="mt-3  ">
                            <p>
                                <span class="font-weight-black">Delivery Instructions:</span>
                                Please be with your phone to make reaching you easy for delivery persons. Regular
                                delivery will
                                be between 24 to 48 hrs after placing the order. Thank You!
                            </p>
                        </div>
                    </v-card-text>
                </v-card>

                <v-card class="mt-5 pa-2 w-100" rounded="lg">
                    <v-card-text>
                        <p class="text-h6 font-weight-bold" v-if="!xs">Payment Details</p>
                        <p class="font-weight-black" v-if="xs">Payment Details</p>
                        <!-- <div class=" d-flex align-center justify-space-between mt-4">
                            <p>Product cost</p>
                            <p>GHS 40.00</p>
                        </div> -->
                        <div class=" d-flex align-center justify-space-between mt-5">
                            <p>Delivery charge</p>
                            <p class="text-error">GHS {{ deliveryType?.delivery_cost ? deliveryType?.delivery_cost :
                                '0.00' }}
                            </p>
                        </div>
                        <div class="bg-lightYellow pa-6  d-flex align-center justify-space-between mt-5">
                            <p>Total</p>
                            <p v-if="deliveryType?.delivery_cost">GHS {{ cartStore.cart?.cart_items?.total_cost +
                                parseInt(deliveryType?.delivery_cost) }}</p>
                            <p v-else>GHS {{ cartStore.cart?.cart_items?.total_cost + parseInt('0.00') }}</p>
                        </div>

                        <p class="text-h6 font-weight-bold mt-4" v-if="!xs">Payment option</p>
                        <p class="font-weight-bold mt-4" v-if="xs">Payment option</p>
                        <v-card class="mt-3" :class="xs ? 'pa-3' : 'pa-5'">
                            <v-card-text>
                                <div class="d-flex align-center justify-space-between">
                                    <div class="">
                                        <p class="font-weight-bold">Cash on delivery/Pay on delivery</p>
                                        <p class="mt-2">Only Cash accepted</p>
                                    </div>
                                    <img src="@/assets/cashondelivery.svg" alt="cash on delivery" width="60" />
                                </div>
                                <v-row class="mt-2 justify-center">
                                    <v-col cols="12" md="5" sm="6">
                                        <v-btn v-if="!xs" text="Confirm Order" class="text-capitalize bg-black"
                                            size="large" block rounded="lg" type="submit" :loading="load"
                                            :disabled="!(form && date && cartStore.orderTypes.length > 0)" />
                                        <v-btn v-if="xs" text="Confirm Order" class="text-capitalize bg-black" block
                                            :loading="load" rounded="lg" type="submit"
                                            :disabled="!(form && date && cartStore.orderTypes.length > 0)" />
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-card-text>
                </v-card>
            </v-form>
        </v-skeleton-loader>
        <LocationChangeLocation v-if="uiStore.changeLocation" />
        <PromptsSuccess v-if="uiStore.notifyDialog" />
        <PromptsAction :action="deleteFromCart" :loading="loading" v-if="uiStore.actionDialog" />
        <PromptsAddProduct v-if="uiStore.addProduct" />
    </v-container>
</template>