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
                                        <v-btn icon="mdi-reload" @click="changePhone" variant="text" :loading="profileStore.loading" :disabled="profileStore.timeDiff > 0" />
                                    </div>
                                </v-col>
                            </v-row>
                            <v-row class="justify-center">
                                <v-col md="7" cols="12">
                                    <v-btn class="bg-black" size="large" block @click="submitOtp" :loading="loading" :disabled="otp?.length !== 6">
                                        Submit
                                    </v-btn>
                                </v-col>
                            </v-row>

                            <div>

                            </div>
                        </div>
                    </v-container>
                </v-window-item>

                <v-window-item :value="2">
                    <v-container class="text-center">
                        <div>
                            <h4 class="font-weight-bold">Enter your New phone number</h4>
                            <img src="@/assets/mobile.png" width="190" class="mt-3"/>
                            <v-form v-model="form" @submit.prevent="submitNewPhone">
                                <v-row class="mt-5 justify-center">
                                    <v-col>
                                        <v-text-field placeholder="Eg. 0243132568" v-model="phone" :rules="[rules.required]" label="Phone Number" variant="outlined" bg-color="white"/>
                                    </v-col>
                                </v-row>
                                <v-row class="justify-center">
                                    <v-col>
                                        <v-btn class="bg-black" size="large" block :loading="profileStore.loading" type="submit" :disabled="!form">
                                            Submit
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </div>
                    </v-container>
                </v-window-item>
                <v-window-item :value="3">
                    <v-container class="text-center">
                        <div>
                            <p class="text-h6 font-weight-bold">Enter one-time password</p>
                            <img src="@/assets/otp.png" width="200" class="mt-3" />
                            <p class="mt-3" v-if="!xs">Please enter the 6-digit One-time password (OTP)<br> we have sent to your number {{ phone }}</p>
                            <p class="mt-3" v-else>Please enter the 6-digit One-time password (OTP) we have sent to your number {{ phone }}</p>

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
                                    <p v-if="timeDiff > 0">{{ mins }}:{{ secs }}</p>
                                    <p class="text-center text-error" v-if="timeDiff < 0">Expired</p>
                                </v-col>
                            </v-row>
                            <v-row class="justify-center">
                                <v-col md="6" cols="12">
                                    <v-progress-linear :indeterminate="timeDiff > 0" color="info" />
                                </v-col>
                            </v-row>
                            <v-row class="justify-center">
                                <v-col md="6" cols="12">
                                    <p style="color: #7A7A7A;">Didn’t receive OTP code?</p>
                                    <div class="d-flex align-center justify-center text-info mt-2">
                                        <p>Resend OTP</p>
                                        <v-btn icon="mdi-reload" @click="submitNewPhone" variant="text" :loading="profileStore.loading" :disabled="timeDiff > 0" />
                                    </div>
                                </v-col>
                            </v-row>
                            <v-row class="justify-center">
                                <v-col md="7" cols="12">
                                    <v-btn class="bg-black" size="large" block @click="confirmNewPhone" :loading="loading" :disabled="otp?.length !== 6">
                                        Submit
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </div>
                    </v-container>
                </v-window-item>
            </v-window>
        </v-col>
    </v-row>
</template>
    
<script setup lang="ts">
import { useDisplay } from 'vuetify';
import { ref } from 'vue';
import { getRequestHandler, patchRequestHandler, postRequestHandler } from '@/utils/httpHandler';
import { useUserStore } from '@/stores/user';
import { useUiStore } from '@/stores/ui';
import { formatPhoneNumber } from '@/utils/constants';



const loading = ref<boolean>(false)
const profileStore = useProfileStore()
const userStore = useUserStore()
const uiStore = useUiStore()
const form = ref<boolean>(false)
const phone = ref<string>('')
const otp = ref<string>('')
const step = ref<number>(1)
const { xs } = useDisplay()
const securityToken = ref<string>('')
const formattedPhoneNumber = ref<string>('')
const emit = defineEmits(['updateSelectedWindow'])
const timeDiff = ref<number>(0)
const timerInterval = ref<any>()
const mins = ref<any>()
const secs = ref<any>()
const rules = ref({
    required: (val: string) => {
      if (val) {
        return true;
      }
      return "Field is required";
    },
    email: (val: string) => {
      // must be a valid email
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(val)) {
        return true;
      }
      return "Must be a valid e-mail.";
    }
})

const timer = () => {
    // Clear any existing timer
    if (timerInterval.value) {
        clearInterval(timerInterval.value);
    }

    let y = 5 * 60 * 1000; // 5 minutes in ms
    let tokenExp = new Date().getTime();

    timerInterval.value = setInterval(function () {
        let now = new Date().getTime();
        timeDiff.value = (tokenExp + y) - now;

        if (timeDiff.value < 0) {
            clearInterval(timerInterval.value);
            timerInterval.value = null;
        }
    }, 1000);
}

watch(() => timeDiff.value, async (newValue) => {
    if (newValue) {
        // Time calculations for days, hours, minutes and seconds
        let totalSeconds = Math.floor(timeDiff.value / 1000);
        mins.value = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
        secs.value = String(totalSeconds % 60).padStart(2, '0');
    }
})


const back = () => {
    if(step.value > 1) {
        step.value--
    }
}

const submitOtp = async() => {
    loading.value = true

    const data = ref<any>({
        otp_code: otp.value,
        phone: userStore.user?.phone
    })
    await postRequestHandler(`nova_auth/customer/${userStore.user?.id}/phone/update_request/confirm`, data.value, true)
    .then(res => {
        otp.value = ''
        console.log(res)
        securityToken.value = res.security_token
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

const submitNewPhone = async() => {
    profileStore.loading = true

    formattedPhoneNumber.value = `%2B233${formatPhoneNumber(phone.value)}`;
    await getRequestHandler(`nova_auth/customer/${userStore.user?.id}/phone/update?new_phone=${formattedPhoneNumber.value}`)
    .then(res => {
        step.value = 3
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

const confirmNewPhone = async() => {
    loading.value = true

    const data = ref<any>({
        security_token: securityToken.value,
        new_phone: `+233${formatPhoneNumber(phone.value)}`
    })

    await patchRequestHandler(`nova_auth/customer/${userStore.user?.id}/phone/update/confirm`, data.value, true)
    .then(res => {
        uiStore.success = true
        uiStore.notifyTitle = "Success"  
        uiStore.notifyMessage = "Your phone number has been successfully update"
        uiStore.notifyDialog = true
        otp.value = ''
        watch(() => uiStore.notifyDialog, (value) => {
            if(value == false) {
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
</script>

<style scoped lang="css"></style>