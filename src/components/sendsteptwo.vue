<template>
	<div class="sendsteptwo">
		<!-- <div class="head">
			<x-header :left-options="{backText: ''}">发公告<span slot="right" @click="fabu">发布</span></x-header>
		</div> -->
		<div class="content">
			<cell title="发送范围" :value="sendnum" :is-link="true" link="./sendrange"></cell>
			<div class="addimg">
				<p>添加封面图片</p>
				<img v-if="coverimg==''" :src="defaultimg" alt="">
				<input v-if="coverimg==''" type="file" @change="addimg" id="files">
				<div v-if="coverimg!=''" class="coverimg">
					<img :src="coverimg" alt="">
					<span @click="delimg"><icon type="cancel"></icon></span>
				</div>				
			</div>
			<div class="foot">
				<x-switch title="设为保密公告" v-model="secrecy"></x-switch>
				<p>接收人只能查看，消息不可转发和拷贝；公告详情页有接收人真实姓名水印，防止截图发送</p>
				<x-switch title="咻一下" v-model="xiuxiu"></x-switch>
				<p>将重要的公告咻一下，确保对方收到</p>
			</div>
			<p class="tips">不能同时勾选‘设为保密公告’和‘咻一下’</p>
		</div>
		<tabbar>
			<div class="foot" @click="fabu">发布</div>
		</tabbar>
	</div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
import { Cell,XHeader,Icon,XSwitch,Tabbar} from 'vux'
import defaultimg from '../image/addimg.png'
import qs from 'qs';
export default{
	data (){
		return {
			defaultimg:defaultimg,
			coverimg:"",
			coverimg1:"",
			secrecy:false,
			xiuxiu:true,
		}
	},
	components: {
	    XHeader,
	    Cell,
	    Icon,
	    XSwitch,
	    Tabbar,
	  },
	computed:{
		...mapState([
	            'entId',
	            'token',
	            'dptchecklist',
	            'empchecklist',
	            'noticetitle',
	            'noticewriter',
	            'noticecontent',
	      ]),
		sendnum (){
			return this.empchecklist.length+'个人，'+this.dptchecklist.length+'个部门';
		}
	},
    methods:{
    	...mapMutations([
                'record_dptchecklist',
                'record_empchecklist',
                'record_noticetitle',
                'record_noticewriter',
                'record_noticecontent',
            ]),
    	addimg (){
    		var $_file = document.getElementById("files");
    		var files=$_file.files[0];
    		var formData = new FormData();
            formData.append('file', files);
            var config = {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
    		this.$ajax.post(this.baseurl+'notice/photoUpload',formData,config).then((res)=>{
            	var res=res.data;
            	if(res.code==0){
            		this.coverimg=this.baseurl+res.data.path;
            		this.coverimg1=res.data.path;
            	}else{
	            	this.$vux.toast.text(res.msg);
	            }   
            	
            })
            .catch((err)=>{
            	this.$vux.toast.text('获取图片失败')
            })
    	},
    	delimg (){
    		this.coverimg="";
    	},
    	// 发布公告
    	fabu (){
    		var type=0;
    		if(this.secrecy==true){
    			type=1;
    		}else if(this.xiuxiu==true){
    			type=0;
    		}
            var formData = new FormData();
			formData.append('entId', this.entId);
            formData.append('token', this.token);
            formData.append('type', type);
            formData.append('title', this.noticetitle);
            formData.append('content', this.noticecontent);
            formData.append('sort', 0);
            formData.append('writer', this.noticewriter);
            formData.append('coverImg', this.coverimg1);
            formData.append('empIdList', this.empchecklist);
            formData.append('deptIdList', this.dptchecklist);
            var config = {
	              headers: {
	                'Content-Type': 'multipart/form-data'
	              }
	            }
	        if(this.empchecklist.length==0&&this.dptchecklist.length==0){
	        	this.$vux.toast.text('请选择发送范围');
	        }else if(this.secrecy==true&&this.xiuxiu==true){
	        	this.$vux.toast.text("不能同时勾选'设为保密公告'和'咻一下'");
	        }else if(this.secrecy==false&&this.xiuxiu==false){
	        	this.$vux.toast.text("'设为保密公告'和'咻一下'必须勾选一个");
	        }else{
               this.$ajax.post(this.baseurl+'notice/add',formData, config).then((res)=>{
	               	var res=res.data;
	               	if(res.code==0){
	               		this.xiuxiu=true;
	               		this.coverimg1="";
	               		this.coverimg="";
	               		this.record_noticetitle("");
	               		this.record_noticewriter("");
	               		this.record_noticecontent("");
                        this.record_dptchecklist([]);
                        this.record_empchecklist([]);
                        eventBus.$emit('cleardata');
		        		this.$router.push('/notice')
		        	}else{
		        		this.$vux.toast.text(res.msg)
		        	}
               })
               .catch((res)=>{
		          this.$vux.toast.text('获取数据失败')
		        })
	        }
	        
    	}
    },
}
</script>

<style scoped>
.addimg{
	padding:0 15px 10px;
	border-top: 1px solid #ccc;
	border-bottom: 1px solid #ccc;
	position: relative;
}
.addimg img{
	max-width: 60px;
	max-height: 60px;
}
.addimg input{
	position: absolute;
	top: 40px;
	left: 15px;
	height: 40px;
	width: 60px;
    opacity: 0;
}
.coverimg{
	position: relative;
	max-width: 60px;
	max-height: 60px;
}
.coverimg span{
	position: absolute;
	top: -10px;
	right: -10px;
}
.foot p{
	padding: 0 15px;
	font-size: 12px;
	color: #ccc;
}
.tips{
	padding: 0 15px;
	font-size: 12px;
	color: red;
}
.foot{
	margin: 0 auto;
	line-height: 40px;
}
</style>