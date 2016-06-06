<style scoped>
	.form-group {
		min-height: 50px;
		margin-top: 14px;
		margin-bottom: 0;
	}
</style>

<template>
	<div class="form-group">
	    <div class="col-md-3">
	    开始时间:
			<date-picker :time.sync="starttime" :option="timeoption" id="start-picker"></date-picker>
	    </div>
	    <div class="col-md-3">
	    结束时间:
			<date-picker :time.sync="endtime" :option="timeoption" id="end-picker"></date-picker>
	    </div>
        <div class="col-md-2">
    	    <select class="form-control" v-model="selected">
    	    	<option v-for="option in options" :value="option.value">
    	    	    {{ option.text }}
    	    	</option>
    	    </select>
        </div>
        <div class="col-md-2">
        	<input type="text" class="form-control input-group-lg" placeholder="请输入关键字" v-model="keyword">
        </div>
        <div class="col-md-1">
        	<button class="btn btn-primary" @click="_search">筛选</button>
        </div>
        <div class="col-md-1">
        	<button class="btn btn-default" @click="reset">重置</button>
        </div>
	</div>
</template>

<script>
	var dp = require('vue-datepicker');
	var date = new Date();

	// 补全时间的前导0
	function leftPaddingZero (num) {
	    if (typeof num != 'number') return ;

	    return num < 10 ? '0' + num : num;
	}

	var _endtime = date.getFullYear() + '-' + leftPaddingZero(date.getMonth() + 1) + '-' + leftPaddingZero(date.getDate()) + ' ' + leftPaddingZero(date.getHours()) + ':' + leftPaddingZero(date.getMinutes());

	module.exports = {
		props: ['list', 'pageSize', 'curPage', 'keyword', 'selected', 'starttime', 'endtime', 'search'],
		data: function () {
		    return {
	    	    options: [
	    	    	{ text: '选择筛选项目', value: '-1' },
					{ text: '错误信息', value: '0' },
					{ text: '目标网页', value: '1' },
					{ text: '目标文件', value: '2' },
					{ text: '分辨率', value: '3' },
					{ text: 'UA', value: '4' },
					{ text: 'IP', value: '5' },
					{ text: '页面来路', value: '6' }
	    	    ],
		    	timeoption: {
	    	        type: 'min',
	    	        week: ['一', '二', '三', '四', '五', '六', '日'],
	    	        month: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
	    	        format: 'YYYY-MM-DD HH:mm',
	    	        buttons: {
						ok: '确定',
						cancel: '取消'
	    	        }
		    	}
		    };
		},
		components: {
			'date-picker': dp
		},
		methods: {
			_search: function () {
				this.curPage = 1;
			    this.search();
			},
			reset: function () {
			    this.selected = -1;
			    this.keyword = '';
			    this.starttime = '2016-05-01 00:00';
			    this.endtime = _endtime;
			    this.curPage = 1;

			    this.search();
			}
		}
	};
</script>