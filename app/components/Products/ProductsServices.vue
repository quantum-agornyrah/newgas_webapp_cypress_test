<template>
    <v-container max-width="1200">
      <div class="d-flex ga-6 mb-6">
        <v-btn class="text-capitalize"
          :class="productStore.activeView === 'cylinders' ? 'bg-black text-white': 'bg-transparent text-black'"
          rounded="lg" size="large" variant="outlined"
          @click="productStore.activeView = 'cylinders'"
        >
          Cylinders
        </v-btn>
  
        <v-btn class="text-capitalize"
          :class="productStore.activeView === 'accessories' ? 'bg-black text-white' : 'bg-transparent text-black'"
          rounded="lg" size="large" variant="outlined"
          @click="productStore.activeView = 'accessories'"
        >
          Accessories
        </v-btn>
      </div>
      
      <v-window v-model="productStore.activeView">
        <v-window-item value="cylinders">
          <p class="text-capitalize text-h6 font-weight-bold">
            Select your preferred cylinder type and size
          </p>
          <p class="mt-2">Only cash deposits attract a cylinder deposit cost</p>
          <v-row class="mt-3">
            <v-skeleton-loader type="card, card" class="w-100 bg-transparent" :loading="productStore.productLoader">
              <v-col cols="12" sm="4" md="3" v-for="product, index in productStore.cylinders" :key="index">
                 <ProductsProductCard :product="product" :index="index"/>
              </v-col>    
            </v-skeleton-loader>
        </v-row>
        </v-window-item>
  
        <v-window-item value="accessories">
          <p class="text-capitalize text-h6 font-weight-bold">
            Select your preferred Newgas Accessory
          </p>
            <v-row class="mt-2">
              <v-skeleton-loader type="card, card" class="w-100 bg-transparent" :loading="productStore.productLoader">
                <v-col cols="12" sm="4" md="3" v-for="product, index in productStore.accessories" :key="index">
                    <ProductsAccessoriesCard :product="product" :index="index"/>
                </v-col>
              </v-skeleton-loader>
            </v-row>
        </v-window-item>
      </v-window>
    </v-container>
    <PromptsSuccess v-if="uiStore.notifyDialog"/>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const productStore = useProductStore()
  const uiStore = useUiStore()
  const cylinders = ref<any>()
  const accessories = ref<any>()  

  
  watchEffect(async() => {
      if(productStore.activeView == 'cylinders'){
          cylinders.value = productStore.products?.filter((item:any) => {
              return item.name === 'Cylinder'
          })  
          if(cylinders.value && !productStore.cylinders){
            await productStore.getCylinders(cylinders.value?.[0]?.id)
          }
      } 
      
      if (productStore.activeView == 'accessories') {
          accessories.value = productStore.products?.filter((item:any) => {
              return item.name === 'Accessories'
          })  
          if(accessories.value && !productStore.accessories){
            await productStore.getAccessories(accessories.value?.[0]?.id)
          }
      } 
  })
  </script>
  