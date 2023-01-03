import send, { ResponseData } from "../../util/request_ts"
import { toLineObj } from '../../util/convert'

import { AxiosResponse } from 'axios'
import { number } from "prop-types"
// export type {ResponseData} from "../../util/request"
export interface Record {
  [key: string]: any
}
export interface ListData<U> { // data error msg 里的data
  data: U[],
  total: number
}

export interface RelationUserListInterface{
  full_name: string,
  salesman_id: number,
}

export type TaskInfoInterface = {
  task_id: string,
  name: string,
  time1: string,
  time2: string,
  loop: LoopType,
  loopValue: string | number[],
  reback: number
}

export interface MemberInterface {
  [k: string]: string
}
export interface DetailInterface {
  [key: string]: any,
  task_list: {
    data: TaskInfoInterface[],
    total: number,
  },
}
export type LoopType = 1 | 2 | 3 | 4
export type MemberType = 1 | 2 | 3 | 4

interface AddInterfalce {
  task_group_id?: number | undefined,
  company_id: number | null | string,
  task_group_name: string,
  task_user_type: string,
}
export function addApi<T>(data: AddInterfalce) {
  return new Promise((resolve, reject) => {
    send<T>({
      url: `salesman-task/save-task`,
      method: "POST",
      data: toLineObj(data)
    }).then((res: AxiosResponse<ResponseData<T>>) => {
      let { data: { data, error, msg } } = res
      if (error === 0) {
        resolve(res.data)
      } else {
        resolve(res.data)
      }
    }).catch(e => {
      reject(e)
    })
  })
}
export function getListApi<T>(data = {}) {
  return new Promise((resolve, reject) => {
    send<T>({
      url: `salesman-task/group-list`,
      method: "POST",
      data: toLineObj(data)
    }).then((res: AxiosResponse<ResponseData<T>>) => {
      let { data: { data, error, msg } } = res
      resolve(res.data)
    }).catch(e => {
      reject(e)
    })
  })
}

export function changeStatusApi<T>(data = {}) {
  return new Promise((resolve, reject) => {
    send<T>({
      url: `salesman-task/set-status`,
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
export function detailApi<T>(data = {}) {
  return new Promise((resolve, reject) => {
    send<T>({
      url: `salesman-task/group-detail`,
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
export function salesmanListApi<T>(data = {}) {
  return new Promise((resolve, reject) => {
    send<T>({
      url: `salesman-task/search-sales-man`,
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