import React, { useState, useEffect } from 'react'
import { Select, Modal, Form, Input, TimePicker, DatePicker, Radio, Row, Col } from 'antd'
import moment from 'moment'
import {weekendsMap} from '../constant'
const { Option } = Select

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
  },
}
const timePickerFormat = 'HH:mm'
interface FooProp {
  visible: boolean,
  title: string,
  task: {},
  handleCancel: () => void,
  handleOk: () => void,
}
// enum SelectLabelMap {
//   w = '每周',
//   m = '每月'
// }
function disabledDate(current: typeof moment) {
  return current && (current as moment) < moment().startOf('day')
}
function range(start: number, end: number, type: 'w' | 'm') {
  const result = [];
  for (let i = start; i <= end; i++) {
    let value = i
    let label = type === 'w' ? `每周${weekendsMap[i] as string}` : `每月${i}号`
    result.push({
      value,
      label,
    });
  }
  return result;
}

export default Form.create()((props: any) => {
  const { visible, title, handleCancel, handleOk, task, form: { getFieldDecorator, validateFields, getFieldValue, setFieldsValue } } = props
  useEffect(() => {
    let { loopValue } = task
    if (!loopValue) {
      loopValue = undefined
    } else if (Array.isArray(loopValue)) {
      loopValue = loopValue
    } else {
      loopValue = moment(loopValue)
    }
    setFieldsValue({
      ...task,
      time1: task.time1 ? moment(task.time1, timePickerFormat) : undefined,
      time2: task.time2 ? moment(task.time2, timePickerFormat) : undefined,
    })
    setTimeout(() => {
      setFieldsValue({
        loopValue
      })
    })
  }, [])

  const renderDate = () => {
    // '1  仅一次   2 每天  3 周循环  4 月循环'
    const type: number | undefined = getFieldValue('loop')
    const map: {[index: string]: React.ReactElement} = {
      1: <DatePicker
        format="YYYY-MM-DD"
        disabledDate={disabledDate}
        showTime={false}
      />,
      4: <Select mode='multiple' placeholder='请选择'>
        {
          range(1, 31, 'm').map(item => {
            return <Option value={item.value} key={item.value}>
              {`每月${item.value}号`}
            </Option>
          })
        }
      </Select>,
      3: <Select mode='multiple' placeholder='请选择'>
        {
          range(1, 7, 'w').map(item => {
            return <Option value={item.value} key={item.value}>
              {item.label}
            </Option>
          })
        }
      </Select>,
      2: <></>,
    }
    if (!type || type === 2) return null
    return <Row>
      <Col span={6}></Col>
      <Col span={16}>
        <Form.Item>
          {
            getFieldDecorator('loopValue', {
              initialValue: undefined,
              rules: [{
                required: true,
                message: '请选择',
              }]
            })(
              map[type]
            )
          }
        </Form.Item>
      </Col>
    </Row>
  }

  const onLoopChange = () => {
    setFieldsValue({
      loopValue: undefined
    })
  }

  const onOk = () => {
    validateFields((err: any, values: any) => {
      if (err) return
      let { loopValue } = values
      if (!loopValue) {
        loopValue = 2
      } else if (Array.isArray(loopValue)) {
        loopValue = loopValue
      } else {
        loopValue = loopValue.format('YYYY-MM-DD')
      }
      values = {
        ...values,
        loopValue,
        time1: values.time1.format(timePickerFormat),
        time2: values.time2.format(timePickerFormat),
      }
      handleOk(values, task.task_id === undefined)
    })
  }

  return (
    <Modal
      visible={visible}
      title={title}
      onCancel={handleCancel}
      onOk={onOk}
    >
      <Form {...formItemLayout} className='modal-form-form'>
        <Form.Item label='标题'>
          {
            getFieldDecorator('name', {
              initialValue: undefined,
              rules: [{
                required: true,
                message: '请输入标题'
              }]
            })(
              <Input placeholder='请输入标题' />
            )
          }
        </Form.Item>
        <Row style={{ height: '40px', marginBottom: '14px' }}>
          <Col span={6} style={{ lineHeight: '33px', color: '#000000', textAlign: 'right', }}><span style={{ color: '#f5222d', lineHeight: 1, marginRight: '4px' }}>*</span>时间：</Col>
          <Col span={7}>
            <Form.Item>
              {
                getFieldDecorator('time1', {
                  initialValue: undefined,
                  rules: [{
                    required: true,
                    message: '请选择起始时间'
                  }]
                })(
                  <TimePicker format={timePickerFormat} />
                )
              }
            </Form.Item>
          </Col>
          <Col span={2} style={{ lineHeight: '33px' }}>至</Col>
          <Col span={7}>
            <Form.Item>
              {
                getFieldDecorator('time2', {
                  initialValue: undefined,
                  rules: [{
                    required: true,
                    message: '请选择结束时间'
                  }]
                })(
                  <TimePicker format={timePickerFormat} />
                )
              }
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label='循环'>
          {
            getFieldDecorator('loop', {
              initialValue: undefined,
              rules: [{
                required: true,
                message: '请选择循环',
              }]
            })(
              <Radio.Group onChange={onLoopChange}>
                <Radio value={1}>仅一次</Radio>
                <Radio value={4}>月循环</Radio>
                <Radio value={3}>周循环</Radio>
                <Radio value={2}>每天</Radio>
              </Radio.Group>
            )
          }
        </Form.Item>
        {
          renderDate()
        }
        <Form.Item label='反馈'>
          {
            getFieldDecorator('reback', {
              initialValue: undefined,
              rules: [{
                required: true,
                message: '请选择反馈'
              }]
            })(
              <Radio.Group>
                <Radio value={0}>不需要</Radio>
                <Radio value={1}>需要（上传图文）</Radio>
              </Radio.Group>
            )
          }
        </Form.Item>
      </Form>
    </Modal>
  )
})
