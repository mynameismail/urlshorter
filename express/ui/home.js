const Home = {
  template: '#home-page',
  data: () => ({
    message: {
      type: '',
      text: ''
    },
    search: '',
    urls: [],
    filteredUrls: []
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
        this.filteredUrls = data.data
      } else if (response.status == 401) {
        this.$router.push('/login')
      } else {
        this.message = 'Something error'
      }
    },
    doSearch: function() {
      this.filteredUrls = this.urls.filter(url => url.name.includes(this.search) || url.real_url.includes(this.search))
    }
  },
  mounted() {
    this.fetchUrls()

    var elem = document.querySelector('.collapsible.expandable')
    var instance = M.Collapsible.init(elem, {
      accordion: false
    })
  }
}
