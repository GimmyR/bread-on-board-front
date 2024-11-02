export const fetchUsername = (token, username) => {
  if(token != null) {
    let form = new FormData();
    form.append("token", token);

    $fetch("http://localhost:9001/api/account/auth", {
      method: 'POST',
      body: form,
      onResponse({ request, response, options }) {
        if(response.status == 200)
          username.value = response._data;
      }
    });
  }
};