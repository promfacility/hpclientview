<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          {{selectedBuild}} / {{selectedPart}}
        </q-toolbar-title>
        <div>HP Client</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      content-class="bg-grey-2"
    >
      <q-list>
        <q-item-label header v-if="selectedBuild == ''">Builds</q-item-label>
        <q-item-label header v-else>Parts <q-btn color="primary" size="xs" v-on:click="clearStatus" label="Back" ></q-btn></q-item-label>
        
        <q-item clickable v-for="b in builds" v-on:click="setBuild(b)" :active="b === selectedBuild" v-if="selectedBuild == ''">
          <q-item-section>
            <q-item-label>{{b}}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-for="p in parts" v-on:click="setPart(p[0])" v-if="selectedBuild != ''">
          <q-item-section>
            <q-img :src="$apilarasys + '/larasys/thumb/stream?build=' + selectedBuild +'&thumb=' + p[0] " basic></q-img>
          </q-item-section>
        </q-item>

      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'MyLayout',
  data () {
    return {
      builds: [],
      parts: [],
      selectedBuild: '',
      selectedPart: '',
      leftDrawerOpen: true //this.$q.platform.is.desktop
    }
  },
  methods: {
    openURL,
    setBuild: function (build) {
      this.selectedBuild = build
      this.$root.$emit('new_build', build)
      this.fetchParts()
    },
    setPart: function (part) {
      this.selectedPart = part
      this.$root.$emit('new_part', part)
    },
    clearStatus: function () {
      this.selectedPart = ''
      this.selectedBuild = ''
      this.$root.$emit('clear')
    },
    fetch: function () {
        this.$axios
          .get(this.$apilarasys + '/larasys/builds')
          .then(function (response) {
            this.builds = response.data.reverse()
          }.bind(this))
    },
    fetchParts: function () {
        this.$axios //http://192.168.186.101/larasys/larasys/build/thumbs?basename=Build_170719
          .get(this.$apilarasys + '/larasys/build/thumbs?basename=' + this.selectedBuild)
          .then(function (response) {
            this.parts = response.data.thumb
          }.bind(this))
    }
  },
  beforeMount: function () {
    this.fetch()
  }
}
</script>

<style>
</style>
