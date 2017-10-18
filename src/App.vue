<template>
  <div id="app" class="printType">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
   * {
    margin: 0;
    padding: 0;
  }

  html,
  body { height: 100%; }

  body {
    align-items: center;
    background:
      #fff;
    background-position: center;
    display: flex;
    font-family: Lato, Helvetica, sans-serif;
    justify-content: center;
    text-align: left;
  }
  #app {
    width:100%;
    height: 100%;
  }
  .bread {
    font-size: 20px;
    margin:5px;
    font-weight:bold;
    margin-bottom:20px;
  }
  @media print {
  .not-print {
    opacity: 0
  }
  .print {
    opacity: 1
  }
}
</style>
