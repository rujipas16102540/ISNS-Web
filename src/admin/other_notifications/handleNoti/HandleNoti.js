import React, { Component } from 'react'
import { Col, Row, Tabs, Tab, Form, Button, Modal } from 'react-bootstrap'
import { useMediaQuery } from 'react-responsive'
import { RiDeleteBin6Line } from 'react-icons/ri';
import { MdDragHandle } from 'react-icons/md';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { MDBDataTable, Card, CardBody } from 'mdbreact';
import Axios from 'axios'
import Swal from 'sweetalert2'

import Navleft from "../../../component/NavLeft"
import MobileError from '../../../component/MobileError';
import { API_URL } from '../../../config/config'
import SendToEmail from './SendToEmail';
import SendToLine from './SendToLine';
import Approve from './Approve';

const Desktop = ({ children }) => {
    const isDesktop = useMediaQuery({ minWidth: 768 })
    return isDesktop ? children : null
}
const Mobile = ({ children }) => {
    const isMobile = useMediaQuery({ maxWidth: 767 })
    return isMobile ? children : null
}

const url = API_URL + '/queue/list_queue';
export default class HandleNoti extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user_modal: {},
            lst_queue: [],
            posts: [],
            isLoading: true,
            tableRows: [],
            header: localStorage.getItem("header"),
            show: false,

        };
    }

    componentWillMount = async () => {
        await Axios.get(url)
            .then(response => response.data)
            .then(data => {
                this.setState({
                    posts: data.data
                })
            })
            .then(async () => {
                this.setState({ tableRows: this.assemblePosts(), isLoading: false })
                console.log(this.state.tableRows);
            });
    }
    assemblePosts = () => {
        let posts = this.state.posts.map((index, i) => {
            if (index.header === this.state.header && index.approve === "1") {
                console.log('drescription', index.drescription)
                return (
                    {
                        name: index.prefix + " " + index.first_name + "  " + index.last_name,
                        drescription: index.drescription === "undefined" ? "-ไม่มีรายละเอียดเพิ่มเติม-" : index.drescription,
                        email: index.email,
                        phone_number: index.phone_number,
                        bin: <RiDeleteBin6Line onClick={() => this.handleDelete(index.queue_id)} size={20} style={{ cursor: "pointer", color: "#212529" }} />,
                    }
                )
            }
        });
        return posts;
    }

    handleDelete = async (queue_id) => {
        const data = new FormData();
        data.append("queue_id", queue_id)
        try {
            Swal.fire({
                title: 'ต้องการลบการจองคิวหรือไม่',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes',
                cancelButtonText: 'cancel'
            }).then(async (result) => {
                if (result.value) {
                    let url = API_URL + "/queue/cancel_queue";
                    await Axios.post(url, data).then(function (res) {
                        if (res.data = "Success") {
                            Swal.fire(
                                'ลบสำเร็จ',
                                '',
                                'success'
                            ).then(() => {
                                window.location.href = "/other_notifications/handle_noti"
                            })
                        } else if (res.data.status == 0) {
                            Swal.fire(
                                'ลบไม่สำเร็จ',
                                '',
                                'warning'
                            )
                        }
                    }.bind(this))
                }
            })
        } catch (error) { }
    }

    showModal = async (user_id, type_noti) => {
        // localStorage.setItem("user_id", user_id)
        console.log('user_id', user_id)
        // console.log('type_noti', type_noti)


        this.setState({
            show: !this.state.show,
        });
        const data = new FormData();
        data.append("user_id", user_id)
        try {
            let url = API_URL + "/user/list_user_by_id";
            Axios.post(url, data).then(function (res) {
                this.setState({
                    user_modal: {
                        first_name: res.data.data.first_name,
                        last_name: res.data.data.last_name,
                        email: res.data.data.email,
                        // line_id: res.data.data.line_id,
                        phone_number: res.data.data.phone_number,
                        address: res.data.data.address,
                        username: res.data.data.username,
                        password: res.data.data.password,
                        type_noti: res.data.data.type_noti
                    }
                })
            }.bind(this))
        } catch (error) { }
        console.log(this.state.user_modal)
    };

    handleChange(change, event) {
        var toChange = this.state.user_modal;
        toChange[change] = event.target.value;
        this.setState({ form: toChange });
    }

    handleSubmit = async () => {
        console.log(this.state.user_modal)
        const { user_modal } = this.state;
        const data = new FormData();
        data.append("user_id", localStorage.getItem("user_id"))
        if (user_modal.first_name) {
            data.append("first_name", user_modal.first_name);
        } else {
            data.append("first_name", this.state.first_name);
        }
        if (user_modal.last_name) {
            data.append("last_name", user_modal.last_name);
        } else {
            data.append("last_name", this.state.last_name);
        }
        if (user_modal.address) {
            data.append("address", user_modal.address);
        } else {
            data.append("address", this.state.address);
        }
        if (user_modal.email) {
            data.append("email", user_modal.email);
        } else {
            data.append("email", this.state.email);
        }
        if (user_modal.phone_number) {
            data.append("phone_number", user_modal.phone_number);
        } else {
            data.append("phone_number", this.state.phone_number);
        } if (user_modal.username) {
            data.append("username", user_modal.username);
        } if (user_modal.password) {
            data.append("password", user_modal.password);
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
                    let url = API_URL + "/user/update_user"
                    Axios.post(url, data).then(function (res) {
                        console.log(res.data.status)
                        console.log(res.data.data)
                        if (res.data.status == 1) {
                            Swal.fire(
                                'แก้ไขข้อมูลสำเร็จ',
                                '',
                                'success'
                            ).then(() => {
                                window.location.href = "/customer"
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
    };



    render() {
        const data = {
            columns: [
                {
                    label: 'ชื่อจริง',
                    field: 'name',
                },
                {
                    label: 'รายละเอียด',
                    field: 'drescription',
                },
                {
                    label: 'Email',
                    field: 'email',
                },
                {
                    label: 'เบอร์โทร',
                    field: 'phone_number',
                },

                {
                    label: 'ลบ',
                    field: 'bin',
                },
            ],
            rows: this.state.tableRows,
        }
        return (
            <div>
                <Desktop>
                    <div className=" bgAdmin1">
                        <Row>
                            <Col sm={2} style={{ height: "100vh" }}>
                                <Navleft />
                            </Col>
                            <Col sm={10}>
                                <div style={{ margin: '15px' }}>
                                    <div style={{ marginBottom: "15px", fontSize: "2em", fontWeight: "bold", padding: "10px 20px", color: "white", borderBottom: "2px solid white" }} >{this.state.header}</div>
                                    <Tabs defaultActiveKey="userOfNoti" className="editTabsNews">
                                        <Tab eventKey="userOfNoti" title="สมาชิกทั้งหมด" className="styleTabNews">
                                            <CardBody >
                                                <MDBDataTable
                                                    className="data-table-user"
                                                    small
                                                    striped
                                                    bordered
                                                    hover
                                                    data={data}
                                                />
                                            </CardBody>
                                            <Modal show={this.state.show} size="lg" aria-labelledby="contained-modal-title-vcenter" centered className="modal-style">
                                                <Modal.Body>
                                                    <Form style={{ padding: "20px 10px" }}>
                                                        <Row >
                                                            <Col style={{ padding: "5px" }}>
                                                                <Form.Group>
                                                                    <Form.Label>ชื่อ</Form.Label>
                                                                    <Form.Control
                                                                        onChange={this.handleChange.bind(this, "first_name")}
                                                                        name="first_name"
                                                                        value={this.state.user_modal.first_name}
                                                                        type="text"
                                                                        placeholder="ชื่อ" />
                                                                </Form.Group>
                                                            </Col>
                                                            <Col style={{ padding: "5px" }}>
                                                                <Form.Group >
                                                                    <Form.Label>นามสกุล</Form.Label>
                                                                    <Form.Control
                                                                        onChange={this.handleChange.bind(this, "last_name")}
                                                                        name="last_name"
                                                                        value={this.state.user_modal.last_name}
                                                                        type="text"
                                                                        placeholder="นามสกุล" />
                                                                </Form.Group>
                                                            </Col>
                                                        </Row>
                                                        <Row >
                                                            <Col style={{ padding: "5px" }}>
                                                                <Form.Group >
                                                                    <Form.Label>อีเมล</Form.Label>
                                                                    <Form.Control
                                                                        onChange={this.handleChange.bind(this, "email")}
                                                                        name="email"
                                                                        value={this.state.user_modal.email}
                                                                        type="text"
                                                                        placeholder="email" />
                                                                </Form.Group>
                                                            </Col>
                                                            <Col style={{ padding: "5px" }}>
                                                                <Form.Group >
                                                                    <Form.Label>เบอร์โทรศัพท์</Form.Label>
                                                                    <Form.Control
                                                                        onChange={this.handleChange.bind(this, "phone_number")}
                                                                        name="phone_number"
                                                                        value={this.state.user_modal.phone_number}
                                                                        type="text"
                                                                        placeholder="เบอร์โทรศัพท์" />
                                                                </Form.Group>
                                                            </Col>
                                                        </Row>
                                                        {this.state.user_modal.type_noti === "queue_noti" ? <Row >
                                                            <Col style={{ padding: "5px" }}>
                                                                <Form.Group >
                                                                    <Form.Label>วันที่จองคิว</Form.Label>
                                                                    <Form.Control
                                                                        onChange={this.handleChange.bind(this, "username")}
                                                                        name="date"
                                                                        // value={this.state.user_modal.username}
                                                                        type="text"
                                                                        placeholder="วันที่จองคิว" />
                                                                </Form.Group>
                                                            </Col>
                                                            <Col style={{ padding: "5px" }}>
                                                                <Form.Group >
                                                                    <Form.Label>เวลาจองคิว</Form.Label>
                                                                    <Form.Control
                                                                        onChange={this.handleChange.bind(this, "password")}
                                                                        name="time"
                                                                        // value={this.state.user_modal.password}
                                                                        type="text"
                                                                        placeholder="เวลาจองคิว" />
                                                                </Form.Group>
                                                            </Col>
                                                        </Row> : <></>}
                                                        <Form.Group style={{ padding: "5px" }}>
                                                            <Form.Label>รายละเอียดเพิ่มเติม</Form.Label>
                                                            <Form.Control
                                                                onChange={this.handleChange.bind(this, "address")}
                                                                name="drescription"
                                                                // value={this.state.user_modal.address}
                                                                type="text"
                                                                placeholder="ที่อยู่" />
                                                        </Form.Group>
                                                    </Form>
                                                </Modal.Body>
                                                <Modal.Footer>
                                                    <Button onClick={() => this.handleSubmit()} className="btn-confirm" style={{ marginRight: "5px" }}>
                                                        บันทึก
                                                    </Button>
                                                    <Button onClick={() => { this.showModal() }} className="btn-cancel">
                                                        ยกเลิก
                                                    </Button>
                                                </Modal.Footer>
                                            </Modal>
                                        </Tab>
                                        <Tab eventKey="send-Message" title="ส่งข้อความ" className="styleTabNews">
                                            <SendToEmail />
                                            <SendToLine />
                                        </Tab>
                                        <Tab eventKey="approve" title="ขอรับบริการ" className="styleTabNews">
                                            <Approve />
                                        </Tab>
                                    </Tabs>
                                </div>
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
