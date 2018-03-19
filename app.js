var vm = new Vue({
  el:'#app',
  data: {
      tokens: ["Pippo", "Caio", "Sempronio", "admin"],
      currentToken: "Caio",
      orders: [],
      profit: 0,
      findBy: 'status',
      findByStatus: null,
      findByUser: null,
      newOrder: {
        products: "",
        price:0
      }
  },
  methods: {
      setToken: function(token) {
        this.currentToken = token;
        localStorage.setItem('token', this.currentToken);
        if (this.currentToken === 'admin') {
          this.getAllOrders()
        } else {
          this.getOrders();
        }

      },
      createOrder: function() {
        this.$http.post(`http://localhost:3001/users/orders?token=${this.currentToken}`, this.newOrder)
        .then(function(response) {
            this.newOrder.products = "";
            this.newOrder.price = 0;
            this.getOrders();
        })
      },
      getOrders: function() {
        this.$http.get(`http://localhost:3001/users/orders?token=${this.currentToken}`)
        .then(function(response) {
            console.log("response:", response);
            this.orders = response.body;
        })
      },
      getProfit: function() {
        this.$http.get(`http://localhost:3001/admin/profit?token=${this.currentToken}`)
        .then(function(response) {
            console.log("response:", response);
            this.profit = response.body.profit;
        })
      },
      getAllOrders: function() {
        if (this.findBy === 'status') {
          this.$http.get(`http://localhost:3001/admin/orders?token=${this.currentToken}${ this.findByStatus ? '&status=' + this.findByStatus : '' }`)
          .then(function(response) {
              console.log("response:", response);
              this.orders = response.body;
              this.getProfit();
          })
        } else {
          this.$http.get(`http://localhost:3001/admin/byUser/${this.findByUser}?token=${this.currentToken}`)
          .then(function(response) {
              console.log("response:", response);
              this.orders = response.body;
              this.getProfit();
          })
        }
      },
      deleteOrder: function (id) {
        this.$http.delete(`http://localhost:3001/admin/orders/${id}?token=${this.currentToken}`)
        .then(function(response) {
            console.log("response:", response);
            this.getAllOrders();
        })
      },
      setStatus: function(id, status) {
        this.$http.put(`http://localhost:3001/admin/orders/${id}?token=${this.currentToken}`, {status: status})
        .then(function(response) {
            console.log("response:", response);
            this.getAllOrders();
        })
      }
  },
  created: function() {
      this.currentToken = localStorage.getItem('token');
      if (this.currentToken === 'admin') {
        this.getAllOrders();
      } else {
        this.getOrders();
      }
  }
})
