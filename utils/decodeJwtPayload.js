export const decodeJwtPayload = (token, jwtPayload) => {
  if(token != null) {
    let jwt = token.split(".");
    let payload = atob(jwt[1]);
    jwtPayload.value = JSON.parse(payload);
  }
};