<script setup lang="ts">
import { deleteRequestHandler, patchRequestHandler } from '@/utils/httpHandler'

const uiStore = useUiStore()
const userStore = useUserStore()
const locationStore = useLocationStore()
const deleteItem = ref<any>()
const loading = ref<boolean>(false)
defineProps<{
    item: any,
    deletePrompt: (item: any) => void
}>()

const selectDefaultLocation = async(address_id: string) => {
    loading.value = true

    const data = {
        is_default: true
    }

    await patchRequestHandler(`location/customer/${userStore.user?.id}/address/${address_id}`, data, true)
    .then( async(res) => {
        await locationStore.getAllCustomerAddress(userStore.user?.id)
    })
    .catch((error) => {
            uiStore.success = false
            uiStore.notifyTitle = "Error"
            uiStore.notifyMessage = error || 'Failed to set address as default'
            uiStore.notifyDialog = true
    })
    .finally(() => {
        loading.value = false
    })
}
</script>

<template>
    <v-card class="mt-4 pa-3">
        <v-card-text>
            <div class="d-flex align-center justify-space-between">
                <h4 class="text-body-1 font-weight-black">{{ item.name }}</h4>
                <p v-if="item.is_default" class="text-success text-subtitle-2 font-weight-bold">
                    Default location</p>
            </div>
            <div class="mt-4 text-body-1 font-weight-bold">
                <h4>{{ item.ghana_post_address.address_code }}, {{ item.ghana_post_address.area }}
                </h4>
                <h4>{{ item.ghana_post_address.region }}, {{ item.ghana_post_address.district }}
                </h4>
                <h4 class="mt-4">Phone number: {{ item.phone }} </h4>
            </div>
            <div class="mt-3 d-flex align-center justify-space-between">
                <v-btn class="text-capitalize" variant="text" size="small" @click="deletePrompt(item)">
                    <h4 class="text-error">Remove</h4>
                </v-btn>
                <v-btn text="Set default location" variant="outlined" class="text-capitalize"
                    @click="selectDefaultLocation(item?.id)" :loading="loading" v-if="!item.is_default" />
            </div>
        </v-card-text>
    </v-card>
</template>