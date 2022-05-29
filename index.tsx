import React, { useState, useEffect, useCallback, ReactElement, forwardRef, useImperativeHandle } from 'react'
import { Form, Table, Select, DatePicker, Button, Popconfirm, message, Divider, Row, Col } from 'antd'
import { FormComponentProps } from 'antd/es/form';
import CustomerBreadcrumb from '../../components/CustomerBreadcrumb'
import { priceTypeList, auditStatusList, opTypeList } from './constant'
import { getListApi, Record, ListData, } from './api'
import { ResponseData } from '../../util/request_ts'
import './index.less'

import { arrToObj } from './util'

const { RangePicker } = DatePicker
const { Option } = Select

// type MyList = ListData<Record>


// const PriceVerify = forwardRef<FormComponentProps, FCFormProps>(({ form, onSubmit }, ref) => {
//   useImperativeHandle(ref, () => ({
//     form,
//   }));
//   `...the rest of your form`;
// });

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

const ReactFC = (props: any) => {
  const { getFieldDecorator, resetFields, setFieldsValue, getFieldsValue, validateFields } = props.form
  const [data, setData] = useState<Array<Record>>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState({ page: 1, size: 10 })

  const dateFormat = 'YYYY-MM-DD HH:mm:ss'
  useEffect(() => {
    const getList = async () => {
      const values = getFieldsValue()
      const sendData = {
        page: page.page,
        size: page.size,
        price_type: values.price_type,
        audit_status: values.audit_status,
        audit_start_time:
          values["time"] && values["time"].length > 0
            ? values["time"][0].format(dateFormat)
            : "", // 开始时间
        audit_end_time:
          values["time"] && values["time"].length > 0
            ? values["time"][1].format(dateFormat)
            : "", // 结束时间
      }
      let res: ResponseData<ListData<Record>>
      res = await getListApi<ListData<Record>>(sendData).then()
      if (res.error !== 0) return message.error(res.msg)
      setData(res.data.lists)
      setTotal(res.data.total)
    }
    getList()
  }, [page])

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
  const verify = (record: Record) => {
    props.history.push(`/price/priceverify/verify/${record.id}`)
  }
  const view = (record: Record) => {
    props.history.push(`/price/priceverify/view/${record.id}`)
  }
  const columns = [
    {
      title: '定价类型',
      dataIndex: 'price_type',
      align: 'center' as 'center',
      render: (text: string, record: Record) => {
        return arrToObj(priceTypeList)[text]
      }
    },
    {
      title: '操作类型',
      dataIndex: 'op_type',
      align: 'center' as 'center',
      render: (text: string, record: Record) => {
        return arrToObj(opTypeList)[text]
      }
    },
    {
      title: '提交审核时间',
      dataIndex: 'create_time',
      align: 'center' as 'center',
      render: (text: string, record: Record) => {
        if (!text) {
          return '-'
        }
        return text
      }
    },
    {
      title: '审核人',
      dataIndex: 'audit_user_name',
      align: 'center' as 'center',
    },
    {
      title: '审核时间',
      dataIndex: 'audit_time',
      align: 'center' as 'center',
      render: (text: string, record: Record) => {
        if (!text) {
          return '-'
        }
        return text
      }
    },
    {
      title: '审核状态',
      dataIndex: 'audit_status',
      align: 'center' as 'center',
      render: (text: string, record: Record) => {
        return arrToObj(auditStatusList)[text]
      }
    },
    {
      title: '操作',
      dataIndex: 'op',
      align: 'center' as 'center',
      width: 210,
      render: (text: string, record: Record): ReactElement => {
        const { audit_status } = record
        const op = 1 * audit_status === 1 ? <span className='priceverify-list-op-style' onClick={() => { verify(record) }}>审核</span>
          : <span className='priceverify-list-op-style' onClick={() => { view(record) }}>查看</span>
        return op
      }
    },
  ]


  return <>
    <CustomerBreadcrumb className="breadcrumb"></CustomerBreadcrumb>
    <Form style={{ backgroundColor: "#fff" }}  {...formItemLayout}>
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
                {priceTypeList.map((item, index) => {
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
                {auditStatusList.map((item, index) => {
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
    </Form>
    <Table
      style={{ marginTop: '10px', backgroundColor: '#fff', padding: '24px' }}
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
  </>
}

export default Form.create()(ReactFC)
