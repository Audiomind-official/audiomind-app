<template>
  <v-container>
    <h1 class="mt-6 mb-4">Adicionar novo site</h1>
    <v-form ref="form" v-model="valid">
      <v-stepper v-model="e1" :vertical="vertical">
        <v-stepper-step
          :key="`1-step`"
          :complete="e1 > 1"
          :step="1"
          :editable="editable"
        >
          Informações do site
        </v-stepper-step>

        <v-stepper-content :key="`1-content`" :step="1">
          <v-text-field
            class="mt-2"
            label="Nome do site"
            required
            outlined
            :rules="rules.required"
            v-model="property.name"
          ></v-text-field>
          <v-text-field
            label="Domínio"
            required
            outlined
            :rules="rules.domain"
            hide-details="auto"
            hint="Ex.: seudominio.com  |  Sem o www. ou https://"
            :v-on:keydown="(property.domain = transformDomain(property.domain))"
            :v-on:change="(property.domain = transformDomain(property.domain))"
            :v-on:blur="(property.domain = transformDomain(property.domain))"
            v-model="property.domain"
            :counter="true"
          ></v-text-field>

          <v-btn class="mt-4 mb-4" color="primary" @click="nextStep(1)">
            Continuar
          </v-btn>
        </v-stepper-content>

        <v-stepper-step
          :key="`2-step`"
          :complete="e1 > 2"
          :step="2"
          :editable="editable"
        >
          Escolha as integrações
        </v-stepper-step>

        <v-stepper-content :key="`2-content`" :step="2">
          <v-card color="#F7F6F9" elevation="0" class="mb-4">
            <v-card-title>Integração de e-mail</v-card-title>
            <v-card-subtitle
              >Esta integração envia uma mensagem por e-mail a cada novo
              contato</v-card-subtitle
            >
            <v-card-text>
              <v-text-field
                label="E-mails de notificação"
                required
                outlined
                v-model="property.notifications"
                hint="Separados por vírgula"
              ></v-text-field>
            </v-card-text>
          </v-card>

          <v-btn class="mt-4 mb-4" color="primary" @click="nextStep(2)">
            Continuar
          </v-btn>
        </v-stepper-content>

        <v-stepper-step
          :key="`3-step`"
          :complete="e1 > 3"
          :step="3"
          :editable="editable"
          id="3-step"
        >
          Selecione um plano
        </v-stepper-step>

        <v-stepper-content
          :key="`3-content`"
          :step="3"
          style="height: auto; overflow: initial"
        >
          <v-row class="pa-3">
            <v-col class="pa-1">
              <v-chip color="green" text-color="white" small active>
                Mais vendido
              </v-chip>
              <v-card
                class="mt-2"
                v-bind:class="{ active: property.plan == 'basico-v1' }"
                @click="property.plan = 'basico-v1'"
              >
                <v-card-title>Básico</v-card-title>
                <v-card-subtitle>R$99/mês</v-card-subtitle>
                <v-card-text>
                  300.000 visualizações <br />
                  600 envios <br />
                  150 min. de transcrição <br />
                  300 análises de emoção<br />
                </v-card-text>
                <v-card-actions>
                  <v-btn text small :dark="property.plan == 'basico-v1'">{{
                    property.plan == "basico-v1" ? "Ok" : "Selecionar"
                  }}</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>

            <v-col class="pa-1">
              <v-card
                class="mt-9"
                v-bind:class="{ active: property.plan == 'avancado-v1' }"
                @click="property.plan = 'avancado-v1'"
              >
                <v-card-title>Avançado</v-card-title>
                <v-card-subtitle>R$179/mês</v-card-subtitle>
                <v-card-text>
                  600.000 visualizações <br />
                  1.200 envios <br />
                  300 min. de transcrição <br />
                  600 análises de emoção<br
                /></v-card-text>
                <v-card-actions>
                  <v-btn text small :dark="property.plan == 'avancado-v1'">{{
                    property.plan == "avancado-v1" ? "Ok" : "Selecionar"
                  }}</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>

          <div>
            <a @click="showCustomPlan" v-if="hideCustomPlan"
              >Tenho um plano customizado</a
            >
          </div>
          <div v-if="!hideCustomPlan">
            <v-text-field
              label="Código do plano customizado"
              required
              outlined
              v-model="property.plan"
            ></v-text-field>
          </div>

          <v-btn
            class="mt-4 mb-4"
            color="primary"
            @click="createProperty()"
            :disabled="!valid || !property.plan"
            :loading="loading"
          >
            Continuar
          </v-btn>

          <v-alert type="error" v-show="error">
            Parece que algo deu errado! Atualize esta página e tente novamente.
            <v-btn to="/">Atualizar</v-btn>
          </v-alert>
        </v-stepper-content>
      </v-stepper>
    </v-form>
  </v-container>
</template>

<script>
export default {
  middleware: "authenticated",
  head() {
    return {
      title: "Adicionar site",
    };
  },
  data() {
    return {
      e1: 1,
      steps: 3,
      vertical: true,
      editable: true,
      valid: false,
      loading: false,
      error: false,
      hideCustomPlan: true,
      property: {
        name: "",
        domain: "",
        notifications: "",
        plan: null,
      },
      rules: {
        required: [(v) => !!v || "Obrigatório"],
        domain: [
          (v) => !!v || "Obrigatório",
          (v) => v.length >= 5 || "Comprimento mínimo de 5 caracteres",
          (v) =>
            /^((?!-))(xn--)?[a-z0-9][a-z0-9-_]{0,61}[a-z0-9]{0,1}\.(xn--)?([a-z0-9\-]{1,61}|[a-z0-9-]{1,30}\.[a-z]{2,})$/gim.test(
              v
            ) ||
            "Domínio inválido | Sem o www. ou https:// | Não utilizar subdomínio",
        ],
      },
    };
  },

  mounted() {
    console.log(this.$axios());
  },

  watch: {
    steps(val) {
      if (this.e1 > val) {
        this.e1 = val;
      }
    },
    vertical() {
      this.e1 = 2;
      requestAnimationFrame(() => (this.e1 = 1)); // Workarounds
    },
  },

  methods: {
    showCustomPlan() {
      this.hideCustomPlan = false;
    },
    async createProperty() {
      if (!this.$refs.form.validate()) return;

      if (!this.loading) {
        this.loading = true;

        this.property.domain = this.property.domain.replace(
          /https?:\/\/|www\.|\/$/gim,
          ""
        ).replace(' ','');

        try {
          const property = await this.$axios({
            url: "/properties/",
            method: "POST",
            data: { property: this.property },
          });

          if (property.status == 200) {
            if (this.property.plan == "free")
              this.$router.push(`/properties/${property.data._id}`);
            else
              this.$router.push(
                `/checkout/${property.data._id}?plan=${this.property.plan}`
              );
          }
        } catch (err) {
          this.error = true;
          this.loading = false;
        }
      }
    },
    transformDomain(input) {
      return input
        .replace(/[|&;$%@#\[\]"<>()!^*+, ]/g, "")
        .replace(/\s+/g, "")
        .replace(" ", "")
        .toLowerCase();
    },
    onInput(val) {
      this.steps = parseInt(val);
    },
    nextStep(n) {
      if (n === this.steps) {
        this.e1 = 1;
      } else {
        this.e1 = n + 1;
      }
    },
  },
};
</script>

<style>
.active {
  background: #042973 !important;
}

.active div {
  color: white !important;
}

.v-card--link {
  transition: all 0.5s;
}

#3-step .v-stepper__wrapper {
  overflow-x: visible !important;
}
</style>
