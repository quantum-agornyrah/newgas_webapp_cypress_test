<script setup lang="ts">
import { useDisplay } from 'vuetify';

const { xs, sm } = useDisplay()
const userStore = useUserStore()
const uiStore = useUiStore()
const form = ref<boolean>(false)
const verifyNumber = ref<boolean>(false)
const phone = ref<string>('')
const pin = ref<string>('')
const isVisible = ref<boolean>(false)
const loading = ref<boolean>(false)
const router = useRouter()
const step = ref<number>(1)
const otp = ref<string>('')
const create_pin = ref<string>('')
const confirm_pin = ref<string>('')
const checkPIN = ref<boolean>(false)
const timeDiff = ref<number>(0)
const mins = ref<any>()
const timerInterval = ref<any>()
const secs = ref<any>()
const rules = ref({
    required: (val: string) => {
        if (val) {
            return true;
        }
        return "Field is required";
    },
    phoneNumber: (val: string) => {
        // must must be exactly 9 digits
        if (val.length === 10) {
            return true;
        }
        return "Must be a valid phone number";
    }
});

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
    // if (stopTimer.value) {
    //   timeDiff.value = 0
    // }
})

const requestOtp = async() => {
    uiStore.loading = true
    await getRequestHandler(`nova_auth/customer/send_otp?country_code=%2B233&phone_number=${formatPhoneNumber(phone.value)}&purpose=forgot_pin`)
    .then(res => {
        timer()
        step.value = 3
    })
    .catch(err => {
        uiStore.success = false
        uiStore.notifyTitle = "Error"
        uiStore.notifyMessage = err || "Failed to send OTP"
        uiStore.notifyDialog = true
    })
    .finally(() => {
        uiStore.loading = false
     })
}

const checkNumber = async () => {
    loading.value = true

    await getRequestHandler(`nova_auth/customer/check_phone_exists?country_code=%2B233&phone=${formatPhoneNumber(phone.value)}`)
        .then(res => {
            if (res?.pin_exists) {
                step.value = 2
            } else {
                requestOtp()
            }
        })
        .catch(err => {
            uiStore.success = false
            uiStore.notifyTitle = "Error"
            uiStore.notifyMessage = err
            uiStore.notifyDialog = true
        })
        .finally(() => {
            loading.value = false
        })
}

const verifyOtp = async () => {
    loading.value = true

    const data = ref<any>({
        purpose: "forgot_pin",
        country_code: "+233",
        phone: formatPhoneNumber(phone.value),
        otp: otp.value
    })
    await postRequestHandler(`nova_auth/customer/verify_otp`, data.value)
        .then(res => {
            sessionStorage.setItem(import.meta.env.VITE_SESSION_KEY, res.access_token);
            sessionStorage.setItem(import.meta.env.VITE_REFRESH_KEY, res.refresh_token);
            sessionStorage.setItem(import.meta.env.VITE_SESSION_USER, JSON.stringify(res.data));
            userStore.getUserData()
            step.value = 4
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

const createPin = async() => {
    loading.value = true

    await postRequestHandler(`nova_auth/customer/${userStore.user?.id}/pin`, {pin: create_pin.value})
        .then(res => {
            uiStore.success = true
            uiStore.notifyTitle = "Success"
            uiStore.notifyMessage = "Pin successfully created"
            uiStore.notifyDialog = true
        })
        .catch((error) => {
            uiStore.success = false
            uiStore.notifyTitle = "Error"
            uiStore.notifyMessage = error || 'Error creating pin, please try again'
            uiStore.notifyDialog = true
        })
        .finally(() => {
            loading.value = false
        })
}

const login = async () => {
    loading.value = true;
    try {
        const formattedPhoneNumber = `+233${formatPhoneNumber(phone.value)}`;
        const data = {
            phone: formattedPhoneNumber,
            pin: pin.value,
        };
        const url = 'nova_auth/customer/login';
        const response = await postRequestHandler(url, data);
        sessionStorage.setItem(import.meta.env.VITE_SESSION_KEY, response.access_token);
        sessionStorage.setItem(import.meta.env.VITE_REFRESH_KEY, response.refresh_token);
        sessionStorage.setItem(import.meta.env.VITE_SESSION_USER, JSON.stringify(response.data));
        localStorage.setItem('user', response.data.id);
        await userStore.getUserData()
        router.push('/orders');
    } catch (error: any) {
        uiStore.success = false
        uiStore.notifyTitle = "Error"
        uiStore.notifyMessage = error
        uiStore.notifyDialog = true
    } finally {
        loading.value = false;
    }
};

watchEffect(() => {
    if (confirm_pin.value) {
        if (create_pin.value !== confirm_pin.value) {
            checkPIN.value = true
        } else {
            checkPIN.value = false
        }
    } else {
        checkPIN.value = false
    }
})
</script>

<template>
    <v-container fluid class="fill-height login-bg text-center">
        <v-card class="mx-auto"
            :class="[xs ? 'py-4' : 'py-12', xs ? 'w-100' : 'w-75', xs ? 'px-2' : '', sm ? 'px-15' : '']" max-width="750"
            rounded="lg">
            <v-card-text>
                <v-row class="justify-center">
                    <v-col cols="12" md="7">
                        <img src="/NewgasColoredLogo.png" alt="Newgas-logo" width="130" />

                        <v-window v-model="step" class="mt-2">
                            <v-window-item :value="1" class="mt-2" disabled>
                                <p class="text-h5 text-center font-weight-bold mb-2" v-if="!xs">LOG IN</p>
                                <p class="text-h6 text-center font-weight-bold mb-2" v-if="xs">LOG IN</p>
                                <v-form @submit.prevent="checkNumber" v-model="verifyNumber">
                                    <p>Kindly enter your phone number for verification</p>
                                    <v-text-field label="Phone Number" variant="outlined" rounded="lg" class="mt-3"
                                        :rules="[rules.phoneNumber]" v-model="phone"
                                        :density="xs ? 'comfortable' : 'default'" />
                                    <p class="mt-2">By logging in, you are agreeing to Newgas’ <a
                                            href="https://newgas.online/wp-content/uploads/2024/07/Newgas-Customer-Terms-and-Conditions.pdf"
                                            class="text-decoration-none" target="_blank">Terms & Conditions</a>
                                        and <a href="https://newgas.online/privacy-policy/" class="text-decoration-none"
                                            target="_blank">Privacy
                                            Policy</a></p>
                                    <client-only>
                                        <v-btn text="Verify" class="bg-black mt-7" size="large" rounded="lg" block
                                            type="submit" :loading="loading" :disabled="!verifyNumber" />
                                    </client-only>
                                    <p class="mt-3">New User? <a href="https://onboard.newgas.online/" class="text-black">Sign Up</a></p>
                                </v-form>
                            </v-window-item>
                            <v-window-item :value="2" class="mt-2" disabled>
                                <p class="text-h5 text-center font-weight-bold mb-4" v-if="!xs">LOG IN</p>
                                <p class="text-h6 text-center font-weight-bold mb-3" v-if="xs">LOG IN</p>
                                <v-form @submit.prevent="login" v-model="form">
                                    <v-text-field label="Phone Number" variant="outlined" rounded="lg"
                                        :rules="[rules.phoneNumber]" v-model="phone" readonly
                                        :density="xs ? 'comfortable' : 'default'" />
                                    <v-text-field label="Pin" v-model="pin" variant="outlined" rounded="lg"
                                        :rules="[rules.required]" :type="isVisible ? 'text' : 'password'"
                                        :density="xs ? 'comfortable' : 'default'"
                                        :append-inner-icon="isVisible ? 'mdi-eye-off' : 'mdi-eye'"
                                        @click:append-inner="isVisible = !isVisible" class="mt-2" />
                                    <p class="text-right"><a href="/forgotpin" class="text-decoration-none">Forgot
                                            Pin?</a></p>
                                    <p class="mt-3">By logging in, you are agreeing to Newgas’ <a
                                            href="https://newgas.online/wp-content/uploads/2024/07/Newgas-Customer-Terms-and-Conditions.pdf"
                                            class="text-decoration-none" target="_blank">Terms & Conditions</a>
                                        and <a href="https://newgas.online/privacy-policy/" class="text-decoration-none"
                                            target="_blank">Privacy
                                            Policy</a></p>
                                    <v-btn text="Login" class="bg-black mt-7" size="large" rounded="lg" block
                                        type="submit" :loading="loading" :disabled="!form" />
                                </v-form>
                            </v-window-item>
                            <v-window-item :value="3" class="mt-2" disabled>
                                <div class="text-center">
                                    <p class="mt-2" v-if="!xs">Please enter the 6-digit One-time password (OTP)<br> we
                                        have sent to your number
                                        {{phone}}</p>
                                    <p class="mt-2" v-else>Please enter the 6-digit One-time password (OTP) we have sent
                                        to your number {{
                                            phone }}</p>

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
                                            <p v-if="timeDiff > 0">{{ mins }}:{{
                                                secs }}</p>
                                            <p class="text-center text-error" v-if="timeDiff < 0">Expired
                                            </p>
                                        </v-col>
                                    </v-row>
                                    <v-row class="justify-center">
                                        <v-col md="6" cols="12">
                                            <v-progress-linear :indeterminate="timeDiff > 0"
                                                color="info" />
                                        </v-col>
                                    </v-row>
                                    <v-row class="justify-center">
                                        <v-col md="6" cols="12">
                                            <p style="color: #7A7A7A;">Didn’t receive OTP code?</p>
                                            <p class="text-decoration-underline text-info mt-2" @click="requestOtp">Resend OTP</p>
                                            <div class="d-flex align-center justify-center text-info mt-2">
                                                <p>Resend OTP</p>
                                                <v-btn icon="mdi-reload" @click="requestOtp" variant="text" :loading="uiStore.loading" :disabled="timeDiff > 0" />
                                            </div>
                                        </v-col>
                                    </v-row>
                                    <v-row class="justify-center">
                                        <v-col cols="12">
                                            <v-btn class="bg-black" size="large" block @click="verifyOtp"
                                                :loading="loading" :disabled="otp?.length !== 6">
                                                Submit
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </div>
                            </v-window-item>
                            <v-window-item :value="4" class="mt-2" disabled>
                                <p class="text-h5 text-center font-weight-bold mb-4" v-if="!xs">Create Pin</p>
                                <p class="text-h6 text-center font-weight-bold mb-3" v-if="xs">Create Pin</p>
                                <p>Please use numbers that are not in your phone number or date of birth for extra
                                    security.</p>
                                <v-row class="mt-2 justify-center">
                                    <v-col cols="12">
                                        <p>Create Pin</p>
                                        <v-otp-input v-model="create_pin" length="4" type="password" />
                                    </v-col>
                                    <v-col cols="12">
                                        <p>Confirm Pin</p>
                                        <v-otp-input v-model="confirm_pin" length="4" type="password" />
                                        <p class="text-error" v-if="checkPIN">Both PIN should match</p>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-btn class="bg-black" size="large" block :loading="loading" @click="createPin"
                                            :disabled="create_pin.length !== 4 || confirm_pin.length !== 4 || checkPIN">
                                            Submit
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-window-item>
                        </v-window>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        <PromptsSuccess v-if="uiStore.notifyDialog" />
    </v-container>
</template>