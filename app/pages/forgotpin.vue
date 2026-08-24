<script setup lang="ts">
definePageMeta({
    title: 'Forgot PIN',
    layout: 'default'
})

const uiStore = useUiStore()
const step = ref<number>(1)
const { xs, sm } = useDisplay()

const nextStep = () => {
    if (step.value < 3) {
        step.value++
    }
}

const back = () => {
    step.value--
}
</script>

<template>
    <v-container fluid class="fill-height login-bg text-center">
        <v-card class="mx-auto"
            :class="[xs ? 'py-4' : 'py-12', xs ? 'w-100' : 'w-75', xs ? 'px-2' : '', sm ? 'px-15' : '']" max-width="700"
            rounded="lg">
            <v-card-text>
                <v-row class="justify-center">
                    <v-col cols="12" md="8">
                        <div class="back text-left" v-if="step > 1">
                            <v-btn prepend-icon="mdi-arrow-left-top" text="Back" variant="text" @click="back" />
                        </div>
                        <img src="/NewgasColoredLogo.png" alt="Newgas-logo" width="130" />
                        <p class="text-h5 text-center font-weight-bold mt-5" v-if="!xs">FORGOT PIN</p>
                        <p class="text-h6 text-center font-weight-bold mt-5" v-if="xs">FORGOT PIN</p>

                        <v-window v-model="step">
                            <v-window-item :value="1" disabled>
                                <PinResetPhoneNumber @increment="nextStep" />
                            </v-window-item>
                            <v-window-item :value="2" disabled>
                                <PinResetOTP @increment="nextStep" :back="step" />
                            </v-window-item>
                            <v-window-item :value="3" disabled>
                                <PinResetNewPIN />
                            </v-window-item>
                        </v-window>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        <PromptsSuccess v-if="uiStore.notifyDialog" />
    </v-container>
</template>