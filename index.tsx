import React, { useState, useEffect, useCallback, ReactElement, forwardRef, useImperativeHandle, useRef } from 'react'
import { Form, Table, Select, DatePicker, Button, Popconfirm, message, Divider, Row, Col, Input } from 'antd'
import { FormComponentProps } from 'antd/es/form';
import CustomerBreadcrumb from '../../components/CustomerBreadcrumb'
import { statusList } from './constant'
import { ResponseInfo, getListApi, Record, ListData, changeStatusApi, deleteApi } from './api'
import { ResponseData } from '../../util/request_ts'
import './index.less'

import {companyType, Identification} from '../../util/company'
import { listPageParams } from '../../util/storeParmas'
import { arrToObj } from './util'
import { guid } from '../../util/common';
import ShowManager from '../../components/ShowManager';

const { RangePicker } = DatePicker
const { Option } = Select
const dateFormat = 'YYYY-MM-DD HH:mm:ss'

const formItemLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 15,
  },
};

const ReactFC = (props: any) => {
  const { getFieldDecorator, resetFields, setFieldsValue, getFieldsValue, validateFields } = props.form
  const [data, setData] = useState<Array<Record>>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState({ page: 1, size: 10 })
  const cachePageParams = useRef({})
  const cacheFormValues = useRef({})

  const authCompanyId = +(window.localStorage.getItem('authCompanyId') as string) * 1
  const RoleType = companyType(Identification.Product)

  useEffect(() => {
    let pagination = listPageParams.getParams(props)
    if (pagination) {
      let { currentPage, pageSize, formParams } = pagination;
      cachePageParams.current = {
        page: currentPage,
        size: pageSize,
      }
      setFieldsValue(formParams)
      cacheFormValues.current = formParams
    } else {
      cachePageParams.current = {}
      cacheFormValues.current = {}
    }
    getList()
  }, [page])

  // 获取列表
  const getList = async () => {
    const values = getFieldsValue()
    const sendData = {
      // page: cachePageParams.current.page ? cachePageParams.current.page : page.page,
      // page_size: cachePageParams.current.size ? cachePageParams.current.size : page.size,

      // price_no: values.price_no,
      // full_name: values.full_name,
      // mobile: values.mobile,
      // customer_type: values.customer_type,
      // customer_name: values.customer_name,
      // terminal_name: values.terminal_name,
      // create_time_start:
      //   values["time"] && values["time"].length > 0
      //     ? values["time"][0].format(dateFormat)
      //     : "", // 开始时间
      // create_time_end:
      //   values["time"] && values["time"].length > 0
      //     ? values["time"][1].format(dateFormat)
      //     : "", // 结束时间
      source: 1,
      company_id: authCompanyId,
      page: page.page,
      page_size: page.size,
      // status: '',
      // title: '',
      // start_time: '',
      // end_time: '',
    }
    let res: ResponseData<ListData<Record>>
    res = await getListApi<ListData<Record>>(sendData).then()
    if (res.error !== 0) return message.error(res.msg)
    setData(res.data.list)
    setTotal(res.data.total)
  }

  // 搜索
  const submit = useCallback(
    () => {
      setPage({ page: 1, size: 10 })
    },
    [],
  )
  // 重置
  const reset = useCallback(
    () => {
      setPage({ page: 1, size: 10 })
      resetFields()
    },
    [],
  )

  // 分页
  const onPageChange = useCallback(
    (page, size) => {
      setPage({ page, size })
    },
    [],
  )

  // 每页条目
  const onShowSizeChange = useCallback(
    (page, size) => {
      setPage({ page, size })
    },
    [],
  )
  // 新增
  const handleAdd = async () => {
    props.history.push(`/cms/notice/add`)
  }
  // 查看
  const view = (record: Record) => {
    const { getFieldsValue } = props.form
    let pagination = { currentPage: page.page, pageSize: page.size };
    listPageParams.setParams({
      location: props.location,
      form: {
        getFieldsValue: getFieldsValue
      }
    }, pagination);
    props.history.push(`/cms/notice/view/${record.system_notice_id}`)
  }
  // 编辑
  const edit = (record: Record) => {
    const { getFieldsValue } = props.form
    let pagination = { currentPage: page.page, pageSize: page.size };
    listPageParams.setParams({
      location: props.location,
      form: {
        getFieldsValue: getFieldsValue
      }
    }, pagination);
    props.history.push(`/cms/notice/edit/${record.system_notice_id}`)
  }
  // 操作集合
  const handleOp = (record: Record, opKey: Number) => {
    // const { status } = record
    switch (opKey) {
      case 1: // 发布
        emit(record)
        break
      case 2:
        deleteOp(record)
        break
      case 3:
        view(record)
        break
      case 4:
        edit(record)
        break
      case 5: // 禁用
        stop(record)
        break
      default:
    }
  }
  // 发布
  const emit = async (record: Record) => {
    const sendData = {
      system_notice_id: record.system_notice_id,
      status: 20,
      source: 1,
      company_id: authCompanyId
    }
    let res: ResponseInfo
    res = await changeStatusApi(sendData).then()
    const { error, msg, data } = res
    if (error === 0) {
      message.success(msg)
      getList()
    } else {
      message.error(msg)
    }
  }
  // 删除
  const deleteOp = async (record: Record) => {
    const data = {
      source: 1,
      company_id: authCompanyId,
      system_notice_id: record.system_notice_id,
    }
    let res: ResponseInfo
    res = await deleteApi<ResponseInfo>(data).then()
    const {error,msg} = res
    if (error === 0) {
      message.success(msg)
      getList()
    } else {
      message.error(msg)
    }
  }
  // 禁用
  const stop = async (record: Record) => {
    const data = {
      system_notice_id: record.system_notice_id,
      status: 1,
      source: 1,
      company_id: authCompanyId
    }
    let res: ResponseInfo
    res = await changeStatusApi<ResponseInfo>(data).then()
    const { error, msg } = res
    if (error === 0) {
      message.success(msg)
      getList()
    } else {
      message.error(msg)
    }
  }
  const columns = [
    {
      title: '公告ID',
      dataIndex: 'system_notice_id',
      align: 'center' as 'center',
    },
    {
      title: '公告标题',
      dataIndex: 'notice_title',
      align: 'center' as 'center',
    },
    {
      title: '开始时间',
      dataIndex: 'start_time',
      align: 'center' as 'center',
    },
    {
      title: '结束时间',
      dataIndex: 'end_time',
      align: 'center' as 'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center' as 'center',
      render: (text: number, record: Record) => {
        const target = statusList.find(item => item.value === text)
        return target?.label
      }
    },
    {
      title: '创建人',
      dataIndex: 'admin_name',
      align: 'center' as 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      align: 'center' as 'center',
    },
    {
      title: '操作',
      dataIndex: 'op',
      align: 'center' as 'center',
      width: 160,
      fixed: 'right',
      render: (text: string, record: Record) => {
        //  1 禁用 
        // 10 新建待审核 
        // 30 待生效  
        // 40 运行中 
        // 50 已结束

        // 0 审核拒绝 1 禁用 10 新建待审核 20 审核通过 30 待生效 40 已生效 50 已结束
        const opStyle = { color: '#1890ff', cursor: 'pointer', wordBreak: 'keep-all' } as React.CSSProperties
        
        type Key = 1 | 2 | 3 | 4 | 5 | number
        const opTypeMap: {[key: Key]: string} = {
          1: '发布',
          2: '删除',
          3: '查看详情',
          4: '编辑',
          5: '禁用',
        }
        const OpsMap = {
          10: [1, 2, 3, 4],
          30: [3, 5],
          40: [5, 3],
          1: [1, 3, 4, 2],
          50: [3, 2],
        }
        type TextKey = 1 | 2 | 5 | number
        const popConfirmStatus = [1, 2, 5] // 发布 删除 禁用 opTypeMap 1、2、5
        const popConfirmStatusText: {[key: TextKey]: string} = { 1: '发布', 2: '删除', 5: '禁用' } // 发布 删除  禁用 opTypeMap 1、2、5
        const { status } = record
        let ops = OpsMap[status] // 按钮集合
        ops = ops.filter((item: number) => { // 战区子公司没有 发布 删除 编辑 禁用 按钮
          if (RoleType === 3 && ([1, 2, 4, 5].includes(item))) {
            return false
          }
          return true
        })
        if (!Object.keys(OpsMap).includes(status + '')) {
          return '-'
        }
        
        return ops.map((key: Key, index: number) => {
          let op = index === 0 ? null : <Divider type='vertical' />
          if (popConfirmStatus.includes(key)) {
            return <Popconfirm title={`确定${popConfirmStatusText[key]}吗？`} onConfirm={() => { handleOp(record, key) }} key={key}>
              <span style={opStyle} >{op}{opTypeMap[key]}</span>
            </Popconfirm>
          } else {
            return <span style={opStyle} onClick={() => { handleOp(record, key) }} key={key}>{op}{opTypeMap[key]}</span>
          }
        })
      }
    }
  ]

  return <>
    <CustomerBreadcrumb className="breadcrumb"></CustomerBreadcrumb>
    {/* <Form style={{ backgroundColor: "#fff" }}  {...formItemLayout} className='purchase-customer-offer-form'>
      <Row style={{ padding: '24px 24px 0' }}>
        <Col span={8}>
          <Form.Item label='报价单编号'>
            {getFieldDecorator("price_no", {
              initialValue: ''
            })(
              <Input placeholder='请输入报价单编号' />
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='提交人'>
            {getFieldDecorator("full_name", {
              initialValue: ''
            })(
              <Input placeholder='请输入提交人' />
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='提交人手机号'>
            {getFieldDecorator("mobile", {
              initialValue: ''
            })(
              <Input placeholder='请输入提交人手机号' />
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row style={{ padding: '0 24px 0' }}>
        <Col span={8}>
          <Form.Item label='客户类型'>
            {getFieldDecorator("customer_type", {
              initialValue: ''
            })(
              <Select
                placeholder="请选择客户类型"
              >
                {[].map((item, index) => {
                  return (
                    <Option
                      value={item.value}
                      key={item.value}
                    >
                      {item.label}
                    </Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='客户名称'>
            {getFieldDecorator("customer_name", {
              initialValue: ''
            })(
              <Input placeholder='请输入客户名称' />
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='门店名称'>
            {getFieldDecorator("terminal_name", {
              initialValue: ''
            })(
              <Input placeholder='请输入门店名称' />
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row style={{ padding: '0 24px 0' }}>
        <Col span={14}>
          <Form.Item label='提交时间' labelCol={{ span: 4 }} wrapperCol={{ span: 14 }}>
            {getFieldDecorator("time", {
              initialValue: ''
            })(
              <RangePicker
                format={dateFormat}
                showTime={{
                  format: 'HH:mm:ss'
                }}
                style={{ width: '100%' }} />
            )}
          </Form.Item>
        </Col>
        <Col offset={16}>
          <Button
            type="primary"
            htmlType="submit"
            onClick={submit}
            style={{ marginRight: 12, marginLeft: 90 }}
          >
            查询
          </Button>
          <Button onClick={reset} style={{ marginRight: 12 }}>
            重置
          </Button>
        </Col>
      </Row>
    </Form> */}
    <ShowManager show={RoleType !== 3}>
      <Row style={{ marginTop: '10px', padding: '24px 0 0 24px', background: '#fff' }}>
        <Button type='primary' onClick={handleAdd}>新建公告</Button>
      </Row>
    </ShowManager>
    <Table
      style={{ backgroundColor: '#fff', padding: '24px' }}
      rowKey={(record) => record.system_notice_id}
      bordered
      scroll={{ x: 1400, y: 800 }}
      dataSource={data}
      columns={columns}
      pagination={{
        pageSize: cachePageParams.current.size ? cachePageParams.current.size : page.size,
        total: total,
        current: cachePageParams.current.page ? cachePageParams.current.page : page.page,
        onChange: onPageChange,
        showSizeChanger: true,
        onShowSizeChange: onShowSizeChange
      }}
    />
  </>
}

export default Form.create()(ReactFC)
