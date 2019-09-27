
let defaultAuthorization = ''
let defaultUser = {}

try {
  if (localStorage.authorization_zhaocaibao) {
    defaultAuthorization = localStorage.authorization_zhaocaibao
  }
} catch(e) {}

try {
  if (localStorage.user_zhaocaibao) {
    defaultUser = JSON.parse(window.localStorage.getItem('user_zhaocaibao'));
  }
} catch(e) {}

export default {
  authorization: defaultAuthorization,
  user: defaultUser,
  editableTabsEx:[],
  editableTabsValueEx:'0',
  routers:[],
}
