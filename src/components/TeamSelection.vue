<template>
  <v-dialog v-model="show" width="auto" persistent>
    <v-card>
      <v-card-title>
        Select a team
      </v-card-title>
      <v-card-actions>
        <v-btn @click="show=false">
          clique
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {computed} from 'vue'

const props = defineProps({
  value: Boolean,
  group: Object,
  rank: Number,
})


const emit = defineEmits(['update:modelValue'])

const show = computed({
  get() {
    return props.value
  },
  set(newValue) {
   emit('update:modelValue', newValue)
  }
})
</script>
