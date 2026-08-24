<script setup lang="ts">
const uiStore = useUiStore()
const locationStore = useLocationStore()
const formStore = useFormStore()
const orderStore = useOrderStore()
const userStore = useUserStore()
const defaultLocation = ref<any>()
const loading = ref<boolean>(false)
const { xs } = useDisplay()
const route = useRoute()

const selectDefaultLocation = async() => {
    loading.value = true

    const data = {
        is_default: true
    }

    await patchRequestHandler(`location/customer/${userStore.user?.id}/address/${defaultLocation.value}`, data, true)
    .then( async(res) => {
        await locationStore.getAllCustomerAddress(userStore.user?.id)
        await orderStore.getOrderHistory(userStore.user?.id, defaultLocation.value)
        uiStore.changeLocation = false

    })
    .catch((error) => {
        formStore.error = error
    })
    .finally(() => {
        loading.value = false
    })
}

onBeforeMount(() => {
    defaultLocation.value = locationStore.userAddress?.length > 0 ? locationStore.userAddress?.filter((item:any) => (item.is_default == true))[0].id : ''
})
</script>

<template>
    <v-dialog v-model="uiStore.changeLocation" persistent transition="dialog-top-transition" max-width="450">
        <v-card>
            <v-card-text class="text-center">
                <div>
                    <v-icon icon="mdi-map-marker" color="redBtn" :size=" xs ? '60' : '100'"/>
                </div>
                <p class="text-h6 font-weight-black mt-3">Select Address</p>

                <p class="mt-3">From the provided <span class="font-weight-bold">locations</span> below select an address for product delivery. </p>
                <p class="mt-2"> {{ formStore.error }}</p>
                <v-radio-group class="mt-5 overflow-scroll" v-model="defaultLocation" :style="xs ? 'max-height: 245px' : 'max-height: 250px;'">
                    <div v-for="location in locationStore.userAddress" class="mb-2">
                        <v-radio :label="`${location?.ghana_post_address?.street} - ${location?.ghana_post_address?.address_code}`" :value="location.id" hide-details />
                    </div>
                </v-radio-group>

                <div class="mt-3">
                    <v-btn text="Select" class="bg-black text-capitalize mt-5 mb-3" block size="large" @click="selectDefaultLocation"
                    :disabled="!defaultLocation" :loading="loading"/>
                    <v-btn text="Cancel" variant="outlined" class="text-capitalize" block size="large" @click="uiStore.changeLocation = false"/>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>