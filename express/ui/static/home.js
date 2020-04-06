const Home = {
  template: '#home-page',
  data: () => ({
    message: {
      type: '',
      text: ''
    },
    search: '',
    urls: [],
    filteredUrls: [],
    actionData: {
      id: '',
      name: '',
      realUrl: ''
    }
  }),
  computed: {
    baseUrl: function() {
      return window.location.protocol + '//' + window.location.host + '/'
    }
  },
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
        this.filteredUrls = data.data
      } else if (response.status == 401) {
        this.$router.push('/login')
      } else {
        this.message.type = 'error'
        this.message.text = 'Something error'
      }
    },
    doSearch: function() {
      this.filteredUrls = this.urls.filter(url => url.name.includes(this.search) || url.real_url.includes(this.search))
    },
    resetActionData: function() {
      this.actionData.id = ''
      this.actionData.name = ''
      this.actionData.realUrl = ''
    },
    setActionData: function(url) {
      this.resetActionData()
      this.actionData.id = url.id
      this.actionData.name = url.name
      this.actionData.realUrl = url.real_url
    },
    doStore: async function() {
      let basicAuth = localStorage.getItem('basic_auth')
      let response = await fetch('/api/urls', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: this.actionData.name,
          real_url: this.actionData.realUrl
        })
      })
      
      if (response.status == 200) {
        this.resetActionData()
        UIkit.modal('#modal-new').hide()
      } else if (response.status == 401) {
        this.$router.push('/login')
      } else {
        this.message.type = 'error'
        this.message.text = 'Something error'
        setTimeout(() => {
          this.message.type = ''
          this.message.text = ''
        }, 15000)
      }
    },
    doUpdate: async function() {
      let basicAuth = localStorage.getItem('basic_auth')
      let response = await fetch('/api/urls/' + this.actionData.id, {
        method: 'PUT',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: this.actionData.name,
          real_url: this.actionData.realUrl
        })
      })

      if (response.status == 200) {
        this.resetActionData()
        UIkit.modal('#modal-edit').hide()
      } else if (response.status == 401) {
        this.$router.push('/login')
      } else {
        this.message.type = 'error'
        this.message.text = 'Something error'
        setTimeout(() => {
          this.message.type = ''
          this.message.text = ''
        }, 15000)
      }
    },
    doDelete: async function() {
      let basicAuth = localStorage.getItem('basic_auth')
      let response = await fetch('/api/urls/' + this.actionData.id, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.status == 200) {
        this.resetActionData()
        UIkit.modal('#modal-delete').hide()
      } else if (response.status == 401) {
        this.$router.push('/login')
      } else {
        this.message.type = 'error'
        this.message.text = 'Something error'
        setTimeout(() => {
          this.message.type = ''
          this.message.text = ''
        }, 15000)
      }
    },
    copyShortUrl: function(shortUrl) {
      console.log(shortUrl)
    }
  },
  mounted() {
    this.fetchUrls()
  }
}
