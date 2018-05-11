<template>
<div class="sendnotice">
	<!-- <div class="head">
		<x-header :left-options="{backText: ''}">发公告<span slot="right" @click="gorange">下一步</span></x-header>
	</div> -->
	<div class="content">
		<group>
		    <x-input title="公告标题" v-model="noticetitle" placeholder="必填" :required="true"></x-input>
		    <x-input title="作者" v-model="author" placeholder="选填"></x-input>
		    <vue-editor id="editor" @imageAdded="handleImageAdded" useCustomImageHandler v-model="noticecontent" :editorToolbar="customToolbar" placeholder="公告内容"></vue-editor>
	    </group>
	</div>
	<tabbar>
		<div class="foot" @click="gorange">下一步</div>
	</tabbar>
</div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
import { XHeader, XInput,Tabbar, Group, ToastPlugin} from 'vux'
import qs from 'qs'
import { VueEditor } from 'vue2-editor'
import Vue from 'vue'
Vue.use(ToastPlugin)

export default{
	data (){
		return{
			noticetitle:'',
			author:'',
			noticecontent:'',
			customToolbar: [
			  ['bold', 'italic'],
			  ['image'],
			  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
			  [{ 'color': [] }],
			  [{ 'align': [] }],
			]

		}
	},
	components: {
	    XHeader,
	    XInput,
	    Group,
	    ToastPlugin,
	    VueEditor,
	    Tabbar,
	  },
  	mounted:function(){
	    this.$nextTick(function(){
	    })
	},
	methods:{
		...mapMutations([
                'record_noticetitle',
                'record_noticewriter',
                'record_noticecontent',
            ]),
		cleardatas (){
			var _this=this;
			eventBus.$on('cleardata',function(){
				 _this.noticetitle='';
				 _this.author='';
				 _this.noticecontent='';
			})
		},
		//公告内容的图片转换
		handleImageAdded (file, Editor, cursorLocation){
			var formData = new FormData();
            formData.append('file', file);
            var config = {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
            this.$ajax.post(this.baseurl+'notice/photoUpload',formData,config).then((res)=>{
            	var res=res.data;
            	if(res.code==0){
            		let url=this.baseurl+res.data.path;
            		Editor.insertEmbed(cursorLocation, 'image', url);
            	}else{
	            	this.$vux.toast.text(res.msg);
	            }   
            	
            })
            .catch((err)=>{
            	this.$vux.toast.text('获取图片失败')
            })
		},
		gorange (){
			if(this.noticetitle==''){
               this.$vux.toast.text('请填写公告标题');
			}else if(this.noticecontent==''){
				this.$vux.toast.text('请填写公告内容');
			}else{
				this.record_noticetitle(this.noticetitle);
				this.record_noticewriter(this.author);
				this.record_noticecontent(this.noticecontent);
				this.$router.push('/sendsteptwo');
			}
			
		}
	},
	//实时获取当前路由参数
	watch:{
		'$route' (to,from){
			//判断从发布转过来的事件，则清空数据
			this.cleardatas();
		}
	}
}
</script>

<style scoped>
.foot{
	margin: 0 auto;
	line-height: 40px;
}	
</style>