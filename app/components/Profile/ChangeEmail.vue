<template>
    <v-btn v-if="step > 1" prepend-icon="mdi-arrow-left-top" text="Back" variant="text" @click="back" />
    <v-row>
        <v-col>
            <v-window v-model="step" v-if="userStore?.user?.email">
                <v-window-item :value="1">
                    <h4 class="my-4">Your email address</h4>
                    <v-card class="pa-4  elevation-0">
                        <div class="d-flex align-center">
                            <v-icon icon="mdi-email-outline"></v-icon>
                            <h4 class="ml-3" style="color: #8A8A8A;">{{ userStore?.user?.email }}</h4>
                        </div>
                    </v-card>
                    <div class="mt-5">
                        <v-btn class="py-6 bg-black" block size="large" rounded="lg" @click="updateEmail"
                            :loading="loading">
                            Change Email
                        </v-btn>
                    </div>
                </v-window-item>

                <v-window-item :value="2">
                    <v-container class="text-center">
                        <div>
                            <p class="text-h6 font-weight-bold">Enter one-time password</p>
                            <img src="@/assets/otp.png" width="200" class="mt-3" />
                            <p class="mt-3">We have sent the verification code to the email {{ userStore.user?.email }}
                            </p>

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
                                        <v-btn icon="mdi-reload" @click="updateEmail" variant="text" :loading="loading" :disabled="timeDiff > 0" />
                                    </div>
                                </v-col>
                            </v-row>
                            <v-row class="justify-center">
                                <v-col md="7" cols="12">
                                    <v-btn class="bg-black" size="large" block @click="sendOtp"
                                        :loading="load" :disabled="otp?.length !== 6">
                                        Submit
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </div>
                    </v-container>
                </v-window-item>

                <v-window-item :value="3">
                    <h4>Enter Your New Email Address</h4>
                    <div class="d-flex justify-center my-10">
                        <img src="@/assets/otp.png" width="200" class="mt-3" />
                    </div>
                    <v-form v-model="form" @submit.prevent="newEmail">
                        <v-text-field :rules="[rules.email]" v-model="email" variant="outlined" bg-color="white"
                            placeholder="Email" />

                        <v-btn class="bg-black mt-1" size="large" block :loading="loading" :disabled="!form"
                            type="submit">
                            Submit
                        </v-btn>
                    </v-form>
                </v-window-item>

                <v-window-item :value="4">
                    <v-container class="text-center">
                        <div>
                            <p class="text-h6 font-weight-bold">Enter one-time password</p>
                            <img src="@/assets/otp.png" width="200" class="mt-3" />
                            <p class="mt-3">We have sent the verification code to the email {{ email }}</p>

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
                                        <v-btn icon="mdi-reload" @click="newEmail" variant="text" :loading="loading" :disabled="timeDiff > 0" />
                                    </div>
                                </v-col>
                            </v-row>
                            <v-row class="justify-center">
                                <v-col md="7" cols="12">
                                    <v-btn class="bg-black" size="large" block @click="confirmNewEmail"
                                        :loading="load" :disabled="otp?.length !== 6">
                                        Submit
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </div>
                    </v-container>
                </v-window-item>
            </v-window>

            <v-window v-model="step" v-else>
                <v-window-item :value="1">
                    <h4>Your Email Address</h4>
                    <div class="mt-7 d-flex justify-center">
                        <img src="@/assets/empty-email.png" width="241" />
                    </div>
                    <p class="text-body-1 font-weight-black mt-12">No email address has been added yet </p>
                    <v-btn class="bg-black text-capitalize mt-10" size="large" block @click="step++">
                        <h4>Add Email</h4>
                    </v-btn>
                </v-window-item>
                <v-window-item :value="2">
                    <h4>Your Email Address</h4>
                    <div class="mt-7 d-flex justify-center">
                        <img src="@/assets/new-email.png" width="241" />
                    </div>
                    <p class="text-body-1 font-weight-black mt-12">Enter your email address</p>
                    <v-form v-model="form" @submit.prevent="addEmail">
                        <v-text-field label="Email" :rules="[rules.email]" v-model="email" variant="outlined" bg-color="white"
                            class="mt-4" />
                        <v-btn class="bg-black text-capitalize mt-10" size="large" block :loading="loading"
                            :disabled="!form" type="submit">
                            <h4>Submit</h4>
                        </v-btn>
                    </v-form>
                </v-window-item>
                <v-window-item :value="3">
                    <v-container class="text-center">
                        <div>
                            <p class="text-h6 font-weight-bold">Enter one-time password</p>
                            <img src="@/assets/otp.png" width="200" class="mt-3" />
                            <p class="mt-3 text-body-1 font-weight-bold">Enter verification code sent to the email
                                address {{ email }}</p>
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
                                        <v-btn icon="mdi-reload" @click="addEmail" variant="text" :loading="loading" :disabled="timeDiff > 0" />
                                    </div>
                                </v-col>
                            </v-row>
                            <v-row class="justify-center">
                                <v-col md="7" cols="12">
                                    <v-btn class="bg-black" size="large" block @click="confirmAddEmail" :loading="load"
                                        :disabled="otp?.length !== 6">
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
    <PromptsSuccess v-if="uiStore.notifyDialog" />
</template>

<script setup lang="ts">
// import { useDisplay } from 'vuetify';
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { getRequestHandler, patchRequestHandler, postRequestHandler } from '@/utils/httpHandler';
import { useUiStore } from '@/stores/ui';

const userStore = useUserStore()
const uiStore = useUiStore()
const email = ref<string>('')
const loading = ref<boolean>(false)
const step = ref<number>(1)
// const { xs } = useDisplay()
const otp = ref<string>()
const form = ref<boolean>(false)
const securityToken = ref<any>()
const timeDiff = ref<number>(0)
const mins = ref<any>()
const timerInterval = ref<any>()
const load = ref<boolean>(false)
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
    if (step.value > 1) {
        step.value--
    }
}



const addEmail = async () => {
    loading.value = true

    await getRequestHandler(`nova_auth/customer/${userStore.user?.id}/email/add_request?email=${email.value}`, true)
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
            loading.value = false
        })
}

const confirmAddEmail = async () => {
    load.value = true

    const data = ref<any>({
        otp_code: otp.value,
        email: email.value
    })

    await patchRequestHandler(`nova_auth/customer/${userStore.user?.id}/email/add_request/confirm`, data.value, true)
        .then(async(res) => {
            uiStore.success = true
            uiStore.notifyTitle = "Success"
            uiStore.notifyMessage = "Your email has been successfully added"
            uiStore.notifyDialog = true
            otp.value = ''
            await userStore.getUserData()
            step.value = 1
        })
        .catch((error) => {
            uiStore.success = false
            uiStore.notifyTitle = "Error"
            uiStore.notifyMessage = error
            uiStore.notifyDialog = true
        })
        .finally(() => {
            load.value = false
        })
}

const updateEmail = async () => {
    loading.value = true

    await getRequestHandler(`nova_auth/customer/${userStore.user?.id}/email/update_request?old_email=${userStore.user?.email}`, true)
        .then(res => {
            step.value = 2
            timer()
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

const sendOtp = async () => {
    load.value = true

    const data = ref<any>({
        otp_code: otp.value,
        email: userStore.user?.email
    })

    await postRequestHandler(`nova_auth/customer/${userStore.user?.id}/email/update_request/confirm`, data.value, true)
        .then(res => {
            securityToken.value = res
            otp.value = ''
            step.value++
        })
        .catch((error) => {
            uiStore.success = false
            uiStore.notifyTitle= "Error"
            uiStore.notifyMessage = error
            uiStore.notifyDialog = true
        })
        .finally(() => {
            load.value = false
        })
}

const newEmail = async () => {
    loading.value = true

    await getRequestHandler(`nova_auth/customer/${userStore.user?.id}/email/update?new_email=${email.value}`, true)
        .then(res => {
            step.value = 4
            timer()
        })
        .catch((error) => {
            uiStore.success = false
            uiStore.notifyTitle= "Error"
            uiStore.notifyMessage = error
            uiStore.notifyDialog = true
        })
        .finally(() => {
            loading.value = false
        })
}

const confirmNewEmail = async () => {
    load.value = true

    const data = ref<any>({
        security_token: securityToken.value?.security_token,
        new_email: email.value
    })

    await patchRequestHandler(`nova_auth/customer/${userStore.user?.id}/email/update/confirm`, data.value, true)
        .then(async(res) => {
            uiStore.success = true
            uiStore.notifyTitle= "Success"
            uiStore.notifyMessage = "Your email has been successfully updated"
            uiStore.notifyDialog = true
            otp.value = ''
            email.value = ''
            await userStore.getUserData()
            step.value = 1
        })
        .catch((error) => {
            uiStore.success = false
            uiStore.notifyTitle= "Error"
            uiStore.notifyMessage = error
            uiStore.notifyDialog = true
        })
        .finally(() => {
            load.value = false
        })
}
</script>

<style scoped lang="css"></style>