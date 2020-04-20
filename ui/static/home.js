const Home = {
  template: '#home-page',
  data: () => ({
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
      let basicAuth = localStorage.getItem('basic-auth')
      let response = await fetch('/api/urls', {
        headers: {
          'Authorization': `Basic ${basicAuth}`
        }
      })

      if (response.status == 200) {
        let data = await response.json()
        this.urls = data.data
        this.doSearch()
      } else if (response.status == 401) {
        this.$router.push('/login')
      } else {
        UIkit.notification({
          message: `<span class="uk-text-light">Something error</span>`,
          status: 'danger',
          pos: 'bottom-center',
          timeout: 3000
        })
      }
    },
    doSearch: function() {
      this.filteredUrls = this.urls.filter(url => {
        let lowerSearch = this.search.toLowerCase()
        let lowerUrlName = url.name.toLowerCase()
        let lowerRealUrl = url.real_url.toLowerCase()
        return lowerUrlName.includes(lowerSearch) || lowerRealUrl.includes(lowerSearch)
      })
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
      let basicAuth = localStorage.getItem('basic-auth')
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
        this.fetchUrls()
      } else if (response.status == 401) {
        this.$router.push('/login')
      } else {
        UIkit.notification({
          message: `<span class="uk-text-light">Something error</span>`,
          status: 'danger',
          pos: 'bottom-center',
          timeout: 3000
        })
      }
    },
    doUpdate: async function() {
      let basicAuth = localStorage.getItem('basic-auth')
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
        this.fetchUrls()
      } else if (response.status == 401) {
        this.$router.push('/login')
      } else {
        UIkit.notification({
          message: `<span class="uk-text-light">Something error</span>`,
          status: 'danger',
          pos: 'bottom-center',
          timeout: 3000
        })
      }
    },
    doDelete: async function() {
      let basicAuth = localStorage.getItem('basic-auth')
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
        this.fetchUrls()
      } else if (response.status == 401) {
        this.$router.push('/login')
      } else {
        UIkit.notification({
          message: `<span class="uk-text-light">Something error</span>`,
          status: 'danger',
          pos: 'bottom-center',
          timeout: 3000
        })
      }
    },
    copyShortUrl: function(url) {
      let shortUrl = document.createElement('textarea')
      shortUrl.value = url
      document.body.appendChild(shortUrl)
      shortUrl.select()
      shortUrl.setSelectionRange(0, 99999)
      document.execCommand('copy')
      document.body.removeChild(shortUrl)

      UIkit.notification({
        message: `<span class="uk-text-light">Short url copied</span>`,
        pos: 'bottom-center',
        timeout: 3000
      })
    },
    logout: function() {
      localStorage.removeItem('basic-auth')
      this.$router.push('/login')
    }
  },
  mounted() {
    this.fetchUrls()
  }
}
