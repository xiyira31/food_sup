<template>
  <div>
    <component v-bind:is="currentStyle" 
      :company="company"
      :school="school"
      :printOrderNo="printOrderNo"
      :details="details"
      :orderStyle="orderStyle"
      :orderType="orderType"
      :deliverPerson="deliverPerson"
      :carNum = "carNum"></component>
  </div>
</template>

<script>
export default {
  props: ['company', 'school', 'printOrderNo', 'details', 'orderStyle', 'orderType',
    'deliverPerson', 'carNum', 'currentStyle']
}
</script>

<style scoped>
</style>
