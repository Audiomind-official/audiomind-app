<template>
  <v-container>
    <v-form ref="form" v-model="valid">
      <v-row justify="center" class="mt-12">
        <v-col class="col-4">
          <v-card elevation="0" class="pa-4">
            <v-card-title>Dados do comprador</v-card-title>
            <v-card-text>
              <v-text-field
                label="Nome completo"
                :rules="rules.fullname"
                v-model="customer.fullname"
                required
                outlined
              ></v-text-field>
              <v-text-field
                label="E-mail"
                :rules="rules.email"
                v-model="customer.email"
                v-if="!isUser"
                required
                outlined
              ></v-text-field>
              <v-text-field
                label="CPF"
                required
                outlined
                :rules="rules.required"
                v-model="customer.cpf"
                @keyup="formatCPF"
                hint="Apenas números"
              ></v-text-field>

              <v-text-field
                label="Telefone"
                required
                outlined
                :rules="rules.required"
                @keyup="formatPhone"
                v-model="customer.phone"
              ></v-text-field>

              <v-text-field
                class="col-8"
                v-model="customer.birthday"
                label="Data de Nascimento"
                hint="DD/MM/AAAA"
                required
                :rules="rules.required"
                outlined
                @keyup="formatDate"
              ></v-text-field>
            </v-card-text>
          </v-card>

          <v-card elevation="0" class="pa-4 mt-8">
            <v-card-title>Forma de pagamento</v-card-title>
            <v-card-text>
              <v-radio-group v-model="payment_method">
                <v-radio label="Boleto" value="BOLETO"></v-radio>
                <v-radio
                  label="Cartão de crédito"
                  value="CREDIT_CARD"
                ></v-radio>
              </v-radio-group>

              <div v-if="payment_method == 'CREDIT_CARD'">
                <v-text-field
                  label="Número do cartão"
                  required
                  outlined
                  :rules="rules.required"
                  @keyup="card.flag = getCardFlag(card.number)"
                  v-model="card.number"
                >
                  <img slot="append" :src="`/cards/${card.flag}.svg`" />
                </v-text-field>

                <v-text-field
                  label="Nome impresso no cartão"
                  required
                  outlined
                  v-model="card.holder_name"
                  :rules="rules.required"
                  id="holder"
                ></v-text-field>

                <v-row>
                  <v-col>
                    <v-text-field
                      label="Vencimento"
                      required
                      outlined
                      width="1"
                      v-model="card.expiration"
                      :rules="rules.expiration"
                      hint="MM/AAAA"
                      @keyup="formatExpiration"
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      label="Cód. de segurança"
                      required
                      outlined
                      v-model="card.cvc"
                      :rules="rules.cvc"
                      hint="No verso do cartão"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col class="col-4">
          <v-card elevation="0" class="pa-4">
            <v-card-title>Endereço</v-card-title>
            <v-card-text>
              <v-text-field
                label="CEP"
                required
                outlined
                dense
                :loading="loading_cep"
                :rules="rules.cep"
                @keyup="getCEP"
                v-model="customer.address.zipcode"
                class="col-6"
              ></v-text-field>

              <v-row>
                <v-col class="col-8">
                  <v-text-field
                    label="Endereço"
                    required
                    :rules="rules.required"
                    outlined
                    dense
                    v-model="customer.address.street"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                    label="Número"
                    required
                    :rules="rules.required"
                    outlined
                    dense
                    v-model="customer.address.number"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-text-field
                label="Complemento"
                required
                outlined
                hint="Opcional"
                dense
                v-model="customer.address.complement"
              ></v-text-field>
              <v-text-field
                label="Bairro"
                required
                outlined
                :rules="rules.required"
                dense
                v-model="customer.address.district"
              ></v-text-field>

              <v-text-field
                label="Cidade"
                required
                :rules="rules.required"
                outlined
                dense
                v-model="customer.address.city"
              ></v-text-field>
              <v-text-field
                label="UF"
                required
                :rules="rules.required"
                outlined
                dense
                v-model="customer.address.state"
              ></v-text-field>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col class="col-4">
          <v-alert type="error" v-show="error"
            >Algo deu errado. Revise suas informações e tente
            novamente!</v-alert
          >

          <v-card elevation="0" class="pa-4">
            <v-card-title>Informações do pedido</v-card-title>
            <v-card-text>
              <strong>
                Plano {{ plans[plan].name }}
                <v-chip x-small>14 dias grátis</v-chip>
              </strong>
              <p>R${{ plans[plan].price }}/mês</p>
              <a href="javascript:;" v-on:click="changePlan = true"
                >Escolher outro plano</a
              >

              <v-text-field
                label="Cupom"
                class="mt-4"
                outlined
                dense
                v-model="coupon"
                @keyup="getCoupon"
              ></v-text-field>
              <span v-if="error_coupon">Cupom inválido</span>
              <div v-if="coupon_info.name">
                <v-chip>{{ coupon_info.name }}</v-chip
                ><br />{{ coupon_info.description }}. Este cupom te dá direito a
                <span v-if="coupon_info.discount.type != 'PERCENT'"
                  >R${{ coupon_info.discount.value / 100 }}</span
                ><span v-else>{{ coupon_info.discount.value / 100 }}%</span> de
                desconto por {{ coupon_info.duration.occurrences }} mês(es).
              </div>
            </v-card-text>
          </v-card>

          <v-dialog v-model="dialog" width="500">
            <template v-slot:activator="{ on, attrs }">
              <div class="mt-4">
                <small>
                  Ao clicar em "Finalizar compra" você afirma que concorda com
                  nossos
                  <a v-bind="attrs" v-on="on">termos de uso</a>.
                </small>
              </div>
            </template>
            <v-card>
              <v-card-title class="headline grey lighten-2"
                >TERMOS E CONDIÇÕES DE CONTRATAÇÃO DE ASSINATURAS</v-card-title
              >

              <v-card-text>
                <p class="mt-4">
                  São partes neste instrumento, de um lado, TRIALEAD CONSULTORIA
                  E MARKETING EIRELI, empresa legalmente constituída, com sede
                  em R. Aureliano Guimarães, 172, CEP 05727-160 | São Paulo -
                  SP, inscrita no CNPJ/MF sob número 19.068.388/0001-90,
                  doravanteidentificada simplesmente como AUDIOMIND e, de outro
                  lado, a pessoa física ou jurídica identificada no
                  Cadastramento Eletrônico pelo seu Código de Assinante,
                  doravante identificada simplesmente como ASSINANTE.
                </p>
                <ol>
                  <li>
                    OBJETO DOS TERMOS E CONDIÇÕES. O presente instrumento tem
                    por objeto estabelecer os termos e condições da contratação
                    celebrada entre a AUDIOMIND e o ASSINANTE (Contratante) para
                    a utilização dos serviços de gravação, transcrição e
                    interpretação de áudio por ele contratadas
                    (“Produtos/Serviços”), por meio do aplicativo
                    app.audiomind.com.br .
                    <ol>
                      <li>
                        As informações encontram-se disponíveis ao ASSINANTE no
                        site [app.audiomind.com.br].
                      </li>
                    </ol>
                  </li>

                  <li>
                    CÓDIGO DA ASSINATURA: A AUDIOMIND concederá ao ASSINANTE um
                    “Código de Assinante” para identificação do ASSINANTE junto
                    ao Serviço de Atendimento ao Cliente AUDIOMIND, que será um
                    código pessoal e intransferível com 25 dígitos. O ASSINANTE
                    pode encontrá-lo após a confirmação do seu pedido e quando
                    do envio dos Produtos/Serviços ao ASSINANTE.
                  </li>
                  <li>
                    ENTREGA A entrega dos Produtos/Serviços se iniciará no prazo
                    máximo de 1 semana a contar da data da contratação.
                    <ol>
                      <li>
                        Para que o prazo de início da entrega dos
                        Produtos/Serviços seja observado, o ASSINANTE deverá
                        informar de maneira completa todos os dados de seu
                        endereço:
                        <ul>
                          <li>Logradouro (Ex.: rua, avenida, praça, etc.);</li>
                          <li>Número do imóvel;</li>
                          <li>
                            Eventual complemento (Ex.: apto., casa, fundos,
                            baixos, etc.);
                          </li>
                          <li>bairro;</li>
                          <li>Cidade;</li>
                          <li>Estado;</li>
                          <li>Código de Endereçamento Postal – CEP.</li>
                        </ul>
                      </li>
                    </ol>
                  </li>
                  <li>
                    CONTRATAÇÃO, PREÇOS, FORMAS DE PAGAMENTO: A contratação pelo
                    ASSINANTE deverá ser realizada por meio do “site” da
                    AUDIOMIND, onde constarão todos os Planos de Assinatura
                    disponíveis, bem como suas condições específicas.
                  </li>
                  <ol>
                    <li>
                      O ASSINANTE deverá optar pelo Plano de Assinatura que
                      deseja contratar, sendo certo que suas condições
                      específicas (Valores, Prazos, Condições de Pagamento e
                      etc.) constantes do site passarão a fazer parte integrante
                      e inseparável do presente instrumento.
                    </li>

                    <li>
                      O ASSINANTE expressamente declara e garante, para todos os
                      fins de direito:
                    </li>
                    (I) possuir capacidade jurídica para celebrar este
                    instrumento e para utilizar o Produto/ Serviço; (II)
                    reconhecer que o presente instrumento se formaliza,
                    vinculando as partes, com a confirmação contratual, o que se
                    fará mediante o clique no espaço reservado paratanto no site
                    da AUDIOMIND.
                    <li>
                      Como contraprestação pelo objeto deste contrato, o
                      ASSINANTE deverá pagar à AUDIOMIND a quantia
                      correspondente ao Plano contratado, conforme opção
                      realizada na hora da compra e vigente no ato da compra.
                    </li>
                    <li>
                      A forma de pagamento será escolhida pelo ASSINANTE dentre
                      as constantes do “site” para o Plano escolhido, onde
                      constarão também a periodicidade da cobrança e eventuais
                      penalidades aplicáveis.
                    </li>
                  </ol>
                  <li>
                    BANCO DE DADOS. O ASSINANTE se declara ciente de que, a
                    partir da contratação da assinatura de um Produto/Serviço, o
                    mesmo passa a fazer parte do banco de dados da AUDIOMIND,
                    por meio do qual poderá vir a receber informações da
                    AUDIOMIND e de outras empresas idôneas com as quais a mesma
                    possua relacionamento. Se acaso o ASSINANTE não tiver o
                    interesse em receber essas informações, fica assegurado ao
                    mesmo o direito de manifestar sua oposição, bastando que tal
                    decisão seja comunicada para o Serviço de Atendimento ao
                    Cliente AUDIOMIND.
                  </li>
                  5.1. A inviolabilidade e o sigilo dos dados cadastrais de todo
                  os seus ASSINANTES são assegurados pela AUDIOMIND. Todas as
                  suas informações são armazenadas dentro dos mais rígidos
                  critérios de segurança no banco de dados da AUDIOMIND e são
                  tratadas de acordo com a legislação aplicável. Em nenhuma
                  hipótese são fornecidas informações pessoais para terceiros
                  não relacionados à prestação dos serviços, objeto do presente
                  instrumento, somente dados genéricos utilizados para envio de
                  mala direta, e-mail, newsletters e desde que autorizado pelo
                  ASSINANTE.
                  <li>
                    SERVIÇO DE ATENDIMENTO AO ASSINANTE. A AUDIOMIND
                    disponibiliza ao ASSINANTE Serviço de Atendimento e coloca à
                    disposição os seguintes canais de contato:
                  </li>
                  a) Telefone: +55 11 4858-6664 b) Site:
                  https://audiomind.com.br/ c) Endereço: R. Aureliano Guimarães,
                  172 05727-160 | São Paulo - SP Periodicidade de funcionamento
                  (dias e horários): Segunda a sexta-feira em horário comercial.
                  Exceto feriados.
                  <li>
                    PRAZO. Este instrumento é celebrado pelo prazo
                    indetermindado, conforme opção do ASSINANTE no site da
                    AUDIOMIND, sendo prorrogado por períodos iguais, por meio da
                    renovação facilitada, conforme procedimento previsto no
                    próximo item.
                  </li>
                  <li>
                    PROCEDIMENTO DE RENOVAÇÃO: AUDIOMIND adota o procedimento de
                    renovação programada da assinatura, dirigido exclusivamente
                    ao ASSINANTE, assegurando facilidade e agilidade na
                    renovação.
                    <ol>
                      <li>
                        No prazo mínimo de [30 dias] antes do término de sua
                        assinatura, a AUDIOMIND enviará ao ASSINANTE
                        comunicações para relembrá-lo da possibilidade de
                        renovação, nas quais irão constar todas as informações
                        relativas ao novo período de vigência contratual, que
                        somente poderá ser renovado mediante confirmação do
                        ASSINANTE.
                      </li>
                      <li>
                        Se acaso não for do interesse do ASSINANTE a renovação
                        de sua assinatura, basta que o mesmo responda ou entre
                        em contato com o Serviço de Atendimento ao Cliente
                        AUDIOMIND, de [2ª a 6ª] horário comercial, através do
                        email audiomind@trialead.com.br.
                      </li>
                    </ol>
                  </li>

                  <li>
                    CANCELAMENTO. A AUDIOMIND assegura ao ASSINANTE a
                    possibilidade de cancelamento do presente instrumento a
                    qualquer tempo, mediante aviso prévio por parte do ASSINANTE
                    por meio do e-mail audiomind@trialead.com.br, e consequente
                    devolução do valor proporcional aos Produtos/Serviços ainda
                    não recebidos, se for o caso.
                  </li>
                  <li>
                    RESCISÃO. A assinatura poderá ser cancelada e o presente
                    instrumento rescindido na hipótese de infração contratual,
                    caso a parte infratora não corrija o inadimplemento, após
                    notificação.
                    <ol>
                      <li>
                        Caso o ASSINANTE não pague o valor devido no prazo
                        estipulado em notificação a ser enviada pela AUDIOMIND,
                        o presente instrumento poderá ser rescindido com a
                        imediata suspensão da entrega dos Produtos/Serviços.
                      </li>
                    </ol>
                  </li>

                  <li>
                    ALTERAÇÕES DOS TERMOS E CONDIÇÕES. Quaisquer alterações que
                    impactem em ônus financeiro ao ASSINANTE, serão feitas
                    mediante comunicação prévia ao mesmo, que poderá manifestar
                    a sua concordância, por qualquer meio disponível, renegociar
                    tais alterações ou qualquer das partes poderá denunciá-lo,
                    caso não cheguem a um acordo.
                  </li>
                  <li>
                    FORO. Fica assegurado ao ASSINANTE o direito de, caso
                    necessário, recorrer ao Foro da Comarca em que residir, para
                    quaisquer dúvidas e questões oriundas deste instrumento.
                  </li>
                </ol>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="dialog = false"
                  >Concordo</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-btn
            :loading="loading"
            rounded
            depressed
            large
            block
            color="primary"
            :disabled="!valid"
            class="mt-8"
            @click="finishPayment"
            >Finalizar compra</v-btn
          >
          <div class="text-center" style="opacity: 0.5">
            <small>Todos os pagamentos são processados pela Wirecard</small>
          </div>
        </v-col>
      </v-row>
    </v-form>

    <v-dialog v-model="changePlan" persistent max-width="600">
      <v-card>
        <v-card-text>
          <v-row class="pa-3">
            <v-col class="pa-1">
              <v-chip color="green" text-color="white" small active>
                Mais vendido
              </v-chip>
              <v-card
                class="mt-2"
                v-bind:class="{ active: plan == 'basico-v1' }"
                @click="
                  setPlan('basico-v1');
                  changePlan = false;
                "
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
                  <v-btn text small :dark="plan == 'basico-v1'">{{
                    plan == "basico-v1" ? "Ok" : "Selecionar"
                  }}</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>

            <v-col class="pa-1">
              <v-card
                class="mt-9"
                v-bind:class="{ active: plan == 'avancado-v1' }"
                @click="
                  setPlan('avancado-v1');
                  changePlan = false;
                "
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
                  <v-btn text small :dark="plan == 'avancado-v1'">{{
                    plan == "avancado-v1" ? "Ok" : "Selecionar"
                  }}</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="changePlan = false">
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  head() {
    return {
      title: "Finalizar compra",
    };
  },

  watch: {
    date(val) {
      this.dateFormatted = this.formatDate(this.customer.date);
    },
  },

  data() {
    return {
      dialog: false,
      loading: false,
      changePlan: false,
      error: false,
      loading_cep: false,
      valid: false,
      coupon: "",
      error_coupon: false,
      coupon_info: {},
      plans: {
        "starter-v1": {
          name: "Starter",
          price: "89,00",
        },
        "plus-v1": {
          name: "Plus",
          price: "179,00",
        },
        "business-v1": {
          name: "Business",
          price: "389,00",
        },
        "basico-v1": {
          name: "Básico",
          price: "99,00",
        },
        "avancado-v1": {
          name: "Avançado",
          price: "179,00",
        },
        "homolog-v1": {
          name: "Homolog (Plano limitado para testes)",
          price: "1,00",
        },
      },
      rules: {
        cvc: [
          (v) => v.length >= 3 || "Comprimento mínimo de 3 caracteres",
          (v) => v.length < 5 || "Comprimento máximo de 5 caracteres",
        ],
        cep: [(v) => v.length >= 8 || "Obrigatório"],
        expire: [
          (v) => v.split("/")[0] <= 12 || "Mês inválido",
          (v) => v.split("/")[1] >= 2020 || "Ano inválido",
          (v) => v.split("/")[1] <= 2100 || "Ano inválido",
        ],
        email: [
          (v) => !!v || "E-mail é obrigatório",
          (v) => /.+@.+/.test(v) || "E-mail inválido",
        ],
        fullname: [(v) => v.search(" ") != -1 || "Incluir sobrenome"],
        required: [(v) => v.length > 0 || "Obrigatório"],
      },
      card: {
        number: "",
        holder_name: "",
        expiration: "",
        expiration_month: "",
        expiration_year: "",
        cvc: "",
        flag: false,
      },
      payment_method: null,
      customer: {
        email: "",
        fullname: "",
        cpf: "",
        phone: "",
        phone_area_code: "",
        phone_number: "",
        birthday: "",
        birthdate_day: "",
        birthdate_month: "",
        birthdate_year: "",
        address: {
          street: "",
          number: "",
          complement: "",
          district: "",
          city: "",
          state: "",
          country: "BRA",
          zipcode: "",
        },
      },
    };
  },

  computed: {
    plan_url: function () {
      return this.$route.query.plan;
    },
    isUser: function () {
      return this.user != undefined;
    },
  },

  mounted() {
    if (this.user != undefined) this.customer.email = this.user.email;
  },

  async asyncData({ $axios, params }) {
    try {
      const user = await $axios({
        method: "GET",
        url: "/users/current",
      });

      return { user: user.data.user, property: params.checkout };
    } catch (err) {
      console.log(err);
    }
  },

  created() {
    this.setPlan(this.plan_url);
  },

  methods: {
    setPlan(plan) {
      this.plan = plan;
      console.log(this.plan);
    },
    formatDate(date) {
      this.customer.birthday = this.customer.birthday
        .replace(/\D/g, "")
        .slice(0, 8)
        .replace(/^(\d{2})(\d)/g, "$1/$2")
        .replace(/(\d)(\d{4})$/, "$1/$2");

      this.customer.birthdate_day = this.customer.birthday.split("/")[0];
      this.customer.birthdate_month = this.customer.birthday.split("/")[1];
      this.customer.birthdate_year = this.customer.birthday.split("/")[2];
    },
    formatPhone() {
      this.customer.phone = this.customer.phone
        .slice(0, 15)
        .replace(/\D/g, "")
        .replace(/^(\d{2})(\d)/g, "($1) $2")
        .replace(/(\d)(\d{4})$/, "$1-$2");
      this.customer.phone_area_code = this.customer.phone.slice(1, 3);
      this.customer.phone_number = this.customer.phone
        .slice(4, 15)
        .replace(/\D/g, "");
    },
    formatExpiration() {
      this.card.expiration = this.card.expiration
        .replace(/\D/g, "")
        .slice(0, 6)
        .replace(/^(\d{2})(\d)/g, "$1/$2");

      if (this.card.expiration.length == 7) {
        this.card.expiration_month = this.card.expiration.split("/")[0];
        this.card.expiration_year = this.card.expiration
          .split("/")[1]
          .slice(2, 4);
      }

      if (this.card.expiration.length == 5) {
        this.card.expiration_month = this.card.expiration.split("/")[0];
        this.card.expiration_year = this.card.expiration.split("/")[1];
      }
    },
    formatCPF() {
      this.customer.cpf = this.customer.cpf
        .replace(/\D/g, "")
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    },
    async getCoupon() {
      this.error_coupon = false;
      this.coupon_info = {};
      if (this.coupon.length > 5) {
        try {
          let req = await this.$axios({
            method: "GET",
            url: `/checkout/coupon/${this.coupon}`,
          });

          this.coupon_info = req.data;
          this.error_coupon = false;
        } catch (error) {
          this.error_coupon = true;
        }
      }
    },
    async getCEP() {
      if (
        (this.customer.address.zipcode.length == 8) &
        (this.loading_cep == false)
      ) {
        this.loading_cep = true;

        try {
          let req = await this.$axios({
            method: "GET",
            url: `/checkout/cep/${this.customer.address.zipcode}`,
            auth: null,
          });

          let address = {
            street: req.data.logradouro,
            district: req.data.bairro,
            city: req.data.localidade,
            state: req.data.uf,
            country: "BRA",
            zipcode: req.data.cep,
            number: this.customer.address.number,
          };

          console.log(address);

          this.customer.address = address;

          console.log(req.data);
        } catch (err) {
          this.cep_error = true;
        }

        this.loading_cep = false;
      }
    },
    getCardFlag: function (cardnumber) {
      var cardnumber = cardnumber.replace(/[^0-9]+/g, "");

      var cards = {
        visa: /^4[0-9]{12}(?:[0-9]{3})/,
        mastercard: /^5[1-5][0-9]{14}/,
        diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}/,
        amex: /^3[47][0-9]{13}/,
        discover: /^6(?:011|5[0-9]{2})[0-9]{12}/,
        hipercard: /^(606282\d{10}(\d{3})?)|(3841\d{15})/,
        elo: /^((((636368)|(438935)|(504175)|(451416)|(636297))\d{0,10})|((5067)|(4576)|(4011))\d{0,12})/,
        jcb: /^(?:2131|1800|35\d{3})\d{11}/,
        aura: /^(5078\d{2})(\d{2})(\d{11})$/,
      };

      for (var flag in cards) {
        if (cards[flag].test(cardnumber)) {
          return flag;
        }
      }

      return false;
    },
    async finishPayment() {
      if (!this.loading) {
        try {
          this.loading = true;

          let customer = this.customer;

          customer.cpf = customer.cpf.replace(/\D/g, "");

          let req = await this.$axios({
            method: "POST",
            url: `/checkout/purchase`,
            data: {
              customer: customer,
              plan_code: this.plan,
              credit_card: this.card,
              property: this.property,
              coupon: this.coupon,
              payment_method: this.payment_method,
            },
          });

          this.loading = false;

          if ("boleto" in req.data) {
            this.$router.push(
              `/checkout/success?boleto=${req.data._links.boleto.redirect_href}`
            );

          } else {
            this.$router.push(`/checkout/success`);
          }
        } catch (error) {
          console.log(error);
          this.loading = false;
          this.error = true;
        }
      }
    },
  },
};
</script>

<style>
#holder {
  text-transform: uppercase !important;
}

.active {
  background: #042973 !important;
}

.active * {
  color: white !important;
}
</style>
