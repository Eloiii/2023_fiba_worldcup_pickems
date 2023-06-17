<script lang="ts" setup>
import {onBeforeMount, ref} from 'vue'
import {useCurrentUser} from "vuefire";
import {getGroups, getTeams} from "@/api";
import TeamSelection from "@/components/TeamSelection.vue";

const user = useCurrentUser()

const items = [{name: 'Group Stage', startDate: new Date()}, {
  name: 'Second Round',
  startDate: new Date(2023, 7, 30)
}, {name: 'Final phase', startDate: new Date(2023, 8, 4)}]
let tab = ref(items[0])
let groupStageGroups = ref([])
let teams = ref([])
let dialogTeam = ref(false)
let group = ref(null)
let rank = ref(0)

onBeforeMount(async () => {
  groupStageGroups.value = await getGroups()
  teams.value = getTeams(groupStageGroups.value).sort((a, b) => a.name.localeCompare(b.name))

})

function teamIsInGroup(teamName) {
  for(let standing of group.value["team_standings"]) {
    if(standing.team.name === teamName)
      return true
  }
  return false
}

function filterTeams() {
  if(group.value)
    return teams.value.filter(team => teamIsInGroup(team.name))
}


function selectTeam(groupSelected, rankSelected) {
  group.value = groupSelected
  rank.value = rankSelected
  dialogTeam.value = true
}

</script>
<template>
  <v-container fluid class="full-height mt-16">
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
          grow
          hide-slider
        >
          <v-tab
            v-for="item in items"
            :key="item.name"
            :value="item.name"
            :disabled="new Date() < item.startDate"
          >
            {{ item.name }}
          </v-tab>
        </v-tabs>
      </v-col>


    </v-row>
    <v-row justify="center" align="center" class="mt-16" v-if="user">
      <v-col cols="12" md="8">
        <v-window v-model="tab">
          <v-window-item
            :value="items[0].name"
          >
            <v-row justify="center">
              <v-col v-for="item in groupStageGroups" :key="item" cols="12" lg="6">
                <v-card variant="outlined">
                  <v-card-title>
                    {{ item.name }}
                  </v-card-title>
                  <v-container fluid>
                    <v-row dense>
                      <v-col cols="6" v-for="rank in 2" :key="rank">
                        <v-card>
                          <v-card-title>
                            {{ rank == 1 ? '1st' : '2nd' }} team
                          </v-card-title>
                          <v-card-text class="text-center">
                            <v-icon icon="mdi-help" size="x-large">
                            </v-icon>
                          </v-card-text>
                          <v-card-actions>
                            <v-btn border rounded block @click="selectTeam(item, rank)">
                              SELECT
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>
              </v-col>
            </v-row>
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>


    <v-row justify="center" align="center" v-else>
      <v-col cols="12" lg="6" md="8">
        <v-alert title="Not signed in" type="warning">
          Hey, you're not connected! 😡
          <br/>
          Log in by clicking
          <v-icon color="primary">mdi-account-circle</v-icon>
          in the top right-hand corner
        </v-alert>
      </v-col>
    </v-row>
    <teamSelection v-model="dialogTeam" :teams="filterTeams()" :rank="rank" :group="group"/>
  </v-container>
</template>
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

