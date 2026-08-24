<script setup lang="ts">
import { useUiStore } from '@/stores/ui';
import { useUserStore } from '@/stores/user';
import { ref } from 'vue';
import { useDisplay } from 'vuetify';
// import { jsPDF } from 'jspdf'; // This tries to import 'default'
import Vue3Html2pdf from 'vue3-html2pdf'

definePageMeta({
  title: 'Order Status',
  layout: 'user-layout'

})
const step = ref<number>(1);
const { smAndDown } = useDisplay()
const uiStore = useUiStore()
const userStore = useUserStore()
const orderStore = useOrderStore()
const route = useRoute()
const params = ref<any>()
const { xs } = useDisplay()
const router = useRouter()
const html2Pdf = ref()

const downloadReceipt = async () => {
  await nextTick()
  setTimeout(() => {
    if (html2Pdf.value) {
      html2Pdf.value.downloadPdf()
    }
  }, 300)
}


const updateStep = (status: string) => {
  switch (status) {
    case "created":
      step.value = 1;
      break;
    case "confirmed":
      step.value = 2;
      break;
    case "completed":
      step.value = 3;
      break;
    case "cancelled":
      step.value = 0;
      break;
    default:
      step.value;
  }
};

updateStep(orderStore.orderDetails?.order_details.order_status);

watch(() => orderStore.orderDetails?.order_details.order_status, (newStatus) => {
  updateStep(newStatus);
});

onMounted(async () => {
  params.value = route.params
  await userStore.getUserData()
  await orderStore.getOrderDetails(userStore.user?.id, params.value.orderstatus)
})
</script>

<template>
  <v-responsive>
    <v-container :class="xs ? 'pb-0' : ''">
      <v-btn text="Back" prepend-icon="mdi-arrow-left-top" variant="text" class="text-capitalize"
        :class="xs ? 'ml-0' : 'ml-5'" @click="router.back()" />
    </v-container>

    <v-container max-width="1200">
      <p class="text-h6 font-weight-bold" :class="smAndDown ? 'mb-5' : 'mb-7'">Order Status</p>
      <v-skeleton-loader :loading="orderStore.orderStatusLoader" type="card" class="bg-transparent">
        <v-row class="w-100">
          <v-col md="12" class="py-0">
            <v-card :class="xs ? 'pa-1' : 'pa-2'" rounded="lg">
              <v-card-text :class="xs ? 'w-100' : 'w-75'">
                <v-stepper v-model="step" elevation="0" mobile class="bg-transparent"
                  v-if="orderStore.orderDetails?.order_details.order_status == 'cancelled'">
                  <v-stepper-header class="pa-0">
                    <v-stepper-item color="error" :value="1" :complete="step == 0" complete-icon="mdi-close">
                    </v-stepper-item>

                    <v-divider length="50" thickness="2" color="stepper"></v-divider>

                    <v-stepper-item color="error" :value="2" :complete="step == 0"
                      complete-icon="mdi-close"></v-stepper-item>

                    <v-divider length="50" thickness="2" color="stepper"></v-divider>

                    <v-stepper-item color="error" :value="3" :complete="step == 0"
                      complete-icon="mdi-close"></v-stepper-item>
                  </v-stepper-header>
                </v-stepper>
                <v-stepper v-model="step" elevation="0" mobile class="bg-transparent" v-else>
                  <v-stepper-header class="pa-0">
                    <v-stepper-item :color="step > 0 ? 'success' : 'stepper'" :value="1" :complete="step > 0"
                      complete-icon="mdi-check">
                    </v-stepper-item>

                    <v-divider length="50" thickness="2" color="stepper"></v-divider>

                    <v-stepper-item :color="step > 1 ? 'success' : 'stepper'" :value="2"
                      :complete="step >= 2"></v-stepper-item>

                    <v-divider length="50" thickness="2" color="stepper"></v-divider>

                    <v-stepper-item :color="step > 2 ? 'success' : 'stepper'" :value="3"
                      :complete="step == 3"></v-stepper-item>
                  </v-stepper-header>
                </v-stepper>
                <p class="text-capitalize">{{ orderStore.orderDetails?.order_details.order_status }}</p>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="12" sm="12">
            <v-card rounded="lg">
              <div class="pa-4 border" :class="xs ? 'ma-3' : 'ma-6'">
                <p class="my-5 text-h6 font-weight-black" v-if="!xs">Order Details</p>
                <p class="my-5 font-weight-black" v-if="xs">Order Details</p>
                <div class="d-flex justify-space-between align-center" v-if="!xs">
                  <div>
                    <p class="mb-2">Order Unique Number</p>
                    <p class="mb-2">Order Date </p>
                  </div>

                  <div>
                    <p class="mb-2">{{ orderStore.orderDetails?.order_details?.order_unique_number }}</p>
                    <p class="mb-2">
                      {{ new Date(orderStore.orderDetails?.order_details?.created_at).toDateString() }}
                    </p>
                  </div>

                  <p>
                  <p @click="downloadReceipt" class="text-info text-decoration-underline cursor-pointer"
                    v-if="orderStore.orderDetails?.order_details.order_status !== 'cancelled'">Download Receipt</p>
                  </p>
                </div>

                <div v-else>
                  <v-row class="align-start">
                    <v-col cols="12">
                      <p>Order Unique Number</p>
                      <p>{{ orderStore.orderDetails?.order_details?.order_unique_number }}</p>
                    </v-col>

                    <v-col cols="12">
                      <p>Order Date</p>
                      <p>
                        {{ new Date(orderStore.orderDetails?.order_details?.created_at).toDateString() }}
                      </p>
                    </v-col>
                  </v-row>

                  <div class="text-right mt-4">
                    <p @click="downloadReceipt" class="text-info text-decoration-underline cursor-pointer"
                      v-if="orderStore.orderDetails?.order_details.order_status !== 'cancelled'">Download Receipt</p>
                  </div>
                </div>
              </div>

              <div class="pa-4 border" :class="xs ? 'mx-3' : 'mx-6'">
                <p class="my-5 text-h6 font-weight-black" v-if="!xs">Order Summary</p>
                <p class="my-5 font-weight-black" v-if="xs">Order Summary</p>
                <div class="d-flex justify-space-between " v-if="!xs">
                  <div class="text-left">
                    <v-row class="d-flex align-center ga-2">
                      <v-col>
                        <p class="mb-3" v-for="product in orderStore.orderDetails?.order_items_details">
                          {{ product?.product_data_details?.style_description }}
                        </p>
                      </v-col>
                    </v-row>
                    <p class="mb-3">Delivery Charge</p>
                    <p class="">Tax({{ orderStore.orderDetails?.order_items_details?.[0]?.tax_percentage }}%)</p>
                  </div>

                  <div>
                    <p class="mb-3" v-for="product in orderStore.orderDetails?.order_items_details">
                      Qty: {{ product?.quantity }}
                    </p>
                  </div>

                  <div class="text-right ">
                    <p class="mb-3" v-for="product in orderStore.orderDetails?.order_items_details">
                      GHs {{ product?.cost_breakdown?.payable_amount }}
                    </p>
                    <p class="">GHs {{
                      orderStore.orderDetails?.deliveries_details?.[0]?.delivery_cost
                      }}.00</p>
                  </div>
                </div>
                <div v-else>
                  <v-row>
                    <v-col>
                      <v-row class="mb-2 align-center" v-for="product in orderStore.orderDetails?.order_items_details">
                        <v-col cols="6">
                          <div>
                            <p>{{ product?.product_data_details?.style_name }}</p>
                            <p class="mt-1">Qty: {{ product?.quantity }}</p>
                          </div>
                        </v-col>
                        <!-- <v-col cols="3">
                          <v-img src="@/assets/orderHistory.png" alt="6kg" width="100" />
                        </v-col> -->
                        <v-col cols="6" class="text-right">
                          <p>GHs {{ product?.cost_breakdown?.payable_amount }}</p>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>

                  <div class="d-flex justify-space-between mb-2">
                    <p>Delivery Charge</p>
                    <p>GHs {{ orderStore.orderDetails?.deliveries_details?.[0]?.delivery_cost }}.00</p>
                  </div>

                  <div class="d-flex justify-space-between text-left mt-2">
                    <p class="mb-2">Tax({{ orderStore.orderDetails?.order_items_details?.[0]?.tax_percentage }}%)</p>
                  </div>
                </div>
              </div>

              <div class="pa-4 bg-yellow-lighten-5 border" :class="xs ? 'mx-3' : 'mx-6'">
                <div class="d-flex justify-space-between ">
                  <p>Total</p>
                  <p>GHS {{ orderStore.orderDetails?.transaction_details?.payable_amount }}</p>
                </div>
              </div>

              <div class="pa-4 border" :class="xs ? 'ma-3' : 'ma-6'">
                <p class="my-5 text-h6 font-weight-bold" v-if="!xs">Payment Details</p>
                <p class="my-5 font-weight-bold" v-if="xs">Payment Details</p>
                <p class=" text-capitalize" v-if="orderStore.orderDetails?.order_details.order_status == 'confirmed'">
                  Pending
                </p>
                <p v-else-if="orderStore.orderDetails?.order_details.order_status == 'cancelled'" class="text-error">
                  Cancelled
                </p>
                <div class="d-flex justify-space-between align-center" v-else>
                  <!-- <div>
                    <p class="mb-2">Transaction Id</p>
                    <p class="mb-2">Payment To</p>
                    <p class="mb-2">Debited From</p>
                    <p class="mb-2">Payment Method</p>

                  </div>

                  <div>
                    <p class="mb-2">T22548868425</p>
                    <p class="mb-2">NewGas1253</p>
                    <p class="mb-2">Bank Of Ghana</p>
                    <p class="mb-2">Remcash</p>
                  </div> -->
                  <div>
                    <p class="mb-2">Payment on delivery</p>
                  </div>
                  <p v-if="!xs"></p>
                </div>
              </div>

              <div class="pa-4 border" :class="xs ? 'ma-3' : 'ma-6'">
                <p class="my-5 text-h6 font-weight-black" v-if="!xs">Delivery Location</p>
                <p class="my-5 font-weight-black" v-if="xs">Delivery Location</p>
                <p>
                  {{
                    orderStore.orderDetails?.deliveries_details?.[0]?.delivery_address?.ghana_post_address?.district
                  }}
                  {{
                    orderStore.orderDetails?.deliveries_details?.[0]?.delivery_address?.ghana_post_address?.area
                  }} -
                  {{
                    orderStore.orderDetails?.deliveries_details?.[0]?.delivery_address?.ghana_post_address?.address_code
                  }}
                </p>
              </div>
              
              <div class="ma-6 w-50" v-if="orderStore.orderDetails?.order_details.order_status !== 'cancelled'">
                <v-btn class="text-capitalize" rounded="lg" size="large" variant="outlined" block
                  @click="uiStore.transactionDialog = true">Cancel Order</v-btn>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-skeleton-loader>
      <PromptsSuccess v-if="uiStore.notifyDialog" />
      <PromptsTransaction :order="orderStore.orderDetails" v-if="uiStore.transactionDialog" />
    </v-container>
  </v-responsive>

  <client-only>
    <vue3-html2pdf :show-layout="false" :float-layout="true" :enable-download="true" :paginate-elements-by-height="0"
      filename="Order Status" :pdf-quality="2" :manual-pagination="false" pdf-format="a4" pdf-orientation="portrait"
      pdf-content-width="auto" ref="html2Pdf">
      <template #pdf-content>
        <div class="mt-5">
          <div class="text-center">
            <img src="/NewgasColoredLogo.png" alt="Newgas Logo" width="130" />
          </div>
          <div class="ma-6 pa-4 border">
            <p class="my-5 text-h6 font-weight-black">Order Details</p>
            <div class="d-flex justify-space-between align-center">
              <div class="text-body-2">
                <p>Order ID</p>
                <p>Order Date</p>
              </div>

              <div class="text-body-2">
                <p>{{ orderStore.orderDetails?.order_details?.id }}</p>
                <p>
                  {{ new Date(orderStore.orderDetails?.order_details?.created_at).toUTCString()
                  }}
                </p>
              </div>

              <p class="text-body-2">

              </p>
            </div>
          </div>

          <div class="mx-6 pa-4 border">
            <p class="my-5 text-h6 font-weight-black">Order Summary</p>
            <div class="d-flex justify-space-between text-body-2">
              <div class="text-left">
                <p class="mb-2" v-for="product in orderStore.orderDetails?.order_items_details">
                  {{ product?.product_data_details?.style_description }}
                </p>
                <p class="mb-2">Delivery Charge</p>
                <p class="mb-2">Tax({{
                  orderStore.orderDetails?.order_items_details?.[0]?.tax_percentage }}%)</p>
              </div>

              <div class="text-body-2">
                <p class="mb-2" v-for="product in orderStore.orderDetails?.order_items_details">
                  Qty: {{ product?.quantity }}
                </p>
              </div>

              <div class="text-right text-body-2">
                <p class="mb-2" v-for="product in orderStore.orderDetails?.order_items_details">
                  GHs {{ product?.cost_breakdown?.payable_amount }}
                </p>
                <p class="mb-2">GHs {{
                  orderStore.orderDetails?.deliveries_details?.[0]?.delivery_cost
                }}.00</p>
              </div>
            </div>
          </div>

          <div class="mx-6 pa-4 bg-yellow-lighten-5 border">
            <div class="d-flex justify-space-between text-body-2">
              <p>Total</p>
              <p>GHS {{ orderStore.orderDetails?.transaction_details?.payable_amount }}</p>
            </div>
          </div>

          <div class="ma-6 pa-4 border">
            <p class="my-5 text-h6 font-weight-bold">Payment Details</p>
            <p class="text-body-2 text-capitalize"
              v-if="orderStore.orderDetails?.order_details.order_status == 'confirmed'">
              Pending
            </p>
            <p v-else-if="orderStore.orderDetails?.order_details.order_status == 'cancelled'" class="text-error">
              Cancelled
            </p>
            <div class="d-flex justify-space-between align-center" v-else>
              <div class="text-body-2">
                <p class="mb-2">Transaction Id</p>
                <p class="mb-2">Payment To</p>
                <p class="mb-2">Debited From</p>
                <p class="mb-2">Payment Method</p>

              </div>

              <div class="text-body-2">
                <p class="mb-2">T22548868425</p>
                <p class="mb-2">NewGas1253</p>
                <p class="mb-2">Bank Of Ghana</p>
                <p class="mb-2">Remcash</p>
              </div>
            </div>
          </div>

          <div class="ma-6 pa-4 border">
            <p class="my-5 text-h6 font-weight-black">Delivery Location</p>
            <p class="text-body-2">
              {{
                orderStore.orderDetails?.deliveries_details?.[0]?.delivery_address?.ghana_post_address?.district
              }}
              {{
                orderStore.orderDetails?.deliveries_details?.[0]?.delivery_address?.ghana_post_address?.area
              }} -
              {{
                orderStore.orderDetails?.deliveries_details?.[0]?.delivery_address?.ghana_post_address?.address_code
              }}
            </p>
          </div>
        </div>
      </template>
    </vue3-html2pdf>
  </client-only>
</template>