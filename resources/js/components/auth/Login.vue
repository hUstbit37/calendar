<template >
  <!-- <div class="col-5 mx-auto py-5 mt-5">
    <h1 class="text-center">Login</h1>
    <div class="card">
      <div class="card-body">
        <div class="form-group">
          <label for>Email</label>
          <input v-model="email" type="email" class="form-control" />
        </div>
        <div class="form-group">
          <label for>Password</label>
          <input v-model="password" type="password" class="form-control" />
        </div>
        <button @click.prevent="login" class="btn btn-primary btn-block">Login</button>
      </div>
    </div>
  </div>-->
  <v-container grid-list-xs style="background-image: url('')">
    <v-card width="500" class="mx-auto mt-5">
      <v-card-title class="pb-0">
        <h1>Login</h1>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="email"
            type="email"
            label="Email"
            prepend-icon="mdi-account-circle"
          />
          <v-text-field
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            prepend-icon="mdi-lock"
            append-icon="mdi-eye-off"
            @click:append="showPassword = !showPassword"
          />
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn @click.prevent="login" color="info">Login</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      showPassword: false,
      email: "",
      password: ""
    };
  },
  methods: {
    login() {
      axios.get("/sanctum/csrf-cookie").then(response => {
        console.log(response);
        axios
          .post("api/login", { email: this.email, password: this.password })
          .then(response => {
            // console.log(response.data.user);
            if (response.data.token) {
              // this.$router.push("/");
            }
          });
      });
      // axios
      //   .post("api/login", { email: this.email, password: this.password })
      //   .then(response => {
      //     console.log(response.data.user);
      //   });
    }
  },
  destroyed() {
    console.log("destroyed");
  }
};
</script>

<style>
</style>