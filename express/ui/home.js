const Home = {
  template: `
    <div id="home">
      <span v-if="message">{{ message }}</span>
      <ul class="collection with-header">
        <li class="collection-header"><h4>List url</h4></li>
        <li class="collection-item" v-for="url in urls" :key="url.id">
          <div>
            <span class="badge">visited: {{ url.visited }}</span> {{ url.name }}
            <a :href="url.real_url" class="secondary-content"><i class="material-icons">send</i></a>
          </div>
        </li>
      </ul>
    </div>
  `,
  data: () => ({
    message: '',
    urls: []
  }),
  methods: {
    fetchUrls: async function() {
      let basicAuth = localStorage.getItem('basic_auth')
      let response = await fetch('/api/urls', {
        headers: {
          'Authorization': `Basic ${basicAuth}`
        }
      })
      if (response.status == 200) {
        let data = await response.json()
        this.urls = data.data
      } else if (response.status == 401) {
        this.$router.push('/login')
      } else {
        this.message = 'Something error'
      }
    }
  },
  mounted() {
    this.fetchUrls()
  }
}
