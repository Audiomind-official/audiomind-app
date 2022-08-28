<template>
  <v-container>
    <h1>Dados de uso</h1>

    <v-card elevation="0">
      <v-card-title>Período atual</v-card-title>
      <v-card-text>
        <v-row>
          <v-col class="col-6">
            <v-progress-circular
              :set="metric=property.current_interval.seconds_recorded.used/property.current_interval.seconds_recorded.limit"
              size="50"
              :value="metric*100"
              width="4"
              :color="metric < 0.75 ? 'light-blue' : 'red'"
              label="Value - %"
            >{{(metric*100).toFixed()}}%</v-progress-circular>
            Segundos gravados: {{property.current_interval.seconds_recorded.used}}/{{property.current_interval.seconds_recorded.limit}}
          </v-col>
          <v-col class="col-6">
            <v-progress-circular
              :set="metric=property.current_interval.seconds_transcripted.used/property.current_interval.seconds_transcripted.limit"
              size="50"
              :value="metric*100"
              width="4"
              :color="metric < 0.75 ? 'light-blue' : 'red'"
              label="Value - %"
            >{{(metric*100).toFixed()}}%</v-progress-circular>
            Segundos transcritos: {{property.current_interval.seconds_transcripted.used}}/{{property.current_interval.seconds_transcripted.limit}}
          </v-col>
          <v-col class="col-6">
            <v-progress-circular
              :set="metric=property.current_interval.entries_analysed.used/property.current_interval.entries_analysed.limit"
              size="50"
              :value="metric*100"
              width="4"
              :color="metric < 0.75 ? 'light-blue' : 'red'"
              label="Value - %"
            >{{(metric*100).toFixed()}}%</v-progress-circular>
            Análises de sentimento e entidade: {{property.current_interval.entries_analysed.used}}/{{property.current_interval.entries_analysed.limit}}
          </v-col>
          <v-col class="col-6">
            <v-progress-circular
              :set="metric=property.current_interval.entries.used/property.current_interval.entries.limit"
              size="50"
              :value="metric*100"
              width="4"
              :color="metric < 0.75 ? 'light-blue' : 'red'"
              label="Value - %"
            >{{(metric*100).toFixed()}}%</v-progress-circular>
            Mensagens enviadas: {{property.current_interval.entries.used}}/{{property.current_interval.entries.limit}}
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card elevation="0" class="mt-4" v-if="snapshots.length != 0">
      <v-card-title>Períodos anteriores</v-card-title>
      <v-card-text>
        <div v-for="snapshot in snapshots" v-bind:key="snapshot._id">
          {{$moment(snapshot.created_at).calendar()}}
          <div>{{snapshot.interval.entries.used}} mensagens enviadas de {{snapshot.interval.entries.used}} disponíveis</div>
          <div v-if="snapshot.interval.seconds_recorded">{{snapshot.interval.seconds_recorded.used}} mensagens enviadas de {{snapshot.seconds_recorded.entries.used}} disponíveis</div>
          <!--div>{{snapshot.interval.seconds_transcripted.used}} mensagens enviadas de {{snapshot.seconds_transcripted.entries.used}} disponíveis</div>
          <div>{{snapshot.interval.entries_analysed.used}} mensagens enviadas de {{snapshot.entries_analysed.entries.used}} disponíveis</div-->
        </div>
      </v-card-text>
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

      snapshots: [],
    };
  },
  mounted() {
    this.getDataFromApi().then((data) => {
      this.snapshots = data.items;
      this.total = data.total || 0;
    });
  },

  methods: {
    async getDataFromApi() {
      this.loading = true;
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;

      try {
        const entries = await this.$axios({
          url: `/properties/${this.property._id}/history`,
          method: "GET",
          params: {
            limit: this.options.itemsPerPage,
            page: this.options.page,
          },
        });

        const total = entries.data.total_pages;
        let items = entries.data.snapshots;

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