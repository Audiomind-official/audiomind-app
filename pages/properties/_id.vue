<template>
  <div>
    <header>
      <v-container>
        <div style="display: flex; align-items: center; justify-content: space-between;">
        <div><h1>
          <nuxt-link :to="`/properties/${property._id}`">{{
            property.name
          }}</nuxt-link>
        </h1>
        <p>{{ property.domain }}</p></div>
        <div v-if="user.permissions == 'ADMIN'">
          <v-btn :to="`/properties/${property._id}/admin/update/plan`">Painel do administrador</v-btn>
        </div>
        </div>
      </v-container>
    </header>

    <div class="flex align-stretch" style="display: flex">
      <v-navigation-drawer permanent v-model="drawer">
        <v-list dense nav class="py-0 mt-8">
          <v-list-item
            v-for="item in items"
            :key="item.title"
            link
            :to="item.to"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <div class="flex property-child">
        <v-container>
          <v-row>
            <v-col>
              <v-alert
                type="error"
                v-if="property.subscription.status == 'NOTVERIFIED'"
              >
                <h2>Seu site ainda não foi verificado</h2>
                <p>
                  Seu gravador não funcionará enquanto esse processo não for
                  feito. Lembre-se de verificar seu e-mail para garantir a
                  autenticidade da sua conta e não esqueça de olhar na sua caixa
                  de spam. Caso não tenha recebido, clique em reenviar:
                </p>

                <v-btn @click="resend" v-if="resent == false"
                  >Reenviar verificação</v-btn
                >
              </v-alert>
              <v-alert
                type="info"
                v-if="property.subscription.plan.code == 'free'"
              >
                <h2>Finalize sua compra</h2>
                <p>
                  Parece que você não finalizou ainda sua compra. Selecione um
                  dos planos abaixo para continuar:
                </p>

                <v-row class="pa-3">
                  <v-col class="pa-1">
                    <v-chip color="green" text-color="white" small active
                      >Mais vendido</v-chip
                    >
                    <v-card color="blue darken-4" class="mt-2" :dark="false">
                      <v-card-title>Básico</v-card-title>
                      <v-card-subtitle>R$99/mês</v-card-subtitle>
                      <v-card-text>
                        300.000 visualizações
                        <br />600 envios <br />150 min. de transcrição <br />300
                        análises de emoção
                        <br />
                      </v-card-text>
                      <v-card-actions>
                        <v-btn
                          small
                          :to="`/checkout/${property._id}?plan=basico-v1`"
                        >
                          Finalizar compra
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-col>

                  <v-col class="pa-1">
                    <v-card color="blue darken-4" class="mt-9">
                      <v-card-title>Avançado</v-card-title>
                      <v-card-subtitle>R$179/mês</v-card-subtitle>
                      <v-card-text>
                        600.000 visualizações
                        <br />1.200 envios <br />300 min. de transcrição
                        <br />600 análises de emoção
                        <br />
                      </v-card-text>
                      <v-card-actions>
                        <v-btn
                          small
                          :to="`/checkout/${property._id}?plan=avancado-v1`"
                        >
                          Finalizar compra
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>
              </v-alert>
              <nuxt-child
                :key="$route.params.id"
                :keep-alive-props="{ property }"
                :property="property"
              />
            </v-col>
          </v-row>
        </v-container>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: "authenticated",
  data() {
    return {
      property: {},
      drawer: true,
      resent: false,
      items: [
        //{ title: "Visão Geral", icon: "mdi-view-dashboard", to: `/properties/${this.$route.params.id}/overview` },
        {
          title: "Contatos",
          icon: "mdi-message-video",
          to: `/properties/${this.$route.params.id}/entries`,
        },
        {
          title: "Gravador",
          icon: "mdi-microphone",
          to: `/properties/${this.$route.params.id}/recorder`,
        },
        {
          title: "Configurações",
          icon: "mdi-tune",
          to: `/properties/${this.$route.params.id}/settings`,
        },
        //{ title: "Integrações", icon: "mdi-share-variant", to: `/properties/${this.$route.params.id}/integrations` },
        {
          title: "Cobranças",
          icon: "mdi-cash",
          to: `/properties/${this.$route.params.id}/billing`,
        },
        {
          title: "Dados de uso",
          icon: "mdi-atom",
          to: `/properties/${this.$route.params.id}/usage`,
        },
      ],
    };
  },

  methods: {
    async resend() {
      try {
        const resend = await this.$axios({
          url: `/properties/${this.property._id}/send/verification`,
          method: "GET",
        });

        this.resent = true;
      } catch (error) {
        console.log(error);
      }
    },
  },

  head() {
    return {
      title: this.property.name,
    };
  },

  async asyncData({ params, $axios }) {
    try {
      const property = await $axios.get(`/properties/${params.id}`);
      console.log(property.data);

      const user = await $axios({
        method: "GET",
        url: "/users/current",
      });

       console.log(user.data);

      return { property: property.data, user: user.data.user };
    } catch (err) {
      console.log(err);
    }
  },
};
</script>

<style></style>

