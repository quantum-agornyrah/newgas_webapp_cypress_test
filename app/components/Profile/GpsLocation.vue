<script setup lang="ts">
import { useLocationStore } from '@/stores/location'
import { useUiStore } from '@/stores/ui'
import { useUserStore } from '@/stores/user'
import { getRequestHandler, postRequestHandler, deleteRequestHandler } from '@/utils/httpHandler'
import { useRouter } from 'vue-router'

const step = ref<number>(1)
const getGPS = ref<boolean>(false)
const locationAction = ref<number>(1)
const gp_address = ref<string>('')
const name = ref<string>('')
const number = ref<string>('')
const loading = ref<boolean>(false)
const res = ref<any>()
const router = useRouter()
const userStore = useUserStore()
const locationStore = useLocationStore()
const uiStore = useUiStore()
const deleteItem = ref<any>()
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
    },
    phoneNumber: (val: string) => {
        // must must be exactly 10 digits
        if (val?.length === 10) {
            return true;
        }
        return "Must be a valid phone number";
    },
})


const back = () => {
    if (locationAction.value > 1) {
        locationAction.value--
    } else if (step.value > 1) {
        step.value--
    }
}

const getGPSLocation = async () => {
    loading.value = true;
    try {
        res.value = await getRequestHandler(`location/ghana_post_address/search/address?gp_address_code=${gp_address.value}`);
        console.log('GPS Data:', res.value);
        getGPS.value = true;
    } catch (error) {
        console.error('Error fetching GPS data:', error);
    } finally {
        loading.value = false;
    }
}

const createLocation = async () => {
    loading.value = true;
    try {
        const data = {
            gp_address_id: res.value.id,
            customer_id: userStore.user?.id,
            name: name.value,
            phone: number.value
        }
        await postRequestHandler(`location/customer/${userStore.user?.id}/address`, data)
        await locationStore.getAllCustomerAddress(userStore.user?.id)
        locationAction.value = 1
    } catch (error) {
        console.error('Error creating location:', error)
    } finally {
        loading.value = false;
    }
}

const deletePrompt = (item: any) => {
    deleteItem.value = item
    uiStore.actionTitle = 'Remove Address'
    uiStore.actionPrompt = 'Are you sure you want to remove this address?'
    uiStore.actionDialog = true

}

const deleteLocation = async () => {
    loading.value = true
    await deleteRequestHandler(`location/customer/${userStore.user?.id}/address/${deleteItem.value?.id}`, true)
        .then(async (res) => {
            uiStore.actionDialog = false
            uiStore.success = true
            uiStore.notifyTitle = "Success"
            uiStore.notifyMessage = `Successfully removed ${deleteItem.value?.name} from your addresses`
            uiStore.notifyDialog = true
            await locationStore.getAllCustomerAddress(userStore.user?.id);
        })
        .catch(error => {
            uiStore.actionDialog = false
            uiStore.success = false
            uiStore.notifyTitle = "Error"
            uiStore.notifyMessage = error || 'Failed to remove address'
            uiStore.notifyDialog = true
        })
        .finally(() => {
            loading.value = false
        })
}

</script>

<template>
    <v-btn v-if="locationAction > 1 || step > 1" prepend-icon="mdi-arrow-left-top" text="Back" variant="text"
        @click="back" />
    <v-row>
        <v-col v-if="locationStore.userAddress?.length > 0">
            <v-window v-model="locationAction">
                <v-window-item :value="1">
                    <div v-for="item in locationStore.userAddress">
                        <LocationCard :item="item" :deletePrompt="deletePrompt" />
                    </div>

                    <v-btn class="bg-black text-capitalize mt-5" block size="large" rounded="lg"
                        @click="locationAction = 2">
                        <h4>Add Address</h4>
                    </v-btn>
                </v-window-item>

                <v-window-item :value="2">
                    <h4>Enter delivery location’s details </h4>
                    <div class="mt-5">
                        <v-text-field variant="outlined" label="GPS address" bg-color="white" v-model="gp_address"
                            :rules="[rules.required]" />

                        <v-btn text="Submit" @click="getGPSLocation" class="bg-black my-5 text-capitalize" block
                            size="large" :disabled="!gp_address" :loading="loading" />
                    </div>
                    <v-img src="@/assets/ghana-post.png" alt="GPS" width="112" />


                    <div v-if="getGPS" class="my-5">
                        <v-text-field variant="outlined" label="Name associated with Address" bg-color="white"
                            v-model="name" :rules="[rules.required]" />

                        <v-text-field class="mt-2" variant="outlined" label="Phone Number" bg-color="white"
                            v-model="number" :rules="[rules.phoneNumber]" />


                        <v-card class="mt-5 text-center">
                            <v-card-text>
                                <v-row class="justify-center mt-4">
                                    <v-col cols="12">
                                        <v-row class="align-center justify-center">
                                            <v-col cols="3">
                                                <v-icon size="31px">
                                                    <v-img src="@/assets/street.png" />
                                                </v-icon>
                                            </v-col>
                                            <v-col cols="8">
                                                <div class="text-body-1 font-weight-black text-left">
                                                    <p>Street</p>
                                                    <p>{{ res.street }}</p>
                                                </div>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-row class="align-center justify-center">
                                            <v-col cols="3">
                                                <v-icon size="31px">
                                                    <v-img src="@/assets/post-code.png" />
                                                </v-icon>
                                            </v-col>
                                            <v-col cols="8">
                                                <div class="text-body-1 font-weight-black text-left">
                                                    <p>Post Code</p>
                                                    <p>{{ res.post_code }}</p>
                                                </div>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-row class="align-center justify-center">
                                            <v-col cols="3">
                                                <v-icon size="31px">
                                                    <v-img src="@/assets/area.png" />
                                                </v-icon>
                                            </v-col>
                                            <v-col cols="8">
                                                <div class="text-body-1 font-weight-black text-left">
                                                    <p>Area</p>
                                                    <p>{{ res.area }}</p>
                                                </div>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-row class="align-center justify-center">
                                            <v-col cols="3">
                                                <v-icon size="31px">
                                                    <v-img src="@/assets/district.png" />
                                                </v-icon>
                                            </v-col>
                                            <v-col cols="8">
                                                <div class="text-body-1 font-weight-black text-left">
                                                    <p>District</p>
                                                    <p>{{ res.district }}</p>
                                                </div>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-row class="align-center justify-center">
                                            <v-col cols="3">
                                                <v-icon size="31px">
                                                    <v-img src="@/assets/region.png" />
                                                </v-icon>
                                            </v-col>
                                            <v-col cols="8">
                                                <div class="text-body-1 font-weight-black text-left">
                                                    <p>Region</p>
                                                    <p>{{ res.region }}</p>
                                                </div>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-row class="align-center justify-center">
                                            <v-col cols="3">
                                                <v-icon size="31px">
                                                    <v-img src="@/assets/country.png" />
                                                </v-icon>
                                            </v-col>
                                            <v-col cols="8">
                                                <div class="text-body-1 font-weight-black text-left">
                                                    <p>Country</p>
                                                    <p>Ghana</p>
                                                </div>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-row class="align-center justify-center">
                                            <v-col cols="3">
                                                <v-icon size="31px">
                                                    <v-img src="@/assets/universal-address.png" />
                                                </v-icon>
                                            </v-col>
                                            <v-col cols="8">
                                                <div class="text-body-1 font-weight-black text-left">
                                                    <p>Universal Address</p>
                                                    <p>{{ res.address_code }}</p>
                                                </div>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-row class="align-center justify-center">
                                            <v-col cols="3">
                                                <v-icon size="31px">
                                                    <v-img src="@/assets/compass.png" />
                                                </v-icon>
                                            </v-col>
                                            <v-col cols="8">
                                                <div class="text-body-1 font-weight-black text-left">
                                                    <p>Latitutude, Longitude</p>
                                                    <p>{{ res.latitude }},{{ res.longitude }}</p>
                                                </div>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>

                        <v-btn class="bg-black mt-7 text-capitalize" block :loading="loading" size="large"
                            :disabled="!name || !number" @click="createLocation">
                            <h4>Confirm Location</h4>
                        </v-btn>
                    </div>
                </v-window-item>
            </v-window>
        </v-col>

        <v-col v-else>
            <v-window v-model="step">
                <v-window-item :value="1">
                    <h4>Your Address</h4>
                    <div class="mt-10 text-center">
                        <img src="@/assets/no-location.png" width="163" alt="empty" />
                    </div>
                    <p class="text-body-1 mt-10 font-weight-black">No address has been added yet</p>
                    <v-btn text="Add Address" class="bg-black mt-10 font-weight-bold text-capitalize" size="large" block
                        @click="step = 2" />
                </v-window-item>

                <v-window-item :value="2">
                    <h4>Enter delivery location’s details </h4>
                    <div class="mt-5">
                        <v-text-field variant="outlined" label="GPS address" bg-color="white" v-model="gp_address"
                            :rules="[rules.required]" />

                        <v-btn @click="getGPSLocation" class="bg-black my-5 text-capitalize" block size="large"
                            :disabled="!gp_address" :loading="loading">
                            <h4>Submit</h4>
                        </v-btn>
                    </div>
                    <v-img src="@/assets/ghana-post.png" alt="GPS" width="112" />


                    <div v-if="getGPS" class="my-5">
                        <v-text-field variant="outlined" label="Name associated with Address" bg-color="white"
                            v-model="name" :rules="[rules.required]" />

                        <v-text-field class="mt-2" variant="outlined" label="Phone Number" bg-color="white"
                            v-model="number" :rules="[rules.phoneNumber]" />


                        <v-card class="mt-5 text-center">
                            <v-card-text>
                                <v-row class="justify-center mt-4">
                                    <v-col cols="12">
                                        <v-row class="align-center justify-center">
                                            <v-col cols="3">
                                                <v-icon size="31px">
                                                    <v-img src="@/assets/street.png" />
                                                </v-icon>
                                            </v-col>
                                            <v-col cols="8">
                                                <div class="text-body-1 font-weight-black text-left">
                                                    <p>Street</p>
                                                    <p>{{ res.street }}</p>
                                                </div>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-row class="align-center justify-center">
                                            <v-col cols="3">
                                                <v-icon size="31px">
                                                    <v-img src="@/assets/post-code.png" />
                                                </v-icon>
                                            </v-col>
                                            <v-col cols="8">
                                                <div class="text-body-1 font-weight-black text-left">
                                                    <p>Post Code</p>
                                                    <p>{{ res.post_code }}</p>
                                                </div>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-row class="align-center justify-center">
                                            <v-col cols="3">
                                                <v-icon size="31px">
                                                    <v-img src="@/assets/area.png" />
                                                </v-icon>
                                            </v-col>
                                            <v-col cols="8">
                                                <div class="text-body-1 font-weight-black text-left">
                                                    <p>Area</p>
                                                    <p>{{ res.area }}</p>
                                                </div>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-row class="align-center justify-center">
                                            <v-col cols="3">
                                                <v-icon size="31px">
                                                    <v-img src="@/assets/district.png" />
                                                </v-icon>
                                            </v-col>
                                            <v-col cols="8">
                                                <div class="text-body-1 font-weight-black text-left">
                                                    <p>District</p>
                                                    <p>{{ res.district }}</p>
                                                </div>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-row class="align-center justify-center">
                                            <v-col cols="3">
                                                <v-icon size="31px">
                                                    <v-img src="@/assets/region.png" />
                                                </v-icon>
                                            </v-col>
                                            <v-col cols="8">
                                                <div class="text-body-1 font-weight-black text-left">
                                                    <p>Region</p>
                                                    <p>{{ res.region }}</p>
                                                </div>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-row class="align-center justify-center">
                                            <v-col cols="3">
                                                <v-icon size="31px">
                                                    <v-img src="@/assets/country.png" />
                                                </v-icon>
                                            </v-col>
                                            <v-col cols="8">
                                                <div class="text-body-1 font-weight-black text-left">
                                                    <p>Country</p>
                                                    <p>Ghana</p>
                                                </div>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-row class="align-center justify-center">
                                            <v-col cols="3">
                                                <v-icon size="31px">
                                                    <v-img src="@/assets/universal-address.png" />
                                                </v-icon>
                                            </v-col>
                                            <v-col cols="8">
                                                <div class="text-body-1 font-weight-black text-left">
                                                    <p>Universal Address</p>
                                                    <p>{{ res.address_code }}</p>
                                                </div>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-row class="align-center justify-center">
                                            <v-col cols="3">
                                                <v-icon size="31px">
                                                    <v-img src="@/assets/compass.png" />
                                                </v-icon>
                                            </v-col>
                                            <v-col cols="8">
                                                <div class="text-body-1 font-weight-black text-left">
                                                    <p>Latitutude, Longitude</p>
                                                    <p>{{ res.latitude }},{{ res.longitude }}</p>
                                                </div>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>

                        <v-btn class="bg-black mt-7 text-capitalize" block :loading="loading" size="large"
                            :disabled="!name || !number" @click="createLocation">
                            <h4>Confirm Location</h4>
                        </v-btn>
                    </div>
                </v-window-item>
            </v-window>
        </v-col>
    </v-row>
    <PromptsAction :loading="loading" :action="deleteLocation" v-if="uiStore.actionDialog" />
</template>