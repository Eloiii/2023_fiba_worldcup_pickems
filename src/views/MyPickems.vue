<script lang="ts" setup>
import {onBeforeMount, ref, watch} from 'vue'
import {useCurrentUser, useDocument, useFirestore} from "vuefire";
import {getCountryCodes, getCountryFlag, getGroups, getTeams} from "@/api";
import TeamSelection from "@/components/TeamSelection.vue";
import {collection, doc, setDoc} from "firebase/firestore";


onBeforeMount(async () => {
  watch(user, async (user, prevUser) => {
    if (prevUser && !user) {
      console.log('logout')
    } else if (user) {
      await updateUserData()
    }
  })
  groupStageGroups.value = await getGroups()
  teams.value = getTeams(groupStageGroups.value).sort((a, b) => a.name.localeCompare(b.name))
  codes.value = await getCountryCodes()
})

let user = useCurrentUser()
let userData
const db = useFirestore()

let codes = ref()
let tab = ref('Group Stage')
let groupStageGroups = ref([])
let teams = ref([])
let dialogTeam = ref(false)
let group = ref(null)
let rank = ref(0)
let snackbar = ref(false)
let snackbarText = ref('')


const stages = [{name: 'Group Stage', startDate: new Date(), value: 'groupStage'}, {
  name: 'Second Round',
  startDate: new Date(2023, 7, 30), value: 'secondRound'
}, {name: 'Final phase', startDate: new Date(2023, 8, 4), value: 'finalPhase'}]


async function updateUserData() {
  userData = useDocument(doc(collection(db, 'users'), user.value.uid))
}

function teamIsInGroup(teamName) {
  for (let standing of group.value["team_standings"]) {
    if (standing.team.name === teamName)
      return true
  }
  return false
}

function filterTeams() {
  if (group.value)
    return teams.value.filter(team => teamIsInGroup(team.name))
}


function selectTeam(groupSelected, rankSelected) {
  group.value = groupSelected
  rank.value = rankSelected
  dialogTeam.value = true
}

function parseGroupName(groupName) {
  return groupName.split(',')[1].trim()
}

async function validateTeam(args) {
  const team = args[0].name
  const group = parseGroupName(args[1].name)
  const rank = args[2]

  const currentStage = stages.filter(stage => stage.name === tab.value)[0].value

  const empty = {}
  empty[rank] = team

  console.log(userData.value)

  if (userData.value.pickem[currentStage][group] === undefined) {
    userData.value.pickem[currentStage][group] = empty
  } else {
    userData.value.pickem[currentStage][group][rank] = team
  }

  if (userData.value.pickem[currentStage][group][1] === userData.value.pickem[currentStage][group][2])
    userData.value.pickem[currentStage][group][rank === 1 ? 2 : 1] = null

  userData.value.pickem.lastUpdate = new Date()

  await setDoc(doc(db, "users", user.value.uid), userData.value);

  await updateUserData()

  snackbarText.value = "Modification enregistrée"
  snackbar.value = true

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
            v-for="item in stages"
            :key="item.name"
            :value="item.name"
            :disabled="new Date() < item.startDate"
          >
            {{ item.name }}
          </v-tab>
        </v-tabs>
      </v-col>


    </v-row>
    <v-row v-if="user && userData" align="center" class="mt-16" justify="center">
      <v-col cols="12" md="8">
        <v-window v-model="tab">
          <v-window-item
            :value="stages[0].name"
          >
            <v-row justify="center">
              <v-col v-for="group in groupStageGroups" :key="group" cols="12" lg="6">
                <v-card variant="outlined">
                  <v-card-title>
                    {{ group.name }}
                  </v-card-title>
                  <v-container fluid>
                    <v-row dense>
                      <v-col cols="6" v-for="rank in 2" :key="rank">
                        <v-card>
                          <v-card-title>
                            {{ rank == 1 ? '1st' : '2nd' }} team
                          </v-card-title>
                          <v-card-text class="text-center">
                            <v-icon v-if="!userData.pickem[stages[0].value][parseGroupName(group.name)]?.[rank]" icon="mdi-help"
                                    size="72">
                            </v-icon>
                            <div v-else class="d-flex justify-center align-center flex-column">
                              <v-img
                                :src="getCountryFlag(userData.pickem[stages[0].value][parseGroupName(group.name)]?.[rank], codes)"
                                alt="youpi" height="48" width="48">
                              </v-img>
                              <p class="text-body-1">
                                {{ userData.pickem[stages[0].value][parseGroupName(group.name)]?.[rank] }}
                              </p>
                            </div>

                          </v-card-text>
                          <v-card-actions>
                            <v-btn block border rounded @click="selectTeam(group, rank)">
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
    <teamSelection v-model="dialogTeam" :countryCodes="codes" :group="group" :rank="rank" :teams="filterTeams()"
                   @validate="validateTeam"/>
    <v-snackbar
      v-model="snackbar"
      close-on-content-click
      color="primary"
      timeout="2500"
    >
      {{ snackbarText }}

    </v-snackbar>
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

