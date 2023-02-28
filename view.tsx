import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col, Input, Table, message, Descriptions, DatePicker, Select, Checkbox, Divider, InputNumber } from 'antd'
import CustomerBreadcrumb from '../../components/CustomerBreadcrumb'
import { statusList } from './constant'
import { arrToObj } from './util'
import { guid } from '../../util/common'
import './index.less'
import { ResponseData } from '../../util/request_ts'
import moment from 'moment'
import { viewApi, editApi, ResponseInfo, Info, SendData, getCompanysApi, Company } from './api'

import { getBasicCompanyInfoApi } from '../../util/api/common/company'
import { companyType, Identification } from '../../util/company'

const { Option } = Select
const { RangePicker } = DatePicker
const timeFormat = "YYYY-MM-DD HH:mm:ss"
const defaultCompany = { company_id: 0, company_name: '' }

type CompanyData = ResponseData<Company[]>

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 12,
  },
}


const ReactFC = (props: any) => {
  const refChild = React.createRef()
  const { getFieldDecorator, setFieldsValue, validateFields } = props.form
  const [submitLoading, setSubmitLoading] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false)
  const [allChecked, setAllchecked] = useState(false)
  const [company, setCompany] = useState<Company>({ company_id: 0, company_name: '' })// 所属公司
  const [companys, setCompanys] = useState<Company[]>([]) // 所有公司
  const [storeList, setStoreList] = useState<Company[]>([]) // 门店列表

  const id = props.match.params.id
  const view = props.location.pathname.indexOf('view') !== -1

  const authCompanyId: number = +(window.localStorage.getItem('authCompanyId') as string) * 1
  const userId: number = +(window.localStorage.getItem('userId') as string) * 1
  const adminName: string = window.localStorage.getItem('userName') as string
  const RoleType = companyType(Identification.Product)


  useEffect(() => {
    getCompanys()
  }, [])

  useEffect(() => {
    // if (view) return
    initCompany()
  }, [companys])

  useEffect(() => {
    if (!id) return
    if (!companys.length) return
    getInfo()
  }, [company])

  // 获取公司列表
  const getCompanys = async () => {
    return new Promise(async (resolve, reject) => {
      let res: CompanyData
      res = await getCompanysApi<CompanyData>().then()
      const { error, msg, data } = res
      if (error !== 200) {
        reject({ error, msg, data })
        return
      }
      setCompanys(data)
      resolve({ error, msg, data })
    })
  }

  // 判断是否管理员 判断是否战区
  const initCompany = async () => {
    return new Promise(async (resolve, reject) => {

      const target: Company = companys.find(item => 1 * item.company_id === 1 * authCompanyId * 1) || defaultCompany
      const storeList = (JSON.parse(window.localStorage.getItem('companyConfig') || '{}').sub_company_list) || []

      setCompany(target)
      setStoreList(storeList)
      resolve(1)
    })
  }

  // 详情接口
  const getInfo = async () => {
    const sendData = {
      source: 1,
      company_id: authCompanyId,
      system_notice_id: id,
    }
    let res: ResponseInfo
    res = await viewApi<ResponseInfo>(sendData).then()
    const { error, msg, data: act_info } = res
    if (error !== 0) return message.error(msg)
    const formData = {
      title: act_info.notice_title,
      desc: act_info.notice_desc,
      time: [moment(act_info.start_time), moment(act_info.end_time)],
      sub_company_id: act_info.sub_company_id ? act_info.sub_company_id.split(',').map((i: string) => +i) : []
    }

    setFieldsValue(formData)
  }

  // 返回
  const back = () => {
    props.history.push('/cms/notice')
  }
  // 提交
  const submit = () => {
    validateFields(async (e: any, values: any) => {
      if (!e) {
        const sendData = {
          system_notice_id: id,
          source: 1,
          company_id: authCompanyId * 1 === 0 ? values('company_id') : company.company_id,
          sub_company_id: Array.isArray(values.sub_company_id) ? values.sub_company_id.join(',') : undefined,
          start_time:
            values["time"] && values["time"].length > 0
              ? values["time"][0].format(timeFormat)
              : "", // 开始时间
          end_time:
            values["time"] && values["time"].length > 0
              ? values["time"][1].format(timeFormat)
              : "", // 结束时间
          title: values.title,
          desc: values.desc,
          admin_id: userId,
          admin_name: adminName,
        }
        setSubmitLoading(true)
        let res: ResponseInfo
        res = await editApi<ResponseInfo>(sendData).then()
        setSubmitLoading(false)
        if (res.error !== 0) return message.error(res.msg)
        message.success(res.msg, .5, () => { back() })
      }
    })
  }

  // 切换所属公司
  const handleParentCompanyChange = async (company_id: number) => {
    const { data: { relation: sub_company_list }, error, msg } = await getBasicCompanyInfoApi({
      company_id
    })
    if (error !== 0) {
      return message.error(msg)
    }
    setStoreList(sub_company_list)
  }

  // 门店全选
  const selectAllCompany = (event: Event) => {
    const checked = event.target.checked
    let sub_company_id = props.form.getFieldValue('sub_company_id') || []
    let ids = storeList.map(item => item.company_id + '')
    setAllchecked(checked)
    setIndeterminate(false)

    if (checked === true) {
      refChild.current && refChild.current.blur()
      props.form.setFieldsValue({
        sub_company_id: [...new Set([...sub_company_id, ...ids])],
      })
    } else if (event.target.checked === false) {
      let store = sub_company_id.filter(item => !ids.includes(item))
      props.form.setFieldsValue({
        sub_company_id: store,
      })
    }
  }
  // 选择门店
  const onChangeSelect = (checkedValue: string[]) => {//单选
    let flag = storeList.every(item => checkedValue.includes(item.company_id + ''))
    let indeterminate = filterCompany(flag, storeList, checkedValue)
    setIndeterminate(checkedValue.length && indeterminate.length)
    setAllchecked(flag)
  }
  const filterCompany = (flag: boolean, data: Company[], checkedValue: string[]) => {
    let indeterminate = []
    if (!flag) {
      indeterminate = data.length && data.filter(item => checkedValue.includes(item.company_id + ''))
    }
    return indeterminate
  }

  return <>
    <CustomerBreadcrumb className="breadcrumb"></CustomerBreadcrumb>
    <Form {...formItemLayout} style={{ background: '#fff', padding: '24px' }}>
      <Form.Item label="公告标题">
        {
          getFieldDecorator('title', {
            rules: [
              {
                required: true,
                message: '请输入公告标题'
              }
            ]
          })(
            <Input
              placeholder='请输入公告标题'
              maxLength={28}
              disabled={view}
            />
          )
        }
      </Form.Item>
      <Form.Item label="活动时间">
        {getFieldDecorator("time", {
          rules: [
            {
              required: true,
              message: "请选择活动时间",
            },
          ],
        })(
          <RangePicker
            showTime
            placeholder="请选择活动时间"
            format={timeFormat}
            style={{ width: "100%" }}
            disabled={view}
          />
        )}
      </Form.Item>
      {
        company.company_id ?
          <Row style={{ height: '40px', lineHeight: '40px', marginBottom: '24px' }}>
            <Col span={6} style={{ textAlign: 'right' }}>
              <span style={{ color: '#000000d9' }}>所属公司：</span>
            </Col>
            <Col span={12}>
              <span>{company.name}</span>
            </Col>
          </Row>
          :
          <Form.Item label="所属公司">
            {
              getFieldDecorator('company_id', {
                rules: [
                  {
                    required: true,
                    message: '请选择所属公司'
                  }
                ]
              })(
                <Select
                  disabled={view}
                  placeholder='请选择所属公司'
                  onChange={handleParentCompanyChange}
                >
                  {
                    companys.map(item => (
                      <Option value={item.company_id} key={item.company_id}>{item.name}</Option>
                    ))
                  }
                </Select>
              )
            }
          </Form.Item>
      }
      {
        (RoleType !== 1 && RoleType !== 2) ? null :
          <Form.Item label="同步门店">
            {getFieldDecorator(`sub_company_id`, {
              rules: [
                {
                  required: true,
                  message: "请选择同步门店",
                },
              ],
            })(
              <Select
                placeholder='请选择同步门店'
                ref={refChild}
                mode="multiple"
                showArrow
                disabled={view}
                style={{ width: "100%" }}
                onChange={onChangeSelect}
                filterOption={false}
                dropdownRender={(menu) => (
                  <div
                    onMouseDown={(e) => {
                      e.preventDefault()
                      return false
                    }}>
                    {menu}
                    <Divider style={{ margin: '2px 0' }} />
                    <div
                      style={{ padding: '4px 8px 8px 8px', cursor: 'pointer' }}
                    >
                      <Checkbox
                        indeterminate={indeterminate}
                        checked={allChecked}
                        onChange={selectAllCompany}
                      >
                        全选
                      </Checkbox>
                    </div>
                  </div>
                )}
              >
                {storeList && storeList.length && storeList.map((item) => {
                  return <Option key={item.company_id} value={item.company_id}>{item.company_name}</Option>;
                })}
              </Select>
            )}
          </Form.Item>
      }
      <Form.Item label="公告内容">
        {
          getFieldDecorator('desc', {
            rules: [
              {
                required: true,
                message: '请输入公告内容'
              }
            ]
          })(
            <Input.TextArea
              disabled={view}
              placeholder='请输入公告内容'
              rows={6}
              maxLength={112}
            />
          )
        }
      </Form.Item>
      <Form.Item wrapperCol={{ span: 24, offset: 6 }} style={{ paddingBottom: '30px' }}>
        <Button
          onClick={back}
          style={{ width: 80, marginRight: "10px" }}
        >
          取消
        </Button>
        <Button
          type="primary"
          style={{ width: 80 }}
          onClick={submit}
          loading={submitLoading}
          disabled={view || RoleType === 3}
        >
          保存
        </Button>
      </Form.Item>

    </Form>
  </>

}
export default Form.create()(ReactFC)