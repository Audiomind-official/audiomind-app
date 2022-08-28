<template>
  <div>
    <header>
      <v-container>
        <div style="flex">
          <div></div>
          <div>
            <h1>
              {{
              entry.contact.name || entry.contact.email || entry.contact.phone
              }}
            </h1>
            <p v-if="entry.property">{{ entry.property.name }}</p>
          </div>
        </div>
      </v-container>
    </header>

    <div class="flex align-stretch" style="display: flex">
      <div class="flex property-child">
        <v-container>
          <v-row>
            <v-col class="col-7">
              <v-card elevation="0" class="mb-4" v-if="entry.updates[0].speech">
                <v-card-subtitle>Transcrição com confiança de {{ (entry.updates[0].speech[0].confidence*100).toFixed(1)}}%</v-card-subtitle>
                <v-card-text>
                  <p
                    style="font-size:1.5rem; font-style: italic; line-height: 1.2;"
                  >"{{ entry.updates[0].speech[0].transcript}}"</p>
                </v-card-text>
              </v-card>

              <v-card elevation="0" class="mb-4" v-if="entry.updates[0].entities">
                <v-card-subtitle>Palavras-chave</v-card-subtitle>
                <v-card-text>
                  <v-chip
                    v-for="entity in entry.updates[0].entities"
                    :class="entry.type"
                    class="ma-1"
                    v-bind:key="entity.name"
                    label
                  >{{entity.name}}</v-chip>
                </v-card-text>
              </v-card>

              <v-card v-for="update in entry.updates" v-bind:key="update._id" elevation="0">
                <v-card-subtitle>
                  {{ update.type == "file" ? "Audio" : "Comentário" }} |
                  {{ $moment(update.created_at).calendar() }}
                </v-card-subtitle>
                <v-card-text>
                  <client-only placeholder="Carregando audio...">
                    <player :file="update.file.location"></player>
                  </client-only>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col class="col-5">
              <v-card elevation="0" class="mb-4" v-if="entry.updates[0].sentiment.magnitude">
                <v-card-title>
                  Esse áudio foi&nbsp;
                  <span v-if="overall_score < -0.25">negativo</span>
                  <span v-else-if="overall_score > 0.25">positivo</span>
                  <span v-else>neutro</span>
                </v-card-title>
                <v-card-text
                  :set="overall_score = (entry.updates[0].sentiment.score * Math.ceil(entry.updates[0].sentiment.magnitude))"
                >
                  <p>O texto transcrito recebe essa nota analisando o sentimento geral do texto e a intensidade de emoção. Essa mensagem teve um nota sentimento {{entry.updates[0].sentiment.score}} (lembrando que 1 siginifica positivo e -1 negativo) e uma intensidade de {{entry.updates[0].sentiment.magnitude}}</p>

                  <div class="emotions-options">
                    <img
                      :class="{'emotion-check': overall_score > 0.25}"
                      src="/emoji-positivo.svg"
                      alt="Positivo"
                      title="Positivo"
                      class="ma-2"
                      width="42px"
                    />
                    <img
                      :class="{'emotion-check': overall_score < 0.25 & overall_score > -0.25}"
                      src="/emoji-neutro.svg"
                      alt="Neutro"
                      title="Neutro"
                      class="ma-2"
                      width="42px"
                    />
                    <img
                      :class="{'emotion-check': overall_score < -0.25}"
                      src="/emoji-negativo.svg"
                      alt="Negativo"
                      title="Negativo"
                      class="ma-2"
                      width="42px"
                    />
                  </div>
                </v-card-text>
              </v-card>
              <v-card elevation="0">
                <v-card-title>Informações sobre o contato</v-card-title>
                <v-card-text>
                  <v-form>
                    <v-text-field
                      label="Nome"
                      required
                      outlined
                      v-on:blur="update('name')"
                      :loading="loading['name']"
                      :append-icon="show['name'] ? 'mdi-check-circle' : ''"
                      v-model="entry.contact.name"
                    ></v-text-field>

                    <v-text-field
                      label="E-mail"
                      required
                      outlined
                      v-on:blur="update('email')"
                      :loading="loading['email']"
                      :append-icon="show['email'] ? 'mdi-check-circle' : ''"
                      v-model="entry.contact.email"
                    ></v-text-field>

                    <v-text-field
                      label="Telefone"
                      required
                      outlined
                      v-on:blur="update('phone')"
                      @keyup="formatPhone"
                      :loading="loading['phone']"
                      :append-icon="show['phone'] ? 'mdi-check-circle' : ''"
                      v-model="entry.contact.phone"
                    ></v-text-field>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </div>
  </div>
</template>

<script>
import Player from "~/components/Player.vue";

export default {
  middleware: "authenticated",

  components: {
    Player,
  },

  data() {
    return {
      entry: {},
      loading: {
        name: false,
        email: false,
        phone: false,
      },
      show: {
        name: false,
        email: false,
        phone: false,
      },
    };
  },

  methods: {
    formatPhone() {
      this.entry.contact.phone = this.entry.contact.phone
        .slice(0, 15)
        .replace(/\D/g, "")
        .replace(/^(\d{2})(\d)/g, "($1) $2")
        .replace(/(\d)(\d{4})$/, "$1-$2");
    },

    async update(field) {
      let contact = {};

      contact[field] = this.entry.contact[field];

      try {
        this.loading[field] = true;

        const entry = await this.$axios({
          url: `/entries/${this.entry._id}`,
          method: "PUT",
          data: {
            entry: {
              contact: this.entry.contact,
            },
          },
        });

        this.loading[field] = false;
        this.show[field] = true;
      } catch (error) {
        console.log(error);
      }
    },
  },

  head() {
    return {
      title:
        this.entry.contact.name ||
        this.entry.contact.email ||
        this.entry.contact.phone,
    };
  },

  async asyncData({ params, $axios }) {
    try {
      const entry = await $axios.get(`/entries/${params.id}`);
      return { entry: entry.data };
    } catch (err) {
      console.log(err);
    }
  },
};
</script>

<style>
.emotions-options {
  display: flex;
  justify-content: center;
  align-items: center;
}
.emotions-options img {
  opacity: 0.2;
}

.emotion-check {
  opacity: 1 !important;
}
</style>
