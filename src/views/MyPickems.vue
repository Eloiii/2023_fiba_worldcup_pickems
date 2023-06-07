<template>
  <v-container fluid="true" class="full-height mt-16">
    <v-row justify="center" align="center">
      <v-col class="text-center" cols="12">
        <p class="text-h2 text-uppercase font-italic font-weight-bold">
          My pick'em
        </p>
        <p class="text-h2 text-uppercase font-italic font-weight-bold">
          {{ tab }}
        </p>
      </v-col>
    </v-row>
    <v-row justify="center" align="center">
      <v-col cols="12" lg="5" md="7">
        <v-tabs
          v-model="tab"
          bg-color="transparent"
          color="primary"
          align-tabs="center"
          center-active
          grow="true"
          hide-slider
        >
          <v-tab
            v-for="item in items"
            :key="item"
            :value="item">
            {{ item }}
          </v-tab>
        </v-tabs>
      </v-col>


    </v-row>
    <v-row justify="center" align="center" class="mt-16" v-if="user">
      <v-col cols="12" md="8">
        <v-window v-model="tab">
          <v-window-item
            v-for="item in items"
            :key="item"
            :value="item"
          >
            lol
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>

    <v-row justify="center" align="center" v-else>
      <v-col cols="12" lg="6" md="8">
        <v-alert title="Not signed in" type="warning">
          Hey, you're not connected !
          <br/>
          Log in by clicking <v-icon color="primary">mdi-account-circle</v-icon> in the top right-hand corner
        </v-alert>
      </v-col>
    </v-row>


  </v-container>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {useCurrentUser} from "vuefire";

const user = useCurrentUser()
const items = ['Group Stage', 'Second Round', 'Finale phase']

let tab = ref(null)
</script>
<style scoped lang="scss">
.grostitre {
  font-family: "RadionA";
  text-transform: uppercase;
  font-weight: 900;
  letter-spacing: 0px;
  font-size: 3rem;
  line-height: 0.916667;
  color: rgb(255, 255, 255);
  padding: 0px;
  margin: 0px;
  pointer-events: none;
  cursor: inherit;
}
</style>

