<template>
  	<q-page class="q-pa-md">
      	<div class="row q-col-gutter-lg">
    		<div class="col-12 col-md-6" >
    			<q-card class="my-card">
    			  	<q-img :src="$apiserver + '/api/getRGB'" basic>
    			    	<div class="absolute-top text-subtitle2 text-center">
    			    	  	Stream
    			    	</div>
    			    	<div class="absolute-bottom text-subtitle2 text-center">
    			    	  	<q-btn color="red" label="Take a picture" v-on:click="takePicture" v-if="selectedPart.value == undefined"/>
    			    	  	<q-btn color="secondary" label="Take a picture" v-on:click="takePicture" v-if="selectedPart.value != undefined"/>
    			    	</div>
    			  	</q-img>
    			</q-card>
    		</div>
        	<div class="col-12 col-md-6" v-if="image != undefined">
    			<q-card class="my-card">
    			  	<q-img
    			  	  :src="imageToShow == 'normal' ? ('data:image/jpeg;base64,' + image) : ('data:image/jpeg;base64,' + depth)"
    			  	  basic
    			  	>
    			  	<div class="absolute-top text-subtitle2 text-center">
    			    	Static @ {{new Date().toString().split('T')[0]}}
    			    </div>
    			    <div class="absolute-bottom text-subtitle2 text-center">
    			    	<div class="row q-col-gutter-lg">
    			    		<div class="col-12 col-md-4" >
    			    			<q-btn size="sm" color="red" label="Clear" v-on:click="clearPic"/>
    			    		</div>
    			    		<div class="col-12 col-md-4" >
    			    			<q-btn size="sm" color="secondary" label="Depth" v-on:click="imageToShow = 'depth'" v-if="imageToShow == 'normal'"/>
    			    			<q-btn size="sm" color="secondary" label="Normal" v-on:click="imageToShow = 'normal'" v-if="imageToShow == 'depth'"/>
    			    		</div>
    			    		<div class="col-12 col-md-4" >
    			    			<q-btn size="sm" color="primary" label="Save" v-on:click="savePic"/>
    			    		</div>
    			    	</div>
    			    </div>
    			  </q-img>
    			</q-card>
    		</div>
    	</div>
    	<div class="row q-col-gutter-xs" style="margin-top: 25px;">
    		<div class="col-4 col-md-3" v-for="i in acquiredImages" v-if="i.split('_')[0] == 'aq'">
    			  <q-img
    			    :src="$apilarasys + '/larasys/acq/stream?build=' + selectedBuild.value + '&image=' + i"
    			    basic
    			  ></q-img>
    		</div>
    	</div>
  	</q-page>
</template>

<style>
</style>

<script>

//http://192.168.186.101/larasys/larasys/acq/stream?build=Build_170719&image=aq_07004247cda5e2991e8e2fd2e123cd6f_0.png
export default {
  name: 'PageIndex',
  data: function () {
  	return {
  		image: undefined,
  		img: undefined,
  		selectedBuild: {
  			value: undefined
  		},
  		selectedPart: {
  			value: undefined
  		},
		acquiredImages: [],
		acqSize: 0,
		imageToShow: 'normal'
  	}
  },
  methods: {
  	takePicture: function () {
  		if (this.selectedPart.value == undefined) {
  			alert('Select first a build and a part in the sidebar')
  			return
  		}
  		this.myImage()
  	},
  	clearPic: function () {
  		this.image = undefined
  	},
  	savePic: function () {
  		let generalAcqImg = this.selectedPart.value.split('_')[1]
  		let imageName = 'aq_' + generalAcqImg + '_' + (this.acqSize + 1) + '.jpeg'
  		let depthName = 'dp_' + generalAcqImg + '_' + (this.acqSize) + '.jpeg'
      	this.$axios.post(this.$apilarasys + '/saveacq', {
      		image: this.image, 
      		name: imageName, 
      		depth: this.depth,
      		depthName: depthName, 
      		build: this.selectedBuild.value}).then(function (response) {
      		setTimeout(function () {
      			this.fetchAcquireImages()
      		}.bind(this), 3000)
      	  }.bind(this))
  	},
  	myImage: function () {
      	this.$axios.get(this.$apiserver + '/api/getImage').then(function (response) {
      	  	this.image = response.data.image
      	  	this.depth = response.data.depth
      	  }.bind(this))
  	},
  	fetchAcquireImages: function () {
  		let generalAcqImg = this.selectedPart.value.split('_')[1]
      	this.$axios.get(this.$apilarasys + '/larasys/build/acquired?basename=' + this.selectedBuild.value).then(function (response) {
      	  	Object.keys(response.data.thumb).forEach(function (thumb) {
      	  		if (thumb === generalAcqImg) {
      	  			this.acqSize = response.data.thumb[thumb].length
      	  			this.acquiredImages = response.data.thumb[thumb]
      	  		}
      	  	}.bind(this))
      	}.bind(this))
  	}
  },
  beforeMount: function () {
  	this.$root.$on('new_build', function (cb) {
  		this.selectedBuild.value = cb
  	}.bind(this))
  	this.$root.$on('new_part', function (cb) {
  		this.selectedPart.value = cb
  		this.fetchAcquireImages()
  	}.bind(this))
  	this.$root.$on('clear', function () {
  		this.selectedPart.value = undefined
  		this.selectedBuild.value = undefined
  		this.clearPic()
  	}.bind(this))
  }
}
</script>
