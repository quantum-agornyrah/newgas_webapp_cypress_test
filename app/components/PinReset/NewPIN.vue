<script setup lang="ts">
import { useUiStore } from '@/stores/ui';
import { useUserStore } from '@/stores/user';
import { postRequestHandler } from '@/utils/httpHandler';


const uiStore = useUiStore()
const userStore = useUserStore()
const loading = ref<boolean>(false)
const otp = ref<string>('')
const confirm_otp = ref<string>('')
const checkPIN = ref<boolean>(false)

const resetPin = async() => {
    loading.value = true
    
    const data = ref<any>({
        pin: otp.value
    })

    await postRequestHandler(`nova_auth/customer/${userStore.user?.id}/reset_pin`, data.value)
    .then(res => {
        uiStore.success = true
        uiStore.notifyTitle = "Success"  
        uiStore.notifyMessage = "Your PIN has been successfully updated"
        uiStore.notifyDialog = true
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

watchEffect(() => {
    if(confirm_otp.value){
        if(otp.value !== confirm_otp.value){
            checkPIN.value = true
        } else{
            checkPIN.value = false
        }
    } else{
        checkPIN.value = false
    }
})
</script>

<template>
    <div class="text-center">
        <p class="mt-2">Enter and confirm your new PIN</p>
        <v-row class="mt-2 justify-center">
            <v-col cols="12">
                <p>New Pin</p>
                <v-otp-input v-model="otp" length="4" type="password"/>
            </v-col>
            <v-col cols="12">
                <p>Confirm Pin</p>
                <v-otp-input v-model="confirm_otp" length="4" type="password"/>
                <p class="text-error" v-if="checkPIN">Both PIN should match</p>
            </v-col>
        </v-row>
        <v-row class="justify-center">
            <v-col cols="12">
                <v-btn class="bg-black" size="large" block @click="resetPin" :loading="loading" :disabled="otp.length !== 4 || confirm_otp.length !== 4 || checkPIN">
                    Submit
                </v-btn>
            </v-col>
        </v-row>

        <div>

        </div>
    </div>
</template>