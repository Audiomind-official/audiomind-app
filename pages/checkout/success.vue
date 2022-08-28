<template>
  <v-container>
    <v-row class="justify-center mt-10">
      <v-col class="col-6 text-center">
        <img src="/success.png" alt="" style="width: 100%; height: auto" />
        <div v-if="$route.query.boleto">
          
          <h1 class="mt-10">Finalize sua compra pagando o boleto</h1>
          <p>
            Os boletos demoram até 3 dias para serem compensados. Enquanto isso você já pode instalar o Gravador Audiomind em seu site!
          </p>
          
          <v-btn :href="$route.query.boleto" target="_blank"
              x-large
            color="primary">Visualizar Boleto</v-btn>
          <v-btn to="/properties">Ver meus sites</v-btn>
        </div>
        <div v-else>
          <h1 class="mt-10">Parabéns!</h1>
          <p>Sua assinatura foi criada com sucesso.</p>
          <p>
            Assim que tivermos a confirmação do seu cartão nós entramos em
            contato. Em breve você vai receber um e-mail com mais detalhes da
            transação.
          </p>
          <v-btn to="/properties">Ver meus sites</v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  head() {
    return {
      title: "Assinatura criada",
    };
  },
};
</script>