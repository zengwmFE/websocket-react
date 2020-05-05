const defaultState = {
  ws: null,
  userName: "",
};
function wsReduces(state = defaultState, action) {
  const newState = JSON.parse(JSON.stringify(state));
  console.log(action);
  if (action.type === "SAVE_WS") {
    newState.ws = action.ws;
    return newState;
  }
  if (action.type === "SAVE_USERNAME") {
    newState.userName = action.userName;
    return newState;
  }
  if (action.type === "COMBINE") {
    newState.ws = action.ws;
    newState.userName = action.userName;
    return newState;
  }
  return defaultState;
}

export default wsReduces;
