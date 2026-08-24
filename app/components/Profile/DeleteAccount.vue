<script setup lang="ts">
import { useUiStore } from '@/stores/ui';

const chip = ref<number>()
const step = ref<number>(1)
const uiStore = useUiStore()

const back = () => {
    if(step.value > 1){
        step.value--
    }
}
</script>

<template>
    <v-btn v-if="step > 1" prepend-icon="mdi-arrow-left-top" text="Back" variant="text" @click="back" />
    <v-window v-model="step" class="mt-2">
        <v-window-item :value="1">
            <h4 class="font-weight-bold">Why are you leaving us ?</h4>
        
            <v-chip-group v-model="chip"  column class="mt-3" color="red">
                <v-row>
                    <v-col>
                        <v-chip class="pa-5 bg-white" variant="flat" rounded="lg" :value="1">I no longer need the service.</v-chip>
                    </v-col>
                    <v-col class="pt-0">
                        <v-chip class="pa-5 bg-white" variant="flat" rounded="lg" :value="2">I had a poor experience with the service.</v-chip>
                    </v-col>
                    <v-col class="pt-0">
                        <v-chip class="pa-5 bg-white" variant="flat" rounded="lg" :value="3">The service is too expensive.</v-chip>
                    </v-col>
                    <v-col class="pt-0">
                        <v-chip class="pa-5 bg-white" variant="flat" rounded="lg" :value="4">Privacy or security concerns.</v-chip>
                    </v-col>
                    <v-col class="pt-0">
                        <v-chip class="pa-5 bg-white" variant="flat" rounded="lg" :value="5">I am not satisfied with customer support.</v-chip>
                    </v-col>
                    <v-col class="pt-0">
                        <v-chip class="pa-5 bg-white" variant="flat" rounded="lg" :value="6">I have an issue with the third-party cylinder policy.</v-chip>
                    </v-col>
                    <v-col class="pt-0">
                        <v-chip class="pa-5 bg-white" variant="flat" rounded="lg" :value="7">Other</v-chip>
                    </v-col>
                </v-row>
            </v-chip-group>
        
            <v-textarea variant="outlined" rounded="lg" rows="3" hide-details class="mt-2" placeholder="Reason for deleting..." bg-color="white" v-if="chip == 7"/>

            <v-btn class="text-capitalize font-weight-bold bg-black mt-7" block size="large" rounded="lg" @click="step = 2">
                <h4>Continue</h4>
            </v-btn>
        </v-window-item>

        <v-window-item :value="2">
            <div class="text-center">
                <h4>Delete Account</h4>
                <div class="mt-5">
                    <img src="../../assets/delete-account.png" width="180"/>
                </div>
                <h4 class="mt-3">Is this goodbye? Are you sure you don’t want to reconsider?</h4>
                <div class="mt-3">
                    <p class="font-weight-thin">
                        Before you proceed with the deletion of your account, please carefully read the following terms and conditions. By requesting the deletion 
                        of your account, you acknowledge you have read our <span class="text-error">Privacy Policy</span>.
                    </p>
                    <h4 class="font-weight-black mt-3">Consequences of Account Deletion</h4>
                    <p class="mt-1 font-weight-thin">
                        Data Removal All personal data associated with your account, including order history, personal information, and preferences, will be
                        permanently deleted from our systems.
                    </p>
                    <p class="font-weight-thin mt-3">
                        <span class="font-weight-black">Service Disruption</span> You will no longer have access to any services provided by Newgas Cylinder, including current orders, delivery schedules,
                        and customer support.
                    </p>
                    <p class="mt-3"><span class="font-weight-black">Third-Party Cylinders</span> If you have any third-party gas </p>
                </div>

                <v-btn class="text-capitalize mt-3 bg-black" block size="large" rounded="lg" @click="uiStore.deleteDialog = true">
                    <h4>Submit</h4>
                </v-btn>
            </div>

        </v-window-item>
    </v-window>

</template>