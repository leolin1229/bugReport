<template>
	<pagination :cur-no.sync="curPage" :callback="loadData" :total-num="totalNum"></pagination>
</template>

<script>
	var vbp = require('./vue-bootstrap-pagination.vue');

	module.exports = {
		props: ['curPage', 'pageSize', 'totalLists', 'search'],
		data: function () {
		    return {
		    	totalNum: 0
		    };
		},
		methods: {
			loadData: function () {
				this.search();
			}
		},
		watch: {
			totalLists: function (val, oldVal) {
			    this.totalNum = Math.ceil(this.totalLists / this.pageSize);
			}
		},
		components: {
			pagination: vbp
		}
	};
</script>