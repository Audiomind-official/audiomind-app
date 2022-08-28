<template>
  <v-container>
    <v-alert type="success" v-show="this.$route.query.event">
      Site verificado com sucesso.
    </v-alert>

    <v-alert type="error" v-show="error">
      Parece que algo deu errado! Atualize esta página e tente novamente.
      <v-btn to="/">Atualizar</v-btn>
    </v-alert>

    <v-alert type="success" v-show="success">
      Informações atualizadas
    </v-alert>

    <v-card elevation="0" class="contain">
      <v-card-title>Opções gerais</v-card-title>
      <v-card-subtitle>ID da propriedade: {{ property._id }}</v-card-subtitle>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-text-field
            label="Nome do site"
            required
            outlined
            v-model="property.name"
          ></v-text-field>
          <v-text-field
            label="Domínio"
            required
            outlined
            :rules="rules.domain"
            hint="Ex.: seudominio.com  |  Sem o www. ou https://"
            :v-on:keydown="(property.domain = transformDomain(property.domain))"
            :v-on:change="(property.domain = transformDomain(property.domain))"
            v-model="property.domain"
            :counter="true"
          ></v-text-field>

          <v-text-field
            label="E-mails de notificação"
            required
            outlined
            v-model="property.notifications"
            hint="Separados por vírgula"
          ></v-text-field>

          <v-btn
            :loading="loading"
            rounded
            depressed
            color="primary"
            @click="confirm"
            :disabled="!valid"
          >
            Atualizar
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
    
    <v-card class="mt-6" elevation="0">
      <v-card-title>Instalar gravador no seu site</v-card-title>
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

    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title class="headline"
          >Tem certeza que deseja atualizar essas informações?</v-card-title
        >

        <v-card-text>
          Mudar o domínio do seu site pode fazer com que o gravador pare de
          funcionar.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text @click="dialog = false">
            Cancelar
          </v-btn>

          <v-btn text @click="update">
            Atualizar informações
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  middleware: "authenticated",
  props: ["property"],
  data() {
    return {
      valid: false,
      loading: false,
      dialog: false,
      success: false,
      error: false,
      notifications: { text: "", show: false },

      rules: {
        domain: [
          v => !!v || "Obrigatório",
          v => v.length >= 5 || "Comprimento mínimo de 5 caracteres",
          v =>
            /^((?!-))(xn--)?[a-z0-9][a-z0-9-_]{0,61}[a-z0-9]{0,1}\.(xn--)?([a-z0-9\-]{1,61}|[a-z0-9-]{1,30}\.[a-z]{2,})$/gim.test(
              v
            ) || "Domínio inválido"
        ]
      }
    };
  },
  methods: {
    confirm() {
      this.dialog = true;
      return;
    },

    transformDomain(input) {
      return input
        .replace(/[|&;$%@#\[\]"<>()!^*+, ]/g, "")
        .replace(/\s+/g, "")
        .replace(/https?:\/\/|www\.|\/$/gim, "")
        .toLowerCase();
    },

    async update() {
      try {
        this.loading = true;
        this.dialog = false;

        const entries = await this.$axios({
          url: `/properties/${this.property._id}`,
          method: "PUT",
          data: {
            property: {
              name: this.property.name,
              domain: this.property.domain,
              notifications: this.property.notifications
            }
          }
        });

        this.loading = false;
        this.success = true;
        this.notifications.show = true;
        this.notifications.text = "Site atualizado com sucesso";
      } catch (err) {
        this.error = true;
        console.log(err)
        this.notifications.show = true;
        this.notifications.text = "Algo deu errado. Tente novamente!";
      }
    }
  }
};
</script>
