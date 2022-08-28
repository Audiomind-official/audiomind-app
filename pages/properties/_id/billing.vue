<template>
  <v-container>
    <h1>Cobranças</h1>

    <v-card elevation="0" class="mt-4" v-if="property.subscription.amount">
      <v-card-title>Plano atual</v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <small>Código do plano</small>
            <h2>{{property.subscription.plan.code}}</h2>
          </v-col>
          <v-col>
            <small>Valor</small>
            <h2>R$ {{(property.subscription.amount/100).toFixed(2)}}</h2>
          </v-col>
          <v-col>
            <small>Método de pagamento</small>
            <h2>{{property.subscription.payment_method}}</h2>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <small>Data de criação</small>
            <h2>{{property.subscription.creation_date.day}}/{{property.subscription.creation_date.month}}/{{property.subscription.creation_date.year}}</h2>
          </v-col>
          <v-col>
            <small>Próxima cobrança</small>
            <h2>{{property.subscription.next_invoice_date.day}}/{{property.subscription.next_invoice_date.month}}/{{property.subscription.next_invoice_date.year}}</h2>
          </v-col>
          <v-col>
            <!--small>Próxima cobrança</small>
            <h2>{{property.subscription.next_invoice_date.day}}/{{property.subscription.next_invoice_date.month}}/{{property.subscription.next_invoice_date.year}}</h2-->
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card elevation="0" class="mt-4" v-else>
      <v-card-title>Nenhum plano cadastrado</v-card-title>
      <v-card-text>Finalize agora sua compra</v-card-text>
    </v-card>

    <v-card elevation="0" class="mt-4" v-if="invoices.length != 0">
      <v-card-title>Faturas</v-card-title>
      <v-card-text>
        <v-card elevation="1" class="mt-4" v-for="invoice in invoices" v-bind:key="invoice._id">
          <v-list-item>
           <!--v-chip class="mr-4">{{invoice.status.description}}</v-chip-->
            <v-list-item-content>
              <v-list-item-title class="headline">#{{invoice.id}}</v-list-item-title>
              <v-list-item-subtitle>{{ $moment(invoice.created_at).calendar() }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-card-text>
            Valor: R$ {{(invoice.amount/100).toFixed(2)}}
            <br />
            <!--Status: {{invoice.status.description}}-->
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>
    <v-card elevation="0" class="mt-4" v-else>
      <v-card-title>Nenhuma cobrança até agora</v-card-title>
    </v-card>
    <v-card elevation="0" class="mt-4">
      <v-card-text>Para cancelar seu plano, entre em contato por e-mail audiomind@trialead.com.br</v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  middleware: "authenticated",
  props: ["property"],
  data() {
    return {
      error: false,
      loading: true,
      options: {
        itemsPerPage: 10,
        page: 1,
      },
      total: 0,

      invoices: [],
    };
  },
  mounted() {
    this.getDataFromApi().then((data) => {
      this.invoices = data.items;
      this.total = data.total || 0;
    });
  },

  methods: {
    async getDataFromApi() {
      this.loading = true;
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;

      try {
        const entries = await this.$axios({
          url: `/properties/${this.property._id}/invoices`,
          method: "GET",
          params: {
            limit: this.options.itemsPerPage,
            page: this.options.page,
          },
        });

        console.log(entries.data);

        const total = entries.data.total_pages;
        let items = entries.data.invoices;

        console.log(entries);

        this.loading = false;
        return { items, total };
      } catch (err) {
        this.error = true;
      }
    },
  },
};
</script>