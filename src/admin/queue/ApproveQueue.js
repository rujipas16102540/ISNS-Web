import React, { Component } from 'react'
// import { Button } from 'react-bootstrap'
import Axios from 'axios'
import { API_URL } from '../../config/config'
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
export default class ApproveQueue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            queueInfo: {
                first_name: "",
                last_name: "",
                email: "",
                start_time: "",
                address: "",
                phone_number: "",
                consonant: "",
                number: "",
                province: "",
                approve: "1",  ////เมื่ออนุมัติแล้วจะเปลี่ยน 0 เป็น 1
                servicr: "",
                price: "",
                end_time: "",
                line_uid: "",
                comment: ""
            },
            queue_modal: {},
            show_approve: false,
            show_disapprove: false,
            username: localStorage.getItem("username"),
            password: localStorage.getItem("password"),
            data_queue: [],
            page_accept: true,
            posts: [],
            isLoading: true,
            tableRows: [],
        };
    }

    componentWillMount = async () => {
        console.log(url)
        await Axios.get(url)
            .then(response => response.data)
            .then(data => {
                console.log(data)
                let result = data.data
                for (let i in result) {
                    let date_time = dayjs(result[i].date).format("DD/MM/YYYY HH:mm")
                    // console.log('date_time', date_time)
                    result[i].time = date_time.split(" ")[1]
                    result[i].date = date_time.split(" ")[0]
                }
                this.setState({
                    posts: result
                })
                console.log(this.state.posts)
            })
            .then(async () => {
                this.setState({ tableRows: this.assemblePosts(), isLoading: false })
                // console.log(this.state.tableRows);
            });
    }

    assemblePosts = () => {
        let posts = this.state.posts.map((index, i) => {
            if (index.approve == "0") {
                return (
                    {
                        name: index.prefix + " " + index.first_name + "  " + index.last_name,
                        email: index.email,
                        address: index.address,
                        // line_id: index.line_id,
                        phone_number: index.phone_number,
                        date: index.time + "น. " + index.date,
                        license_plate: index.consonant + " " + index.number + " " + index.province,
                        approve: <Button className="btn-confirm" onClick={() => { this.showModalApprove(index.queue_id) }}>อนุมัติ</Button >,
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
                console.log(res.data.data)
                this.setState({
                    queue_modal: {
                        approve: this.state.queueInfo.approve,
                        queue_id: res.data.data.queue_id,
                        first_name: res.data.data.first_name,
                        last_name: res.data.data.last_name,
                        email: res.data.data.email,
                        prefix: res.data.data.prefix,
                        phone_number: res.data.data.phone_number,
                        address: res.data.data.address,
                        consonant: res.data.data.consonant,
                        number: res.data.data.number,
                        province: res.data.data.province,
                        service: res.data.data.service,
                        line_uid: res.data.data.line_uid,
                        date: res.data.data.date,
                        price: "",
                        end_time: "",
                    }
                })
            }.bind(this))
        } catch (error) { }
        // console.log(this.state.queue_modal)
    };

    showModalApprove = async (queue_id) => {
        localStorage.setItem("queue_id", queue_id)
        this.setState({
            show_approve: !this.state.show_approve,
        });

        const data = new FormData();
        data.append("queue_id", queue_id)
        try {
            let url = API_URL + "/queue/list_queue_by_id";
            Axios.post(url, data).then(function (res) {
                console.log(res.data.data)
                this.setState({
                    queue_modal: {
                        approve: this.state.queueInfo.approve,
                        queue_id: res.data.data.queue_id,
                        first_name: res.data.data.first_name,
                        last_name: res.data.data.last_name,
                        email: res.data.data.email,
                        prefix: res.data.data.prefix,
                        phone_number: res.data.data.phone_number,
                        address: res.data.data.address,
                        consonant: res.data.data.consonant,
                        number: res.data.data.number,
                        province: res.data.data.province,
                        service: res.data.data.service,
                        line_uid: res.data.data.line_uid,
                        date: res.data.data.date,
                        price: "",
                        end_time: "",
                    }
                })
            }.bind(this))
        } catch (error) { }
    };

    handleApprove = async () => {
        const { queue_modal, queueInfo } = this.state;
        console.log(queue_modal)
        // if (queueInfo.price !== "" && queueInfo.end_time !== "") {
        const data = new FormData();
        data.append("queue_id", queue_modal.queue_id)
        data.append("first_name", queue_modal.first_name)
        data.append("last_name", queue_modal.last_name)
        // data.append("price", queueInfo.price)
        // data.append("end_time", queueInfo.end_time)
        data.append("approve", queue_modal.approve)
        data.append("date", queue_modal.date)
        data.append("email", queue_modal.email)
        data.append("line_uid", queue_modal.line_uid)
        try {
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
                                window.location.href = "/queue"
                            })
                        } else if (res.data.status == 0) {
                            Swal.fire(
                                'อนุมัติไม่สำเร็จ',
                                '',
                                'warning'
                            ).then(() => {
                                this.setState({
                                    queueInfo: {
                                        price: "",
                                        end_time: "",
                                    },
                                });
                            })
                        }
                    }.bind(this))
                }
            })
        } catch (error) {
        }
        // } else {
        //     Swal.fire(
        //         'กรุณากรอกข้อมูลให้ครบ',
        //         '',
        //         'warning'
        //     )
        // }
    }

    handleDisapprove = async () => {
        const { queue_modal, queueInfo } = this.state;
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
                                    window.location.href = "/queue"
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
                    label: 'ที่อยู่',
                    field: 'address',
                },
                {
                    label: 'Email',
                    field: 'email',
                },
                {
                    label: 'ป้ายทะเบียนรถ',
                    field: 'license_plate',
                },
                {
                    label: 'วันที่รับบริการ',
                    field: 'date',
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

                <Modal show={this.state.show_approve} size="lg" aria-labelledby="contained-modal-title-vcenter" centered className="modal-style">
                    <ModalHeader>
                        <h2>ข้อมูลลูกค้า</h2>
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <h4>ชื่อ :</h4> {this.state.queue_modal.prefix} {this.state.queue_modal.first_name}    {this.state.queue_modal.last_name}
                        </Row>
                        <Row >
                            <h4>บริการ :</h4> {this.state.queue_modal.service}
                        </Row>

                        <Row>
                            <h4>ป้ายทะเบียนรถ :</h4> {this.state.queue_modal.consonant} {this.state.queue_modal.number} {this.state.queue_modal.province}
                        </Row>
                        <Row>
                            <h4>เบอร์โทรติดต่อ :</h4> {this.state.queue_modal.phone_number}
                        </Row>
                        <Row>
                            <h4>ที่อยู่ :</h4> {this.state.queue_modal.address}
                        </Row>

                    </ModalBody>
                    <Modal.Footer>
                        <Button onClick={() => this.handleApprove()} className="btn-confirm" style={{ marginRight: "5px" }}>
                            บันทึก
                        </Button>
                        <Button onClick={() => { this.showModalApprove() }} className="btn-cancel">
                            ยกเลิก
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.show_disapprove} size="lg" aria-labelledby="contained-modal-title-vcenter" centered className="modal-style">
                    <ModalBody>
                        <Row>
                            ชื่อ : {this.state.queue_modal.prefix} {this.state.queue_modal.first_name}    {this.state.queue_modal.last_name}
                        </Row>
                        <Row style={{ alignItems: "center" }}>
                            บริการ : {this.state.queue_modal.service}
                        </Row>
                        <Row>
                            ป้ายทะเบียนรถ : {this.state.queue_modal.consonant} {this.state.queue_modal.number} {this.state.queue_modal.province}
                        </Row>
                        <Row>
                            เบอร์โทรติดต่อ : {this.state.queue_modal.phone_number}
                        </Row>
                        <Row>
                            ที่อยู่ : {this.state.queue_modal.address}
                        </Row>
                        <Row>
                            <h4>หมายเหตุ :</h4>
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
            </div>
        )
    }
}
