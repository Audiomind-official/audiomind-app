<template>
  <v-container>
    <h1>Gravador</h1>
    <v-row>
      <v-col class="col-6">
        <v-card elevation="0" class="mt-4">
          <v-card-title>Cor do gravador</v-card-title>
          <v-card-text
            class="text-center align-center justify-center"
            style="display: flex"
          >
            <v-color-picker v-model="property.embed.color" flat>
            </v-color-picker>
          </v-card-text>
        </v-card>
        <v-card elevation="0" class="mt-4">
          <v-card-title>Mais opções</v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field
                label="Mensagem de inicial"
                required
                outlined
                v-model="property.embed.messages.initial"
              ></v-text-field>
              <v-text-field
                label="Texto do botão"
                required
                outlined
                v-model="property.embed.messages.button"
              ></v-text-field>
              <v-text-field
                label="Mensagem de instrução"
                required
                outlined
                v-model="property.embed.messages.instructions"
              ></v-text-field>
              <v-text-field
                label="Mensagem de sucesso"
                required
                outlined
                v-model="property.embed.messages.success"
              ></v-text-field>

              <!--Campos a exibir:
              <v-checkbox
                class="ma-0"
                v-model="property.embed.fields.phone"
                :label="`Telefone`"
              ></v-checkbox>

              <v-checkbox
                class="ma-0"
                v-model="property.embed.fields.email"
                :label="`E-mail`"
              ></v-checkbox>

              <v-checkbox
                class="ma-0"
                v-model="property.embed.fields.name"
                :label="`Nome`"
              ></v-checkbox>

              <v-switch
                v-model="showBadge"
                :label="`Mostrar logo da Audiomind`"
                disabled=""
              ></v-switch-->
            </v-form> </v-card-text
        ></v-card>
        <v-btn
          :loading="loading"
          depressed
          large
          block
          color="primary"
          class="mt-4"
          @click="update"
        >
          Atualizar
        </v-btn>
      </v-col>
    </v-row>
    <v-snackbar v-model="notifications.show">
      {{ notifications.text }}
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  props: ["property"],
  data() {
    return {
      color: "#ccc",
      showPhone: true,
      showEmail: true,
      showName: true,
      showBadge: true,
      loading: false,

      notifications: { text: "", show: false },
    };
  },
  methods: {
    async update() {
      try {
        this.loading = true;

        const prop = await this.$axios({
          url: `/properties/${this.property._id}`,
          method: "PUT",
          data: {
            property: {
              embed: this.property.embed,
            },
          },
        });

        this.loading = false;
        this.success = true;
        this.notifications.show = true;
        this.notifications.text = "Gravador atualizado com sucesso";
      } catch (err) {
        this.error = true;
        console.log(err);
        this.notifications.show = true;
        this.notifications.text = "Algo deu errado. Tente novamente!";
      }
    },
  },
};
</script>


<style>
.v-color-picker__input:nth-child(4) {
  display: none !important;
}
</style>