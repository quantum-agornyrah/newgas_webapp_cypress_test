<script setup lang="ts">
import { useUiStore } from '@/stores/ui';
import { getRequestHandler } from '@/utils/httpHandler';

const uiStore = useUiStore()
const profileStore = useProfileStore()
const phone = ref<string>('')
const { xs } = useDisplay()
const loading = ref<boolean>(false)
const emit = defineEmits(['increment'])
const form = ref<boolean>(false)
const timerInterval = ref<any>()
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


const submitPhone = async () => {
    loading.value = true

    await getRequestHandler(`nova_auth/customer/send_otp?country_code=%2B233&phone_number=${formatPhoneNumber(phone.value)}&purpose=forgot_pin`)
        .then(res => {
            emit('increment')
            profileStore.forgotPin_phone = phone.value
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
    <div>
        <p class="mt-3">Enter your phone number to complete your phone number verification</p>
        <v-form v-model="form" @submit.prevent="submitPhone">
            <v-row class="mt-3 justify-center">
                <v-col cols="12">
                    <v-text-field variant="outlined" placeholder="Eg. 024xxxxxxx" v-model="phone" :rules="[rules.phoneNumber]"
                        label="Phone Number" rounded="lg" :density="xs ? 'comfortable' : 'default'"/>
                        <v-btn class="bg-black text-capitalize mt-2" size="large" block type="submit" :loading="loading" :disabled="!form"
                            >
                            Verify
                        </v-btn>
                </v-col>
            </v-row>
        </v-form>
    </div>
</template>