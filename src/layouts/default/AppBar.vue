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
import {useCurrentUser, useFirestore} from 'vuefire'
import {getAuth, GoogleAuthProvider, signInWithPopup, signOut} from "firebase/auth";
import {doc, getDoc, setDoc} from "firebase/firestore";

const db = useFirestore()
const user = useCurrentUser()
const auth = getAuth();
const provider = new GoogleAuthProvider();

let errorCode = null
let errorMessage = null

let dialog = false

function logout() {
  signOut(auth)
}

function login() {
  signInWithPopup(auth, provider)
    .then(async (result) => {
      const user = result.user;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);


      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
      } else {
        console.log("new user")
       const newUser = {
        name: user.displayName,
        picture: user.photoURL,
        uid: user.uid,
        pickem: {
          groupStage: {},
          secondRound: {},
          finalPhase: {},
          lastUpdated: new Date()
        }
      }
      await setDoc(doc(db, "users", user.uid), newUser);
      }

    }).catch((error) => {
    errorCode = error.code;
    errorMessage = error.message;
    dialog = true
  });
}
</script>
<style>

</style>
