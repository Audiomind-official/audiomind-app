const cookieparser = process.server ? require("cookieparser") : undefined;

export default function(context) {
  var auth;

  if (context.req) {
    if (context.req.headers.cookie) {
      const parsed = cookieparser.parse(context.req.headers.cookie);

      try {
        auth = parsed.auth;
        context.$axios.setToken(auth, "Token");
      } catch (err) {
        console.log(err);
      }
    }
  }

  if (!context.store.state.auth) {
    return context.redirect("/login");
  } else {
    context.$axios.setToken(context.store.state.auth, "Token");
  }
}
