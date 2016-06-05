<template>
	<nav class="navbar navbar-default navbar-fixed-top">
	    <div class="container">
	        <div class="navbar-header">
				<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
					<span class="sr-only">Toggle navigation</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				</button>
				<a class="navbar-brand" href="/">前端错误上报管理系统</a>
	        </div>
	        <div id="navbar" class="navbar-collapse collapse">
				<!-- <ul class="nav navbar-nav">
					<li class="active"><a href="#">Home</a></li>
					<li><a href="#about">About</a></li>
					<li><a href="#contact">Contact</a></li>
					<li class="dropdown">
					  	<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span class="caret"></span></a>
						<ul class="dropdown-menu">
							<li><a href="#">Action</a></li>
							<li><a href="#">Another action</a></li>
							<li><a href="#">Something else here</a></li>
							<li role="separator" class="divider"></li>
							<li class="dropdown-header">Nav header</li>
							<li><a href="#">Separated link</a></li>
							<li><a href="#">One more separated link</a></li>
						</ul>
					</li>
				</ul> -->
				<ul class="nav navbar-nav navbar-right">
					<li><a href="/user">{{username}}</a></li>
					<li><a href="/logout">退出</a></li>
				</ul>
	        </div>
	    </div>
	</nav>
</template>

<script>
	module.exports = {
		props: {
			user: {
				type: Object
			}
		},
		data: function () {
		    return {
		    	username: ''
		    };
		},
		ready: function () {
		    this.$http.get({
		    	url: '/getUser'
		    }).then(function  (res) {
		        if (res.status == 200 && res.data) {
		        	if (res.data.rtn == 0 && res.data.data) {
		        		this.$set('user', res.data.data || {});
		        		this.username = res.data.data.username || '';
		        	} else if (res.data.rtn == 11) {
		        		window.location.href = '/login';
		        	} else {
		        		console.error(res.data.message || 'Error API: [/getUser]');
		        	}
		        } else {
		        	console.error(res);
		        }
		    }, function (err) {
		        console.error(err);
		    });
		}
	};
</script>