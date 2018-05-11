<template>
	<div class="notice">
		<div class="content">
			<tab>
		      <tab-item :selected="showtab===0" @on-item-click="showtab=0">未读</tab-item>
		      <tab-item :selected="showtab===1" @on-item-click="showtab=1">已读</tab-item>
		    </tab>
		    <div class="tabcontent">
		    	<div class="unread" v-show="showtab===0">
		    		<ul v-if="unreadlist.length>0">
		    			<li v-for="item in unreadlist" @click="unreaddetail(item)">
		    				<img class="coverimg" :src="baseurl+item.coverImg" alt="" v-if="item.coverImg!=''">
		    				<img class="coverimg" :src="defaultimg" alt="" v-if="item.coverImg==''">
		    				<div class="singcon">
		    					<p>{{item.title}}</p>
		    					<p><span class="writer">{{item.writer}}</span><span>{{item.createTime}}</span></p>
		    				</div>
		    				<span class="jiaobiao"><badge></badge></span>
                            <img class="delimg" v-if="item.status==0" :src="delimg" alt="" @click.stop="ifshowdelmodel(item)" v-model="showdelmodel">
		    			</li>
		    		</ul>
		    		<p v-else class="nolist">当前暂无公告</p>
		    	</div>
		    	<div class="read" v-show="showtab===1">
		    		<ul v-if="readlist.length>0">
		    			<li v-for="item in readlist" @click="unreaddetail(item)">
		    				<img class="coverimg" :src="baseurl+item.coverImg" alt="" v-if="item.coverImg!=''">
		    				<img class="coverimg" :src="defaultimg" alt="" v-if="item.coverImg==''">
		    				<div class="singcon">
		    					<p>{{item.title}}</p>
		    					<p><span class="writer">{{item.writer}}</span><span>{{item.createTime}}</span></p>
		    				</div>
                            <img class="delimg" v-if="item.status==0" :src="delimg" alt="" @click.stop="ifshowdelmodel(item)" v-model="showdelmodel">
		    			</li>
		    		</ul>
		    		<p v-else class="nolist">当前暂无公告</p>
		    	</div>
		    </div>
		    <div v-transfer-dom>
		      <confirm v-model="showdelmodel" title="提示" @on-confirm="delsinglist">
		        <p style="text-align:center;">删除公告后，该公告的消息链接继续保留，点击进入不能查看公告详情</p>
		      </confirm>
		    </div>
		</div>
		<tabbar>
			<div class="foot" @click="gosend">发公告</div>
		</tabbar>
	</div>
</template>

<script>
import qs from 'qs';
import {mapState, mapMutations} from 'vuex'
import { XHeader,Tab,TabItem,Tabbar,Badge,Confirm,TransferDomDirective as TransferDom,ToastPlugin } from 'vux'
import defaultimg from '../image/defaultimg.jpg'
import delimg from '../image/delicon.png'
import Vue from 'vue'
Vue.use(ToastPlugin)

export default{
	data (){
		return{
			  showtab:0,
			  defaultimg: defaultimg,
			  delimg:delimg,
			  unreadlist:[],
			  readlist:[],
			  showdelmodel:false,
			  noticeId:null,
		}
	},
	mounted:function (){
		this.$nextTick(function(){
			this.getpramas();
			this.getlist();
		})
	},
	computed:{
      ...mapState([
            'entId',
            'token',
      ]),
    },
	directives: {
	    TransferDom
	  },
	components: {
	    XHeader,
	    Tab,
        TabItem,
        Tabbar,
        Badge,
		Confirm,
		ToastPlugin,
	  },
	methods:{
		 ...mapMutations([
	          'record_token',
	          'record_entId',
	      ]),
		getpramas (){
	      this.record_token(this.$route.query.token);
	      this.record_entId(this.$route.query.entId);
	    },
		//获取公告列表
		getlist (){
			let params={
	           token:this.token,
	           entId:this.entId,
	        }
	        this.$ajax.post(this.baseurl+'/notice/list',qs.stringify(params)).then((res)=>{
	        	var res=res.data;
	        	if(res.code==0){
	        		this.unreadlist=res.data.unreadlist;
	        		this.readlist=res.data.readlist;
	        	}else{
                    this.$vux.toast.text(res.msg)
	        	}
	        })
		},
		//显示删除model
		ifshowdelmodel (item){
			this.showdelmodel=true;
			this.noticeId=item.noticeId;
		},
		//删除单条公告
        delsinglist (){
        	let params={
	           noticeId:this.noticeId,
	        }
	        this.$ajax.post(this.baseurl+'/notice/del',qs.stringify(params)).then((res)=>{
	        	var res=res.data;
	        	if(res.code==0){
	        		this.getlist();
	        	}else{
                    this.$vux.toast.text(res.msg)
	        	}
	        })

        },
        gosend (){
        	this.$router.push('/sendnotice');
        },
        //未读详情
        unreaddetail (item){
        	 this.getlist();
	         this.$router.push({ path: 'detail', query:{noticeId:item.noticeId,token:this.token }}) 
        }       
	},
	//实时获取当前路由参数
	watch:{
		'$route' (to,from){
			this.getlist();
		}
	}
}

</script>

<style scoped>
.content{
	margin-bottom: 50px;
}
.coverimg{
	width: 75px;
	height: 50px;
	margin-right: 10px;
}
.coverimg,.singcon{
	display: inline-block;
	vertical-align: middle;
}
.singcon{
	width: 60%;
}
.singcon p{
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	font-size: 14px;
}
.unread ul,.read ul{
	margin-top: 10px;
}
.unread li,.read li{
	position: relative;
	margin :0 15px;
	box-sizing:border-box;
	border-bottom: 1px solid #ccc;
}
.jiaobiao {
	position: absolute;
	top: 0;
	right: 0;
}
.delimg{
	position: absolute;
	bottom: 10px;
	right: 0;
	width: 24px;
	height: 26px;
}
.nolist{
	text-align: center;
}
.writer{
	margin-right: 10px;
}
.foot{
	margin: 0 auto;
	line-height: 50px;
}
</style>