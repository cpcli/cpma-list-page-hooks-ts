import send, { ResponseData } from "../../util/request_ts"
import { toLineObj } from '../../util/convert'

import { AxiosResponse } from 'axios'
// export type {ResponseData} from "../../util/request"
export interface Record {
  [key: string]: any
}
export interface ListData<U> { // data error msg 里的data
  lists: U[],
  page?: string,
  total: number
}

// type List = ListData<Record>

interface InfoRecord {
  [k: string]: any
}
export interface Info {
  // [key: string]: any
  lists: InfoRecord[],
  count: any,
  invalid: any,
  price_type: string | number
  submit_user_name: string
  audit_user_name: string
  audit_status: number
  audit_reason: string
  audit_time: string
  create_time: string
  total: string | number
}

// type ResponseDataType = ResponseData<ListData<Record>>

export function getListApi<T>(params = {}) {
  return new Promise((resolve, reject) => {
    send<T>({
      url: `price-audit/lists`,
      method: "GET",
      params: toLineObj(params)
    }).then((res: AxiosResponse<ResponseData<T>>) => { // data error msg AxiosResponse<ResponseData<T>>  
      let { data: { data, error, msg } } = res
      if (error === 0) {
        // resolve({ data, error, msg })
        // res.data.data error msg
        resolve(res.data)
      } else {
        // resolve({ data: [], error, msg })
        resolve(res.data)
      }
    }).catch(e => {
      reject(e)
    })
  })
}
// 详情api
export function viewApi<T>(params = {}) {
  return new Promise((resolve, reject) => {
    send<T>({
      url: `price-audit/info`,
      method: "GET",
      params
    }).then((res: AxiosResponse<ResponseData<T>>) => {
      const { data: { data, error, msg } = {} } = res
      resolve({ data, error, msg })
    }).catch(e => {
      reject(e)
    })
  })
}
// 审核api
export interface SendData {
  id: string,
  audit_reason: string,
  audit_status: string | number
}
export function submitApi<T>(data:SendData) {
  return new Promise((resolve, reject) => {
    send<T>({
      url: `price-audit/audit`,
      method: "POST",
      data
    }).then((res: AxiosResponse<ResponseData<T>>) => {
      const { data: { data, error, msg } = {} } = res
      resolve({ data, error, msg })
    }).catch(e => {
      reject(e)
    })
  })
}