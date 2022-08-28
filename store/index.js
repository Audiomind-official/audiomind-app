const cookieparser = process.server ? require('cookieparser') : undefined

export const state = () => {
  return {
    auth: null
  }
}
export const mutations = {
  setAuth (state, auth) {
    state.auth = auth
  }
}

export const actions = {
  nuxtServerInit ({ commit }, { $axios, req }) {

  console.log("🖥 START INIT");
    let auth = null

    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie)
      
      try {
        auth = parsed.auth
      } catch (err) {
        console.log(err)
      }
    }

    $axios.setToken(auth, 'Token')

    commit('setAuth', auth)


  console.log("------------------------ END INIT");
  }
}
