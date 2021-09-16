// @format
export default function allFunctions(contracts) {
  let fns = {};
  for (let [key, impl] of Object.entries(contracts)) {
    fns[key] = impl.abi.filter(({ type }) => type === "function");
  }

  return fns;
}
