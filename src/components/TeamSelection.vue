<template>
  <v-dialog v-model="show" width="75vw">
    <v-card>
      <v-toolbar color="transparent" theme="dark">
        <v-toolbar-title class="text-h5 font-weight-bold">
          Select a team that finishes {{ rank === 1 ? '1st' : '2nd' }} in {{ group.name.split(',')[1].trim() }}
        </v-toolbar-title>

        <template v-slot:append>
          <v-btn icon="mdi-close" @click="show = false"></v-btn>
        </template>

      </v-toolbar>
      <v-card-text>
        <v-row jusity="center" align="center">
          <v-col v-for="team in teams" :key="team" cols="12" md="3">
            <v-card variant="outlined" @click="validate(team)">
              <v-card-text class="flex-0-0 d-flex">
                <v-row align="center">
                  <v-col cols="5">
                    <v-img :src="getCountryFlag(team.name, codes)" height="64" width="64" alt="youpi">

                    </v-img>
                  </v-col>
                  <v-col cols="7" class="font-weight-bold text-body-1">
                    {{ team.name }}
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {computed, onBeforeMount, ref} from 'vue'

import {getCountryCodes, getCountryFlag} from "@/api";


const props = defineProps({
  value: Boolean,
  group: Object,
  rank: Number,
  teams: Array
})


const codes = ref([])

onBeforeMount(async () => {
  codes.value = await getCountryCodes()
})

function validate(team) {
  console.log(team)
  show.value = false
}

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
