<template>
  <div>
    <div class="ui vertical clearing segment" style="margin-bottom: 14px;">
      <div class="ui container">
        <span>Logmonster</span>
      </div>
    </div>
    <div class="ui container">
      <div class="ui segments" v-if="targets.length">
        <div class="ui segment" v-for="target in targets" :key="target.name">
          <div class="content">
            <span style="float: right;">{{target.host}}</span>
            <router-link :to="`/console/${target.name}`">{{target.name}}</router-link>
          </div>
        </div>
      </div>
      <div class="ui basic center aligned segment" v-else>
        <p>You haven't set any available resources.</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Index",
    data: function () {
      return {
        targets: []
      }
    },
    created: function () {
      fetch('/api/targets').then(r => r.json()).then(j => this.targets = j);
    }
  }
</script>

<style scoped>

</style>
