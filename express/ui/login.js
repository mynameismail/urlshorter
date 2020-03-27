const Login = {
  template: `
    <div id="login">
      <div class="card">
        <div class="card-content">
          <h3>Login</h3>
          <span v-if="message">{{ message }}</span>
          <form @submit.prevent="doLogin">
            <div class="input-field">
              <input
                id="username"
                type="text"
                class="validate"
                v-model="username">
              <label for="username">Username</label>
            </div>
            <div class="input-field">
              <input
                id="password"
                type="password"
                class="validate"
                v-model="password">
              <label for="password">Password</label>
            </div>
            <button class="btn waves-effect waves-light" type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  data: () => ({
    message: '',
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
        this.message = 'Wrong login'
      } else {
        this.message = 'Something error'
      }
    }
  }
}
