<template>
  <v-app>
    <v-content  class="login-background">
      <v-container>
        <nuxt/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style scoped>
.login-background {
  background: #221b2f url("/login-bg.svg")!important;
  background-position: center;
  background-size: cover;
}
</style>
