<script setup lang="ts">
import { useUiStore } from '@/stores/ui';
import { postRequestHandler } from '@/utils/httpHandler';
import { useDisplay } from 'vuetify';

const uiStore = useUiStore()
const profileStore = useProfileStore()
const userStore = useUserStore()
const loading = ref<boolean>(false)
const otp = ref<string>()
const timerInterval = ref<any>()
const emit = defineEmits(['increment'])
const { xs } = useDisplay()

const verifyOtp = async () => {
    loading.value = true

    const data = ref<any>({
        purpose: "forgot_pin",
        country_code: "+233",
        phone: formatPhoneNumber(profileStore.forgotPin_phone),
        otp: otp.value
    })
    await postRequestHandler(`nova_auth/customer/verify_otp`, data.value)
        .then(res => {
            sessionStorage.setItem(import.meta.env.VITE_SESSION_KEY, res.access_token);
            sessionStorage.setItem(import.meta.env.VITE_REFRESH_KEY, res.refresh_token);
            sessionStorage.setItem(import.meta.env.VITE_SESSION_USER, JSON.stringify(res.data));
            userStore.getUserData()
            emit('increment')
            otp.value = ""
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

const resendOTP = async () => {
    profileStore.loading = true
    await getRequestHandler(`nova_auth/customer/send_otp?country_code=%2B233&phone_number=${formatPhoneNumber(profileStore.forgotPin_phone)}&purpose=forgot_pin`)
        .then(res => {
            timer()
        })
        .catch((error) => {
            uiStore.success = false
            uiStore.notifyTitle = "Error"
            uiStore.notifyMessage = error
            uiStore.notifyDialog = true
        })
        .finally(() => {
            profileStore.loading = false
        })
}

const timer = () => {
    // Clear any existing timer
    if (timerInterval.value) {
        clearInterval(timerInterval.value);
    }

    let y = 5 * 60 * 1000; // 5 minutes in ms
    let tokenExp = new Date().getTime();

    timerInterval.value = setInterval(function () {
        let now = new Date().getTime();
        profileStore.timeDiff  = (tokenExp + y) - now;

        if (profileStore.timeDiff < 0) {
            clearInterval(timerInterval.value);
            timerInterval.value = null;
        }
    }, 1000);
}

watch(() => profileStore.timeDiff , async (newValue) => {
    if (newValue) {
        // Time calculations for days, hours, minutes and seconds
        let totalSeconds = Math.floor(profileStore.timeDiff / 1000);
        profileStore.mins = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
        profileStore.secs = String(totalSeconds % 60).padStart(2, '0');
    }

    // if (profileStore.stopTimer) {
    //   profileStore.timeDiff = 0
    // }
})
</script>

<template>
    <div class="text-center">
        <p class="mt-2" v-if="!xs">Please enter the 6-digit One-time password (OTP)<br> we have sent to your number
            {{ profileStore.forgotPin_phone }}</p>
        <p class="mt-2" v-else>Please enter the 6-digit One-time password (OTP) we have sent to your number {{
            profileStore.forgotPin_phone }}</p>

        <v-row class="mt-2 justify-center">
            <v-col cols="12">
                <v-otp-input v-model="otp" />
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
                     <v-btn icon="mdi-reload" @click="resendOTP" variant="text" :loading="profileStore.loading" :disabled="profileStore.timeDiff > 0" />
                </div>
            </v-col>
        </v-row>
        <v-row class="justify-center">
            <v-col cols="12">
                <v-btn class="bg-black" size="large" block @click="verifyOtp" :loading="loading"
                    :disabled="otp?.length !== 6">
                    Submit
                </v-btn>
            </v-col>
        </v-row>
    </div>
</template>