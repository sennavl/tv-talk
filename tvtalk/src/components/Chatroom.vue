<template>
  <div>

  </div>
</template>

<script type="text/ecmascript-6">
var socket = io.connect();

socket.on('stream', function(data){
app.title = data.title;
});

export default{
	data() {
		return{
			title: 'ugly title'
		}
	},
}
</script>

<style>

</style>
