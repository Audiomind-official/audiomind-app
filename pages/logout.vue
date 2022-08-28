<template>
  <v-container class="text-center">
    <h1>Você foi deslogado com sucesso!</h1>
  </v-container>
</template>

<script>

const Cookie = process.client ? require('js-cookie') : undefined

export default {
  created() {
      Cookie.remove('auth')
      this.$store.commit('setAuth', null)
      this.$router.push("/")
  },
  methods: {
    logout () {
    }
  }
}
</script>