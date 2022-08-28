<template>
  <v-container fluid>
    <v-row>
      <v-col align="left" justify="center" md="6" class="align-center">
        <img src="/negative-logo.svg" alt="" style="margin: 2rem 0" />
        <v-card>
          <v-card-title>Criar conta</v-card-title>
          <v-card-text>
            <v-alert type="error" v-show="error">
              {{error}}
            </v-alert>
            <v-form ref="form" v-model="valid" v-on:keyup.enter="postLogin">
              <v-text-field
                v-model="email"
                label="E-mail"
                required
                :rules="rules.email"
                outlined
                :v-on:keydown="(email = transformEmail(email))"
                :v-on:change="(email = transformEmail(email))"
              ></v-text-field>
              <v-text-field
                v-model="fullname"
                label="Nome completo"
                required
                :rules="rules.fullname"
                outlined
              ></v-text-field>
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
                Finalizar cadastro
              </v-btn>
            </v-form>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn text small to="/login">Já tenho conta</v-btn>
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
      title: "Entrar",
    };
  },

  data() {
    return {
      valid: false,
      email: "",
      password: "",
      fullname: "",
      loading: false,
      show: false,
      error: null,
      rules: {
        required: [(value) => !!value || "Obrigatório"],
        min: [(v) => v.length >= 8 || "Comprimento mínimo de 8 caracteres"],
        fullname: [
          (v) => v.indexOf(" ") >= 0 || "Inserir nome completo",
        ],
        email: [
          (v) => !!v || "E-mail é obrigatório",
          (v) => /.+@.+/.test(v) || "E-mail inválido",
        ],
      },
    };
  },

  methods: {
    transformEmail(input) {
      return input.replace(" ", "").toLowerCase();
    },
    async postLogin({ $axios }) {
      if (!this.$refs.form.validate()) return;

      if (!this.loading) {
        this.loading = true;
        
        this.email = this.transformEmail(this.email);

        try {
          const auth = await this.$axios({
            url: "/users/register",
            method: "POST",
            data: {
              user: {
                email: this.email,
                password: this.password,
                fullname: this.fullname,
              },
            },
          });

          if (auth.status == 200) {
            this.$store.commit("setAuth", auth.data.user.token); // mutating to store for client rendering
            this.$axios.setHeader(
              "Authorization",
              `Token ${auth.data.user.token}`
            );
            this.$axios.setToken(auth.data.user.token, "Token");
            Cookie.set("auth", auth.data.user.token); // saving token in cookie for server rendering
            this.$router.push("/?event=register");
          }
        } catch (err) {
          this.loading = false;

          if (err.status == 422) {this.error = 'Cadastro inválido. Verifique se suas informações estão corretas ou se seu e-mail já está cadastrado na plataforma.'} else {
            this.error = 'Erro desconhecido. Verifique suas informações e tente novamente.'
          }
        }
      }
    },
  },
};
</script>
