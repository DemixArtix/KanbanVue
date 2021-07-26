<template lang="pug">
  div(
    class="auth-card__block container"
  )
    div(class="row justify-content-center")
      div(class="col-3")
        //h4 Войти
        form(class="auth-card__form container" @submit.prevent="onSignIn")
          div(class="auth-card__item  form-group")
            label(class="auth-card__label") username
            input(
              class="auth-card__input  form-control"
              v-model="username"
              type="username")
          div(class="auth-card__item form-group")
            label(class="auth-card__label") пароль
            input(
              class="auth-card__input form-control"
              v-model="password"
              type="password")
            div(
              class="auth-card__message"
              v-if="message"
            ) {{message}}
          div(class="auth-card__buttons row")
            div(class="col")
              button(class="auth-card__submit  darken button btn btn-dark w-100 border-2" type="submit") Подтвердить
</template>

<script>
  import api from '@/plugins/api';

  export default {
    name: "SignIn",
    data: () => ({
      username: '',
      password: '',
      message: '',
    }),
    computed: {
    },
    methods: {
      async onSignIn() {
        this.message = '';
        const formData = {
          username: this.username,
          password: this.password,
        };
        const login = await api.post('/users/login/', formData)
          .then(res => {
            const { username, password, token } = res.data;
            console.log(res);
            if(res.status === 200) {
              localStorage.setItem('token', token);
              console.log(token);
              this.$router.push({name: "Kanban"})
            } else {
              console.log('Other status: ', res.status);
            }

          })
          .catch((err) => {
            console.log(err.response.data);

            this.message = 'сервер ответил статусом' + err.response.status;

          });
      },
    }
  }
</script>

<style>

</style>