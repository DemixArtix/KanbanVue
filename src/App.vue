<template>
  <div id="app">
    <div id="nav">
      <router-link class="nav-item btn btn-dark border-0 m-1" v-if="token()" to="/">главная</router-link>
      <router-link class="nav-item btn btn-dark border-0 m-1" v-if="!token()" to="/sign_in">войти</router-link>
      <router-link class="nav-item btn btn-dark border-0 m-1" v-if="!token()" to="/sign_up">присоединиться</router-link>
      <a class="nav-item btn btn-dark border-0 m-1" v-if="token()" @click="onSignOut" >выйти</a>
    </div>
    <router-view/>
  </div>
</template>

<script>
  import getToken from "./mixins/getToken";

  export default {
    data: () => ({}),
    mixins: [getToken],
    methods: {
      onSignOut() {
        localStorage.removeItem('token');
        this.$router.push({name: 'Sign In'})
      },
    }
  }
</script>

<style lang="scss">
  @import "@/assets/styles/colors";

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    background-color: #363A3F;
    min-height: 100vw;
    color: #fff;
  }

  .btn {
    border-radius: 0 !important;
  }



  #nav {
    padding: 30px;

    a {
      /*font-weight: bold;*/
      /*color: #2c3e50;*/

      &.router-link-exact-active {
        background-color: $orange;
        &:hover {
          background-color: darken($orange, 10%);
        }
      }
    }
  }

</style>
