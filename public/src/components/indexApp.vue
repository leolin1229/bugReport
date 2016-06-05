<template>
	<div>
		<index-top-nav></index-top-nav>
		<index-wrapper></index-wrapper>
	</div>
</template>

<script>
	var indexTopNav = require('./indexTopNav.vue');
	var indexWrapper = require('./indexWrapper.vue');

	module.exports = {
		el: '#app',
		data: function () {
		    return {
		    	msg: 123
		    };
		},
		components: {
			'index-top-nav': indexTopNav,
			'index-wrapper': indexWrapper
		}
	};
</script>