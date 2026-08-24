<script lang="ts" setup>
import { useUiStore } from '@/stores/ui';

const uiStore = useUiStore()
const router = useRouter()
const route = useRoute()
const depositStore = useDepositStore()
                  
const close = () => {
    if(route.path === '/cylinderdeposit') {
        if(uiStore.notifyMessage === `Added ${depositStore.depositFromProducts ? depositStore.depositFromProducts?.style_name : JSON.parse(sessionStorage.getItem('deposit') ?? '{}')?.style_name} to cart`){
            router.push('/products')
            uiStore.notifyDialog = false
            sessionStorage.removeItem('deposit')
        }
    } else if(route.path === '/orderdetails') {
        if(uiStore.notifyMessage === `Order successfully created`) {
            router.push('/orders')
            uiStore.notifyDialog = false
        }
    } else if (route.path === '/forgotpin') {
        if(uiStore.notifyMessage === `Your PIN has been successfully updated`) {
            router.push('/orders')
            uiStore.notifyDialog = false
        }
    }
    else if (route.path === '/') {
        if(uiStore.notifyMessage === `Pin successfully created`) {
            router.push('/orders')
            uiStore.notifyDialog = false
        }
    }
        uiStore.notifyDialog = false
}
</script>

<template>
    <v-dialog v-model="uiStore.notifyDialog" max-width="410" transition="dialog-top-transition" persistent>
        <v-card class="text-center">
            <v-card-text class="pa-10">
                <!-- <v-icon :icon="uiStore.success ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline'" size="100px" :color="uiStore.success ? 'success' : 'error'"/> -->
                <img src="@/assets/success.png" alt="success" width="160" v-if="uiStore.success"/>
                <v-icon icon="mdi-alert-circle-outline" size="100px" color="error" v-if="!uiStore.success"/>
                <p class="mt-5 text-h5 font-weight-black">{{ uiStore.notifyTitle }}</p>
                <p class="mt-10">{{ uiStore.notifyMessage }}</p>
            </v-card-text>
            <v-card-actions class="pa-3">
                <v-btn block class="bg-black text-capitalize" @click="close" size="large">
                    Ok
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
 