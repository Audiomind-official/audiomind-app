const cookieparser = process.server ? require('cookieparser') : undefined

import https from 'https';

export default function(context) {

  context.$axios.setToken(context.store.state.auth, "Token");

  //context.$axios.onRequest(config => {})
  const agent = new https.Agent({
    rejectUnauthorized: false
  });
  context.$axios.onRequest(config => {
      config.httpsAgent = agent;
  });

}