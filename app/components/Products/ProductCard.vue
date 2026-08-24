<script setup lang="ts">
import { useUiStore } from '@/stores/ui';
import { getRandomLightColors } from '@/utils/colors';

const uiStore = useUiStore()
const bg = getRandomLightColors(100)
const depositStore = useDepositStore()
const locationStore = useLocationStore()
const props = defineProps<{
    product: any,
    index: any
}>() 

const addProduct = () => {
    depositStore.depositFromProducts = props?.product
    uiStore.newCylinder = true
}

</script>

<template>
    <v-card>
        <v-card-text>
            <div class="py-3 d-flex justify-center rounded-lg" :style="`background-color: ${bg?.[index]}; height: 172px;`">
                <v-img :src="product?.thumbnail_image" :alt="product?.style_description" width="100%" />
            </div>
            <div class="d-flex align-center justify-space-between mt-2">
                <p class="font-weight-bold">{{ product?.style_name }}</p>
            </div>
            <div class="mt-2">
                <p>Deposit cost: GHS {{ product?.deposit }}</p>
                <p class="mt-1">Gas cost: GHS {{ product?.gas_cost }}</p>
            </div>
            <div class="mt-2">
                <p class="text-info font-weight-bold">GHS {{ product?.total_cost }}</p>
            </div>
            <v-btn text="Select" class="bg-black mt-3 text-capitalize" rounded="lg" block :disabled="locationStore.userAddress?.length == 0"
                @click="addProduct" />
        </v-card-text>
    </v-card>
</template>