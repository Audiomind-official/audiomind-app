<template>
  <div>
    <v-alert type="error" v-show="error">
      Parece que algo deu errado! Atualize esta página e tente novamente.
      <v-btn to="/">Atualizar</v-btn>
    </v-alert>

    <v-container style="min-height: 200px;">
      <v-row class="fill-height" align-content="center" justify="center">
        <v-col v-bind:class="{ loading }" class="subtitle-1 text-center entries" cols="12">
          <v-card v-if="(total == 0) & (loading == false)" elevation="0">
            <v-card-text>
              <h1>Nenhuma entrada até agora</h1>Comece instalando o gravador no seu site para receber contatos!
            </v-card-text>
          </v-card>

          <v-card
            v-for="entry in entries"
            v-bind:key="entry._id"
            :to="`entries/${entry._id}`"
            elevation="0"
            class="justify-space-between mb-2 entry"
            style="display: flex;"
          >
            <div class="pa-6 entry__info" style="display: flex;">
              <div
                v-if="entry.updates[0].sentiment"
                :set="overall_score = (entry.updates[0].sentiment.score * Math.ceil(entry.updates[0].sentiment.magnitude))"
              >
                <img
                  v-if="overall_score < -0.25"
                  src="/emoji-negativo.svg"
                  alt="Negativo"
                  class="mr-4"
                />
                <img
                  v-else-if="overall_score > 0.25"
                  src="/emoji-positivo.svg"
                  alt="Positivo"
                  class="mr-4"
                />
                <img v-else src="/emoji-neutro.svg" alt="Neutro" class="mr-4" />
              </div>
              <div v-else>
                <img src="/emoji-indefinido.svg" alt="Negativo" class="mr-4" />
              </div>
              <div style="line-height: 1;text-align: left;">
                <strong>
                  {{
                  entry.contact.name ||
                  entry.contact.email ||
                  entry.contact.phone
                  }}
                </strong>
                <br />
                <small v-if="entry.property">{{entry.property.name}}</small>
              </div>
            </div>
            <div class="pa-6">
              <span class="pl-10">{{ formatTime(entry.total_duration) }}</span>
              <strong class="ml-10">{{ $moment(entry.created_at).calendar() }}</strong>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <div class="text-center">
      <v-pagination v-model="options.page" :length="total" elevation="0"></v-pagination>
    </div>
  </div>
</template>

<script>
export default {
  middleware: "authenticated",

  head() {
    return {
      title: "Entradas",
    };
  },

  data() {
    return {
      error: false,
      loading: true,
      options: {
        itemsPerPage: 15,
        page: 1,
      },
      total: 0,

      entries: [],
    };
  },

  watch: {
    options: {
      handler() {
        this.getDataFromApi().then((data) => {
          this.entries = data.items;
          this.total = data.total || 0;
        });
      },
      deep: true,
    },
  },

  async asyncData({ $axios }) {
    try {
      const req = await $axios({
        url: "/entries",
        method: "GET",
        params: {
          limit: 15,
          page: 1,
        },
      });

      const total = req.data.total_pages;
      let entries = req.data.entries;
      let loading = false;

      return { entries, total, loading };
    } catch (err) {
      this.error = true;
    }
  },

  methods: {
    formatTime(d) {
      if (d) {
        d = Number(d);

        var m = Math.floor((d % 3600) / 60);
        var s = Math.floor((d % 3600) % 60);

        return ("0" + m).slice(-2) + ":" + ("0" + s).slice(-2);
      }
    },
    log() {
      console.log(this.entries);
    },
    async getDataFromApi() {
      this.loading = true;
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;

      try {
        const entries = await this.$axios({
          url: "/entries",
          method: "GET",
          params: {
            limit: this.options.itemsPerPage,
            page: this.options.page,
          },
        });

        const total = entries.data.total_pages;
        let items = entries.data.entries;

        this.loading = false;
        return { items, total };
      } catch (err) {
        this.error = true;
      }
    },
  },
};
</script>

<style scoped>
.loading {
  opacity: 0.2;
}

.entries {
  transition: opacity 0.3s;
}
</style>
