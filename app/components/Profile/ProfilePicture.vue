<script setup lang="ts">
import { useUiStore } from '@/stores/ui';
import { useUserStore } from '@/stores/user';
import { deleteRequestHandler, patchRequestHandler } from '@/utils/httpHandler';
import { useDisplay } from 'vuetify';
import axios from 'axios';

const profileStore = useProfileStore()
const uiStore = useUiStore()
const loading = ref<boolean>(false)
const userStore = useUserStore()
const picture = ref<any>([])
const fileInput = ref()
const { smAndUp } = useDisplay()

const createBase64Image = (FileObject:any) => {
    const reader = new FileReader()
    reader.onload = (event) => {
        profileStore.imageDataUrl = event.target?.result
    }
    reader.readAsDataURL(FileObject)
}

const uploadPic = () => {
    fileInput.value.click()
}

const deletePrompt = () => {
    uiStore.actionTitle = 'Remove Profile Picture'
    uiStore.actionPrompt = 'Are you sure you want to remove your profile picture?'
    uiStore.actionDialog = true
}


const removePic = async() => {
    loading.value = true

    await deleteRequestHandler(`nova_auth/customer/${userStore.user?.id}/remove_profile_pic`, true)
    .then(async(res) => {
        uiStore.actionDialog = false
        profileStore.profilePic = false
        uiStore.success = true
        uiStore.notifyTitle = "Success"
        uiStore.notifyMessage = `Successfully removed your profile picture`
        uiStore.notifyDialog = true
        await userStore.getUserData()
    })
    .catch((error) => {
        uiStore.actionDialog = false
        profileStore.profilePic = false
        uiStore.success = false
        uiStore.notifyTitle = "Error"
        uiStore.notifyMessage = error || 'Failed to remove profile picture'
        uiStore.notifyDialog = true
    })
    .finally(() => {
        loading.value = false
    })

}

const changePic = async() => {
    loading.value = true

    await patchRequestHandler(`nova_auth/customer/${userStore.user?.id}/update_profile_pic`)
    .then(res => {
        uiStore.success = true
        uiStore.notifyTitle = "Success"  
        uiStore.notifyMessage = "Profile Picture has been successfully updated"
        uiStore.notifyDialog = true
        profileStore.profilePic = false
        userStore.uploadedPic = res.profile_pic
        profileStore.imageDataUrl = null
        postProfilePic()
        userStore.getUserData()
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

const postProfilePic = async() => {
    const formData = new FormData()
    for(let field in userStore.uploadedPic.fields){
        formData.append(field, userStore.uploadedPic.fields[field])
    }
    formData.append('file', picture.value)
    await axios.post(userStore.uploadedPic?.url, formData)
    .then(res => {
        console.log(res)
    })
    .catch((error) => {
        console.error(error)
    })
}

watch(() => picture.value, (newVal) => {
    if (newVal != "") {
        createBase64Image(newVal)
    } else {
        profileStore.imageDataUrl = null
    }
}, {deep: true})
</script>

<template>
    <v-dialog v-model="profileStore.profilePic" persistent  transition="dialog-top-transition">
        <v-card class="mx-auto" rounded="lg" v-if="!userStore?.user?.profile_pic">
            <v-card-text>
                <div class="text-right">
                    <v-btn icon="mdi-close" variant="text" @click="profileStore.profilePic = false"/>
                </div>
                <div class="text-center">
                    <p class="text-h6 font-weight-black">Profile Picture</p>
                    <v-avatar size="130" class="mt-4" v-if="profileStore.imageDataUrl">
                        <v-img :src="profileStore.imageDataUrl"/>
                    </v-avatar>
                    <v-avatar size="130" class="mt-4" v-else>
                        <v-img src="@/assets/profile-pic.png"/>
                    </v-avatar>
                </div>
                <v-row class="mt-5 justify-center">
                    <v-col cols="10">
                        <v-btn class="text-capitalize bg-bgProfile" prepend-icon="mdi-image-outline" size="x-large" block @click="uploadPic">
                            Upload Picture
                            <v-file-input v-show="false" ref="fileInput" v-model="picture" accept="image/*"/>
                        </v-btn>
                    </v-col>
                    <v-col cols="10">
                        <v-btn text="Done" class="text-capitalize bg-black" size="x-large" @click="changePic" block v-if="profileStore.imageDataUrl"
                        :loading="loading"/>
                        <v-btn text="Cancel" class="text-capitalize bg-black" size="x-large" @click="profileStore.profilePic = false" block v-else/>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <v-card :width="smAndUp ? '500' : ''" class="mx-auto" rounded="lg" v-else>
            <v-card-text>
                <div class="text-right">
                    <v-btn icon="mdi-close" variant="text" @click="profileStore.profilePic = false"/>
                </div>
                <div class="text-center">
                    <p class="text-h6 font-weight-black">Profile Picture</p>
                    <v-avatar size="130" class="mt-4" v-if="profileStore.imageDataUrl">
                        <v-img :src="profileStore.imageDataUrl"/>
                    </v-avatar>
                    <v-avatar size="130" class="mt-4" v-else>
                        <v-img :src="userStore.user?.profile_pic"/>
                    </v-avatar>
                </div>
                <v-row class="mt-5">
                    <v-col md="6" sm="6" xs="12">
                        <v-btn class="text-capitalize bg-bgProfile" prepend-icon="mdi-image-outline" size="x-large" block @click="uploadPic">
                            Change Picture
                            <v-file-input v-show="false" ref="fileInput" v-model="picture" accept="image/*"/>
                        </v-btn>
                    </v-col>
                    <v-col md="6" sm="6" xs="12">
                        <v-btn text="Remove Picture" class="text-capitalize bg-bgProfile" prepend-icon="mdi-delete-outline" size="x-large" block @click="deletePrompt" :loading="loading"/>
                    </v-col>
                    <v-col md="12" sm="12"xs="12">
                        <v-btn text="Submit" class="text-capitalize bg-black" size="x-large" block @click="changePic" v-if="profileStore.imageDataUrl"
                        :loading="loading"/>
                        <v-btn text="Done" class="text-capitalize bg-black" size="x-large" block @click="profileStore.profilePic = false" v-else/>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
    <PromptsAction :loading="loading" :action="removePic" v-if="uiStore.actionDialog"/>
    <PromptsSuccess v-if="uiStore.notifyDialog"/>
</template>