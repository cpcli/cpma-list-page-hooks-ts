import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col, Input, Table, message, Descriptions } from 'antd'
import CustomerBreadcrumb from '../../components/CustomerBreadcrumb'
import { priceTypeList } from './constant'
import { arrToObj } from './util'
import { guid } from '../../util/common'
import './index.less'
import { ResponseData } from '../../util/request_ts'
import { viewApi, submitApi, Info, SendData } from './api'
const { TextArea } = Input
const MAXSIZE = 99999

type ResponseInfo = ResponseData<Info>
interface Record {
  [k: string]: any,
}


const ReactFC = (props: any) => {
  const { getFieldDecorator, getFieldsValue, validateFields } = props.form
  const [info, setInfo] = useState({} as Info)

  useEffect(() => {
    const getInfo = async () => {
      const sendData = {
        id: props.match.params.id,
        page: 1,
        size: MAXSIZE
      }
      let res:ResponseInfo
      res = await viewApi<ResponseInfo>(sendData).then()
      if (res.error !== 0) return message.error(res.msg)
      res.data.lists = res.data?.lists.map(item => ({
        ...item,
        id: guid()
      }))
      setInfo(res.data)
    }
    getInfo()
  }, [])

  const back = () => {
    props.history.push('/price/priceverify')
  }
  const onSubmit = (audit_status: string | number) => {
    validateFields(async (e: any, values: any) => {
      if (!e) {
        const sendData = {
          id: props.match.params.id,
          audit_reason: values.audit_reason,
          audit_status,
        }
        let res:ResponseInfo
        // const { data, error, msg } = await submitApi<SendData>(sendData)
        res = await submitApi<ResponseInfo>(sendData).then()
        if (res.error !== 0) return message.error(res.msg)
        message.success(res.msg, .5, () => { back() })
      }
    })
  }

  const columns1 = [
    {
      title: '商品编码',
      dataIndex: 'product_sn',
      align: 'center'
    },
    {
      title: '输入码',
      dataIndex: 'barcode',
      align: 'center'
    },
    {
      title: '商品名称',
      dataIndex: 'product_name',
      align: 'center'
    },
    {
      title: '商品分类',
      dataIndex: 'cat_name',
      align: 'center'
    },
    {
      title: '销售单位',
      dataIndex: 'value',
      align: 'center'
    },
    {
      title: '计量单位转换比例',
      dataIndex: 'trans_unit',
      align: 'center'
    },
    {
      title: '基础计量单位',
      dataIndex: 'basic_val',
      align: 'center'
    },
    {
      title: '起始时间',
      dataIndex: 'start_time',
      align: 'center'
    },
    {
      title: '结束时间',
      dataIndex: 'end_time',
      align: 'center'
    },
    {
      title: '计量单位等级价格',
      dataIndex: 'ladder',
      align: 'center',
      render: (text = [], record: Record) => {
        // return text.length ? text.map(({ number, price }) => (<><span>
        //   {number ? `(${number})-` : ''}￥{`${price}`}
        // </span><br></br></>)) : record.price
        return <>
          ￥{record.price}<br></br>
          {text.map(({ number, price }) => (<><span>
          {number ? `(${number})-` : ''}￥{`${price}`}
        </span><br></br></>))}
        </>
      }
    },
    {
      title: '说明',
      dataIndex: 'msg',
      align: 'center',
    },
  ]
  const columns2 = [
    {
      title: '公司id-公司名称', // company_name
      dataIndex: 'company_id',
      align: 'center',
      render: (text: string, record: Record) => {
        return `${record.company_id}-${record.company_name}`
      }
    },
    {
      title: '客户组ID',
      dataIndex: 'customer_group_id',
      align: 'center'
    },
    {
      title: '客户组名称',
      dataIndex: 'group_name',
      align: 'center'
    },
    {
      title: '商品编码',
      dataIndex: 'product_sn',
      align: 'center'
    },
    {
      title: '输入码',
      dataIndex: 'barcode',
      align: 'center'
    },
    {
      title: '商品名称',
      dataIndex: 'product_name',
      align: 'center'
    },
    {
      title: '商品分类',
      dataIndex: 'cat_name',
      align: 'center'
    },
    {
      title: '销售单位',
      dataIndex: 'value',
      align: 'center'
    },
    {
      title: '计量单位转换比例',
      dataIndex: 'trans_unit',
      align: 'center'
    },
    {
      title: '基础计量单位',
      dataIndex: 'basic_val',
      align: 'center'
    },
    {
      title: '起始时间',
      dataIndex: 'start_time',
      align: 'center'
    },
    {
      title: '结束时间',
      dataIndex: 'end_time',
      align: 'center'
    },
    {
      title: '计量单位等级价格',
      dataIndex: 'ladder',
      align: 'center',
      render: (text = [], record: Record) => {
        // return text.length ? text.map(({ number, price }) => (<><span>
        //   {number ? `(${number})-` : ''}￥{`${price}`}
        // </span><br></br></>)) : record.price
        return <>
          ￥{record.price}<br></br>
          {text.map(({ number, price }) => (<><span>
          {number ? `(${number})-` : ''}￥{`${price}`}
        </span><br></br></>))}
        </>
      }
    },
    {
      title: '说明',
      dataIndex: 'msg',
      align: 'center'
    },
  ]
  const columns3 = [
    {
      title: '公司id-公司名称', // company_name
      dataIndex: 'company_id',
      align: 'center',
      render: (text: string, record: Record) => {
        return `${record.company_id}-${record.company_name}`
      }
    },
    {
      title: '客户编码',
      dataIndex: 'customer_code',
      align: 'center'
    },
    {
      title: '客户名称',
      dataIndex: 'customer_name',
      align: 'center'
    },
    {
      title: '商品编码',
      dataIndex: 'product_sn',
      align: 'center'
    },
    {
      title: '输入码',
      dataIndex: 'barcode',
      align: 'center'
    },
    {
      title: '商品名称',
      dataIndex: 'product_name',
      align: 'center'
    },
    {
      title: '商品分类',
      dataIndex: 'cat_name',
      align: 'center'
    },
    {
      title: '销售单位',
      dataIndex: 'value',
      align: 'center'
    },
    {
      title: '计量单位转换比例',
      dataIndex: 'trans_unit',
      align: 'center'
    },
    {
      title: '基础计量单位',
      dataIndex: 'basic_val',
      align: 'center'
    },
    {
      title: '起始时间',
      dataIndex: 'start_time',
      align: 'center'
    },
    {
      title: '结束时间',
      dataIndex: 'end_time',
      align: 'center'
    },
    {
      title: '计量单位等级价格',
      dataIndex: 'ladder',
      align: 'center',
      render: (text = [], record: Record) => {
        // return text.length ? text.map(({ number, price }) => (<><span>
        //   {number ? `(${number})-` : ''}￥{`${price}`}
        // </span><br></br></>)) : record.price
        return <>
          ￥{record.price}<br></br>
          {text.map(({ number, price }) => (<><span>
          {number ? `(${number})-` : ''}￥{`${price}`}
        </span><br></br></>))}
        </>
      }
    },
    {
      title: '说明',
      dataIndex: 'msg',
      align: 'center'
    },
  ]

  const columnsMap: {[key:number|string]: any} = {
    1: columns1,
    2: columns2,
    3: columns3,
  }

  const setClassName = (record: Record, index: number) => {
    const { msg } = record
    if (msg) {
      return 'gray'
    }
    return ''
  }

  return <>
    <CustomerBreadcrumb className="breadcrumb"></CustomerBreadcrumb>
    <div style={{ background: '#fff', padding: '24px' }} >
      <div>【价格说明】</div>
      <div>1、导入商品价格，审核通过后新增价格，且新增的价格的开始时间与结束时间，对原有含相同时间段的数据做截断操作，且将被截断后的相同时间段的原有数据删除。<div></div></div>
      <div>2、导入价格的创建时间即为该新增价格的审核通过时间。<div></div></div>
      <div>3、审核通过时间与导入价格的时间关系：
        <div>（1）导入价格的审核通过时间小于设置的开始时间，则该条价格的开始时间=设置的开始时间；</div>
        <div>（2）若导入价格的审核通过时间大于设置开始时间小于结束时间，则该条价格的开始时间=审核通过时间；</div>
        <div>（3）若审核时间超过导入价格的结束时间，则无需审核，无法新增导入；</div>
      </div>
      <div>4、审核通过，代表本次提交的价格均审核通过，若有一条有问题，需本次提交价格均被驳回。<div></div></div>
      <div>5、待审核状态，不允许进行二次编辑/新增提交动作，只有等审核完成后，才可进行下一次的编辑/新增价格操作。<div></div></div>
    </div>

    <div style={{ background: '#fff', padding: '24px', marginTop: '12px' }}>
      <Descriptions>
        <Descriptions.Item>定价类型：{arrToObj(priceTypeList)[info.price_type]}</Descriptions.Item>
        <Descriptions.Item>提交人：{info.submit_user_name}</Descriptions.Item>
        <Descriptions.Item>提交时间：{info.create_time}</Descriptions.Item>
      </Descriptions>
      {/* 审核 */}
      {
        info.audit_status === 1 ?
          <Descriptions >
            <Descriptions.Item>本次提交{info.total}条价格，其中{info.invalid}条已过期无需审核</Descriptions.Item>
          </Descriptions>
          : null
      }
      {/* 查看 */}
      {
        info.audit_status !== 1 ? <>
          <Descriptions>
            <Descriptions.Item>本次提交{info.total}条价格</Descriptions.Item>
            {/* <Descriptions.Item>审核结果：审核通过{info.total - info.invalid}条，过期无需审核{info.invalid}条</Descriptions.Item> */}
            <Descriptions.Item>审核人：{info.audit_user_name}</Descriptions.Item>
            <Descriptions.Item>审核时间：{info.audit_time}</Descriptions.Item>
          </Descriptions>
        </>
          : null
      }
    </div>

    <Table
      style={{ marginTop: '10px', backgroundColor: '#fff' }}
      rowKey={(record) => record.id}
      scroll={{ x: 1300, y: 500 }}
      dataSource={info.lists}
      columns={columnsMap[(info.price_type)]}
      pagination={false}
      className='price-verify-table'
      rowClassName={setClassName}
    />
    <Form style={{ background: '#fff', padding: '24px' }}>
      <Row>
        <Form.Item
          label="备注"
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 22 }}
        >
          {getFieldDecorator("audit_reason", {
            initialValue: info.audit_reason,
            rules: [
              {
                required: false,
                message: "请输入备注",
              },
            ],
          })(<TextArea rows={4} disabled={info.audit_status !== 1} />)}
        </Form.Item>
      </Row>
    </Form>
    {
      info.audit_status === 1 ?
        <Row style={{ background: '#fff', padding: '0 24px 24px 0', display: 'flex', justifyContent: 'center' }}>
          <Button type='primary' onClick={() => onSubmit(3)}>审核通过</Button>
          <Button type='danger' onClick={() => onSubmit(4)} style={{ marginLeft: '20px' }}>审核驳回</Button>
        </Row>
        :
        <Row style={{ background: '#fff', padding: '0 24px 24px 0', display: 'flex', justifyContent: 'center' }}>
          <Button type='primary' onClick={() => back()}>返回</Button>
        </Row>
    }

  </>

}
export default Form.create()(ReactFC)