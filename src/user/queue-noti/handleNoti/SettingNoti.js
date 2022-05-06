import React, { Component } from 'react'
import { Form, Row, Col, Button, Modal, InputGroup, FormControl, Image, Tabs, Tab } from 'react-bootstrap'
import Swal from 'sweetalert2'
import Axios from 'axios'
import { API_URL } from '../../../config/config'

import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

export default class SettingNoti extends Component {
    constructor(props) {
        super(props);
        this.state = {
            start_date: "",
            slc_hours: ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"],
            settingInfo: {},
            header: localStorage.getItem("header")

        };

        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleSubmitSettingNoti = this.handleSubmitSettingNoti.bind(this);
    }

    handleChangeDate(date) {
        console.log('date', date)
        this.setState({
            start_date: date
        })
    }

    handleChange = (action, value) => {
        let { settingInfo } = this.state;
        settingInfo[action] = value;
        this.setState({
            settingInfo,
        });
        console.log('settingInfo', this.state.settingInfo)
    };
    changeMonth(value) {
        var month = "01"
        switch (value) {
            case "Jan":
                month = "01"
                break;
            case "Feb":
                month = "02"
                break;
            case "Mar":
                month = "03"
                break;
            case "Apr":
                month = "04"
                break;
            case "May":
                month = "05"
                break;
            case "Jun":
                month = "06"
                break;
            case "Jul":
                month = "07"
                break;
            case "Aug":
                month = "08"
                break;
            case "Sep":
                month = "09"
                break;
            case "Oct":
                month = "10"
                break;
            case "Nov":
                month = "11"
                break;
            case "Dec":
                month = "12"
                break;
            default:
                break;
        }

        return month
    }

    handleSubmitSettingNoti = async () => {
        let { settingInfo, start_date } = this.state;
        let dmy = start_date.toString()
        let arr_date = dmy.split(" ")
        let date_format = arr_date[3] + "-" + this.changeMonth(arr_date[1]) + "-" + arr_date[2] + "T" + settingInfo.time + ":00.000000000"

        if (start_date !== "" && settingInfo.time !== undefined) {
            const data = new FormData();
            data.append("date", date_format)
            data.append("body", settingInfo.body)
            data.append("header", settingInfo.header)
            data.append("status", "wait")
            data.append("name_noti", this.state.header)
            try {
                Swal.fire({
                    icon: 'question',
                    title: 'ต้องการบึนทึกหรือไม่',
                    showCancelButton: true,
                    confirmButtonColor: '#218838',
                    cancelButtonColor: '#c82333',
                    confirmButtonText: 'ยืนยัน',
                    cancelButtonText: 'ยกเลิก'
                }).then(async (result) => {
                    if (result.value) {
                        let url = API_URL + "/setting_noti/save_setting_noti"
                        Axios.post(url, data).then(function (res) {
                            console.log('res.data.data', res.data.data)
                            Swal.fire({
                                icon: 'success',
                                title: 'ตั้งค่าข้อความอัตโนมัตสำเร็จ',
                                confirmButtonColor: '#218838',
                                confirmButtonText: 'ตกลง',
                            }).then(() => {
                                window.location.href = "/creator/handle"
                            })
                        }.bind(this))
                    }
                })
            } catch (error) {
            }
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'กรุณากรอกข้อมูลให้ครบ',
                confirmButtonColor: '#218838',
                confirmButtonText: 'ตกลง',
            })
        }
    }

    render() {
        return (
            <div>
                <Form style={{ padding: "2% 10%" }}>
                    <Row sm={12}>
                        <Col style={{ padding: "5px" }}>
                            <Form.Group>
                                <Form.Label>หัวข้อ</Form.Label>
                                <Form.Control
                                    onChange={(e) => this.handleChange("header", e.target.value)}
                                    placeholder="หัวข้อ" />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{ padding: "5px" }}>
                            <Form.Group>
                                <Form.Label>รายละเอียดข้อความ</Form.Label>
                                <Form.Control
                                    onChange={(e) => this.handleChange("body", e.target.value)}
                                    placeholder="ข้อความ" />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={6} style={{ padding: "5px" }}>
                            <Form.Group>
                                <Form.Label>กำหนดวันแจ้งเตือน</Form.Label>
                                <div>
                                    <DatePicker
                                        selected={this.state.start_date}
                                        onChange={this.handleChangeDate}
                                        dateFormat="d MMMM yyyy"
                                        minDate={new Date()}
                                        filterDate={date => date.getDay() != 6 && date.getDay() != 0}
                                        className="form-control"
                                        placeholderText="กำหนดวันแจ้งเตือน"
                                    />
                                </div>
                            </Form.Group>
                        </Col>
                        <Col sm={6} style={{ padding: "5px" }}>
                            <Form.Group >
                                <Form.Label>กำหนดเวลาแจ้งเตือน </Form.Label>
                                <Form.Control as="select" onChange={e => this.handleChange('time', e.target.value)}>
                                    <option disabled selected>เลือกเวลา</option>
                                    {this.state.slc_hours.map((index, i) =>
                                        <option value={index}>{index} น.</option>
                                    )}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{ padding: "1.5%", justifyContent: "center", display: "flex" }} >
                            <Button onClick={this.handleSubmitSettingNoti} style={{ marginRight: "10px" }} className="btn-confirm">
                                บันทึก
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}
