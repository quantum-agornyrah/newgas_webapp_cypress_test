<template>
    <v-container max-width="1200" :class="xs ? 'mt-5' : 'mt-8'">
        <v-row class="justify-space-around" v-if="!xs">
            <v-col md="5" sm="5" cols="12" class="fill-height">
                <h4>Account</h4>
                <v-card class="pa-6 elevation-0" :class="xs ? 'my-6' : 'my-10'" @click="profileStore.selectedWindow = 'profile'"
                    :color="profileStore.selectedWindow == 'profile' ? '#FFE6C1' : ''">
                    <div class="d-flex align-center justify-space-between">
                        <div class="d-flex align-center">
                            <v-icon icon="mdi-account-outline"
                                :color="profileStore.selectedWindow == 'profile' ? 'black' : '#8A8A8A'"></v-icon>
                            <h4 class="ml-6" :style="`color: ${profileStore.selectedWindow == 'profile' ? 'black' : '#8A8A8A'}`">
                                Profile</h4>
                        </div>
                        <v-icon icon="mdi-chevron-right"
                            :color="profileStore.selectedWindow == 'profile' ? 'black' : '#8A8A8A'"></v-icon>
                    </div>
                </v-card>

                <v-card class="pa-6 elevation-0" :class="xs ? 'my-6' : 'my-10'" @click="profileStore.selectedWindow = 'location'"
                    :color="profileStore.selectedWindow == 'location' ? '#FFE6C1' : ''">
                    <div class="d-flex align-center justify-space-between">
                        <div class="d-flex align-center">
                            <v-icon icon="mdi-map-marker-plus-outline"
                                :color="profileStore.selectedWindow == 'location' ? 'black' : '#8A8A8A'"></v-icon>
                            <h4 class="ml-6" :style="`color: ${profileStore.selectedWindow == 'location' ? 'black' : '#8A8A8A'}`">
                                GPS Location</h4>
                        </div>
                        <v-icon icon="mdi-chevron-right"
                            :color="profileStore.selectedWindow == 'location' ? 'black' : '#8A8A8A'"></v-icon>
                    </div>
                </v-card>

                <v-card class="pa-6 elevation-0" :class="xs ? 'my-6' : 'my-10'" @click="profileStore.selectedWindow = 'email'"
                    :color="profileStore.selectedWindow == 'email' ? '#FFE6C1' : ''">
                    <div class="d-flex align-center justify-space-between">
                        <div class="d-flex align-center">
                            <v-icon icon="mdi-email-outline"
                                :color="profileStore.selectedWindow == 'email' ? 'black' : '#8A8A8A'"></v-icon>
                            <h4 class="ml-6" :style="`color: ${profileStore.selectedWindow == 'email' ? 'black' : '#8A8A8A'}`">Email
                                Address</h4>
                        </div>
                        <v-icon icon="mdi-chevron-right"
                            :color="profileStore.selectedWindow == 'email' ? 'black' : '#8A8A8A'"></v-icon>
                    </div>
                </v-card>

                <v-card class="pa-6 elevation-0" :class="xs ? 'my-6' : 'my-10'" @click="changePhone()"
                    :color="profileStore.selectedWindow == 'changePhone' ? '#FFE6C1' : ''">
                    <div class="d-flex align-center justify-space-between">
                        <div class="d-flex align-center">
                            <v-icon icon="mdi-phone-outline"
                                :color="profileStore.selectedWindow == 'changePhone' ? 'black' : '#8A8A8A'"></v-icon>
                            <h4 class="ml-6" :style="`color: ${profileStore.selectedWindow == 'changePhone' ? 'black' : '#8A8A8A'}`">
                                Change Phone Number</h4>
                        </div>
                        <v-icon icon="mdi-chevron-right"
                            :color="profileStore.selectedWindow == 'changePhone' ? 'black' : '#8A8A8A'"></v-icon>
                    </div>
                </v-card>

                <v-card class="pa-6 elevation-0" :class="xs ? 'my-6' : 'my-10'" @click="changePIn"
                    :color="profileStore.selectedWindow == 'changePin' ? '#FFE6C1' : ''">
                    <div class="d-flex align-center justify-space-between">
                        <div class="d-flex align-center">
                            <v-icon icon="mdi-key-outline"
                                :color="profileStore.selectedWindow == 'changePin' ? 'black' : '#8A8A8A'"></v-icon>
                            <h4 class="ml-6" :style="`color: ${profileStore.selectedWindow == 'changePin' ? 'black' : '#8A8A8A'}`">
                                Change Pin</h4>
                        </div>
                        <v-icon icon="mdi-chevron-right"
                            :color="profileStore.selectedWindow == 'changePin' ? 'black' : '#8A8A8A'"></v-icon>
                    </div>
                </v-card>

                <v-divider thickness="5" class=""></v-divider>

                <!-- <v-card class="pa-6  my-6 elevation-0" @click="manageAccount" :color="profileStore.selectedWindow == 'manage-account' ? '#FFE6C1' : ''">
                    <div class="d-flex align-center justify-space-between">
                        <div class="d-flex align-center">
                            <v-icon icon="mdi-cog-outline" :color="profileStore.selectedWindow == 'manage-account' ? 'black' : '#8A8A8A'"></v-icon>
                            <h4 class="ml-6" :style="`color: ${profileStore.selectedWindow == 'manage-account' ? 'black' : '#8A8A8A'}`">Manage Account</h4>
                        </div>
                        <v-icon icon="mdi-chevron-down" :color="profileStore.selectedWindow == 'manage-account' ? 'black' : '#8A8A8A'"></v-icon>
                    </div>
                </v-card>

                <v-card class="pa-6  my-6 elevation-0" @click="uiStore.actionDialog = true" v-if="profileStore.selectedWindow == 'manage-account'">
                    <div class="d-flex align-center justify-space-between">
                        <div class="d-flex align-center">
                            <v-icon icon="mdi-trash-can-outline" color="#8A8A8A"></v-icon>
                            <h4 class="ml-6" style="color: #8A8A8A;">Delete Account</h4>
                        </div>
                        <v-icon icon="mdi-chevron-right" color="#8A8A8A"></v-icon>
                    </div>
                </v-card> -->
            </v-col>

            <v-col md="5" sm="5" cols="12">
                <v-skeleton-loader type="card,card" class="bg-transparent" :loading="userStore.userLoader">
                    <v-window v-model="profileStore.selectedWindow" class="w-100">
                        <v-window-item value="profile">
                            <ProfileDetails />
                        </v-window-item>
    
                        <v-window-item value="location" class="overflow-y-scroll" style="max-height:70vh;">
                            <ProfileGpsLocation />
                        </v-window-item>
    
                        <v-window-item value="email">
                            <ProfileChangeEmail />
                        </v-window-item>
    
                        <v-window-item value="changePhone">
                            <ProfileChangePhone @update-selected-window="(window) => profileStore.selectedWindow = window"/>
                        </v-window-item>
    
                        <v-window-item value="changePin">
                            <ProfileChangePIN @update-selected-window="(window) => profileStore.selectedWindow = window"/>
                        </v-window-item>
    <!-- 
                        <v-window-item value="manage-account">
                            <ProfileDetails />
                        </v-window-item> -->
    
                        <!-- <v-window-item value="delete-account">
                            <DeleteAccount />
                        </v-window-item> -->
                    </v-window>
                </v-skeleton-loader>
            </v-col>
        </v-row>
        <v-row class="justify-space-around" v-if="xs">
            <v-col cols="12">
                <v-skeleton-loader class="w-100 bg-transparent" type="card, card" :loading="userStore.userLoader">
                    <v-window v-model="profileStore.selectedWindow" class="w-100">
                        <v-window-item value="profile">
                            <ProfileDetails />
                        </v-window-item>
    
                        <v-window-item value="location" class="overflow-y-scroll" style="max-height:70vh;">
                            <ProfileGpsLocation />
                        </v-window-item>
    
                        <v-window-item value="email">
                            <ProfileChangeEmail />
                        </v-window-item>
    
                        <v-window-item value="changePhone">
                            <ProfileChangePhone @update-selected-window="(window) => profileStore.selectedWindow = window"/>
                        </v-window-item>
    
                        <v-window-item value="changePin">
                            <ProfileChangePIN @update-selected-window="(window) => profileStore.selectedWindow = window"/>
                        </v-window-item>
    <!-- 
                        <v-window-item value="manage-account">
                            <ProfileDetails />
                        </v-window-item> -->
    
                        <!-- <v-window-item value="delete-account">
                            <DeleteAccount />
                        </v-window-item> -->
                    </v-window>
                </v-skeleton-loader>
            </v-col>
            <v-col cols="12" class="fill-height">
                <h4>Account</h4>
                <v-card class="pa-6 elevation-0" :class="xs ? 'my-6' : 'my-10'" @click="profileStore.selectedWindow = 'profile'"
                    :color="profileStore.selectedWindow == 'profile' ? '#FFE6C1' : ''">
                    <div class="d-flex align-center justify-space-between">
                        <div class="d-flex align-center">
                            <v-icon icon="mdi-account-outline"
                                :color="profileStore.selectedWindow == 'profile' ? 'black' : '#8A8A8A'"></v-icon>
                            <h4 class="ml-6" :style="`color: ${profileStore.selectedWindow == 'profile' ? 'black' : '#8A8A8A'}`">
                                Profile</h4>
                        </div>
                        <v-icon icon="mdi-chevron-right"
                            :color="profileStore.selectedWindow == 'profile' ? 'black' : '#8A8A8A'"></v-icon>
                    </div>
                </v-card>

                <v-card class="pa-6 elevation-0" :class="xs ? 'my-6' : 'my-10'" @click="profileStore.selectedWindow = 'location'"
                    :color="profileStore.selectedWindow == 'location' ? '#FFE6C1' : ''">
                    <div class="d-flex align-center justify-space-between">
                        <div class="d-flex align-center">
                            <v-icon icon="mdi-map-marker-plus-outline"
                                :color="profileStore.selectedWindow == 'location' ? 'black' : '#8A8A8A'"></v-icon>
                            <h4 class="ml-6" :style="`color: ${profileStore.selectedWindow == 'location' ? 'black' : '#8A8A8A'}`">
                                GPS Location</h4>
                        </div>
                        <v-icon icon="mdi-chevron-right"
                            :color="profileStore.selectedWindow == 'location' ? 'black' : '#8A8A8A'"></v-icon>
                    </div>
                </v-card>

                <v-card class="pa-6 elevation-0" :class="xs ? 'my-6' : 'my-10'" @click="profileStore.selectedWindow = 'email'"
                    :color="profileStore.selectedWindow == 'email' ? '#FFE6C1' : ''">
                    <div class="d-flex align-center justify-space-between">
                        <div class="d-flex align-center">
                            <v-icon icon="mdi-email-outline"
                                :color="profileStore.selectedWindow == 'email' ? 'black' : '#8A8A8A'"></v-icon>
                            <h4 class="ml-6" :style="`color: ${profileStore.selectedWindow == 'email' ? 'black' : '#8A8A8A'}`">Email
                                Address</h4>
                        </div>
                        <v-icon icon="mdi-chevron-right"
                            :color="profileStore.selectedWindow == 'email' ? 'black' : '#8A8A8A'"></v-icon>
                    </div>
                </v-card>

                <v-card class="pa-6 elevation-0" :class="xs ? 'my-6' : 'my-10'" @click="changePhone"
                    :color="profileStore.selectedWindow == 'changePhone' ? '#FFE6C1' : ''">
                    <div class="d-flex align-center justify-space-between">
                        <div class="d-flex align-center">
                            <v-icon icon="mdi-phone-outline"
                                :color="profileStore.selectedWindow == 'changePhone' ? 'black' : '#8A8A8A'"></v-icon>
                            <h4 class="ml-6" :style="`color: ${profileStore.selectedWindow == 'changePhone' ? 'black' : '#8A8A8A'}`">
                                Change Phone Number</h4>
                        </div>
                        <v-icon icon="mdi-chevron-right"
                            :color="profileStore.selectedWindow == 'changePhone' ? 'black' : '#8A8A8A'"></v-icon>
                    </div>
                </v-card>

                <v-card class="pa-6 elevation-0" :class="xs ? 'my-6' : 'my-10'" @click="changePIn"
                    :color="profileStore.selectedWindow == 'changePin' ? '#FFE6C1' : ''">
                    <div class="d-flex align-center justify-space-between">
                        <div class="d-flex align-center">
                            <v-icon icon="mdi-key-outline"
                                :color="profileStore.selectedWindow == 'changePin' ? 'black' : '#8A8A8A'"></v-icon>
                            <h4 class="ml-6" :style="`color: ${profileStore.selectedWindow == 'changePin' ? 'black' : '#8A8A8A'}`">
                                Change Pin</h4>
                        </div>
                        <v-icon icon="mdi-chevron-right"
                            :color="profileStore.selectedWindow == 'changePin' ? 'black' : '#8A8A8A'"></v-icon>
                    </div>
                </v-card>

                <v-divider thickness="5" class=""></v-divider>

                <!-- <v-card class="pa-6  my-6 elevation-0" @click="manageAccount" :color="profileStore.selectedWindow == 'manage-account' ? '#FFE6C1' : ''">
                    <div class="d-flex align-center justify-space-between">
                        <div class="d-flex align-center">
                            <v-icon icon="mdi-cog-outline" :color="profileStore.selectedWindow == 'manage-account' ? 'black' : '#8A8A8A'"></v-icon>
                            <h4 class="ml-6" :style="`color: ${profileStore.selectedWindow == 'manage-account' ? 'black' : '#8A8A8A'}`">Manage Account</h4>
                        </div>
                        <v-icon icon="mdi-chevron-down" :color="profileStore.selectedWindow == 'manage-account' ? 'black' : '#8A8A8A'"></v-icon>
                    </div>
                </v-card>

                <v-card class="pa-6  my-6 elevation-0" @click="uiStore.actionDialog = true" v-if="profileStore.selectedWindow == 'manage-account'">
                    <div class="d-flex align-center justify-space-between">
                        <div class="d-flex align-center">
                            <v-icon icon="mdi-trash-can-outline" color="#8A8A8A"></v-icon>
                            <h4 class="ml-6" style="color: #8A8A8A;">Delete Account</h4>
                        </div>
                        <v-icon icon="mdi-chevron-right" color="#8A8A8A"></v-icon>
                    </div>
                </v-card> -->
            </v-col>
        </v-row>
        <ProfilePicture v-if="profileStore.profilePic"/>
        <PromptsSuccess v-if="uiStore.notifyDialog"/>
        <!-- <ActionPrompt :action="deleteAccount" v-if="uiStore.actionDialog"/>
        <AccountDelete v-if="uiStore.deleteDialog"/> -->
    </v-container>
</template>

<script setup lang="ts">
import { useLocationStore } from '@/stores/location';
import { useUiStore } from '@/stores/ui';
import { useUserStore } from '@/stores/user';
import { formatPhoneNumber } from '@/utils/constants';
import { getRequestHandler } from '@/utils/httpHandler';
import { useDisplay } from 'vuetify';

const userStore = useUserStore()
const { xs } = useDisplay()
const uiStore = useUiStore()
const profileStore = useProfileStore()
// const selectedWindow = ref<string>('profile')
const locationStore = useLocationStore()
// const timerInterval = ref<any>()

// const timer = () => {
//     // Clear any existing timer
//     if (timerInterval.value) {
//         clearInterval(timerInterval.value);
//     }

//     let y = 1 * 60 * 1000; // 5 minutes in ms
//     let tokenExp = new Date().getTime();

//     timerInterval.value = setInterval(function () {
//         let now = new Date().getTime();
//         profileStore.timeDiff  = (tokenExp + y) - now;

//         if (profileStore.timeDiff < 0) {
//             clearInterval(timerInterval.value);
//             timerInterval.value = null;
//         }
//     }, 1000);
// }

watch(() => profileStore.timeDiff , async (newValue) => {
    if (newValue) {
        // Time calculations for days, hours, minutes and seconds
        let totalSeconds = Math.floor(profileStore.timeDiff / 1000);
        profileStore.mins = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
        profileStore.secs = String(totalSeconds % 60).padStart(2, '0');
    }
})
// const goBack = () => {
//     if (profileStore.selectedWindow !== 'profile') {
//         profileStore.selectedWindow = 'profile';
//     }
// };

// const manageAccount = () => {
//     profileStore.selectedWindow.value = 'manage-account'
//     uiStore.actionTitle = "Delete Account?"
//     uiStore.actionPrompt = "Are you sure you want to delete your account?"
// }

// const deleteAccount = () => {
//     uiStore.actionDialog = false
//     profileStore.selectedWindow = "delete-account"
// }

// const changePhone = async() => {
//     await getRequestHandler(`nova_auth/customer/${userStore.user?.id}/phone/update_request?old_phone=${encodeURIComponent(userStore.user?.phone)}`, true)
//     .then(res => {
//         profileStore.selectedWindow = 'changePhone'
//         timer()
//     })
//     .catch((error) => {
//         uiStore.success = false
//         uiStore.notifyTitle = "Error"  
//         uiStore.notifyMessage = error
//         uiStore.notifyDialog = true
//     })
// }

// const changePIn = async() => {
//     await getRequestHandler(`nova_auth/customer/send_otp?country_code=%2B233&phone_number=${formatPhoneNumber(userStore.user?.phone)}&purpose=change_pin`)
//     .then(res => {
//         profileStore.selectedWindow = 'changePin'
//         timer()
//     })
//     .catch((error) => {
//         uiStore.success = false
//         uiStore.notifyTitle = "Error"  
//         uiStore.notifyMessage = error
//         uiStore.notifyDialog = true
//     })
// }

onMounted(async() => {
    await userStore.getUserData()
    await locationStore.getAllCustomerAddress(userStore.user?.id);
})
</script>

<style scoped lang="css"></style>