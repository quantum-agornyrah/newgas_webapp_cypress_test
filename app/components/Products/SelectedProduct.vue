<script setup lang="ts">
import { getRandomLightColors } from '@/utils/colors';
import { useDisplay } from 'vuetify';
import { useUserStore } from '@/stores/user';
import { useUiStore } from '@/stores/ui';

const { xs } = useDisplay()
const bg = getRandomLightColors(100)
const userStore = useUserStore()
const uiStore = useUiStore()
const loading = ref<boolean>(false)
const router = useRouter()

const addExchangeCylinder = () => {
    router.push('/cylinderdeposit')
}
const addToCart = async() => {
    loading.value = true

    const data = ref<any>({
        // product_style_id: productStore.viewProduct.id,
        // order_type: productStore.orderTypes?.[0].id,
        is_self_pickup: true,
        quantity: 1,
        is_active: true,
        cart_type: 'product'
    })

}

</script>

<template>
    <v-container max-width="1200" :class="xs ? 'pt-0' : ''">
        <!-- <v-row class="mt-4" v-if="productStore.cashDeposit">
            <v-col cols="12" md="5" sm="12">
                <v-card>
                    <v-card-text>
                        <div class="pa-6 d-flex justify-center rounded-lg" :style="`background-color: ${bg?.[productStore?.viewProductIndex]}; height: ${xs ? '400px' : '490px'};`">
                            <v-img :src="productStore?.viewProduct?.images?.[0]?.image_url" :alt="productStore?.viewProduct?.name"/>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="6">
                <v-card height="521">
                    <v-card-text>
                        <p class="text-h6 font-weight-bold mt-6">Product Description</p>
                        <p class="mt-7">{{ productStore?.viewProduct?.name }}</p>
                        <div>
                            <p class="mt-7" style="max-width: 90%;">
                                This 3kg steel cylinder is made from steel and is
                                able to store up to 3 liters of LPG. Volume is 7.2
                                cubic meters. It is use for pressure vessel,
                                steel-plastic storage tank.
                            </p>
                            <p class="text-info mt-7">
                                GHS {{ productStore.viewProduct?.product_cost?.cost + productStore.viewProduct?.product_deposit_rate?.payable_amount  }}
                            </p>
                            <div class="mt-5">
                                <p class="text-caption font-weight-bold mt-7">Measurements</p>
                                <p>
                                    {{ productStore.viewProduct?.dimension }} {{ productStore.viewProduct?.weight  }}{{ productStore.viewProduct?.measuring_unit  }} 
                                    {{  productStore.viewProduct?.material_type }}
                                </p>
                            </div>
                            <div class="text-info mt-7 d-flex justify-space-between">
                                <p>Deposit cost: GHS {{ productStore.viewProduct?.product_deposit_rate?.payable_amount }}</p>
                                <p>Gas cost: GHS {{ productStore.viewProduct?.product_cost?.cost }}</p>
                            </div>
                        </div>
                        <div class="mt-14">
                            <v-btn text="Add" prepend-icon="mdi-plus" class="bg-black text-capitalize" block @click="addToCart" :loading="loading"/>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-row class="mt-4" v-if="productStore.cylinderDeposit">
            <v-col cols="12" md="5" sm="12">
                <v-card>
                    <v-card-text>
                        <div class="pa-6 d-flex justify-center rounded-lg" :style="`background-color: ${bg?.[productStore?.viewProductIndex]}; height: ${xs ? '400px' : '490px'};`">
                            <v-img :src="productStore?.viewProduct?.image_url" :alt="productStore?.viewProduct?.name"/>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="6">
                <v-card height="521">
                    <v-card-text>
                        <p class="text-h6 font-weight-bold mt-6">Product Description</p>
                        <p class="mt-12">{{ productStore.viewProduct?.name }}</p>
                        <div>
                            <p class="mt-12" style="max-width: 90%;">
                                {{ productStore.viewProduct?.description }}
                            </p>
                            <p class="mt-12" style="max-width: 90%;">* Please ensure you select the correct option for cylinder deposit. Incorrect selection may result in order 
                                cancellation upon delivery.</p>
                        </div>
                        <div class="mt-14">
                            <v-btn text="Add" prepend-icon="mdi-plus" class="bg-black text-capitalize" block @click="addExchangeCylinder" :loading="loading"/>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-row class="mt-4" v-if="productStore.productAccessories">
            <v-col cols="12" md="5" sm="12">
                <v-card>
                    <v-card-text>
                        <div class="pa-6 d-flex justify-center rounded-lg" :style="`background-color: ${bg?.[productStore?.viewProductIndex]}; height: ${xs ? '400px' : '490px'};`">
                            <v-img :src="productStore?.viewProduct?.images?.[0]?.image_url" :alt="productStore?.viewProduct?.name"/>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="6">
                <v-card height="521">
                    <v-card-text>
                        <p class="text-h6 font-weight-bold mt-6">Product Description</p>
                        <p class="mt-7">{{ productStore?.viewProduct?.name }}</p>
                        <div>
                            <p class="mt-7" style="max-width: 90%;">
                                This 3kg steel cylinder is made from steel and is
                                able to store up to 3 liters of LPG. Volume is 7.2
                                cubic meters. It is use for pressure vessel,
                                steel-plastic storage tank.
                            </p>
                            <div class="mt-5">
                                <p class="text-caption font-weight-bold mt-7">Measurements</p>
                                <p>
                                    {{ productStore.viewProduct?.dimension }} {{ productStore.viewProduct?.weight  }}{{ productStore.viewProduct?.measuring_unit  }} 
                                    {{  productStore.viewProduct?.material_type }}
                                </p>
                            </div>
                            <div class="text-info mt-7 d-flex justify-space-between">
                                <p>Cost: GHS {{ productStore.viewProduct?.product_cost?.cost }}</p>
                            </div>
                        </div>
                        <div class="mt-14">
                            <v-btn text="Add" prepend-icon="mdi-plus" class="bg-black text-capitalize" block @click="addToCart" :loading="loading"/>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row> -->
        <!-- <div class="mt-10">
            <p class="text-h6 font-weight-bold">Suggested Products For you</p>
        </div>
        <v-row class="mt-1">
            <v-col cols="6" md="2" sm="3">
                <v-card>
                    <v-card-text>
                        <div class="pa-1 d-flex justify-center rounded-lg" :style="`background-color: ${bg?.[0]}; height: 160px;`">
                            <v-img src="../assets/6kg.png" alt="6kg" width="156"/>
                        </div>
                        <div class="mt-2">
                            <p class="text-body-2 font-weight-bold">6kg | Steel</p>
                            <div class="d-flex align-center justify-space-between">
                                <p class="text-info font-weight-bold">GHS 75</p>
                                <v-btn icon="mdi-cart-outline" variant="text"/>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="6" md="2" sm="3">
                <v-card>
                    <v-card-text>
                        <div class="pa-1 d-flex justify-center rounded-lg" :style="`background-color: ${bg?.[1]}; height: 160px;`">
                            <v-img src="../assets/6kg.png" alt="6kg" width="156"/>
                        </div>
                        <div class="mt-2">
                            <p class="text-body-2 font-weight-bold">6kg | Steel</p>
                            <div class="d-flex align-center justify-space-between">
                                <p class="text-info font-weight-bold">GHS 75</p>
                                <v-btn icon="mdi-cart-outline" variant="text"/>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="6" md="2" sm="3">
                <v-card>
                    <v-card-text>
                        <div class="pa-1 d-flex justify-center rounded-lg" :style="`background-color: ${bg?.[2]}; height: 160px;`">
                            <v-img src="../assets/6kg.png" alt="6kg" width="156"/>
                        </div>
                        <div class="mt-2">
                            <p class="text-body-2 font-weight-bold">6kg | Steel</p>
                            <div class="d-flex align-center justify-space-between">
                                <p class="text-info font-weight-bold">GHS 75</p>
                                <v-btn icon="mdi-cart-outline" variant="text"/>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row> -->
    </v-container>
</template>