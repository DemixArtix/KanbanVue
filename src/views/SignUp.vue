<template lang="pug">
  div(
    class="auth-card__block container"
  )
    div(class="row justify-content-center")
      div(class="col-3")
        //h4(class="") Присоединиться
        form(class="auth-card__form" @submit.prevent="onSignUp")
          div(class="auth-card__item form-group")
            label(for="username" class="auth-card__label") username
            input(
              id="username"
              class="auth-card__input form-control"
              :class="[$v.username.$dirty && $v.username.$invalid || message ? 'is-invalid' : $v.username.$dirty && !$v.username.$invalid ? 'is-valid' : '']"
              v-model="username"
              type="text"
              @blur="$v.username.$touch()"
              ref="username"
            )
            div(
              class="auth-card__message"
              v-if="!$v.username.required && $v.username.$dirty"
            ) Введите имя пользователя
            div(
              class="auth-card__message"
              v-else-if="!$v.username.minLength && $v.username.$dirty"
            ) Поле "username" должно содержать минимум 1 символ
            div(
              class="auth-card__message"
              v-else-if="!$v.username.maxLength && $v.username.$dirty"
            ) Поле "username" должно содержать не более 150 символов
            div(
              class="auth-card__message"
              v-else-if="!$v.username.correctName && $v.username.$dirty"
            ) Недопустимые символы в поле "username" Только буквы, цифры и символы @/./+/-/_.
            div(
              class="auth-card__message"
              v-if="message"
            ) {{message}}
          div(class="auth-card__item form-group")
            label(for="email" class="auth-card__label") email
            input(
              class="auth-card__input form-control"
              :class="[$v.email.$dirty && $v.email.$invalid ? 'is-invalid' : $v.email.$dirty && !$v.email.$invalid ? 'is-valid' : '']"
              id="email"
              v-model="email"
              placeholder="not required(необязательно)"
              @blur="$v.email.$touch()"
              type="email")
            div(
              class="auth-card__message"
              v-if="!$v.email.email && $v.email.$dirty"
            ) Должен быть в формате mail@mail.com

          div(class="auth-card__item form-group")
            label(for="password" class="auth-card__label") пароль
            input(
              class="auth-card__input form-control"
              :class="[$v.password.$dirty && $v.password.$invalid ? 'is-invalid' : $v.password.$dirty && !$v.password.$invalid ? 'is-valid' : '']"
              id="password"
              v-model="password"
              @blur="$v.password.$touch()"
              type="password")
            div(
              class="auth-card__message"
              v-if="!$v.password.required && $v.password.$dirty"
            ) Пожалуйста, заполните поле пароль
            div(
              class="auth-card__message"
              v-else-if="!$v.password.minLength && $v.password.$dirty"
            ) Должен содержать минимум 8 символов
            div(
              class="auth-card__message"
              v-else-if="!$v.password.strongPassword && $v.password.$dirty"
            ) Пароль должен состоять из цифр и латинских букв верхнего и нижнего регистра
            div(
              class="auth-card__message"
              v-else-if="!$v.password.maxLength && $v.password.$dirty"
            ) Пароль должен содержать не более 30 символов
          div(class="auth-card__item form-group")
            label(for="passwordRepeat" class="auth-card__label") подтвердите пароль
            input(
              id="passwordRepeat"
              class="auth-card__input form-control"
              :class="[$v.passwordRepeat.$dirty && $v.passwordRepeat.$invalid ? 'is-invalid' : $v.passwordRepeat.$dirty && !$v.passwordRepeat.$invalid ? 'is-valid' : '']"
              v-model="passwordRepeat"
              type="password"
              @blur="$v.passwordRepeat.$touch()"
            )
            div(
              class="auth-card__message"
              v-if="!$v.passwordRepeat.required && $v.passwordRepeat.$dirty"
            ) Введите пароль еще раз
            div(
              class="auth-card__message"
              v-else-if="!$v.passwordRepeat.matchingPasswords && $v.passwordRepeat.$dirty"
            ) Пароли не совпадают

          div(class="auth-card__buttons row")
            div(class="col")
              button(class="auth-card__submit btn btn-dark w-100" type="submit") Регистрация
</template>

<script>
  import { email, required, minLength, maxLength } from 'vuelidate/lib/validators';
  import validation from "@/mixins/validation";
  import api from '@/plugins/api';

  export default {
    name: "SignUp",
    data: () => ({
      username: '',
      email: '',
      password: '',
      passwordRepeat: '',
      message: '',
    }),
    mixins: [validation],
    validations: {
      username: {
        required,
        minLength: minLength(1),
        maxLength: maxLength(150),
        correctName: function(value) {
          return this.regExpTest(
            value,
            /^[\w.@+-]+$/
          )
        }
      },
      email: {
        email,
        maxLength: maxLength(254),
      },
      password: {
        required,
        minLength: minLength(8),
        maxLength: maxLength(128),
        strongPassword: function(value) {
          return this.regExpTest(
            value,
            /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\S+$).{8,}$/
          )
        }
      },
      passwordRepeat: {
        required,
        matchingPasswords: function() {
          return this.password === this.passwordRepeat
        }
      },
    },
    methods: {
      async onSignUp() {
        this.message = '';
        if(this.$v.$invalid) {
          this.$v.$touch();
          return
        }
        const formData = {
          username: this.username,
          email: this.email,
          password: this.password,
        };
        const registration = await api.post('/users/create/', formData)
          .then(res => {
            const { username, token, email} = res.data;
            console.log(res);
            if(res.status === 201) {
              localStorage.setItem('token', token);
              this.$router.push({name: "Kanban"})
            } else {
              console.log('Other status: ', res.status);
            }

          })
          .catch((err) => {
            console.log(err.response.data);
            if(err.response.data.username) {
              this.message = err.response.data.username[0]
            }

          });
      },
    },
    watch: {
      username: function () {
        this.message = '';
      }
    }
  }
</script>

<style lang="sass">
  @import "@/assets/styles/colors"

  .auth-card__message
    font-size: .8em
    text-align: left
    color: #DC3545
  .auth-card__label
    display: block
    text-align: left
    text-transform: capitalize
    color: $textColorCard
  .auth-card__item
    min-height: calc(38px + 24px + 20px)
  .auth-card__input.form-control
    border-radius: 0
    background-color: $inputActive
    color: $textColorCard !important
    &:focus
      background-color: rgba($blue, .5)
      border-color: #86b7fe
      box-shadow: 0 0 0 0.25rem rgba($blue, .25)
  .auth-card__submit.btn

</style>