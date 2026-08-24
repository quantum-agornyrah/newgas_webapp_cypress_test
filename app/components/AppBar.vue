<template>
  <v-app-bar flat class="px-5 main_bg">
    <template v-slot:prepend>
      <v-btn
        v-if="uiStore.toggle"
        color="secondary"
        icon="mdi-menu"
        size="small"
        rounded="lg"
        @click="uiStore.showNav = true"
      ></v-btn>
    </template>

    <template v-slot:append>
      <div v-if="uiStore.toggle && locationStore.userAddress?.length > 1">
        <v-tooltip text="Change Delivery Address">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="mdi-map-marker" color="redBtn" @click="uiStore.changeLocation = true" :disabled="cartStore.cart?.cart_items?.quantity > 0"/>
          </template>
        </v-tooltip>
      </div>

      <div style="opacity: 0.9" class="d-flex align-center">
        <v-btn
          variant="text"
          @click="router.push('/orderdetails')"
          size="large"
          stacked
          v-if="cartStore.cart?.cart_items?.quantity"
          :disabled="locationStore.userAddress?.length == 0"
        >
        <v-badge :content="cartStore.cart?.cart_items?.quantity" color="redBtn">
          <v-icon icon="mdi-cart-outline"/>
        </v-badge>
      </v-btn>

      <v-btn
          icon="mdi-cart-outline"
          variant="text"
          @click="router.push('/orderdetails')"
          v-if="cartStore.cart?.cart_items?.quantity == 0"
          :disabled="locationStore.userAddress?.length == 0"
        />
      </div>
      <v-menu v-if="uiStore.toggle">
        <template v-slot:activator="{ props }">
          <v-btn
            variant="text"
            class="border-white border-lg border-opacity-0 text-black"
            size="large"
            style="opacity: 0.6"
            icon="mdi-account-outline"
            v-bind="props"
          ></v-btn>
        </template>

        <v-list>
          <v-list-item to="/profile" prepend-icon="mdi-card-account-details">
            Profile
          </v-list-item>
          <v-list-item class="text-center">
            <v-btn
              rounded="md"
              color="secondary"
              append-icon="mdi-logout"
              variant="flat"
              @click="logout()"
              class="bg-primary"
              block
              >Logout &nbsp;</v-btn
            >
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-app-bar>
  <LocationChangeLocation v-if="uiStore.changeLocation"/>
</template>
<script lang="ts" setup>
import { useUiStore } from "@/stores/ui";

const uiStore = useUiStore();
const userStore = useUserStore();
const cartStore = useCartStore();
const locationStore = useLocationStore();
const router = useRouter();
const logout = () => {
  sessionStorage.clear();
  localStorage.clear();
  router.replace("/");
};

onMounted(async() => {
  Promise.all([
  await userStore.getUserData(),
  await cartStore.getCustomerCart(userStore.user?.id),
  await locationStore.getAllCustomerAddress(userStore.user?.id)
  ])
})

</script>

<style scoped lang="css"></style>
