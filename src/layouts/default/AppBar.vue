<template>
  <v-app-bar rounded aria-level="2" scroll-behavior="collapse">
    <template v-slot:prepend>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
    </template>

    <v-app-bar-title>2023 FIBA World cup Pick'em ! (le basketball 🏀)</v-app-bar-title>

    <v-spacer></v-spacer>

    <div class="mr-5">
      <v-btn icon v-if="!user" @click="login">
        <v-icon color="primary">mdi-account-circle</v-icon>
      </v-btn>
      <v-tooltip text="Sign out" v-else>
        <template v-slot:activator="{ props }">
          <v-avatar @click="logout" class="pointer" v-bind="props">
            <v-img
              :src="user.providerData[0].photoURL"
              alt="photo"
            ></v-img>
          </v-avatar>
        </template>
      </v-tooltip>
    </div>

    <v-dialog
      v-model="dialog"
      width="auto"
    >
      <v-card>
        <v-card-title>
          Error {{ errorCode }}
        </v-card-title>
        <v-card-text>
          {{ errorMessage }}
        </v-card-text>
      </v-card>
    </v-dialog>

  </v-app-bar>
</template>

<script lang="ts" setup>
import {useCurrentUser} from 'vuefire'
import {getAuth, GoogleAuthProvider, signInWithPopup, signOut} from "firebase/auth";

const user = useCurrentUser()
const provider = new GoogleAuthProvider();
const auth = getAuth();

let errorCode = null
let errorMessage = null

let dialog = false

function logout() {
  signOut(auth)
}

function login() {
  signInWithPopup(auth, provider)
    .then((result) => {
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential.accessToken;
      // const user = result.user;
    }).catch((error) => {
    errorCode = error.code;
    errorMessage = error.message;
    dialog = true
  });
}
</script>
<style>

</style>
