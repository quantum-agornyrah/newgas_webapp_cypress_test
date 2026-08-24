<script setup lang="ts">
import { getRandomLightColors } from '@/utils/colors';
import { useUiStore } from '@/stores/ui';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore()
const uiStore = useUiStore()
const router = useRouter()
const bg = getRandomLightColors(100)
const loading = ref<boolean>(false)

const props = defineProps<{
    product: any,
    index: number
}>()

const addToCart = async() => {
    uiStore.orderDetails = props.product
    uiStore.addMore = true
}

</script>

<template>
    <v-card>
        <v-card-text>
            <div class="py-3 d-flex justify-center rounded-lg"
                :style="`background-color: ${bg?.[index]}; height: 172px;`">
                <img :src="product?.images?.[0]?.image_url" :alt="product?.description"
                    class="cursor-pointer" />
            </div>
            <div class="d-flex align-center justify-space-between mt-2">
                <p class="font-weight-bold">{{ product?.name  }}</p>
            </div>
            <div class="mt-2">
                <p>Deposit cost: GHS {{ product?.product_deposit_rate?.payable_amount }}</p>
                <p class="mt-1">Gas cost: GHS {{  product?.product_cost?.cost }}</p>
                <p class="text-info mt-1 font-weight-bold">GHS {{ product?.product_deposit_rate?.payable_amount +
                    product?.product_cost?.cost  }}</p>
            </div>
            <v-btn text="Select" class="bg-black mt-3 text-capitalize" rounded="lg" block
                @click="addToCart" :loading="loading" />
        </v-card-text>
    </v-card>
</template>