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
import './Queue.css'


const Desktop = ({ children }) => {
    const isDesktop = useMediaQuery({ minWidth: 768 })
    return isDesktop ? children : null
}
const Mobile = ({ children }) => {
    const isMobile = useMediaQuery({ maxWidth: 767 })
    return isMobile ? children : null
}

const url = API_URL + '/queue/list_queue';

export default class Progress extends Component {
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
                approve: "2",  ////เมื่อแจ้งรายละเอียดจะเปลี่ยน 1 เป็น 2
                service: "",
                price: "",
                end_time: "",
                line_uid: "",
                details: ""
            },
            queue_modal: {},
            show_details: false,
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
        await Axios.get(url)
            .then(response => response.data)
            .then(data => {
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
            if (index.approve == "1" || index.approve == "2" || index.approve == "3" || index.approve == "4") {
                return (
                    {
                        // name: index.prefix + " " + index.first_name + "  " + index.last_name,
                        name: `${index.prefix} ${index.first_name} ${index.last_name}`,
                        email: index.email,
                        // address: index.address,
                        // line_id: index.line_id,
                        phone_number: index.phone_number,
                        date: index.time + "น. " + index.date,
                        license_plate: index.consonant + " " + index.number + " " + index.province,
                        status: index.approve === "1" ? <div className="d-flex justify-content-center"><div className="status-red" style={{ marginRight: "2%" }}></div><span className="d-flex align-items-center">ยังไม่ดำเนินการซ่อม</span></div> :
                            index.approve === "2" ? <div className="d-flex justify-content-center"><div className="status-red" style={{ marginRight: "2%" }}></div><span>รอยืนยันการซ่อม</span></div> :
                                index.approve === "3" ? <div className="d-flex justify-content-center"><div className="status-green" style={{ marginRight: "2%" }}></div><span className="d-flex align-items-center">ดำเนินการซ่อมได้</span></div> :
                                    index.approve === "4" && <div className="d-flex justify-content-center"><div className="status-red" style={{ marginRight: "2%" }}></div><span className="d-flex align-items-center">รอการชำระเงิน</span></div>,
                        details_finish: index.approve === "1" ? <Button className="btn-edit" onClick={() => { this.showModalDetails(index.queue_id) }}> แจ้งรายละเอียด </Button > :
                            index.approve === "2" ? <Button className="btn-edit" onClick={() => { this.showModalDetails(index.queue_id) }}> แจ้งรายละเอียด </Button > :
                                index.approve === "3" ? <Button className="btn-confirm" onClick={() => { this.handleFinish(index.queue_id) }}>ซ่อมสำเร็จ</Button > :
                                    index.approve === "4" && <div className="d-flex justify-content-center"><Button className="btn-confirm" onClick={() => { this.handlePay(index.queue_id, index.email) }}>ชำระเงินแล้ว</Button ></div>,
                        cancel: <Button className="btn-cancel" onClick={() => { this.cancelHistory(index.queue_id) }}> ยกเลิก </Button >
                    }
                )
            }
        });
        return posts;
    }

    handleDetails = async (queue_id) => {
        let { queueInfo, queue_modal } = this.state
        const data = new FormData;
        data.append("queue_id", queue_modal.queue_id)
        data.append("first_name", queue_modal.first_name)
        data.append("last_name", queue_modal.last_name)
        data.append("approve", "2")
        data.append("email", queue_modal.email)

        data.append("details", queue_modal.details)
        data.append("price", queue_modal.price)
        data.append("end_time", queue_modal.end_time)
        try {
            Swal.fire({
                title: 'ต้องการแจ้งรายละเอียดหรือไม่',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes',
                cancelButtonText: 'cancel'
            }).then(async (result) => {
                if (result.value) {
                    let url = API_URL + "/queue/update_details_send"
                    await Axios.post(url, data).then(function (res) {
                        if (res.data.status == 1) {
                            Swal.fire(
                                'แจ้งรายละเอียดสำเร็จ',
                                '',
                                'success'
                            ).then(() => {
                                window.location.href = "/queue"
                            })
                        } else if (res.data.status == 0) {
                            Swal.fire(
                                'แจ้งรายละเอียดไม่สำเร็จ',
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

    showModalDetails = async (queue_id) => {
        localStorage.setItem("queue_id", queue_id)
        this.setState({
            show_details: !this.state.show_details,
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
                        price: res.data.data.price,
                        end_time: res.data.data.end_time,
                        details: res.data.data.details,
                    }
                })
            }.bind(this))
        } catch (error) { }
    }

    handleFinish = async (queue_id) => {
        const { queue_modal, queueInfo } = this.state;
        const data = new FormData();
        data.append("queue_id", queue_id)
        try {
            let url = API_URL + "/queue/list_queue_by_id";
            Axios.post(url, data).then(function (res) {
                console.log(res.data.data)
                Swal.fire({
                    title: 'ยืนยันดำเนินการสำเร็จ?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'cancel'
                }).then(async (result) => {
                    if (result.value) {
                        data.append("queue_id", res.data.data.queue_id)
                        data.append("approve", "4")
                        let url_update = API_URL + "/queue/update_approve"
                        await Axios.post(url_update, data).then(function (res) {
                            if (res.data.status == 1) {
                                data.append("first_name", res.data.data.first_name)
                                data.append("last_name", res.data.data.last_name)
                                data.append("line_uid", res.data.data.line_uid)
                                data.append("email", res.data.data.email)
                                let url_send = API_URL + "/queue/finish_send";
                                Axios.post(url_send, data)
                                Swal.fire(
                                    'ดำเนินการสำเร็จ',
                                    '',
                                    'success'

                                ).then(() => {
                                    window.location.href = "/queue"
                                })
                            } else if (res.data.status == 0) {
                                Swal.fire(
                                    'ดำเนินการไม่สำเร็จ',
                                    '',
                                    'warning'
                                )
                            }
                        })
                    }
                })
            }.bind(this))
        } catch (error) { }
    }

    handlePay = async (queue_id, email) => {
        console.log(email)
        let data = new FormData
        data.append("approve", "5")
        data.append("queue_id", queue_id)
        Swal.fire({
            title: 'ยืนยันดำเนินการสำเร็จ?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'cancel'
        }).then(async (result) => {
            if (result.value) {
                let url_update_approve_payment = API_URL + "/queue/update_approve"
                Axios.post(url_update_approve_payment, data).then(function (res) {
                    if (res.data.status == 1) {
                        data.append("email", email)
                        let url_update_approve_queue = API_URL + "/payment/update_approve_by_email"
                        Axios.post(url_update_approve_queue, data)

                        Swal.fire(
                            'ยืนยันการชำระเงินสำเร็จ',
                            '',
                            'success'
                        ).then(() => {
                            window.location.href = "/queue"
                        })
                    } else if (res.data.status == 0) {
                        Swal.fire(
                            'ยืนยันการชำระเงินไม่สำเร็จ',
                            '',
                            'warning'
                        )
                    }
                })
            }
        })
    }

    cancelHistory = async (queue_id) => {
        const data = new FormData();
        data.append("queue_id", queue_id)
        try {
            Swal.fire({
                title: 'ต้องการยกเลิกการคิวหรือไม่',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#218838',
                cancelButtonColor: '#c82333',
                confirmButtonText: 'ยืนยัน',
                cancelButtonText: 'ยกเลิก'
            }).then(async (result) => {
                if (result.value) {
                    let url = API_URL + "/queue/cancel_queue"
                    Axios.post(url, data).then(function (res) {
                        if (res.data.status == 1) {
                            Swal.fire({
                                icon: 'success',
                                title: 'ยกเลิกคิวสำเร็จ',
                                confirmButtonColor: '#218838',
                                confirmButtonText: 'ตกลง',
                            }).then(() => {
                                window.location.href = "/queue"
                                this.setState({
                                    lstStatus: null
                                })
                            })
                        } else if (res.data.status == 0) {
                            Swal.fire({
                                icon: 'warning',
                                title: 'ยกเลิกคิวไม่สำเร็จ',
                                confirmButtonColor: '#218838',
                                confirmButtonText: 'ตกลง',
                            }
                            )
                        }
                    }.bind(this))
                }
            })
        } catch (error) {
        }
    }

    handleChange = (action, value) => {
        let { queueInfo } = this.state;
        queueInfo[action] = value;
        this.setState({
            queueInfo
        });
    };

    handleChangeInModal(action, value) {
        let { queue_modal } = this.state;
        queue_modal[action] = value;
        this.setState({
            queue_modal
        });
    }


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
                // {
                //     label: 'ที่อยู่',
                //     field: 'address',
                // },
                // {
                //     label: 'Email',
                //     field: 'email',
                // },
                {
                    label: 'ป้ายทะเบียนรถ',
                    field: 'license_plate',
                },
                {
                    label: 'วันที่รับบริการ',
                    field: 'date',
                },
                {
                    label: 'สถานะ',
                    field: 'status',
                },
                // {
                //     label: 'ดำเนินการเสร็จ',
                //     field: 'finish',
                // },
                {
                    label: 'การดำเนินงาน',
                    field: 'details_finish',
                }

                ,
                {
                    label: 'ยกเลิก',
                    field: 'cancel',
                },
            ],
            rows: this.state.tableRows,
        }
        return (
            <div>
                <CardBody >
                    <MDBDataTable
                        className="data-table-progress data-table-queue-hidden"
                        small
                        striped
                        bordered
                        hover
                        data={data}
                    />
                </CardBody>

                <Modal show={this.state.show_details} size="lg" aria-labelledby="contained-modal-title-vcenter" centered className="modal-style">
                    <ModalHeader>
                        <h1>รายละเอียดซ่อมรถยนต์</h1>
                    </ModalHeader>
                    <ModalBody>
                        <Row >
                            <h4> ชื่อ : </h4>{this.state.queue_modal.prefix} {this.state.queue_modal.first_name}    {this.state.queue_modal.last_name}
                        </Row>
                        <Row style={{ alignItems: "center", paddingTop: " 1% " }}>
                            <h4>บริการ : </h4>{this.state.queue_modal.service}
                        </Row>
                        <Row style={{ paddingTop: " 2% " }} >
                            <h4> ป้ายทะเบียนรถ : </h4>{this.state.queue_modal.consonant} {this.state.queue_modal.number} {this.state.queue_modal.province}
                        </Row>
                        <Row style={{ paddingTop: " 2% " }}>
                            <h4> เบอร์โทรติดต่อ :</h4> {this.state.queue_modal.phone_number}
                        </Row>
                        <Row style={{ paddingTop: " 2% " }}>
                            <h4>ที่อยู่ :</h4> {this.state.queue_modal.address}
                        </Row>
                        <Row style={{ paddingTop: " 2% " }}>
                            <h4>รายละเอียดเพิ่มเติม :</h4>
                        </Row>
                        <Row >
                            <Form.Control
                                onChange={(e) => this.handleChangeInModal("details", e.target.value)}
                                value={this.state.queue_modal.details}
                                placeholder="รายละเอียดเพิ่มเติม"
                            />
                        </Row>
                        <Row style={{ paddingTop: " 2% " }}>
                            <Col >
                                <Row style={{ alignItems: "center" }}>
                                    <Col sm={2}>
                                        <h4> ราคา : </h4>
                                    </Col>
                                    <Col sm={5} style={{ paddingTop: " 0 10px" }} >
                                        <Form.Control
                                            // onChange={this.handleChangeInModal.bind(this, "price")}
                                            onChange={(e) => this.handleChangeInModal("price", e.target.value)}
                                            value={this.state.queue_modal.price}
                                            placeholder="ราคา" />
                                    </Col>
                                    <Col sm={5}>
                                        <h4> บาท </h4>
                                    </Col>
                                </Row>
                            </Col>
                            <Col >
                                <Row style={{ alignItems: "center" }}>
                                    <Col sm={5}>
                                        <h4> เวลาดำเนินการ : </h4>
                                    </Col>
                                    <Col sm={5} style={{ padding: " 0px 10px" }}>
                                        <Form.Control as="select" onChange={e => this.handleChangeInModal('end_time', e.target.value)}
                                            value={this.state.queue_modal.end_time}
                                        >
                                            <option disabled selected>เวลาดำเนินการ</option>
                                            {/* <option value="0.30">0.30</option> */}
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                        </Form.Control>
                                    </Col>
                                    <Col sm={2}>
                                        <h4>ชั่วโมง</h4>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </ModalBody>
                    <Modal.Footer>
                        <Button onClick={() => this.handleDetails()} className="btn-confirm" style={{ marginRight: "5px" }}>
                            แจ้งรายละเอียด
                        </Button>
                        <Button onClick={() => { this.showModalDetails() }} className="btn-cancel">
                            ยกเลิก
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}
