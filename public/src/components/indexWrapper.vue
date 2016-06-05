<template>
	<index-filter :cur-page.sync="curPage" :keyword.sync="keyword" :selected.sync="selected" :starttime.sync="starttime" :endtime.sync="endtime" :search="search"></index-filter>
	<index-pager :cur-page.sync="curPage" :page-size="pageSize" :total-lists="totalLists" :search="search"></index-pager>
	<index-list :list="list" :total-lists.sync="totalLists"></index-list>
	<index-pager :cur-page.sync="curPage" :page-size="pageSize" :total-lists="totalLists" :search="search"></index-pager>
</template>

<script>
	var indexFilter = require('./indexFilter.vue');
	var indexList = require('./indexList.vue');
	var indexPager = require('./indexPager.vue');

	var date = new Date();

	function concatUrlParam(url, obj) {
	    url = url || '';
	    obj = obj || {};

	    if (Object.prototype.toString.call(obj).toLowerCase() != '[object object]') {
	        return url;
	    }

	    var flag = /\?/ig.test(url);
	    var arr = [];
	    for (var k in obj) {
	        if (obj.hasOwnProperty(k) && obj[k] !== undefined) {
	            arr.push(k + '=' + encodeURIComponent(obj[k]));
	        }
	    }

	    return url + (flag ? arr.join('&') : '?' + arr.join('&'));
	};

	// 补全时间的前导0
	function leftPaddingZero (num) {
	    if (typeof num != 'number') return ;

	    return num < 10 ? '0' + num : num;
	}

	var _endtime = date.getFullYear() + '-' + leftPaddingZero(date.getMonth() + 1) + '-' + leftPaddingZero(date.getDate()) + ' ' + leftPaddingZero(date.getHours()) + ':' + leftPaddingZero(date.getMinutes());

	module.exports = {
		data: function () {
		    return {
		    	totalLists: 0,
		    	pageSize: 10,
		    	curPage: 1,
		    	keyword: '',
		    	selected: -1,
		    	starttime: '2016-05-01 00:00',
		    	endtime: _endtime,
		    	list: []
		    };
		},
		components: {
			'index-filter': indexFilter,
			'indexList': indexList,
			'index-pager': indexPager
		},
		methods: {
			truncatHandler: function (arr) {
			    if (Array.isArray(arr)) {
			    	for (var i = 0, len = arr.length; i < len; i++) {
			    		if (arr[i].message && arr[i].message.length > 150) {
			    			arr[i].long_message = {
			    				show: false
			    			};
			    		}
			    		if (arr[i].refer_url && arr[i].refer_url.length > 150) {
			    			arr[i].long_refer_url = {
			    				show: false
			    			};
			    		}
			    		if (arr[i].from && arr[i].from.length > 150) {
			    			arr[i].long_from = {
			    				show: false
			    			};
			    		}
			    	}
			    	return arr;
			    } else {
			    	return [];
			    }
			},
			search: function () {
				var obj = {};
				if (this.starttime) obj['from'] = new Date(this.starttime).getTime();
				if (this.endtime) obj['to'] = new Date(this.endtime).getTime();
				if (this.selected > -1) {
					obj['field'] = this.selected;
					if (this.keyword && this.keyword.trimLeft().trimRight()) {
						obj['keyword'] = this.keyword.trimLeft().trimRight();
					}
				}
				obj['limit'] = this.pageSize;
				obj['page'] = this.curPage;

				this.$http.get({
					url: concatUrlParam('/search', obj)
				}).then(function (res) {
				    if (res.status == 200 && res.data) {
				    	if (res.data.rtn == 0 && res.data.data) {
				    		this.$set('totalLists', res.data.total || 0);
				    		this.$set('list', this.truncatHandler(res.data.data));
				    	} else if (res.data.rtn == 11) {
				    		window.location.href = '/login';
				    	} else {
				    		console.error(res.data.message || 'Error API: [/search]');
				    	}
				    } else {
				    	console.error(res);
				    }
				}, function (err) {
				    console.error(err);
				});
			}
		}
	};
</script>