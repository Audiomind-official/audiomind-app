<template>
  <div>
    <header>
      <v-container>
        <v-flex class="justify-space-between">
          <div>
            <h1>Meus sites</h1>
          </div>
          <div>
            <v-btn
              class="mt-4"
              rounded
              depressed
              color="primary"
              to="/properties/new"
            >Adicionar site</v-btn>
          </div>
        </v-flex>
      </v-container>
    </header>
    <v-container>
      <v-row>
        <v-col v-if="properties.length == 0">
          <v-card elevation="0">
            <v-card-text>
              <h1>Adicione seu primeiro site</h1>
              <v-btn
                class="mt-4"
                rounded
                depressed
                color="primary"
                to="/properties/new"
              >Adicionar site</v-btn>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col
          v-for="property in properties"
          v-bind:key="property._id"
          md="4"
          sm="6"
          class="col-12"
        >
          <v-hover>
            <template v-slot="{ hover }">
              <v-card :elevation="hover ? 4 : 0" :to="`/properties/${property._id}`">
                <v-card-title><div :class="{active: property.subscription.status == 'ACTIVE', trial: property.subscription.status == 'TRIAL', property_status: true}">✓</div> {{ property.name }}</v-card-title>
                <v-card-subtitle>{{ property.domain }}</v-card-subtitle>
              </v-card>
            </template>
          </v-hover>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <div class="text-center">
        <v-pagination v-model="options.page" :length="total" elevation="0"></v-pagination>
      </div>
    </v-container>
  </div>
</template>

<script>
export default {
  middleware: "authenticated",
  data() {
    return {
      error: false,
      loading: true,
      properties: [],
      options: {
        itemsPerPage: 21,
        page: 1
      },
      total: 0
    };
  },

  head() {
    return {
      title: "Meus sites"
    };
  },

  watch: {
    options: {
      handler() {
        this.getDataFromApi().then(data => {
          this.properties = data.items;
          this.total = data.total || 0;
        });
      },
      deep: true
    }
  },

  methods: {
    async getDataFromApi() {
      this.loading = true;
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;

      try {
        const properties = await this.$axios({
          url: "/properties",
          method: "GET",
          params: {
            limit: this.options.itemsPerPage,
            page: this.options.page
          }
        });

        const total = properties.data.total_pages;
        let items = properties.data.properties;

        this.loading = false;
        return { items, total };
      } catch (err) {
        this.error = true;
      }
    }
  },

  async asyncData({ $axios }) {
    try {
      const req = await $axios({
        url: "/properties",
        method: "GET",
        params: {
          limit: 21,
          page: 1
        }
      });

      const total = req.data.total_pages;
      let loading = false;

      return { properties: req.data.properties, total, loading };
    } catch (err) {
      console.log(err);
    }
  }
};
</script>

<style scoped>
.property_status {
  width: 1rem;
  height: 1rem;
  margin-right: .5rem;
  border-radius: 50%;
  background: #E3E1E8;
  color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: .5rem;
}
.active {
  background: #44b148!important;
  color: white;
}
.trial {
  background: #b19844!important;
  color: white;
}
</style>