const Login = {
  template: '#login-page',
  data: () => ({
    message: {
      type: '',
      text: ''
    },
    username: '',
    password: ''
  }),
  methods: {
    doLogin: async function() {
      let response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'username': this.username,
          'password': this.password
        })
      })
      if (response.status == 200) {
        let basicAuth = btoa(`${this.username}:${this.password}`)
        localStorage.setItem('basic_auth', basicAuth)
        this.$router.push('/')
      } else if (response.status == 401) {
        this.message.text = 'Wrong login'
        this.message.type = 'error'
        setTimeout(() => {
          this.message.type = ''
          this.message.text = ''
        }, 15000)
      } else {
        this.message.text = 'Something error'
        this.message.type = 'error'
        setTimeout(() => {
          this.message.type = ''
          this.message.text = ''
        }, 15000)
      }
    }
  }
}
