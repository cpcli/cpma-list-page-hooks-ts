import React, { useState, useEffect, useCallback, ReactElement, useRef } from 'react'
import { Form, Table, Select, DatePicker, Button, Popconfirm, message, Divider, Row, Col, Switch, Popover } from 'antd'
import CustomerBreadcrumb from '../../components/CustomerBreadcrumb'
import { rolesList } from './constant'
import { getListApi,changeStatusApi,  Record, ListData,RelationUserListInterface } from './api'
import { ResponseData } from '../../util/request_ts'
import './index.less'
import {listPageParams} from '../../util/storeParmas'
import { arrToObj } from './utils'
import ShowManager from '../../components/ShowManager'

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};
const addShow = () => {
  return +!window.localStorage.getItem('authCompanyId') !== 1
}

const ReactFC:React.FC<any> = (props) => {
  const { getFieldDecorator, resetFields, setFieldsValue, getFieldsValue, validateFields } = props.form
  const [data, setData] = useState<Array<Record>>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState({ page: 1, size: 10 })
  const [search, setSearch] = useState({})


  useEffect(() => {
    let pagination = listPageParams.getParams(props);
    if (pagination) {
      let { currentPage: page, pageSize: size } = pagination;
      setPage({ page, size });
    } else {
      getList()
    }
  }, [page, search])

  const getList = async () => {
    const values = getFieldsValue()
    const sendData = {
      page: page.page,
      page_size: page.size,
    }
    let res: ResponseData<ListData<Record>>
    res = await getListApi<ListData<Record>>(sendData).then()
    if (res.error !== 0) return message.error(res.msg)
    setData(res.data.data)
    setTotal(res.data.total)
  }
  const handleSwitch = async (val: boolean, record: Record) => {
    const sendData = {
      task_group_id: record.task_group_id,
      status: val ? 1 : 2,
    }
    let res: ResponseData<ListData<Record>>
    res = await changeStatusApi(sendData).then()
    if (res.error !== 0){
      message.error(res.msg)
    }else{
      message.success(res.msg)
    }
    setSearch({})
  }

  const submit = useCallback(
    () => {
      setPage({ page: 1, size: 10 })
    },
    [],
  )
  const reset = useCallback(
    () => {
      setPage({ page: 1, size: 10 })
      resetFields()
    },
    [],
  )
  const onPageChange = useCallback(
    (page, size) => {
      setPage({ page, size })
    },
    [],
  )
  const onShowSizeChange = useCallback(
    (page, size) => { // current, pageSize
      setPage({ page, size })
    },
    [],
  )
  const add = (record: Record) => {
    props.history.push(`/salesman/todoList/add`)
  }
  const edit = (record: Record) => {
    let pagination = { currentPage: page.page, pageSize: page.size };
    listPageParams.setParams( props, pagination );
    props.history.push(`/salesman/todoList/edit/${record.task_group_id}`)
  }
  const view = (record: Record) => {
    let pagination = { currentPage: page.page, pageSize: page.size };
    listPageParams.setParams( props, pagination );
    props.history.push(`/salesman/todoList/view/${record.task_group_id}`)
  }
  const columns = [
    {
      title: '任务组名',
      dataIndex: 'task_group_name',
      align: 'center' as 'center'
    },
    {
      title: '角色',
      dataIndex: 'task_user_type',
      align: 'center' as 'center',
      render: (text: string, record: Record) => {
        return arrToObj(rolesList)[text]
      }
    },
    {
      title: '成员',
      dataIndex: 'relation_user_list',
      align: 'center' as 'center',
      render: (text: RelationUserListInterface[], record: Record) => {
        let str: string = text.map(item => item.full_name).join(',')
        let renderText = ''
        if(str.length > 12){
          renderText = str.slice(0,12) + '...'
        }else{
          renderText = str
        }
        return <Popover content={str}>{renderText}</Popover>
      }
    },
    {
      title: '启用状态',
      dataIndex: 'status',
      align: 'center' as 'center',
      width: 100,
      render: (val: number, record: Record) => (
        <Switch
          defaultChecked={val === 1 ? true:false}
          onChange={(val) => { handleSwitch(val, record) }}
        />
      )
    },
    {
      title: '操作',
      dataIndex: 'op',
      align: 'center' as 'center',
      render: (text: string, record: Record): ReactElement => {
        const { } = record
        return <>
          <a onClick={ () => edit( record)}>编辑</a>
          <Divider type='vertical' />
          <a onClick={ () => view( record) }>查看</a>
        </>
      }
    }
  ]
  return <>
    <CustomerBreadcrumb className="breadcrumb"></CustomerBreadcrumb>
    {/* <Form style={{ backgroundColor: "#fff" }}  {...formItemLayout}>
      <Row style={{ padding: '24px 24px 0' }}>
        <Col span={6}>
          <Form.Item label='定价类型'>
            {getFieldDecorator("price_type", {
              initialValue: ''
            })(
              <Select
                style={{ width: "90%" }}
                placeholder="请选择定价类型"
              >
                {rolesList.map((item, index) => {
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
        <Col span={6}>
          <Form.Item label='审核状态'>
            {getFieldDecorator("audit_status", {
              initialValue: ''
            })(
              <Select
                style={{ width: "90%" }}
                placeholder="请选择审核状态"
              >
                {rolesList.map((item, index) => {
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
        <Col span={12}>
          <Form.Item label='审核时间'>
            {getFieldDecorator("time", {
              initialValue: []
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
      </Row>
      <Row style={{ padding: '0 24px 24px' }}>
        <Col offset={18}>
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
    <div style={{ backgroundColor: "#fff",paddingTop:'24px' }}>
      <Row style={{ paddingLeft: 24 }}>
        <Col span={24}>
          <ShowManager show={addShow}>
            <Button type="primary" onClick={add}>
              添加
            </Button>
          </ShowManager>
        </Col>
      </Row>
      <Table
        style={{ padding: '24px' }}
        rowKey={(record) => record.id}
        bordered
        scroll={{ y: 800 }}
        dataSource={data}
        columns={columns}
        pagination={{
          pageSize: page.size,
          total: total,
          current: page.page,
          onChange: onPageChange,
          showSizeChanger: true,
          onShowSizeChange: onShowSizeChange
        }}
      />
    </div>
  </>
}

export default Form.create()(ReactFC)
