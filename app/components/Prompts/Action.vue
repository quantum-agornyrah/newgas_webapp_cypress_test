<script setup lang="ts">
import { useUiStore } from '@/stores/ui';

const uiStore = useUiStore()
defineProps<{
    action: Function,
    loading: boolean
}>()
</script>

<template>
    <v-dialog v-model="uiStore.actionDialog" max-width="410" transition="dialog-top-transition" persistent>
        <v-card class="text-center">
            <v-card-text class="pa-7 pb-4">
                <v-icon icon="mdi-delete-outline" size="100px" color="redBtn" />
                <p class="mt-5 text-h6 font-weight-black">{{ uiStore.actionTitle }}</p>
                <p class="mt-5">{{ uiStore.actionPrompt }}</p>
            </v-card-text>
            <v-card-actions class="px-7 pb-5 mb-3 flex-column">
                <v-btn block class="text-capitalize mb-3" variant="outlined" size="large"
                    @click="uiStore.actionDialog = false">
                    No, Keep
                </v-btn>
                <v-btn block class="text-capitalize bg-black" @click="action" size="large" :loading="loading">
                    Yes, Remove
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>