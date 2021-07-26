export default {
  methods: {
    token() {
      return localStorage.getItem('token') || null
    },
  }
}