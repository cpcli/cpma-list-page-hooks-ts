
interface Item {
  label: string
  value: number | string
}
// type List = Item[]
interface ResultObj{
  [key:string]: string
}

export function arrToObj<T>(arr: Item[]) {
  let obj:ResultObj = {}
  for (let item of arr) {
    if (item.value !== '') {
      obj[item.value] = item.label
    }
  }
  return obj
}
