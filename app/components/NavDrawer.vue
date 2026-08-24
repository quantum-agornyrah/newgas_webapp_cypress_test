<template>
  <v-navigation-drawer
    width="300"
    class="navDrawer_bg text-white"
    v-model="uiStore.showNav"
    :permanent="!uiStore.toggle"
    :temporary="uiStore.toggle"
    style="height: 100vh; position: fixed; top: 0; left: 0; z-index: 9999"
  >
    <template v-slot:prepend>
      <v-img height="30" width="200" class="my-5" src="/Newgaslogo.png"></v-img>
    </template>

    <v-divider />
    <v-list class="pa-2 mt-2 opacity-100">
      <v-list-item
        rounded="lg"
        class="mb-1"
        prepend-icon="mdi-file-document-edit-outline"
        active-class="myNav"
        to="/orders"
        >Orders</v-list-item
      >
         <v-list-item
      rounded="lg"
      class="mb-1"
      prepend-icon="mdi-gas-station-outline"
      active-class="myNav"
      to="/refill"
      :disabled="locationStore.userAddress?.length == 0"
    >
      Refill
    </v-list-item>
      <v-list-item
        rounded="lg"
        class="mb-1"
        prepend-icon="mdi-archive-outline"
        active-class="myNav"
        to="/products"
        >Products & Accessories</v-list-item
      >
      <v-list-item
        rounded="lg"
        class="mb-1"
        prepend-icon="mdi-map-marker-outline"
        active-class="myNav"
        @click="changeLocation"
        v-if="locationStore.userAddress?.length > 1 && cartStore.cart?.cart_items?.quantity == 0"
        >Change Location</v-list-item
      >
    </v-list>
    <template v-slot:append>
      <v-list lines="two" style="background-color: black !important;">
        <v-list-item rounded="lg" :title="`${userStore.user?.first_name } ${userStore.user?.last_name}`" :subtitle="userStore.user?.email">
          <template v-slot:prepend>
            <v-avatar v-if="userStore.user?.profile_pic">
              <v-img :src="userStore.user?.profile_pic"></v-img>
            </v-avatar>
            <v-avatar image="../assets/profile-pic.png" v-else/>
          </template>
          <template v-slot:append>
            <v-menu location="end" style="z-index: 10000">
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props">mdi-dots-vertical</v-icon>
              </template>
              <v-list>
                <v-list-item
                  to="/profile"
                  prepend-icon="mdi-card-account-details"
                  >Profile</v-list-item
                >
                <v-list-item @click="logout">
                  <v-btn
                    rounded="md"
                    color="secondary"
                    append-icon="mdi-logout"
                    variant="flat"
                    @click="logout"
                    >Logout &nbsp;</v-btn
                  ></v-list-item
                >
              </v-list>
            </v-menu>
          </template>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>
<style lang="css" scoped>
.myNav {
  background-color: white;
  color: black;
  border: 1px solid #b5b5b5;
  font-weight: 600;
}
</style>

<script setup lang="ts">
import { useUiStore } from "@/stores/ui";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";

const uiStore = useUiStore();
const userStore = useUserStore();
const router = useRouter();
const cartStore = useCartStore();
const locationStore = useLocationStore()
const { smAndDown } = useDisplay()

const changeLocation = () => {
  if (smAndDown.value) {
    uiStore.showNav = false;
    uiStore.changeLocation = true;
  }
  uiStore.changeLocation = true;
};

const logout = () => {
  sessionStorage.clear();
  localStorage.clear();
  router.replace("/");
};

onMounted(async () => {
  await userStore.getUserData();
});
</script>
