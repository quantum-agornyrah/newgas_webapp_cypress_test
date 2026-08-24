<script setup lang="ts">
import { useUiStore } from '@/stores/ui';
import { patchRequestHandler } from '@/utils/httpHandler';

const uiStore = useUiStore()
const orderStore = useOrderStore()
const locationStore = useLocationStore()
const userStore = useUserStore()
const step = ref<number>(1)
const chip = ref<string>('')
const other = ref<string>('')
const loading = ref<boolean>(false)
const router = useRouter()
const defaultAddress = ref<any>()

const props = defineProps<{ order: any }>()

const cancelOrder = async() => {
    loading.value = true

    const data = ref<object>({
        order_status: "cancelled_by_customer",
        cancellation_reason_title: chip.value,
        cancellation_reason_comment: other.value
    })

    await patchRequestHandler(`order/${props.order?.order_details.id}/cancel_order`, data.value, true)
    .then(res => {
        step.value++
    })
    .catch((error) => {
        uiStore.transactionDialog = false
        uiStore.success = false
        uiStore.notifyTitle = "Error"
        uiStore.notifyMessage = error
        uiStore.notifyDialog = true
    })
    .finally(() => {
        loading.value = false
    })
}

const orderCancelled = async() => {
    uiStore.transactionDialog = false
    await locationStore.getAllCustomerAddress(userStore.user?.id)
    defaultAddress.value = locationStore.userAddress?.filter((item: any) => (item.is_default == true))[0].id
    await orderStore.getOrderHistory(userStore.user?.id, defaultAddress.value)
    router.push('/orders')
}
</script>

<template>
    <v-dialog v-model="uiStore.transactionDialog" max-width="425" persistent transition="dialog-top-transition" scrollable>
        <v-window v-model="step">
            <v-window-item :value="1">
                <v-card class="text-center">
                    <v-card-text class="pa-10">
                        <v-icon icon="mdi-alert-circle-outline" size="100px" color="error" />
                        <p class="mt-5 text-h5 font-weight-black">{{ uiStore.transTitle }}</p>
                        <p class="mt-10 text-body-1">{{ uiStore.transError }}</p>
                    </v-card-text>
                    <v-card-actions class="px-7 pb-5 flex-column">
                        <v-btn class="text-capitalize mb-3" block variant="outlined" @click="uiStore.transactionDialog = false" size="large">
                            No, Continue
                        </v-btn>
                        <v-btn block class="bg-black text-capitalize" @click="step++" size="large">
                            Yes, Cancel
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-window-item>

            <v-window-item :value="2">
                <v-card class="text-center">
                    <v-card-text class="pa-7 pb-4">
                        <v-icon icon="mdi-alert-circle-outline" size="100px" color="error" />
                        <p class="mt-5 text-h5 font-weight-black">{{ uiStore.transTitle }}</p>
                        <p class="mt-5">Are you sure you want to cancel this order? Choose a reason for order cancellation</p>
                        <v-chip-group v-model="chip"  selected-class="text-red" column class="mt-3">
                            <v-chip value="Changed_my_mind">Changed my mind</v-chip>
                            <v-chip value="Delivery_delayed">Delivery delayed</v-chip>
                            <v-chip value="Need_to_change_address">Need to change address</v-chip>
                            <v-chip value="Ordered_by_mistake">Ordered by mistake</v-chip>
                            <v-chip value="Other">Other</v-chip>
                        </v-chip-group>
                        <v-textarea variant="outlined" rounded="lg" rows="3" class="mt-2" v-if="chip == 'Other'" v-model="other"/>
                    </v-card-text>
                    <v-card-actions class="px-7 pb-5 flex-column">
                        <v-btn block class="text-capitalize mb-3" variant="outlined" size="large" @click="uiStore.transactionDialog = false">
                            No, Keep
                        </v-btn>
                        <v-btn block class="text-capitalize bg-black" @click="cancelOrder" size="large" :loading="loading" :disabled="!chip">
                            Yes, Remove
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-window-item> 
            <v-window-item :value="3">
                <v-card class="text-center">
                    <v-card-text class="pa-10">
                        <v-icon icon="mdi-check-circle-outline" size="100px" color="success" />
                        <p class="mt-5 text-h5 font-weight-black">Success</p>
                        <p class="mt-10 text-body-1">Your order has been cancelled successfully</p>
                    </v-card-text>
                    <v-card-actions class="pa-3">
                        <v-btn block class="bg-black" @click="orderCancelled" size="large">
                            Ok
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-window-item>
        </v-window>
    </v-dialog>
</template>