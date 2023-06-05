<template>
  <v-app-bar rounded aria-level="2" scroll-behavior="collapse">
    <template v-slot:prepend>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
    </template>

    <v-app-bar-title>2023 FIBA Worldcup Pick'ems ! (le basketball 🏀)</v-app-bar-title>

    <v-spacer></v-spacer>

    <div class="mr-5">
     <v-btn icon v-if="!user" @click="login">
       <v-icon>mdi-account-circle</v-icon>
     </v-btn>
    <v-avatar v-else @click="logout">
      <v-img
        :src="user.providerData[0].photoURL"
        alt="John"
      ></v-img>
    </v-avatar>
    </div>

  </v-app-bar>
</template>

<script lang="ts" setup>
import { useCurrentUser } from 'vuefire'
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

const user = useCurrentUser()
const provider = new GoogleAuthProvider();
const auth = getAuth();

function logout() {
  signOut(auth)
}

function login() {
 signInWithPopup(auth, provider)
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData.email;
    const credential = GoogleAuthProvider.credentialFromError(error);
  });
}
</script>
