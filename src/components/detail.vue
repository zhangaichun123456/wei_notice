<template>
	<div class="detail">
		<!-- <div class="head">
			<x-header :left-options="{backText: ''}">公告</x-header>
		</div> -->
		<div class="content" v-if="ifdel==false">
			<h3>{{detaildata.title}}</h3>
			<p class="sendfrom"><span class="writer">{{detaildata.writer}}</span><span>{{detaildata.createTime}}</span></p>
			<p class="duqu" @click="goreadnum">{{detaildata.readCount}}人已读，{{detaildata.unreadCount}}人未读</p>
			<img class="coverimg" v-if="detaildata.coverImg!=''" :src="baseurl+detaildata.coverImg" alt="">
			<div class="ql-editor" v-html="detaildata.content"></div>
			<div v-if="detaildata.noticeFiles.length>0" class="previewfj">
		        <p>附件：</p>
		    	<ul>
	            	<li v-for="(item,index) in detaildata.noticeFiles">
		            	<span class="filename">{{item.name}}</span>
		            	<span class="downbtn" @click="downloadfile(item)"><x-button type="primary" mini>下载</x-button></span>
	            	</li>
	            </ul>
		    </div>
		</div>
		<div class="content ifdel" v-if="ifdel==true">
		    <div>
				<icon type="warn" is-msg></icon>
				<p>无法查看</p>
				<p>管理员已在后台删除本条公告</p>
			</div>
		</div>
	</div>
</template>
<script>
import { XHeader,XButton,ToastPlugin,Icon } from 'vux'
import { VueEditor } from 'vue2-editor'
import {mapState, mapMutations} from 'vuex'
import qs from 'qs';
import Vue from 'vue'
Vue.use(ToastPlugin)

export default {
	data (){
		return {
            detaildata:{},
            ifdel:false,
		}
	},
	mounted:function(){
        this.$nextTick(function(){
        	this.getdetail();
        })
	},
	components: {
	    XHeader,
	    ToastPlugin,
	    XButton,
	    Icon,
	  },
	methods:{
		getdetail (){
	        let params={
	           token:this.$route.query.token,
	           noticeId:this.$route.query.noticeId,
	        }
	        this.$ajax.post(this.baseurl+'notice/detail',qs.stringify(params)).then((res)=>{
	        	var res=res.data;
	        	if(res.code==0){
	        		this.ifdel=false;
	        		this.detaildata=res.data;
	        	}else if(res.code==1000){
                    this.ifdel=true;
	        	}else{
	        		this.$vux.toast.text(res.msg)
	        	}
	        	
	        })
		},
		goreadnum (){
			this.$router.push({ path: 'readnum', query:{noticeId:this.$route.query.noticeId,token:this.$route.query.token }}) 
		},
		// 下载附件
		downloadfile (item){
			window.location.href=this.baseurl+'notice/download?noticefileId='+item.id;
		}
	},
	//实时获取当前路由参数
	watch:{
		'$route' (to,from){
			this.getdetail();
		}
	}
}
</script>

<style scoped>
.content{
	padding: 10px;
}
.sendfrom{
	font-size: 13px;
	color: #ccc;
}
.sendfrom span:first-child{
	margin-right: 
}
.duqu{
	font-size: 13px;
	color: #66c4f3;
}
.previewfj{
	border-top: 1px solid #ccc;
}
.previewfj p{
	margin: 10px 0;
}
.previewfj li{
	height: 50px;
	line-height: 50px;
	width: 90%;
	border:1px solid #ccc;
	margin-top: 10px;
	padding: 0 10px;
	font-size: 14px;
}
.previewfj .filename{
	display: inline-block;
	width: 70%;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
.writer{
	margin-right: 10px;
}
.downbtn{
	float: right;
}
.ifdel{
	text-align: center;
}
.coverimg{
	max-width: 100%;
	max-height: 100%;
}	
</style>