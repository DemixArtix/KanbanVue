<template lang="pug">
  div(class="container")
    div(class="row")
      template(v-for="([name, item], index) of Object.entries(cards)")
        Lane(
          :laneTitle="laneTitles[index]"
          :laneName="name"
          :laneData="item"
          :titleColors="titleColors[index]"
        )
</template>

<script>
  import getToken from "@/mixins/getToken";
  import Lane from "../components/Lane";
  import { mapGetters, mapActions } from 'vuex'
  import api from '@/plugins/api';

  export default {
    name: "Kanban",
    components: {
      Lane
    },
    async created() {
      const cards = await api.get('/cards/',
        {
          headers: {
            'Authorization': `JWT ${this.token()}`,
          }
        }).then(res => {
        this.uploadCards(res.data);
      }).catch(err => {
        localStorage.removeItem('token');
        this.$router.push({name: 'Sign In'});
        console.log(err)
      })
    },
    data: () => ({
      laneTitles:  ['On Hold', 'On Progress', 'Needs Review', 'Approved'],
      titleColors: ["#EE8645", "#3986B6", "#EEC34D", "#4AA265"]
    }),
    computed: {
      ...mapGetters('cards', ['cards'])
    },
    methods: {
      ...mapActions('cards', ['uploadCards'])
    },
    mixins: [getToken],
  }
</script>

<style lang="sass">


</style>
