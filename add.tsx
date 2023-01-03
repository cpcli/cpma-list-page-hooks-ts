import React, { useState, useEffect, useCallback, MutableRefObject } from 'react'
import { Form, Button, Row, Col, Input, message, Popconfirm, Select, Icon, Card } from 'antd'
import CustomerBreadcrumb from '../../components/CustomerBreadcrumb'
import { rolesList } from './constant'
import { guid } from '../../util/common'
import './index.less'
import { ResponseData } from '../../util/request_ts'
import { detailApi, addApi, salesmanListApi, DetailInterface, TaskInfoInterface, MemberInterface, LoopType, MemberType } from './api'
import ConfigModal from './components/modal'
import moment from 'moment'
import { weekendsMap, timePickerFormat } from './constant'

const Option = Select.Option
const ButtonGroup = Button.Group
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  }
}

type ResponseInfo<T> = ResponseData<T>
// interface Record {
//   task_title: string,
//   task_start_time: string,
//   task_end_time: string,
//   task_cycle_type: LoopType,
//   task_cycle_days: number[] | typeof moment,
//   need_feedback: string,
//   id?: string | number,
// }

const ReactFC: React.FC<any> = (props) => {
  const { getFieldDecorator,  validateFields } = props.form
  const [visible, setVisible] = useState(false)
  const [detail, setDetail] = useState<DetailInterface>({} as DetailInterface)
  const [task, setTask] = useState<TaskInfoInterface>({} as TaskInfoInterface)
  const [membersList, setMembersList] = useState<Array<MemberInterface>>([])
  const [configList, setConfigList] = useState<Array<TaskInfoInterface>>([])
  const id = props.match.params.id
  const isView = props.match.path.indexOf('view') !== -1
  let company_id = window.localStorage.getItem('authCompanyId')

  useEffect(() => {
    if (id) {
      getInfo()
    }else{
      getMemberList()
    }
  }, [])

  const getInfo = useCallback(async () => {
    const sendData = {
      task_group_id: id
    }
    let res: ResponseInfo<DetailInterface>
    res = await detailApi(sendData).then()
    if (res.error !== 0) return message.error(res.msg)
    const detail = res.data
    setDetail(detail)
    await getMemberList(detail.task_user_type)
    // setFieldsValue({
    //   task_group_name: detail.task_group_name,
    //   task_user_type: detail.task_user_type,
    // })
    const configList: TaskInfoInterface[] = detail.task_list.data.map((item: any) => {
      let loopValue
      if(item.task_cycle_type === 3 || item.task_cycle_type === 4){
        loopValue = item.task_cycle_days.split(',').map((i: string)=> +i)
      }else if(item.task_cycle_type === 1){
        loopValue = item.task_cycle_days
      }else if(item.task_cycle_type === 2){
        loopValue = 2
      }
      return {
        task_id: item.task_id + '',
        name: item.task_title,
        time1: moment(item.task_start_time,'HH:mm:ss').format(timePickerFormat),
        time2: moment(item.task_end_time,'HH:mm:ss').format(timePickerFormat),
        loop: item.task_cycle_type,
        loopValue,
        reback: item.need_feedback,
      }
    })
    setConfigList(configList)
  }, [])

  const getMemberList = async (type: MemberType = 1) => {
    return new Promise(async (resolve, reject) => {
      const sendData = {
        type,
        company_id,
        name: '',
      }
      let res: ResponseInfo<MemberInterface[]>
      res = await salesmanListApi(sendData).then()
      if (res.error !== 0) {
        message.error(res.msg)
        reject()
      }
      setMembersList(res.data)
      resolve(res.data)
    })
  }
  const onUserTypeChange = (type: MemberType) => {
    getMemberList(type)
  }

  const back = () => {
    props.history.push('/salesman/todoList')
  }
  const showModal = () => {
    setVisible(true)
  }
  const hideModal = () => {
    setVisible(false)
    setTask({} as TaskInfoInterface)
  }
  const submitModal = (values: TaskInfoInterface, isAdd: boolean) => {
    if (isAdd) {
      configList.push({ ...values, task_id: guid() })
    } else {
      let index = configList.findIndex(item => item.task_id === values.task_id)
      configList.splice(index, 1, values)
    }
    setConfigList([...configList])
    hideModal()
  }
  const edit = (item: TaskInfoInterface) => {
    setTask(item)
    showModal()
  }
  const del = (index: number) => {
    configList.splice(index, 1)
    setConfigList([...configList])
  }
  const handleSave = async () => {
    if (!configList.length) {
      return message.info('请添加配置')
    }
    validateFields(async (e: any, values: any) => {
      if (!e) {
        console.log(configList,'configList~')
        const task_list = configList.map(item => {
          let task_cycle_days
          if(item.loop === 3 || item.loop === 4){
            task_cycle_days = (item.loopValue as number[]).join(',')
          }else if(item.loop === 1){
            task_cycle_days = item.loopValue
          }else if(item.loop === 2){
            task_cycle_days = 2
          }
          return {
            task_id: item.task_id.indexOf('-') !== -1 ? undefined : item.task_id,
            task_title: item.name,
            task_start_time: item.time1,
            task_end_time: item.time2,
            task_cycle_type: item.loop,
            task_cycle_days,
            need_feedback: item.reback,
          }
        })
        const sendData = {
          task_group_id: id ? id : undefined,
          company_id,
          task_group_name: values.task_group_name,
          task_user_type: values.task_user_type,
          task_user_id: values.task_user_id.join(','),
          task_list
        }
        interface Res{
          data: any,
          error: number,
          msg: string,
        }
        let res: Res
        res = await addApi<Res>(sendData).then()
        if (res.error !== 0) return message.error(res.msg)
        message.success(res.msg, .5, () => { back() })
      }
    })
  }
  const RenderItemTime = (item: TaskInfoInterface) => {
    const { loop, time1, time2, loopValue } = item
    const loopTextMap = {
      1: loopValue,
      4: Array.isArray(loopValue) && loopValue.map(i => `每月${i}号`).join('、'),
      3: Array.isArray(loopValue) && loopValue.map((i) => `每周${weekendsMap[i]}`).join('、'),
      2: '每日',
    }
    return `时间：${time1}-${time2} （${loopTextMap[loop]}）`
  }
  return <>
    <CustomerBreadcrumb className="breadcrumb"></CustomerBreadcrumb>
    <Form style={{ background: '#fff', padding: '24px' }} {...formItemLayout}>
      <Form.Item
        label="任务组名"
      >
        {getFieldDecorator("task_group_name", {
          initialValue: detail.task_group_name,
          rules: [
            {
              required: true,
              message: "请输入任务组名",
            },
          ],
        })(<Input
          maxLength={20}
          placeholder='请输入任务组名'
          disabled={isView}
        />)}
      </Form.Item>
      <Form.Item
        label="角色"
      >
        {getFieldDecorator("task_user_type", {
          initialValue: detail.task_user_type || 1,
          rules: [
            {
              required: true,
              message: "请选择角色",
            },
          ],
        })(<Select
          placeholder='请选择角色'
          disabled={id || isView}
          onChange={onUserTypeChange}
        >
          {
            rolesList.map(item => {
              return <Option key={item.value} value={item.value}>
                {item.label}
              </Option>
            })
          }
        </Select>)}
      </Form.Item>
      <Form.Item
        label="姓名"
      >
        {getFieldDecorator("task_user_id", {
          initialValue: (detail.relation_user_list || []).map((item: MemberInterface) => item.salesman_id),
          rules: [
            {
              required: true,
              message: "请选择成员",
            },
          ],
        })(<Select
          mode='multiple'
          placeholder='请选择成员'
          disabled={isView}
          showSearch
          filterOption={(input, option: any) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {
            membersList.map((item: MemberInterface) => {
              return <Option key={item.salesman_id} value={item.salesman_id}>
                {item.full_name}
              </Option>
            })
          }
        </Select>)}
      </Form.Item>
      <Button type='primary' onClick={showModal}
        disabled={isView}>添加配置</Button>
      {
        configList.map((item: TaskInfoInterface, index: number) => (
          <Card key={index} style={{ marginTop: '16px' }}>
            <Row>
              <ButtonGroup style={{}}>
                <Button onClick={() => edit(item)}
                  disabled={isView}>
                  <Icon type="edit" />
                </Button>
                <Popconfirm title='确定删除吗？' onConfirm={() => del(index)} disabled={isView}>
                  <Button disabled={isView}>
                    <Icon type="delete" />
                  </Button>
                </Popconfirm>
              </ButtonGroup>
            </Row>
            <Row style={{ margin: '12px 0' }}>
              {index + 1}、标题：{item.name}
            </Row>
            <Row style={{ margin: '12px 0' }}>
              {
                RenderItemTime(item)
              }
            </Row>
          </Card>
        ))
      }
    </Form>
    <div style={{ background: '#fff', textAlign: 'center', padding: '12px 0', }}>
      <Button type='primary' onClick={handleSave}
        disabled={isView}>保存</Button>
    </div>
    {
      visible ? <ConfigModal
        task={task}
        title='待办任务'
        visible={visible}
        handleCancel={hideModal}
        handleOk={submitModal}
      >
      </ConfigModal> : null
    }
  </>
}
export default Form.create()(ReactFC)