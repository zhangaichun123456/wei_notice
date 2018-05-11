<template>
	<div class="readnum">
		<!-- <div class="head">
			<x-header :left-options="{backText: ''}">公告接收列表</x-header>
		</div> -->
		<div class="content">
			<tab>
		      <tab-item :selected="showtab===0" @on-item-click="showtab=0">未读({{unreadlist.length}})</tab-item>
		      <tab-item :selected="showtab===1" @on-item-click="showtab=1">已读({{readlist.length}})</tab-item>
		    </tab>
		</div>
		<div class="tabcontent">
			<div class="unread" v-show="showtab===0">
			<ul>
				<li v-for="item in unreadlist">
					<img :src="baseurl+item.avatarUrl" alt="">
					<p>{{item.nickname}}</p>
				</li>
			</ul>
			</div>
			<div class="read" v-show="showtab===1">
			    <li v-for="item in readlist">
					<img :src="baseurl+item.avatarUrl" alt="">
					<p>{{item.nickname}}</p>
				</li>
			</div>
		</div>
	</div>
</template>

<script>
import { XHeader,Tab,TabItem,ToastPlugin} from 'vux'
import qs from 'qs';
import Vue from 'vue'
Vue.use(ToastPlugin)

export default{
	data (){
		return{
          showtab:0,
          readlist:[],
          unreadlist:[],
		}
	},
	components: {
	    XHeader,
	    Tab,
	    TabItem,
	    ToastPlugin
	  },
	mounted:function(){
        this.$nextTick(function(){
        	this.getreadnum();
        })
	},
	methods:{
		//获取已读未读列表
		getreadnum (){
			let params={
	           token:this.$route.query.token,
	           noticeId:this.$route.query.noticeId,
	        }
	        this.$ajax.post(this.baseurl+'notice/readinfo',qs.stringify(params)).then((res)=>{
	        	var res=res.data;
	        	console.log(res);
	        	if(res.code==0){
	        		this.readlist=res.data.readlist;
	        		this.unreadlist=res.data.unreadlist;
	        	}else{
	        		this.$vux.toast.text(res.msg)
	        	}
	        })
	        .catch((res)=>{
	          this.$vux.toast.text('获取数据失败')
	        })
		}
	},
	//实时获取当前路由参数
	watch:{
		'$route' (to,from){
			this.getreadnum();
		}
	}
}
</script>

<style scoped>
.unread li,.read li{
	display: inline-block;
	margin: 15px;
}
.unread li p,.read li p{
	text-align: center;
}
.unread li img,.read li img{
	width: 50px;
	height: 50px;
	border-radius: 50%;
	text-align: center;
}	
</style>