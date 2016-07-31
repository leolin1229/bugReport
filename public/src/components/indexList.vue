<style scoped>
	.info {
		width: 15px;
		height: 15px;
		margin-top: -1px;
	}
	table {
	    table-layout: fixed;
	    word-wrap: break-word;
	}
</style>

<template>
	<div>
		<table class="table table-hover">
			<thead>
				<tr>
					<th>时间</th>
					<th>IP</th>
					<th>目标网页</th>
					<th>错误信息</th>
					<th>目标文件</th>
					<th>分辨率</th>
					<th>页面来路</th>
					<th>UA</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(index, data) in list">
					<td class="col-md-1">{{ data.create_time | timeFormat }}</td>
					<td class="col-md-1">{{ data.ip }}</td>
					<td class="col-md-2" v-if="data.long_refer_url">
						<span v-if="!data.long_refer_url.show">
							{{ data.refer_url | truncat }}
							<a href="javascript:;" @click="moreRefer(index)">...</a>
						</span>
						<span v-else>
							{{ data.refer_url }}
						</span>
					</td>
					<td class="col-md-2" v-else>{{ data.refer_url }}</td>
					<td class="col-md-2" v-if="data.long_message">
						<span v-if="!data.long_message.show">
							{{ data.message | truncat | decode }}
							<a href="javascript:;" @click="moreMessage(index)">...</a>
						</span>
						<span v-else>
							{{ data.message | decode }}
						</span>
					</td>
					<td class="col-md-2" v-else>{{ data.message | decode }}</td>
					<td class="col-md-1">
						{{ data.source_file | decode }}
						<span v-if="data.source_file">:{{ data.row_num }}:{{ data.col_num }}</span>
						<a href="javascript:;" v-if="data.row_num > 0 && data.col_num > 0" @click="parseSourceMap(data)"><img alt="查询原文件错误信息" title="查询原文件错误信息" src="/images/info.png" class="info"></a>
					</td>
					<td class="col-md-1">{{ data.resolution }}</td>
					<td class="col-md-1" v-if="data.long_from">
						<span v-if="!data.long_from.show">
							{{ data.from | truncat | decode }}
							<a href="javascript:;" @click="moreFrom(index)">...</a>
						</span>
						<span v-else>
							{{ data.from | decode }}
						</span>
					</td>
					<td class="col-md-1" v-else>{{ data.from | decode }}</td>
					<td class="col-md-3">{{ data.user_agent }}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
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

	function  htmlDecode(str) {
	    var s = '';
	    if (!str) return '';
	    s = str.replace(/&amp;/g, "&");
	    s = s.replace(/&lt;/g, "<");
	    s = s.replace(/&gt;/g, ">");
	    s = s.replace(/&nbsp;/g, " ");
	    s = s.replace(/'/g, "\'");
	    s = s.replace(/&quot;/g, "\"");
	    s = s.replace(/<br>/g, String.fromCharCode(10));
	    return s;
	}

	module.exports = {
		props: ['list', 'totalLists'],
		data: function () {
		    return {
		    	pageSize: 10,
		    	curPage: 1
		    };
		},
		ready: function () {
		    this.$http.get({
		    	url: concatUrlParam('/getAllLogs', {
		    		limit: this.pageSize,
		    		page: this.curPage
		    	})
		    }).then(function (res) {
		        if (res.status == 200 && res.data) {
		        	this.$set('totalLists', res.data.total || 0);

		        	if (res.data.rtn == 0 && res.data.data) {
		        		this.$set('list', this.truncatHandler(res.data.data));
		        	} else if (res.data.rtn == 11) {
		        		window.location.href = '/login';
		        	} else {
		        		console.error(res.data.message || 'Error API: [/getAllLogs]');
		        	}
		        } else {
		        	console.error(res);
		        }
		    }, function (err) {
		        console.error(err);
		    });
		},
		methods: {
			parseSourceMap: function (data) {
				var smap_url = data.source_file + '.map';// 默认map文件在js原文件同级目录

			    this.$http.get({
			    	url: concatUrlParam('/getOriginalPosition', {
			    		source_map_src: smap_url,
			    		row: data.row_num,
			    		col: data.col_num
			    	})
			    }).then(function (res) {
			        if (res.status == 200 && res.data) {
			        	if (res.data.rtn == 0) {
			        		var str = '文件名: ' + res.data.message.source + '\n';
			        		str += '行号: ' + res.data.message.line + '\n';
			        		str += '变量名: ' + res.data.message.name + '\n';
			        		alert(str);
			        	} else {
			        		alert(res.data.message || 'request file error!');
			        	}
			        } else {
			        	console.error(res);
			        }
			    }, function (err) {
			        console.error(err);
			    });
			},
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
			moreMessage: function (id, event) {
				this.list[id].long_message.show = true;
			},
			moreRefer: function (id, event) {
				this.list[id].long_refer_url.show = true;
			},
			moreFrom: function (id, event) {
				this.list[id].long_from.show = true;
			}
		},
		filters: {
			timeFormat: function (val) {
				return new Date(+val).toLocaleString();
			},
			truncat: function (val) {
			    return val.substr(0, 150);
			},
			decode: function (val) {
			    return htmlDecode(val);
			}
		}
	};
</script>