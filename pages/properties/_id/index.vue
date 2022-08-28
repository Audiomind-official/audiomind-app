<template>
  <v-container>
    <h1>Relatórios do último período</h1>
    <v-row v-if="status === 'ACTIVE'">
      <v-col class="col-6">
        <v-card elevation="0">
          <v-card-title>Visualizações</v-card-title>
          <v-card-text>
            <span
              style="font-size: 2rem"
              v-if="property?.current_interval?.hits?.used"
              >{{ property.current_interval.hits.used }}</span
            >
            <span style="font-size: 2rem" v-else>{{ seen }}</span>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col class="col-6">
        <v-card elevation="0">
          <v-card-title>Total de tempo gravado</v-card-title>
          <v-card-text>
            <span
              style="font-size: 2rem"
              v-if="property?.current_interval?.seconds_recorded?.used"
            >
              {{ property.current_interval.seconds_recorded.used }}
            </span>

            <span style="font-size: 2rem" v-else>
              {{ total_records_used }}
            </span>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col class="col-6">
        <v-card elevation="0">
          <v-card-title>Total de mensagens enviadas</v-card-title>
          <v-card-text>
            <span
              style="font-size: 2rem"
              v-if="property?.current_interval?.hits?.used"
            >
              {{ property.current_interval.hits.used }}
            </span>
            <span style="font-size: 2rem" v-else>
              {{ sent }}
            </span>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col class="col-6">
        <v-card elevation="0">
          <v-card-title>Total de tempo transcrito</v-card-title>
          <v-card-text
            ><span
              style="font-size: 2rem"
              v-if="property?.current_interval?.seconds_transcripted?.used"
            >
              {{
                formatTime(property.current_interval.seconds_transcripted.used)
              }}</span
            >
            <span style="font-size: 2rem" v-else>
              {{ formatTime(trascripted.toString()) }}</span
            ></v-card-text
          >
        </v-card>
      </v-col>
      <v-col class="col-6">
        <v-card elevation="0">
          <v-card-title>Duração média de cada contato</v-card-title>
          <v-card-text
            ><span
              style="font-size: 2rem"
              v-if="
                property?.current_interval?.seconds_recorded?.used &&
                property?.current_interval?.entries?.used
              "
            >
              {{
                formatTime(
                  property?.current_interval?.seconds_recorded?.used /
                    property?.current_interval?.entries?.used
                )
              }}</span
            >
            <span style="font-size: 2rem" v-else>
              {{ formatTime(duration.toString()) }}</span
            >
          </v-card-text>
        </v-card>
      </v-col>
      <v-col class="col-6">
        <v-card elevation="0">
          <v-card-title>Conversão média</v-card-title>
          <v-card-text
            ><span
              style="font-size: 2rem"
              v-if="
                proper?.current_interval?.entries?.used &&
                proper?.current_interval?.hits?.used
              "
            >
              {{
                (
                  100 *
                  (proper.current_interval.entries.used /
                    proper.current_interval.hits.used)
                ).toFixed()
              }}%</span
            >
            <span style="font-size: 2rem" v-else>
              {{ (100 * converted).toFixed() }}%</span
            >
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <div v-else>
      <v-card class="mt-6" elevation="0">
        <v-card-title>Comece instalando o gravador no seu site</v-card-title>
        <v-card-subtitle
          >Copie o código abaixo e cole dentro do elemento que deseja exibir o
          gravador:</v-card-subtitle
        >
        <v-card-text>
          <pre>
&lt;script src="//app.audiomind.com.br/build/app.bundle.js" id="audiomind-script">&lt;/script>
&lt;script>
  new Audiomind({
    propertyId: "{{ property._id }}",
    onRecorderSubmitted: function() {
      // Evento de conversão GTM
    }
  });
&lt;/script></pre
          >
        </v-card-text>
      </v-card>
    </div>
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
      seen: null,
      total_records_used: null,
      trascripted: null,
      sent: null,
      duration: null,
      converted: null,
      status: "",
      options: {
        itemsPerPage: 21,
        page: 1,
      },
    };
  },

  watch: {
    options: {
      async handler() {
        let response = await this.getDataFromApi();
        this.seen = response.total_seen;
        this.total_records_used = response.total_records_used;
        this.trascripted = response.total_trascriped;
        this.sent = response.total_sent;
        this.duration = response.total_duration;
        this.converted = response.med_converted;
        this.status = response.status;
      },
      deep: true,
    },
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
      console.log(this.property);
    },
    async getDataFromApi() {
      this.loading = true;
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;

      try {
        const proper = await this.$axios({
          url: `/properties/${this.property._id}`,
          method: "GET",
          params: {
            limit: this.options.itemsPerPage,
            page: this.options.page,
          },
        });

        let total_seen = proper.data.current_interval.hits.used;
        let total_records_used =
          proper.data.current_interval.seconds_recorded.used;
        let total_trascriped =
          proper.data.current_interval.seconds_transcripted.used;
        let total_sent = proper.data.current_interval.hits.used;
        let total_duration =
          proper.data.current_interval.seconds_recorded.used /
          proper.data.current_interval.entries.used;
        let med_converted =
          proper.data.current_interval.entries.used /
          proper.data.current_interval.hits.used;
        let status = proper.data.status;

        let obj = {
          total_seen,
          total_records_used,
          total_trascriped,
          total_sent,
          total_duration: !isNaN(total_duration) ? total_duration : 0,
          med_converted,
          status,
        };

        this.loading = false;
        return obj;
      } catch (err) {
        console.log(err.message);
      }
    },
  },

  async mounted() {
    let response = await this.getDataFromApi();
    this.seen = response.total_seen;
    this.total_records_used = response.total_records_used;
    this.trascripted = response.total_trascriped;
    this.sent = response.total_sent;
    this.duration = response.total_duration;
    this.converted = response.med_converted;
    this.status = response.status;
  },
};
</script>

