<script setup lang="ts">
import { useUiStore } from '@/stores/ui';
const step = ref<number>(1)

const uiStore = useUiStore()
const router = useRouter()
const { xs } = useDisplay()

const refill = () => {
    uiStore.addProduct = false
    router.push('/refill')
}


const accessories = () => {
    uiStore.addProduct = false
    router.push('/products')
}
</script>

<template>
    <v-dialog v-model="uiStore.addProduct" max-width="450" persistent>
        <v-card class="text-center">
            <v-card-text class="pt-5" :class="xs ? 'pa-5' : 'pa-7'">
                <div class="d-flex align-center justify-space-between">
                    <v-btn icon="mdi-arrow-left-top" variant="text" @click="step = 1" v-if="step > 1"/>
                    <v-btn icon="mdi-close" class="ml-auto" variant="text" @click="uiStore.addProduct = false"/>
                </div>
                
                <v-window class="mt-3" v-model="step">
                    <v-window-item :value="1" disabled>
                        <div class="text-center">
                            <img src="@/assets/addmore.png" alt="Add-more" :width="xs ? '90' : '120'" />
                        </div>
                        <p class="mt-4 text-h5 font-weight-black">Add Product</p>
                        <p class="mt-4">Choose from the option below to process your order.</p>
                        <v-row class="mt-5">
                            <v-col cols="12">
                                <v-card class="border" rounded="lg" elevation="2" @click="refill">
                                    <v-card-text>
                                        <div class="d-flex align-center text-left ga-4">
                                            <div>
                                                <v-img src="@/assets/refill.png" alt="refill" width="48" />
                                            </div>
                                            <div>
                                                <p class="text-body-1 font-weight-bold">Refill Cylinder</p>
                                                <p class="text-subtitle-2">Cylinder from newgas that you have</p>
                                            </div>
                                            <v-icon icon="mdi-chevron-right" size="20" class="ml-auto"/>
                                        </div>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                            <v-col cols="12">
                                <v-card class="mb-2 border" rounded="lg" elevation="2" @click="accessories">
                                    <v-card-text>
                                        <div class="d-flex align-center text-left ga-4">
                                            <div>
                                                <v-img src="@/assets/accessories.png" alt="accessories" width="48" />
                                            </div>
                                            <div>
                                                <p class="text-body-1 font-weight-bold">Products & Accessories</p>
                                                <p class="text-subtitle-2">Add Product/accessory to your purchase</p>
                                            </div>
                                            <v-icon icon="mdi-chevron-right" size="20" class="ml-auto"/>
                                        </div>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-window-item>
                    <!-- <v-window-item :value="3">
                        <v-row>
                            <v-col cols="12">
                                <v-card class="border" rounded="lg" elevation="2" @click="refill">
                                    <v-card-text>
                                        <div class="d-flex align-center text-left ga-4">
                                            <div>
                                                <v-img src="../../assets/refill.png" alt="Refill" width="48" />
                                            </div>
                                            <div>
                                                <p class="text-body-1 font-weight-bold">Refill</p>
                                            </div>
                                            <v-icon icon="mdi-chevron-right" size="20" class="ml-auto"/>
                                        </div>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                            <v-col cols="12">
                                <v-card class="mb-2 border" rounded="lg" elevation="2">
                                    <v-card-text>
                                        <div class="d-flex align-center text-left ga-4">
                                            <div>
                                                <v-img src="../../assets/upgrade.png" alt="upgrade" width="48" />
                                            </div>
                                            <div>
                                                <p class="text-body-1 font-weight-bold">Upgrade Cylinder</p>
                                            </div>
                                            <v-icon icon="mdi-chevron-right" size="20" class="ml-auto"/>
                                        </div>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-window-item> -->
                </v-window>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>