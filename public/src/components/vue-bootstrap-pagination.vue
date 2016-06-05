<style scoped>
	.wraper {
		position: relative;
		overflow: hidden;
		margin-top: 14px;
	}
	.inner, .pagination {
		float: left;
	}
	.pagination {
		margin: 0;
	}
	.total {
		float: left;
		line-height: 31px;
		margin-left: 15px;
	}
	.form {
		float: left;
	}
	.text {
		margin-left: 5px;
	}
	.input-group {
		display: inline;
		width: 50px;
	}
	.clearfix{ *zoom:1; }
	.clearfix:after, .clearfix:before{ content:"";display:table; }
	.clearfix:after{ clear:both; }
</style>

<template>
	<div class="wraper" v-if="totalNum > 0">
		<div class="inner clearfix">
			<ul class="pagination">
				<li :class="[curNo == 1 ? 'disabled' : '']" @click.prevent="changePage(curNo - 1)"><a href="javascript:;"><span aria-hidden="true">上一页</span></a></li>
				<li v-for="(index, val) in array" track-by="$index" :class="[val == curNo ? 'active' : '', val == '...' ? 'disabled' : '']">
					<a href="javascript:;" @click.prevent="changePage(val)"><span aria-hidden="true">{{ val }}</span></a>
				</li>
				<li :class="[curNo == totalNum ? 'disabled' : '']" @click.prevent="changePage(curNo + 1)"><a href="javascript:;"><span aria-hidden="true">下一页</span></a></li>
			</ul>
			<div class="total">共 {{ totalNum }}页</div>
			<div class="form">
				<span class="text">到第</span>
				<input class="input-group input-group-sm" type="number" v-model="jumpNum" min="1" max="{{ totalNum }}">
				<span class="text">页</span>
				<button class="btn btn-primary" @click="jump">确定</button>
			</div>
		</div>
	</div>
</template>

<script>
	module.exports = {
		data: function () {
		    return {
		    	jumpNum: 1
		    };
		},
		props: {
		    curNo: {
		    	// 当前第几页
		        type: [Number, String], // 多种类型 (1.0.21+)
		        required: true
		    },
		    totalNum: {
		    	// 总页数
		        type: [Number, String],
		        required: true
		    },
		    callback: {
		    	// 点击页码回调函数
		        type: Function,
		        required: true
		    },
		    limitNum: {
		    	// 超过后要省略显示的限制页数，默认为5
		        type: [Number, String],
		        default: 5
		    },
		    array: []
		},
		methods: {
			jump: function () {
			    if (1 <= this.jumpNum && this.jumpNum <= this.totalNum && this.curNo != this.jumpNum) {
			    	this.curNo = +this.jumpNum;

			    	this.callback();
			    } else {
			    	return ;
			    }
			},
			computed: function () {
				var arr = [];

			    if (this.totalNum <= this.limitNum) {
		    	    for (var n = 0; n < this.totalNum; n++) {
		    	        arr.push(n + 1);
		    	    }
		    	} else {
		    		if (this.curNo <= this.limitNum - 2) {
		    		    for (var n = 0; n < this.limitNum - 1; n++) {
		    		        arr.push(n + 1);
		    		    }
		    		    arr.push('...');
		    		    arr.push(this.totalNum);
		    		} else if (this.curNo + 4 > this.totalNum) {
		    			arr.push(1);
		    		    arr.push('...');

		    		    for (var n = this.totalNum - this.limitNum; n < this.totalNum; n++) {
		    		        arr.push(n + 1);
		    		    }
		    		} else {
		    			arr.push(1);
		    		    arr.push('...');
		    		    for (var n = this.curNo - parseInt((this.limitNum - 2) / 2) - 1; n < this.curNo + parseInt((this.limitNum - 2) / 2); n++) {
		    		        arr.push(n + 1);
		    		    }
		    		    arr.push('...');
		    		    arr.push(this.totalNum);
		    		}
		    	}

		    	this.$set('array', arr);
			},
			changePage: function (num) {
				if (num < 1 || num > this.totalNum || num == '...' || this.curNo == num) return ;
			    
			    this.curNo = +num;

				this.callback();
			}
		},
		watch: {
			totalNum: function (val, oldVal) {
			    this.computed();
			    if (val && this.jumpNum > val) this.jumpNum = +val;
			},
			curNo: function (val, oldVal) {
			    this.computed();
			}
		}
	};
</script>