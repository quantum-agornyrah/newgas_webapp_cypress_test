<template>
    <v-btn v-if="step > 1" prepend-icon="mdi-arrow-left-top" text="Back" variant="text" @click="back" />
    <v-row>
        <v-col>
            <v-window v-model="step">   
                <v-window-item :value="1">
                    <v-container class="text-center">
                        <div>
                            <p class="text-h6 font-weight-bold">Enter one-time password</p>
                            <img src="@/assets/otp.png" width="200" class="mt-3" />
                            <p class="mt-3" v-if="!xs">Please enter the 6-digit One-time password (OTP)<br> we have sent to your number {{ userStore.user?.phone }}</p>
                            <p class="mt-3" v-else>Please enter the 6-digit One-time password (OTP) we have sent to your number {{ userStore.user?.phone }}</p>

                            <v-row class="mt-2 justify-center">
                                <v-col cols="12">
                                    <v-otp-input v-model="otp"/>
                                </v-col>
                            </v-row>
                            <v-row class="d-flex justify-space-between">
                                <v-col>
                                    <p>OTP Code valid for</p>
                                </v-col>
                                <v-col class="text-right">
                                    <p v-if="profileStore.timeDiff > 0">{{ profileStore.mins }}:{{ profileStore.secs }}</p>
                                    <p class="text-center text-error" v-if="profileStore.timeDiff  < 0">Expired</p>
                                </v-col>
                            </v-row>
                            <v-row class="justify-center">
                                <v-col md="6" cols="12">
                                    <v-progress-linear :indeterminate="profileStore.timeDiff > 0" color="info" />
                                </v-col>
                            </v-row>
                            <v-row class="justify-center">
                                <v-col md="6" cols="12">
                                    <p style="color: #7A7A7A;">Didn’t receive OTP code?</p>
                                    <div class="d-flex align-center justify-center text-info mt-2">
                                        <p>Resend OTP</p>
                                        <v-btn icon="mdi-reload" @click="changePIn" variant="text" :loading="profileStore.loading" :disabled="profileStore.timeDiff > 0" />
                                    </div>
                                </v-col>
                            </v-row>
                            <v-row class="justify-center">
                                <v-col md="7" cols="12">
                                    <v-btn class="bg-black" size="large" block @click="verifyOtp" :loading="loading" :disabled="otp?.length !== 6">
                                        Submit
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </div>
                    </v-container>
                </v-window-item>

                <v-window-item :value="2">
                    <v-container class="text-center">
                        <div>
                            <p class="text-body-1 font-weight-black">Welcome, {{ `${userStore.user?.first_name} ${userStore.user?.last_name}` }}</p>
                            <p class="text-info mt-3">{{ userStore.user?.email }}</p>
                            
                            <div class="mt-4">
                                <p class="">Please enter the old 4-digit PIN</p>
                                <v-otp-input :length="4" v-model="oldPIN" type="password"></v-otp-input>
                                <label>New PIN</label>
                                <v-otp-input :length="4" v-model="PIN" type="password"></v-otp-input>

                                <label>Confirm PIN</label>
                                <v-otp-input :length="4" v-model="confirmPIN" type="password"></v-otp-input>
                                
                                <p class="text-error" v-if="checkPIN">Both PIN should match</p>
                            </div>
                            <v-row class="justify-center">
                                <v-col>
                                    <v-btn class="bg-black mt-2" size="large" block @click="submitNewPin" :loading="loading" 
                                    :disabled="oldPIN?.length !== 4 || PIN?.length !== 4 || confirmPIN?.length !== 4 || checkPIN">
                                        continue
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </div>
                    </v-container>
                </v-window-item>
            </v-window>
        </v-col>
    </v-row>
    <PromptsSuccess v-if="uiStore.notifyDialog"/>
</template>
    
<script setup lang="ts">
import { useDisplay } from 'vuetify';
import { ref } from 'vue';
import { postRequestHandler } from '@/utils/httpHandler';
import { useUserStore } from '@/stores/user';
import { useUiStore } from '@/stores/ui';
import { formatPhoneNumber } from '@/utils/constants';

const loading = ref<boolean>(false)
const profileStore = useProfileStore()
const uiStore = useUiStore()
const userStore = useUserStore()
const step = ref<number>(1)
const PIN = ref<string>('')
const oldPIN = ref<string>('')
const confirmPIN = ref<string>('')
const checkPIN = ref<boolean>(false)
const { xs } = useDisplay()
const otp = ref<string>()
const emit = defineEmits(['updateSelectedWindow'])


const verifyOtp = async() => {
    loading.value = true

    const data = ref<any>({
        purpose: "change_pin",
        country_code: "+233",
        phone: formatPhoneNumber(userStore.user?.phone),
        otp: otp.value
    })

    await postRequestHandler(`nova_auth/customer/verify_otp`, data.value)
    .then(res => {
        console.log(res)
        otp.value = ''
        step.value++
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

const submitNewPin = async() => {
    loading.value = true

    const data = ref<any>({
        old_pin: oldPIN.value,
        pin: PIN.value
    })

    await postRequestHandler(`nova_auth/customer/${userStore.user?.id}/change_pin?customer_id=${userStore.user?.id}`, data.value, true)
    .then(res => {
        uiStore.success = true
        uiStore.notifyTitle = "Success"  
        uiStore.notifyMessage = "Your PIN has been successfully updated"
        uiStore.notifyDialog = true
        watch(() => uiStore.notifyDialog, (newValue) => {
            if(newValue == false){
                emit('updateSelectedWindow', 'profile')
            }
        })
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

const back = () => {
    if(step.value > 1){
        step.value--
    }
}

watchEffect(() => {
    if(confirmPIN.value){
        if(PIN.value != confirmPIN.value){
            checkPIN.value = true
        } else{
            checkPIN.value = false
        }
    } else {
        checkPIN.value = false
    }
})

</script>

<style scoped lang="css"></style>