import React, { Component } from 'react'
import { Form, Row, Col, Button, InputGroup } from 'react-bootstrap'
import Axios from 'axios'
import { API_URL } from '../../config/config'
import Swal from 'sweetalert2'


export default class CreateNoti extends Component {
    constructor(props) {
        super(props);
        this.state = {
            add_noti: {},
            btnCheckBox: {},
            checked: true,
        };

    }
    handleChangeCheckBox = (e) => {
        let { checked } = e.target
        let { btnCheckBox } = this.state
        btnCheckBox[e.target.name] = checked
        this.setState({
            btnCheckBox
        })
    }

    handleChange = (name, value) => {
        let { add_noti } = this.state
        add_noti[name] = value
        this.setState({
            add_noti
        })
    }

    handleSubmit = () => {
        let { add_noti, btnCheckBox } = this.state
        console.log('btnCheckBox', btnCheckBox.type)
        console.log('btnCheckBox', btnCheckBox.comment)
        console.log('btnCheckBox', btnCheckBox.send_message)
        console.log('btnCheckBox', btnCheckBox.setting_noti)


        if (add_noti.header && add_noti.drescription && add_noti.name !== undefined) {

            Swal.fire({
                icon: 'question',
                title: 'เพิ่มการแจ้งเตือนอื่นหรือไม่',
                showCancelButton: true,
                confirmButtonColor: '#218838',
                cancelButtonColor: '#c82333',
                confirmButtonText: 'ยืนยัน',
                cancelButtonText: 'ยกเลิก'
            }).then(async (result) => {
                if (result.value) {

                    let data_status = new FormData
                    data_status.append("header", add_noti.header)
                    data_status.append("status", "creator")
                    data_status.append("username", localStorage.getItem("username"))
                    let url_update = API_URL + "/user/update_status"
                    Axios.post(url_update, data_status).then(function (res) {
                        let data = new FormData
                        data.append("header", add_noti.header)
                        data.append("drescription", add_noti.drescription)
                        data.append("name", add_noti.name)
                        data.append("type_noti", btnCheckBox.type)
                        data.append("send_message", btnCheckBox.send_message)
                        data.append("comment", btnCheckBox.comment)
                        data.append("setting_noti", btnCheckBox.setting_noti)
                        let url = API_URL + "/other_noti/add_other_noti"
                        Axios.post(url, data).then(function (res) {
                            if (res.data.message === "Success") {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'สร้างบริการสำเร็จ',
                                    confirmButtonColor: '#212529',
                                    confirmButtonText: 'ตกลง',
                                }).then(() => {
                                    localStorage.setItem("header", add_noti.header)
                                    window.location.href = "/creator/handle"
                                })
                            } else if (res.data.message === "Failed") {
                                Swal.fire({
                                    icon: 'warning',
                                    title: 'ชื่อบริการซ้ำ',
                                    confirmButtonColor: '#212529',
                                    confirmButtonText: 'ตกลง',
                                })
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'ไม่สามารถสร้างบริการได้ในขณะนี้',
                                    confirmButtonColor: '#212529',
                                    confirmButtonText: 'ตกลง',
                                })
                            }

                        }.bind(this))
                    }.bind(this))
                }
            })
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'กรุณากรอกข้อมูลให้ถูกต้อง',
                confirmButtonColor: '#212529',
                confirmButtonText: 'ตกลง',
            })
        }

    }
    render() {

        return (
            <div>
                <Form style={{ padding: "20px 100px" }}>
                    <Row >
                        <Col style={{ width: "10%" }}>
                            <Form.Group>
                                <Form.Label><h4>ชื่อหัวข้อบริการ</h4></Form.Label>
                                <Form.Control
                                    onChange={(e) => this.handleChange("header", e.target.value)}
                                    placeholder="ชื่อหัวข้อบริการ" />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col >
                            <Form.Group>
                                <Form.Label><h4>รายละเอียดของบริการ</h4></Form.Label>
                                <Form.Control
                                    onChange={(e) => this.handleChange("drescription", e.target.value)}
                                    placeholder="รายละเอียดการแจ้งเตือน" />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col >
                            <Form.Group>
                                <Form.Label><h4>ชื่อองค์กร บริษัท สำนักงาน หรืออื่นๆ</h4></Form.Label>
                                <Form.Control
                                    onChange={(e) => this.handleChange("name", e.target.value)}
                                    placeholder="องค์กร บริษัท สำนักงาน และอื่นๆ" />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row >
                        <Col>
                            <Row>
                                <h4>ปรับแต่งเพิ่มเติม</h4>
                            </Row>
                            <Row>
                                <InputGroup.Prepend>
                                    <InputGroup.Checkbox name={"type"} onChange={(e) => this.handleChangeCheckBox(e)} />
                                    <Form.Label style={{ alignItems: "center", display: "flex" }}>มีการจองคิวจองคิว</Form.Label>

                                </InputGroup.Prepend>
                            </Row>
                            <Row>
                                <InputGroup.Prepend>
                                    <InputGroup.Checkbox name={"send_message"} onChange={(e) => this.handleChangeCheckBox(e)} />
                                    <Form.Label style={{ alignItems: "center", display: "flex" }}>สามารถประชาสัมพันธ์ได้</Form.Label>
                                </InputGroup.Prepend>
                            </Row>
                            <Row>
                                <InputGroup.Prepend>
                                    <InputGroup.Checkbox name={"comment"} onChange={(e) => this.handleChangeCheckBox(e)} />
                                    <Form.Label style={{ alignItems: "center", display: "flex" }}>ช่องกรอกรายละเอียดเพิ่มเติม</Form.Label>
                                </InputGroup.Prepend>
                            </Row>
                            <Row>
                                <InputGroup.Prepend>
                                    <InputGroup.Checkbox name={"setting_noti"} onChange={(e) => this.handleChangeCheckBox(e)} />
                                    <Form.Label style={{ alignItems: "center", display: "flex" }}>กำหนดวัน และข้อความแจ้งเตือนอัตโนมัติเอง</Form.Label>
                                </InputGroup.Prepend>
                            </Row>
                        </Col>
                    </Row>
                    <Row style={{ justifyContent: 'end', display: 'flex', marginTop: '2%' }}>
                        <div >
                            <Button className="btn-confirm" btn-Edit onClick={this.handleSubmit}>
                                สร้าง
                            </Button>
                        </div>
                    </Row>



                </Form>
            </div >
        )
    }
}
