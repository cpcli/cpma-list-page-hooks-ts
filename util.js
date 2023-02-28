


export function arrToObj(arr) {
  let obj = {}
  for (let item of arr) {
    if (item.value !== '') {
      obj[item.value] = item.label
    }
  }
  return obj
}
