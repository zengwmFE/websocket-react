export default (state = "", action) => {
  let newState = "";
  if (action.type === "SAVE_USERNAME") {
    newState = action;
    return newState;
  }
  return state;
};
