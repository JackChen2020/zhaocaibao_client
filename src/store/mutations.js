export default {
  handleAuthorization (state, authorization) {
    state.authorization = authorization
    try {
      localStorage.authorization_zhaocaibao = authorization
    } catch(e) {}
  },
  handleUser(state,user){
    state.user = user
    try {
      localStorage.setItem('user_zhaocaibao', JSON.stringify(user))
    } catch(e) {}
  },
  handleEditableTabsEx(state,editableTabs){
    state.editableTabsEx = editableTabs
  },
  handleEditableTabsValueEx(state,editableTabsValue){
    state.editableTabsValueEx = editableTabsValue
  },
  handlerRouters(state,routers){
    state.routers = routers
  }
}
