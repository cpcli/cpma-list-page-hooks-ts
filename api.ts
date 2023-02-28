import send, { ResponseData } from "../../util/request_ts"
import { toLineObj } from '../../util/convert'

import { domain } from './config'
import { AxiosResponse } from 'axios'


type Status = 10 | 30 | 40 | 1 | 50
export interface Record {
  status: Status
  [key: string]: any
}
export interface ListData<U> { // data error msg 里的data
  lists?: U[],
  list: U[],
  page?: string,
  total: number
}
export interface SendData {
  [key: string]: any
}
export type ResponseInfo = ResponseData<Info>

export interface Company { company_id: number, company_name: string }
export interface Info {
  notice_title: string,
  notice_desc: string,
  start_time: string,
  end_time: string,
  sub_company_id: string,
  create_time: string
}

// 列表
export function getListApi<T>(data = {}) {
  return new Promise((resolve, reject) => {
    send<T>({
      url: `${domain}/admin/cms/system-notice-list`,
      method: "POST",
      data: toLineObj(data)
    }).then((res: AxiosResponse<ResponseData<T>>) => { // data error msg AxiosResponse<ResponseData<T>>  
      resolve(res.data)
    }).catch(e => {
      reject(e)
    })
  })
}
// 获取详情
export function viewApi<T>(data = {}) {
  return new Promise((resolve, reject) => {
    send<T>({
      url: `${domain}/admin/cms/system-notice-detail`,
      method: "POST",
      data: toLineObj(data)
    }).then((res: AxiosResponse<ResponseData<T>>) => {
      const { data: { data, error, msg } = {} } = res
      resolve({ data, error, msg })
    }).catch(e => {
      reject(e)
    })
  })
}
// 编辑提交
export function editApi<T>(data = {}) {
  return new Promise((resolve, reject) => {
    let api = data.system_notice_id ? 'save' : 'create'
    send<T>({
      url: `${domain}/admin/cms/system-notice-${api}`,
      method: "POST",
      data: toLineObj(data)
    }).then((res: AxiosResponse<ResponseData<T>>) => {
      const { data: { data, error, msg } = {} } = res
      resolve({ data, error, msg })
    }).catch(e => {
      reject(e)
    })
  })
}
// 发布 停用等改状态
export const changeStatusApi = <T>(data = {}) => {
  return new Promise((resolve, reject) => {
    send<T>({
      url: `${domain}/admin/cms/set-system-notice-status`,
      method: "POST",
      data: toLineObj(data)
    }).then((res: AxiosResponse<ResponseData<T>>) => {
      const { data: { error, msg } } = res
      resolve({ error, msg })
    })
  })
}
// 停用
export const stopApi = <T>(data = {}) => {
  return new Promise((resolve, reject) => {
    send<T>({
      url: `${domain}/admin/cms/set-system-notice-status`,
      method: "POST",
      data: toLineObj(data)
    }).then((res: AxiosResponse<ResponseData<T>>) => {
      const { data: { error, msg } } = res
      resolve({ error, msg })
    })
  })
}
// 删除
export const deleteApi = <T>(data = {}) => {
  return new Promise((resolve, reject) => {
    send<T>({
      url: `${domain}/admin/cms/del-system-notice`,
      method: "POST",
      data: toLineObj(data)
    }).then((res: AxiosResponse<ResponseData<T>>) => {
      const { data: { error, msg } } = res
      resolve({ error, msg })
    })
  })
}

// 全部公司
export const getCompanysApi = <T>(data = {}) => {
  return new Promise((resolve, reject) => {
    send<T>({
      url: `basics/company`,
      method: "POST",
      data: toLineObj(data)
    }).then((res: AxiosResponse<ResponseData<T>>) => {
      const { data: { error, msg, data } } = res
      resolve({ error, msg, data })
    }).catch(e => {
      reject(e)
    })
  })
}