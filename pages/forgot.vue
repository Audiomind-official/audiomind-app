<template>
  <v-container fluid>
    <v-row>
      <v-col align="left" justify="center" md="6" class="align-center">
        <img src="/negative-logo.svg" alt="" style="margin: 2rem 0;" />
        <v-card>
          <v-card-title>Recuperar senha</v-card-title>
          <v-card-text>
            <v-alert type="success" v-show="success">
              Um e-mail foi enviado para você com os próximos passos para
              recuperar sua senha.
            </v-alert>
            <v-alert type="error" v-show="error">
              E-mail inválido.
            </v-alert>
            <v-form ref="form" v-model="valid" v-on:keyup.enter="postLogin">
              <v-text-field
                v-model="email"
                label="E-mail"
                required
                :rules="rules.email"
                outlined
              ></v-text-field>
              <v-btn
                :loading="loading"
                rounded
                depressed
                large
                block
                color="primary"
                @click="postLogin"
                :disabled="!valid || !resend"
              >
                <span v-if="seconds != -1">Enviar novamente ({{this.seconds}}s)</span>
                <span v-else>Recuperar senha</span>
              </v-btn>
            </v-form>
          </v-card-text>

          <v-card-actions class="justify-center">
            <v-btn text small to="/login">Voltar</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
const Cookie = process.client ? require("js-cookie") : undefined;

export default {
  layout: "login",
  middleware: "notAuthenticated",

  head() {
    return {
      title: "Redefinir senha"
    };
  },

  data() {
    return {
      valid: false,
      email: "",
      password: "",
      loading: false,
      show: false,
      error: false,
      success: false,
      timer: '',
      resend: true,
      seconds: -1,
      rules: {
        required: [value => !!value || "Obrigatório"],
        min: [v => v.length >= 8 || "Comprimento mínimo de 8 caracteres"],
        email: [
          v => !!v || "E-mail é obrigatório",
          v => /.+@.+/.test(v) || "E-mail inválido"
        ]
      }
    };
  },

  beforeRouteLeave(to, from, next) {
    clearInterval(this.timer);
    next();
  },

  methods: {
    async postLogin({ $axios }) {
      if (!this.$refs.form.validate()) return;

      if (!this.loading) {
        this.loading = true;

        try {
          const auth = await this.$axios({
            url: "/users/password/request",
            method: "POST",
            data: { user: { email: this.email } }
          });

          if (auth.status == 200) {
            this.success = true;
            this.error = false;
            this.loading = false;
            this.resend = false;
            this.seconds = 60;

            this.timer = setInterval(() => {
              this.seconds = this.seconds - 1;

              if (this.seconds == 0) {
                clearInterval(this.timer);
                this.resend = true;
              }
              
            }, 1000)
          }
        } catch (err) {
          this.error = true;
          this.loading = false;
        }
      }
    }
  }
};
</script>
