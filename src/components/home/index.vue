<template>
    <div class="wrapper">
        <headerView></headerView>
        <leftView></leftView>
        <div class="content printHiddenScroll">
            <transition name="move" mode="out-in">
              <router-view></router-view>
            </transition>
        </div>
    </div>
</template>

<script>
import headerView from './headerView'
import leftView from './leftView'

export default {
  components: {
    headerView, leftView
  }
}
</script>

<style scoped>
@media print {
    @page {
        margin:0;
    }
    .printHiddenScroll {
        overflow-y: hidden;
    }
}
.content{
    background: none repeat scroll 0 0 #fff;
    position: absolute;
    left: 200px;
    right: 0;
    top: 60px;
    bottom:0;
    width: auto;
    padding:40px;
    box-sizing: border-box;
}
</style>
