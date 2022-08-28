<template>
  <v-layout column justify-center align-center class="mt-10">
    <h1>Bem-vindo à Audiomind!</h1>

    <v-card elevation="0" class="mt-10" style="width: 95%; max-width: 600px">
      <v-card-title>Tour pela conta</v-card-title>
      <v-card-text>
        <div class="embed-container">
          <iframe
            src="https://www.youtube.com/embed/STzL91qZkhQ?modestbranding=1&autohide=1&showinfo=0&controls=0autoplay=0"
            frameborder="0"
            allowfullscreen
          ></iframe>
        </div>
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
export default {
  head() {
    return {
      title: "Audiomind",
    };
  },

  middleware: "authenticated",
};
</script>

<style>
.embed-container {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  max-width: 100%;
}
.embed-container iframe,
.embed-container object,
.embed-container embed {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>