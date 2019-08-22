import axios from 'axios'

export default async ({ Vue }) => {
  Vue.prototype.$axios = axios
  Vue.prototype.$apiserver = 'http://192.168.180.162:3000'
  Vue.prototype.$apilarasys = ''
}
