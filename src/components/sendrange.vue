<template>
	<div class="sendrange">
		<!-- <div class="head">
			<x-header :left-options="{backText: ''}">发送范围</x-header>
		</div> -->
		<div class="wrapper" id="wrapper">
			<search :results="results" v-model="searchcontent" auto-scroll-to-top top="46px" ref="search" @on-change="changesearch($event)"></search>
			<div class="chooserange" v-if="searchcontent==''">
				<ul class="teamname">
		        	<li v-for="item in breadlist" @click="nextfloor(item)">{{item.name}}</li>
	        	</ul>
	        	<div>
	        	    <p class="dptlisttip" v-if="dptlist.length==0">当前部门暂无下级部门</p>
	        	    <ul class="dptlist" v-if="dptlist.length>0">
		        	    <li v-for="item in dptlist">
		        	    	<input type="checkbox" :value="item.deptId" v-model="dptchecklist">
		        	    	<label :for="item.name">{{item.name}}<span>({{item.empTotal}}人)</span></label>
		        	    	<span class="nextfloor" @click="nextfloor(item)">下级部门</span>
		        	    </li>
	        	    </ul>
        	    </div>
        	    <div>
        	        <p>部门成员</p>
        	        <p class="emplisttip" v-if="emplist.length==0">当前部门暂无成员</p>  
        	        <ul class="emplist" v-if="emplist.length>0">
		        	    <li v-for="item in emplist">
		        	    	<input type="checkbox" :value="item.empId" v-model="empchecklist">
		        	    	<label :for="item.name">
			        	    	<img class="avatarUrl" :src="item.avatarUrl" alt="">
			        	    	<div class="info">
			        	    	    <p>{{item.name}}</p>
				        	    	<p>{{item.jobPosition}}</p>
			        	    	</div>
		        	    	</label>
		        	    </li>
	        	    </ul>  
        	    </div>
			</div>
			<div class="chooserange" v-if="searchcontent!=''">
			    <p>部门成员</p>
        	    <p class="emplisttip" v-show='filteremplist.length==0'>暂无匹配人员</p>
	        	<ul class="emplist" v-show='filteremplist.length>0'>
	        		<li v-for="item in filteremplist">
		        		<input type="checkbox" :value="item.empId" v-model="empchecklist">
	        	    	<label :for="item.name">
		        	    	<img class="avatarUrl" :src="item.avatarUrl" alt="">
		        	    	<div class="info">
		        	    	    <p>{{item.name}}</p>
			        	    	<p>{{item.jobPosition}}</p>
		        	    	</div>
	        	    	</label>
	        		</li>
	        	</ul>
			</div>
		</div>
        <footer>
        	 <span>已勾选：{{empchecklist.length}}个人，{{dptchecklist.length}}个部门</span>
        	 <span class="surechoose" @click="surechoose">确定</span>
        </footer>	
	</div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
import qs from 'qs'
import { XHeader,Search,ToastPlugin,Checklist} from 'vux'
export default{
	data (){
		return {
			searchcontent:'',
			results: [],
			breadlist:[],
			dptlist:[],
            emplist:[],
            dptchecklist:[],
            empchecklist:[],
            searchemplist:[],
		}
	},
	mounted:function(){
        this.$nextTick(function(){
        	this.getdata();
        })
	},
	components: {
	    XHeader,
	    Search,
	    ToastPlugin,
	    Checklist,
	  },
	computed:{
		...mapState([
	            'entId',
	            'token',
	      ]),
		//搜索过滤的人员渲染数据
	    filteremplist:function(){
	    	var searchcontent=this.searchcontent;
	    	if(searchcontent){
	    		return this.searchemplist.filter(function(item){
	    			return Object.keys(item).some(function(key){
	    				return String(item[key]).toLowerCase().indexOf(searchcontent)>-1
	    			})
	    		})
	    	}
	    	return this.searchemplist;
	    }
	},
	methods:{
		...mapMutations([
                'record_dptchecklist',
                'record_empchecklist',
            ]),
        //获取当前部门和人员列表
		getdata (){
			let datas={
                 	'entId':this.entId,
                 	'deptId':0
                 };
            let datastr=JSON.stringify(datas);
			let params={
                 token:this.token,
                 data:datastr
			}
			this.$ajax.post(this.baseurl+'report/getMemberList',qs.stringify(params)).then((res)=>{				
				var res=res.data;
				if(res.code==0){
					this.breadlist=res.data.parentDept;
					this.dptlist=res.data.deptList;
					this.emplist=res.data.empList;
				}else{
					this.$vux.toast.text(res.msg)
				}
			})
			.catch((err)=>{
            	this.$vux.toast.text('获取数据失败')
            })   
		},
        //点击下级部门
        nextfloor (item){
               let datas={
                     	'entId':this.entId,
                     	'deptId':item.deptId,
                     };
                let datastr=JSON.stringify(datas);
				let params={
                     token:this.token,
                     data:datastr
				}
				this.$ajax.post(this.baseurl+'report/getMemberList',qs.stringify(params)).then((res)=>{
					var res=res.data;
					if(res.code==0){
					   this.dptlist=res.data.deptList;
					   this.emplist=res.data.empList;
					   this.breadlist=res.data.parentDept;
					}else{
						this.$vux.toast.text(res.msg)
					}
				})  
			},
	    //确定选择
	    surechoose (){
	    	this.record_dptchecklist(this.dptchecklist);
	    	this.record_empchecklist(this.empchecklist);
	    	this.$router.go(-1);
	    },
	    //搜索
	    changesearch (e){
	    	if(e!=''){
				let datas={
                 	'entId':this.entId,
                 };
                let datastr=JSON.stringify(datas);
				let params={
                     token:this.token,
                     data:datastr,
				}
				this.$ajax.post(this.baseurl+'report/getempList',qs.stringify(params)).then((res)=>{
					var res=res.data;
					if(res.code==0){
					   this.searchemplist=res.data;
					}else{
						this.$vux.toast.text(res.msg)
					}
				})  
			}
	    }
	}
}
</script>

<style scoped>
.wrapper{
	position: absolute;
	top: 0;
	bottom: 0;
	width: 100%;
	overflow:auto;
}
.chooserange{
	margin: 10px;
}
.teamname{
	text-align: left;
	background: #fff;
	line-height: .8rem;
	font-size: 14px;
	padding: 0 .3rem;
	margin: 20px 0;
}
.teamname li{
	display: inline-block;
	padding-right: .2rem;
	margin-right: .2rem;
	border-right: 1px solid #eee;
	height: .6rem;
	line-height: .6rem;
}
.teamname li:last-child{
	border-right: none;
	color: rgb(56, 214, 230);
}	
.emplisttip,.dptlisttip{
	text-align: center;
}
.dptlist li{
	height: 30px;
	line-height: 30px;
}
.nextfloor{
	float: right;
	color: rgb(56, 214, 230);
}
.emplist .avatarUrl,.emplist .info{
	display: inline-block;
    vertical-align: middle;
}
.avatarUrl{
	width: 50px;
	height: 50px;
	border-radius: 50%;
}
footer{
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	width: 100%;
	height: 50px;
	line-height: 50px;
	background: #EFEFF4;
}
footer span:first-child{
	padding-left: 10px;
}
.surechoose{
	float: right;
	padding-right: 10px;
	color: rgb(56, 214, 230);
}
</style>