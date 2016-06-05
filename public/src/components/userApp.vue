<style scoped>
	table {
		width: 50%;
	}
	input[type=number] {  
	    -moz-appearance:textfield;  
	}  
	input[type=number]::-webkit-inner-spin-button,  
	input[type=number]::-webkit-outer-spin-button {  
	    -webkit-appearance: none;  
	    margin: 0;  
	}
</style>

<template>
	<div>
		<index-top-nav :user.sync="user"></index-top-nav>
		<table class="table table-bordered">
			<thead>
				<tr>
					<th>key</th>
					<th>value</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td class="col-md-2">用户名</td>
					<td class="col-md-2">{{ user.username }}</td>
				</tr>
				<tr>
					<td class="col-md-2">账号类型</td>
					<td class="col-md-2" v-if="user.type == 1">超级管理员(可添加用户、修改系统设置)</td>
					<td class="col-md-2" v-else>普通管理员(只有查看权限)</td>
				</tr>
				<tr v-if="user.type == 1">
					<td class="col-md-2">添加普通管理员</td>
					<td class="col-md-2">
						<input type="text" class="form-control input-group-lg" placeholder="请输入用户名(字母/数字/下划线/@/.)" v-model="admin_name" required>
						<input type="text" class="form-control input-group-lg" placeholder="请输入密码(至少六位字符, 不含空格)" v-model="admin_password" required>
						<button class="btn btn-primary" @click="addAdmin">添加</button>
					</td>
				</tr>
				<tr>
					<td class="col-md-2">日志有效期(范围[86400, 2592000], 单位s)</td>
					<td class="col-md-2">
						<input v-if="user.type == 1" type="number" class="form-control input-group-lg" placeholder="请输入时间(86400<= x <= 2592000)" v-model="setting" min="86400" max="2592000" required>
						<input v-else type="number" class="form-control input-group-lg" v-model="setting" disabled>
						<button class="btn btn-primary" v-if="user.type == 1" @click="updateSetting">修改</button>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
	var indexTopNav = require('./indexTopNav.vue');

	module.exports = {
		el: '#app',
		data: function () {
		    return {
		    	user: {},
		    	setting: 1,
		    	admin_password: '',
		    	admin_name: ''
		    };
		},
		watch: {
			user: function (val, oldVal) {
			    this.getSetting();
			}
		},
		methods: {
			addAdmin: function () {
				var regx_name = /^[a-zA-Z0-9_@.]+$/;
				var regx_pwd = /\s/;
				if (!regx_name.test(this.admin_name)) {
					alert('用户名只能包含a-zA-Z0-9_.@');
					return ;
				}
				if (regx_pwd.test(this.admin_password) || this.admin_password.length < 6) {
					alert('密码至少六位字符且不含空格');
					return ;
				}
				
				this.$http.post({
					url: '/register',
					method: 'POST',
					data: {
						username: this.admin_name,
						password: this.admin_password
					},
					emulateJSON: true
				}).then(function (res) {
				    if (res.status == 200 && res.data) {
				    	if (res.data.rtn == 0) {
				    		alert('register success!');
				    	} else if (res.data.rtn == 11) {
				    		window.location.href = '/login';
				    	} else {
				    		console.error(res.data.message || 'Error API: [/register]');
				    		alert(res.data.message || 'Error API: [/register]');
				    	}
				    } else {
				    	console.error(res);
				    }
				}, function (err) {
				    console.error(err);
				});
			},
			getSetting: function () {
			    this.$http.get({
			    	url: '/setting/get'
			    }).then(function (res) {
			        if (res.status == 200 && res.data) {
			        	if (res.data.rtn == 0 && res.data.data && res.data.data.length) {
			        		this.$set('setting', res.data.data[0].expired_time);
			        	} else if (res.data.rtn == 11) {
			        		window.location.href = '/login';
			        	} else {
			        		console.error(res.data.message || 'Error API: [/setting/get]');
			        	}
			        } else {
			        	console.error(res);
			        }
			    }, function (err) {
			        console.error(err);
			    });
			},
			updateSetting: function () {
				if (!this.setting || this.setting < 86400 || this.setting > 2592000) {
					alert('时间(86400s<= time <= 2592000s)');
					return ;
				}
				
				this.setting = parseInt(this.setting)
			    this.$http.post({
			    	url: '/setting/update',
			    	method: 'POST',
			    	data: {
			    		expired: parseInt(this.setting)
			    	},
			    	emulateJSON: true
			    }).then(function (res) {
			        if (res.status == 200 && res.data) {
			        	if (res.data.rtn == 0) {
			        		alert('update expired time success!');
			        	} else if (res.data.rtn == 11) {
			        		window.location.href = '/login';
			        	} else {
			        		alert(res.data.message || 'Error API: [/setting/update]');
			        	}
			        } else {
			        	console.error(res);
			        }
			    }, function (err) {
			        console.error(err);
			    });
			}
		},
		components: {
			'index-top-nav': indexTopNav
		}
	};
</script>