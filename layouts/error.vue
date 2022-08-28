<template>
  <v-app dark>
 <v-layout
    column
    justify-center
    class="mt-10"
  >
    <v-container class="text-center">
    <h1 v-if="error.statusCode === 404">
      {{ pageNotFound }}
    </h1>
    <h1 v-else>
      {{ otherError }}
    </h1>
    Você pode tentar <a href="javascript:window.location.reload(true);" onclick="window.location.reload(true)">atualizar página</a> ou 
    <NuxtLink to="/">
      ir para a homepage
    </NuxtLink>.
    </v-container>
 </v-layout>
  </v-app>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pageNotFound: '404 Página não foi encontrada',
      otherError: 'Ops... Algo deu errado!'
    }
  },
  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
