<template>
  <v-container fluid>
    <v-row>
      <v-col align="left" justify="center" md="6" class="align-center">
        <img src="/negative-logo.svg" alt="" style="margin: 2rem 0;" />
        <v-card>
          <v-card-title>Escolher nova senha</v-card-title>
          <v-card-text>
            <v-alert
              type="success"
              v-show="success"
              class="justify-space-between"
            >
              Senha alterada.
              <v-btn light to="/login">Acessar</v-btn>
            </v-alert>
            <v-alert type="error" v-show="error">
              Token expirado
            </v-alert>
            <v-form
              ref="form"
              v-model="valid"
              v-show="!success"
              v-on:keyup.enter="postLogin"
            >
              <v-text-field
                v-model="password"
                label="Senha"
                required
                :rules="rules.required"
                outlined
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show ? 'text' : 'password'"
                @click:append="show = !show"
              ></v-text-field>
              <v-text-field
                v-model="password2"
                label="Confirme sua senha"
                required
                :rules="rules.password"
                outlined
                type="password"
              ></v-text-field>

              <v-btn
                :loading="loading"
                rounded
                depressed
                large
                block
                color="primary"
                @click="postLogin"
                :disabled="!valid"
              >
                Recuperar senha
              </v-btn>
            </v-form>
          </v-card-text>
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
      password2: "",
      loading: false,
      show: false,
      error: false,
      success: false,
      rules: {
        required: [value => !!value || "Obrigatório"],
        min: [v => v.length >= 8 || "Comprimento mínimo de 8 caracteres"],
        password: [
          v => v == this.password || "Senhas não batem",
          v => v.length >= 8 || "Comprimento mínimo de 8 caracteres"
        ],
        email: [
          v => !!v || "E-mail é obrigatório",
          v => /.+@.+/.test(v) || "E-mail inválido"
        ]
      }
    };
  },

  methods: {
    async postLogin({ $axios }) {
      if (!this.$refs.form.validate()) return;

      if (!this.loading) {
        this.loading = true;

        let token = this.$route.query.token;

        try {
          const auth = await this.$axios({
            url: "/users/password/reset",
            method: "POST",
            data: { password: this.password, token: token }
          });

          if (auth.status == 200) {
            this.success = true;
            this.loading = false;
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

<style>
.v-alert__icon.v-icon {
  margin-top: 5px;
}

.v-alert__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
