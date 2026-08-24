<template>
    <h4>Profile Picture</h4>
    <div class="d-flex align-center justify-space-between">
        <v-avatar size="100" class="mt-4 cursor-pointer" v-if="!userStore?.user?.profile_pic" @click="profileStore.profilePic = true">
            <v-img src="@/assets/profile-pic.png" />
        </v-avatar>
        <v-avatar size="100" class="mt-4 cursor-pointer" v-if="userStore?.user?.profile_pic" @click="profileStore.profilePic = true">
            <v-img :src="userStore?.user?.profile_pic" />
        </v-avatar>

        <v-btn text="Edit Profile" class="bg-black text-capitalize" @click="editButton" v-if="disabled"/>
    </div>
    <v-form @submit.prevent="editProfile" v-model="form">
        <div class="flex mt-7">
            <h4 class="mb-2">First Name</h4>
            <v-text-field :rules="[rules.required]" v-model="firstName" variant="outlined" bg-color="white" placeholder="Eg. Kwadwo" :disabled="disabled"/> 
        </div>
    
        <div class="flex my-2">
            <h4 class="mb-2">Last Name</h4>
            <v-text-field  :rules="[rules.required]" v-model="lastName" variant="outlined" bg-color="white" placeholder="Eg. Mensah" :disabled="disabled" />
        </div>
        <div class="flex my-2" v-if="userStore.user?.email">
            <h4 class="mb-2">Email</h4>
            <v-text-field :rules="[rules.email]" v-model="email" variant="outlined" bg-color="white" placeholder="Eg. kwadwomensah@example.com" readonly :disabled="disabled"/> 
        </div>
        <div class="d-flex justify-end ga-4" v-if="!disabled">
            <v-btn text="Cancel" class="bg-black text-capitalize" @click="disabled = true"/>
            <v-btn text="Save" class="bg-black text-capitalize" :disabled="!form" type="submit" :loading="loading"/>
        </div>
    </v-form>
</template>

<script setup lang="ts">
import { useUiStore } from '@/stores/ui';
import { useUserStore } from '@/stores/user';
import { patchRequestHandler } from '@/utils/httpHandler';

const profileStore = useProfileStore()
const uiStore = useUiStore()
const loading = ref<boolean>(false)
const userStore = useUserStore()
const firstName = ref<string>('')
const lastName = ref<string>('')
const email = ref<string>('')
const disabled = ref<boolean>(true)
const form = ref<boolean>(false)
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


const editButton = () => {
    disabled.value = false
}

const editProfile = async() => {
   loading.value = true

    const data = ref<any>({
        first_name: firstName.value,
        last_name: lastName.value,
        email: email.value,
        is_showcase_view: true
    })

    await patchRequestHandler(`nova_auth/customer/${userStore.user?.id}/update_profile`, data.value, true)
    .then(res => {
        uiStore.success = true
        uiStore.notifyTitle = "Success"  
        uiStore.notifyMessage = "Your Profile has been successfully updated"
        uiStore.notifyDialog = true
        userStore.getUserData()
        disabled.value = true
    })
    .catch((error) => {
        uiStore.notifyTitle = "Error"  
        uiStore.notifyMessage = error
        uiStore.notifyDialog = true
    })
    .finally(() => {
       loading.value = false
    })
}

onMounted(async() => {
    await userStore.getUserData()
    firstName.value = userStore?.user?.first_name
    lastName.value = userStore?.user?.last_name
    email.value = userStore?.user?.email
})
</script>

<style scoped lang="css"></style>