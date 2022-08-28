<template>
<v-container>
    <v-alert type="error" v-show="error">
        Parece que algo deu errado! Atualize esta página e tente novamente.
        <v-btn to="/">Atualizar</v-btn>
    </v-alert>

    <v-alert type="success" v-show="success">
        Informações atualizadas
    </v-alert>
    <v-card elevation="0" class="mt-4">
        <v-card-title>Atualizar limites manualmente</v-card-title>
        <v-card-text>
            <v-form ref="form">
                <p class="mb-8">Para fazer um beta com clientes, coloque o status como <b>ACTIVE</b>, código do plano como <b>custom</b> e aumente os limites do plano conforme necessário</p>

                <v-combobox v-model="selected" :items="status" label="Status" outlined></v-combobox>
                <v-text-field label="Código do plano" required outlined v-model="property.subscription.plan.code"></v-text-field>

                <hr class="mb-8">

                <v-text-field label="Visualizações" required outlined v-model="property.current_interval.hits.limit"></v-text-field>
                <v-text-field label="Transcrição (em segundos)" required outlined v-model="property.current_interval.seconds_transcripted.limit"></v-text-field>
                <v-text-field label="Gravações (em segundos)" required outlined v-model="property.current_interval.seconds_recorded.limit"></v-text-field>
                <v-text-field label="Contatos analisados" required outlined v-model="property.current_interval.entries_analysed.limit"></v-text-field>
                <v-text-field label="Contatos enviados" required outlined v-model="property.current_interval.entries.limit"></v-text-field>

                <v-btn @click="update">
                    Atualizar informações
                </v-btn>
            </v-form>
        </v-card-text>
    </v-card>
</v-container>
</template>

<script>
export default {
    middleware: "authenticated",
    props: ["property"],
    data() {
        return {
            loading: false,
            dialog: false,
            success: false,
            error: false,
            selected: [],
            status: ["NOTVERIFIED", "VERIFIED", "ACTIVE", "SUSPENDED", "EXPIRED", "OVERDUE", "CANCELED", "TRIAL"]
        };
    },
    created() {
        this.selected = [this.property.subscription.status];

    },

    async asyncData({ $axios, params, redirect}) {
        try {
            const user = await $axios({
                method: "GET",
                url: "/users/current",
            });

            if (user.data.user.permissions != "ADMIN") return redirect('/')
            
        } catch (err) {
            console.log(err);
        }
    },

    methods: {
        async update() {
            try {
                this.loading = true;
                this.dialog = false;

                const entries = await this.$axios({
                    url: `/properties/${this.property._id}`,
                    method: "PUT",
                    data: {
                        property: {
                            current_interval: this.property.current_interval,
                            subscription: {
                                plan: { code: this.property.subscription.code },
                                status: this.selected.toString()
                            }
                        }
                    }
                });

                this.loading = false;
                this.success = true;

            } catch (err) {
                this.error = true;
                console.log(err)
            }
        }
    }
};
</script>
