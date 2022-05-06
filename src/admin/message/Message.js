import React, { Component } from 'react'
import { Col, Row, Tabs, Tab, Form, Button, Modal } from 'react-bootstrap'
import Header from "../../component/Header"
import Navleft from "../../component/NavLeft"
import { FaRegEdit } from 'react-icons/fa';
import Swal from 'sweetalert2'
import '../StyleAdmin.css'



import Axios from 'axios'
import { API_URL } from '../../config/config'
import { useMediaQuery } from 'react-responsive'
import MobileError from '../../component/MobileError';

const Desktop = ({ children }) => {
    const isDesktop = useMediaQuery({ minWidth: 768 })
    return isDesktop ? children : null
}
const Mobile = ({ children }) => {
    const isMobile = useMediaQuery({ maxWidth: 767 })
    return isMobile ? children : null
}


export default class Message extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // message: {
            //     header: "",
            //     body: "",
            // },
            message_modal: {
                header: "",
                body: "",
            },
            show: false,
            data_message: [],
            page_accept: true,
            username: localStorage.getItem("username"),
            password: localStorage.getItem("password"),
        };
    }

    showModal = async (message_id) => {
        localStorage.setItem("message_id", message_id)
        console.log(message_id)
        this.setState({
            show: !this.state.show,
        });
        const data = new FormData();
        data.append("message_id", message_id)
        try {
            let url = API_URL + "/message/list_message_by_id";
            Axios.post(url, data).then(function (res) {
                this.setState({
                    message_modal: {
                        header: res.data.data.header,
                        body: res.data.data.body,
                    }
                })
            }.bind(this))
        } catch (error) { }
    };

    handleChange(change, event) {
        var toChange = this.state.message_modal;
        toChange[change] = event.target.value;
        this.setState({ form: toChange });
    }

    // handleChangeMessage = (action, value) => {
    //     let { message } = this.state;
    //     message[action] = value;
    //     this.setState({
    //         message,
    //     });
    // };

    handleSubmit = async () => {
        const { message_modal } = this.state;
        console.log(message_modal.header)
        console.log(message_modal.body)
        if (message_modal.header && message_modal.body) {
            const data = new FormData();
            data.append("message_id", localStorage.getItem("message_id"))
            if (message_modal.header) {
                data.append("header", message_modal.header);
            } else {
                data.append("header", this.state.header);
            }
            if (message_modal.body) {
                data.append("body", message_modal.body);
            } else {
                data.append("body", this.state.body);
            }
            try {
                Swal.fire({
                    title: 'ต้องการแก้ไขข้อมูลหรือไม่',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'cancel'
                }).then(async (result) => {
                    if (result.value) {
                        let url = API_URL + "/message/update_message"
                        Axios.post(url, data).then(function (res) {
                            if (res.data.status == 1) {
                                Swal.fire(
                                    'แก้ไขข้อมูลสำเร็จ',
                                    '',
                                    'success'
                                ).then(() => {
                                    window.location.href = "/message"
                                })
                            } else if (res.data.status == 0) {
                                Swal.fire(
                                    'แก้ไขข้อมูลไม่สำเร็จกรุณาลองใหม่อีกครั้ง',
                                    '',
                                    'warning'
                                )
                            }
                        }.bind(this))
                    }
                })
            } catch (error) {
            }
        }
        else {
            Swal.fire(
                'กรถณากรอกข้อมูลให้ครบ',
                '',
                'warning'
            )
        }

    };

    // addMessage = async () => {
    //     const { message } = this.state;
    //     const data = new FormData();
    //     data.append("header", message.header)
    //     data.append("body", message.body)
    //     try {
    //         let url = API_URL + "/message/add_message";
    //         Axios.post(url, data).then(function (res) {
    //             this.setState({
    //                 message_modal: {
    //                     header: res.data.data.header,
    //                     body: res.data.data.body,
    //                 }
    //             })
    //         }.bind(this))
    //     } catch (error) { }
    // }


    render() {

        if (this.state.page_accept) {
            let url = API_URL + "/message/list_message"
            Axios.get(url).then(function (res) {
                console.log(res.data)
                this.setState({
                    data_message: res.data.data,
                    page_accept: false
                })


            }.bind(this))
        }

        if (this.state.username === null && this.state.password === null) {
            window.location.href = "/";
        }
        return (
            <div className=" bgAdmin">
                <Desktop>
                    <div lassName=" bgAdmin1" >
                        <Row style={{ marginRight: "0px", height: "100%" }}>
                            <Col md={2} style={{ height: 'auto' }}  >
                                <Navleft />
                            </Col>
                            <Col md={10} >

                                <div style={{ margin: '15px', fontSize: "2em", fontWeight: "bold", padding: "10px 20px", color: "#212529", borderBottom: "2px solid #212529" }} >ตั้งค่าข้อความอัตโนมัติ</div>
                                {this.state.data_message.map((index, i) =>
                                    <div style={{ borderRadius: "10px", margin: "15px", padding: "10px", backgroundImage: "linear-gradient(rgb(150,150,150), #F1F1F1, #F1F1F1, rgb(150,150,150))" }}>
                                        <Row >
                                            <Col sm={10}>
                                                <Row style={{ alignItems: 'center', display: 'flex', wordBreak: 'break-all' }}>
                                                    <h4>{index.header}</h4>
                                                </Row>
                                                <Row style={{ alignItems: 'center', display: 'flex', wordBreak: 'break-all' }}>
                                                    {index.body}
                                                </Row>
                                                {/* <div id="six" class="button">Sketch</div> */}
                                            </Col>
                                            <Col sm={2} style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-around' }}>
                                                {/*/////////////////// Modal Edit /////////////// */}
                                                <FaRegEdit size={20} style={{ cursor: "pointer", color: "#212529" }} onClick={() => {
                                                    this.showModal(index.message_id)
                                                }} />
                                            </Col>
                                        </Row>
                                    </div>
                                )}
                                <Modal show={this.state.show} size="lg" centered>
                                    <Modal.Body>
                                        <Row >
                                            <Col style={{ paddingBottom: "20px" }}>
                                                <div>
                                                    <Form.Label><h2>{this.state.message_modal.header}</h2></Form.Label>
                                                </div>
                                                <div>
                                                    <Form.Label><h4>เนื้อหาภายใน</h4></Form.Label>
                                                    <Form.Control
                                                        onChange={this.handleChange.bind(this, "body")}
                                                        name="body"
                                                        value={this.state.message_modal.body}
                                                        type="text"
                                                        placeholder="ข้อความ" />
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row style={{ justifyContent: "flex-end" }}>
                                            <div >
                                                <Button onClick={() => this.handleSubmit()} style={{ marginRight: '10px' }} className="btn-Nomal btn-Edit">
                                                    บันทึก
                                                </Button>
                                                <Button onClick={() => { this.showModal() }} style={{ marginLeft: '10px' }} className="btn-Nomal btn-Edit">
                                                    ยกเลิก
                                                </Button>
                                            </div>
                                        </Row>
                                    </Modal.Body>
                                </Modal>
                            </Col>
                        </Row>
                    </div>
                </Desktop>
                <Mobile>
                    <MobileError />
                </Mobile>
            </div>
        )
    }
}
