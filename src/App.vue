<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  font-size: 14px;
}
ul,li{
  list-style: none;
  margin: 0;
  padding: 0;
}
.head{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}
.weui-search-bar__label{
  top: 5px!important;
}
.vux-search-fixed{
  position: static!important;
}
/*.content{
  margin-top: 46px;
}*/
.ql-editor img{
  max-width: 100% !important;
  max-height: 100% !important;  
}
.detail .ql-editor{
  padding: 0 !important;
}
.vux-tabbar-simple .weui-tabbar__label{
  line-height: 25px!important;
}
.ql-toolbar.ql-snow{
  border:none!important;
  border-top: 1px solid #ccc!important;
  border-bottom: 1px solid #ccc!important;
}
.ql-container.ql-snow{
  border:none!important;
}
.weui-cells:before{
  border-top:none!important;
}
.vux-tab .vux-tab-item.vux-tab-selected{
  color: rgb(56, 214, 230)!important;
  border-bottom: rgb(56, 214, 230)!important;
}
.vux-tab-ink-bar{
  background-color:rgb(56, 214, 230)!important;
}
.weui-tabbar{
  background-color: rgb(56, 214, 230)!important;
  color: #fff;
}
</style>
