<template>
  <v-app>
    <AppBar />
    <NavDrawer />
    <v-main class="main_bg">
      <v-divider :opacity="0.2" />
      <v-container class="pb-0" max-width="1200" v-if="locationStore.userAddress?.length == 0">
        <v-alert
            title="Complete Your Profile!" type="info" variant="tonal" 
            class="mx-auto mb-5" :class="xs ? 'mt-1' : 'mt-4'">
            <p>Tap on the button to add your delivery address by selecting <span class="font-weight-bold">"GPS Location"</span>. Orders are disabled until your profile is complete</p>
            <div class="mt-2">
              <v-btn class="text-capitalize bg-info" text="Click Here" @click="setAddress" />
            </div>
          </v-alert>
      </v-container>
      <slot />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
const { xs } = useDisplay()
const router = useRouter()
const locationStore = useLocationStore()
const profileStore = useProfileStore()

const setAddress = () => {
  router.push('/profile')
  profileStore.selectedWindow = 'location'
}
</script>
