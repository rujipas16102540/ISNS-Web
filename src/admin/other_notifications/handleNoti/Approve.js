import React, { Component } from 'react'
import Axios from 'axios'
import { API_URL } from '../../../config/config'
import dayjs from 'dayjs'
import { MDBDataTable, CardBody } from 'mdbreact';
import { useMediaQuery } from 'react-responsive'
import { FaRegEdit } from 'react-icons/fa';
import { Col, Row, Tabs, Tab, Form, Button, Modal, ModalBody, Label } from 'react-bootstrap'
import Swal from 'sweetalert2'
import ModalHeader from 'react-bootstrap/esm/ModalHeader';

const Desktop = ({ children }) => {
    const isDesktop = useMediaQuery({ minWidth: 768 })
    return isDesktop ? children : null
}
const Mobile = ({ children }) => {
    const isMobile = useMediaQuery({ maxWidth: 767 })
    return isMobile ? children : null
}

const url = API_URL + '/queue/list_queue';
export default class Approve extends Component {
    constructor(props) {
        super(props);
        this.state = {
            queueInfo: {
                first_name: "",
                last_name: "",
                email: "",
                phone_number: "",
                approve: "1",  ////เมื่ออนุมัติแล้วจะเปลี่ยน 0 เป็น 1
                line_uid: "",
                comment: ""
            },
            userInfo: {},
            queue_modal: {},
            show_approve: false,
            show_disapprove: false,
            username: localStorage.getItem("username"),
            password: localStorage.getItem("password"),
            header: localStorage.getItem("header"),
            data_queue: [],
            page_accept: true,
            posts: [],
            isLoading: true,
            tableRows: [],

        };
    }
    // componentDidMount = async () =>{
    //     let url = API_URL + "/queue/list_queue";
    //     Axios.post(url, data).then(function (res) {
    //         this.setState({
    //             queue_modal: {
    //                 approve: this.state.queueInfo.approve,
    //                 queue_id: res.data.data.queue_id,
    //                 prefix: res.data.data.prefix,
    //                 first_name: res.data.data.first_name,
    //                 last_name: res.data.data.last_name,
    //                 email: res.data.data.email,
    //                 phone_number: res.data.data.phone_number,
    //                 line_uid: res.data.data.line_uid,
    //                 date: res.data.data.date,
    //                 drescription: res.data.data.drescription
    //             }
    //         })
    //     }.bind(this))
    // }

    componentWillMount = async () => {
        await Axios.get(url)
            .then(response => response.data)
            .then(data => {
                this.setState({
                    posts: data.data,
                })
            })
            .then(async () => {
                this.setState({ tableRows: this.assemblePosts(), isLoading: false })
                // console.log(this.state.tableRows);
            });
    }

    assemblePosts = () => {
        let posts = this.state.posts.map((index, i) => {
            if (index.header === this.state.header && index.approve === "0") {
                return (
                    {
                        name: index.prefix + " " + index.first_name + "  " + index.last_name,
                        drescription: index.drescription,
                        email: index.email,
                        phone_number: index.phone_number,
                        approve: <Button className="btn-confirm" onClick={() => { this.handleApprove(index.queue_id) }}>อนุมัติ</Button >,
                        disapprove: <Button className="btn-cancel" onClick={() => { this.showModalDisapprove(index.queue_id) }}> ไม่อนุมัติ </Button >
                    }
                )
            }
        });
        return posts;
    }

    showModalDisapprove = async (queue_id) => {
        localStorage.setItem("queue_id", queue_id)
        this.setState({
            show_disapprove: !this.state.show_disapprove,
        });

        const data = new FormData();
        data.append("queue_id", queue_id)
        try {
            let url = API_URL + "/queue/list_queue_by_id";
            Axios.post(url, data).then(function (res) {
                this.setState({
                    queue_modal: {
                        approve: this.state.queueInfo.approve,
                        queue_id: res.data.data.queue_id,
                        prefix: res.data.data.prefix,
                        first_name: res.data.data.first_name,
                        last_name: res.data.data.last_name,
                        email: res.data.data.email,
                        line_uid: res.data.data.line_uid,
                        drescription: res.data.data.drescription
                    }
                })
            }.bind(this))
        } catch (error) { }
        // console.log(this.state.queue_modal)
    };

    handleApprove = async (queue_id) => {
        const { queue_modal, queueInfo, userInfo } = this.state;
        const data = new FormData();
        data.append("queue_id", queue_id)
        let url = API_URL + "/queue/list_queue_by_id";
        Axios.post(url, data).then(function (res) {
            data.append("approve", "1")
            data.append("first_name", res.data.data.first_name)
            data.append("last_name", res.data.data.last_name)
            data.append("email", res.data.data.email)
            data.append("line_uid", res.data.data.line_uid)
            Swal.fire({
                title: 'อนุมัติการจองคิวหรือไม่',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes',
                cancelButtonText: 'cancel'
            }).then(async (result) => {
                if (result.value) {
                    let url = API_URL + "/queue/update_approve"
                    await Axios.post(url, data).then(function (res) {
                        if (res.data.status == 1) {
                            let url_send = API_URL + "/queue/approve_send";
                            Axios.post(url_send, data)
                            Swal.fire(
                                'อนุมัติสำเร็จ',
                                '',
                                'success'

                            ).then(() => {
                                window.location.href = "/other_notifications/handle_noti"
                            })
                        } else if (res.data.status == 0) {
                            Swal.fire(
                                'อนุมัติไม่สำเร็จ',
                                '',
                                'warning'
                            )
                        }
                    }.bind(this))
                }
            })
        }.bind(this))
    }

    handleDisapprove = async () => {
        const { queue_modal, queueInfo } = this.state;
        console.log('queue_modal', queue_modal)
        console.log('queue_modal', queueInfo)

        if (queueInfo.comment !== "") {
            const data = new FormData();
            data.append("comment", queueInfo.comment)
            data.append("queue_id", queue_modal.queue_id)
            data.append("first_name", queue_modal.first_name)
            data.append("last_name", queue_modal.last_name)
            data.append("email", queue_modal.email)
            data.append("line_uid", queue_modal.line_uid)

            try {
                Swal.fire({
                    title: 'ไม่อนุมัติการจองคิวหรือไม่',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'cancel'
                }).then(async (result) => {
                    if (result.value) {
                        let disapprove_send = API_URL + "/queue/disapprove_send";
                        await Axios.post(disapprove_send, data).then(function (res) {
                            console.log(res.data)
                            // console.log(res.data.data)
                            if (res.data = "Success") {
                                console.log("ได้แล้ว")
                                let url = API_URL + "/queue/cancel_queue"
                                Axios.post(url, data)
                                Swal.fire(
                                    'ไม่อนุมัติสำเร็จ',
                                    '',
                                    'success'
                                ).then(() => {
                                    window.location.href = "/other_notifications/handle_noti"
                                })
                            } else if (res.data.status == 0) {
                                Swal.fire(
                                    'ไม่อนุมัติไม่สำเร็จ',
                                    '',
                                    'warning'
                                )
                            }
                        }.bind(this))
                    }
                })
            } catch (error) {
            }
        } else {
            Swal.fire(
                'กรุณากรอกข้อมูลให้ครบ',
                '',
                'warning'
            )
        }
    }

    handleChange = (action, value) => {
        let { queueInfo } = this.state;
        queueInfo[action] = value;
        this.setState({
            queueInfo
        });
    };

    render() {
        if (this.state.username === null && this.state.password === null) {
            window.location.href = "/";
        }

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
                    label: 'อนุมัติ',
                    field: 'approve',
                },
                {
                    label: 'ไม่อนุมัติ',
                    field: 'disapprove',
                },
            ],
            rows: this.state.tableRows,
        }
        return (
            <div>
                <CardBody >
                    <MDBDataTable
                        className="data-table-approve-queue data-table-queue-hidden"
                        small
                        striped
                        bordered
                        hover
                        data={data}
                    />
                </CardBody>

                <Modal show={this.state.show_disapprove} size="lg" aria-labelledby="contained-modal-title-vcenter" centered className="modal-style">
                    <ModalBody>
                        <Row>
                            <h5> ชื่อ :&nbsp;</h5>{this.state.queue_modal.prefix} {this.state.queue_modal.first_name}    {this.state.queue_modal.last_name}
                        </Row>
                        <Row>
                            <h5> รายละเอียดเพิ่มเติม :&nbsp;</h5>{this.state.queue_modal.drescription}
                        </Row>
                        <Row>
                            <h5> อีเมล :&nbsp; </h5>{this.state.queue_modal.email}
                        </Row>
                        <Row>
                            <h5> เบอร์โทรติดต่อ :&nbsp; </h5>{this.state.queue_modal.phone_number}
                        </Row>
                        <Row>
                            <h5>หมายเหตุ :</h5>
                        </Row>

                        <Row>
                            <Form.Control
                                onChange={(e) => this.handleChange("comment", e.target.value)}
                                placeholder="หมายเหตุ" />
                        </Row>
                    </ModalBody>

                    <Modal.Footer>
                        <Button onClick={() => this.handleDisapprove()} className="btn-confirm" style={{ marginRight: "5px" }}>
                            ไม่อนุมัติ
                        </Button>
                        <Button onClick={() => { this.showModalDisapprove() }} className="btn-cancel">
                            ยกเลิก
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div >
        )
    }
}
