<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      :right="true"
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
      dark
    >
      
      

     <img src="/negative-icon.svg" alt="" height="32px" style="margin: 0 1.25rem 0 .5rem;">


      <v-spacer />
      <v-tabs>
        <v-tab to="/">Visão geral</v-tab>
        <v-tab  to="/entries">Contatos</v-tab>
        <v-tab  to="/properties">Meus sites</v-tab>
      </v-tabs>
            <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

    </v-app-bar>
    <v-content>
      
        <nuxt />
      
    </v-content>
    <v-snackbar v-model="notification.show">
      {{notification.text}}
    </v-snackbar>
    <v-footer
      :fixed="fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }} Audiomind</span>
    </v-footer>
  </v-app>
</template>

<script>

const events = {
  login: "Login efetuado com sucesso",
  verified: "Site verificado com sucesso",
  register: "Conta criada com sucesso"
}
export default {
  mounted() {
    if (this.$route.query.event) {
      this.notification.text = events[this.$route.query.event];
      this.notification.show = true;
    }
  },
  data () {
    return {
      notification: {
        show: false,
        text: '',
      },
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        //{
        //  icon: 'mdi-account',
        //  title: 'Minha conta',
        //  to: '/'
        //},
        //{
        //  icon: 'mdi-credit-card-multiple',
        //  title: 'Financeiro',
        //  to: '/billing'
        //},
        {
          icon: 'mdi-logout',
          title: 'Sair',
          to: '/logout'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false
    }
  }
}
</script>

<style >

body, main {
  background: #F7F6F9;
}

</style>