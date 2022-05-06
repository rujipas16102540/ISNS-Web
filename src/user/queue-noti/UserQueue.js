import React, { Component } from 'react'
import { Form, Row, Col, Button, Modal, InputGroup, FormControl, Image, Tabs, Tab } from 'react-bootstrap'
import { BiLeftIndent, BiUserCircle } from "react-icons/bi";
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Swal from 'sweetalert2'
import Axios from 'axios'

import { API_URL } from '../../config/config'
import QR from '../image/QRcode.png'
import bank from '../image/bank.png'
import QRcode from '../image/QRcode.png'

import { slide as Menu } from 'react-burger-menu'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import "../StyleUser.css"
import { Link } from 'react-router-dom'

import parse from 'html-react-parser';
import { MDBDataTable, CardBody } from 'mdbreact';

import { setMinutes, setHours } from "date-fns";
import { RiTruckLine } from 'react-icons/ri'
import dayjs from 'dayjs'
import { useMediaQuery } from 'react-responsive'
import SelectNoti from './SelectNoti';
import CreateNoti from './CreateNoti';
import NavLeftUser from '../../component/NavLeftUser';

const url = API_URL + '/queue/list_queue';

const Desktop = ({ children }) => {
    const isDesktop = useMediaQuery({ minWidth: 768 })
    return isDesktop ? children : null
}
const Mobile = ({ children }) => {
    const isMobile = useMediaQuery({ maxWidth: 767 })
    return isMobile ? children : null
}

export default class UserQueue extends Component {

    constructor(props) {
        super(props);
        this.state = {
            line_uid: this.props.match.params.id,
            lst_noti: {},
            start_date: "",
            queueInfo: {
                drescription: "null"
            },
            userInfo: {},
            user_modal: {},
            historyQueue: [],
            user_id: localStorage.getItem("user_id"),
            username: localStorage.getItem("username"),
            password: localStorage.getItem("password"),
            show: false,
            show_qr: false,
            slc_hours: ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"],
            lstStatus: null,
            lstQueue_id: '',
            error: {
                errorname: '',
                errorsurname: ''
            },
            btnRadio: {},
            service: {},
        };

        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleSubmitQueueNoti = this.handleSubmitQueueNoti.bind(this);
        this.handlenameChange = this.handlenameChange.bind(this);
    }


    handleChangeDate(date) {
        this.setState({
            start_date: date
        })
    }
    handleChange = (action, value) => {
        let { queueInfo } = this.state;
        queueInfo[action] = value;
        this.setState({
            queueInfo,
        });
    };
    handlenameChange = (e) => {
        if (e.target.value.match("^[ก-๙]+$")) {
            this.setState({
                name: e.target.value,
                errorname: "",
            });
        } else {
            this.setState({
                errorname: "กรอกได้เฉพาะตัวอักษรภาษาไทย",
            });
        }
    }
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
    handleSubmitQueueNoti = async () => {
        let { queueInfo, lstStatus, btnRadio, userInfo, start_date } = this.state;
        let dmy = start_date.toString()
        let arr_date = dmy.split(" ")
        let date_format = arr_date[3] + "-" + this.changeMonth(arr_date[1]) + "-" + arr_date[2] + "T" + queueInfo.time + ":00.000000000"
        console.log('lstStatus : ', lstStatus)
        if (btnRadio.line_check !== undefined) {
            if (lstStatus !== null) {
                Swal.fire({
                    icon: 'warning',
                    title: 'มีการจองคิวแล้ว',
                    confirmButtonColor: '#218838',
                    confirmButtonText: 'ตกลง',
                })
            } else if (lstStatus === null) {
                const data = new FormData();
                data.append("prefix", userInfo.prefix)
                data.append("first_name", userInfo.first_name)
                data.append("last_name", userInfo.last_name)
                data.append("email", userInfo.email)
                data.append("phone_number", userInfo.phone_number)
                data.append("date", date_format)
                data.append("drescription", queueInfo.drescription)
                data.append("header", userInfo.header)
                data.append("status", "2")
                data.append("approve", "0")

                if (btnRadio.line_check === 2) {
                    try {
                        Swal.fire({
                            icon: 'question',
                            title: 'ต้องการจองคิวหรือไม่',
                            showCancelButton: true,
                            confirmButtonColor: '#218838',
                            cancelButtonColor: '#c82333',
                            confirmButtonText: 'ยืนยัน',
                            cancelButtonText: 'ยกเลิก'
                        }).then(async (result) => {
                            if (result.value) {
                                let url = API_URL + "/queue/save_queue"
                                Axios.post(url, data).then(function (res) {
                                    console.log('res.data.data', res.data.data)
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'รอพนักงานอนุมัติอีกครั้ง',
                                        confirmButtonColor: '#218838',
                                        confirmButtonText: 'ตกลง',
                                    }).then(() => {
                                        window.location.href = "/userqueue"
                                    })
                                }.bind(this))
                            }
                        })
                    } catch (error) {
                    }
                } else if (btnRadio.line_check === 1) {
                    try {
                        Swal.fire({
                            icon: 'question',
                            title: 'ต้องการจองคิวหรือไม่1',
                            showCancelButton: true,
                            confirmButtonColor: '#218838',
                            cancelButtonColor: '#c82333',
                            confirmButtonText: 'ยืนยัน',
                            cancelButtonText: 'ยกเลิก'
                        }).then(async (result) => {
                            if (result.value) {
                                let url = API_URL + "/queue/save_queue"
                                Axios.post(url, data).then(function (res) {
                                    window.location.assign(`https://line-login-6827c.web.app/`)  // ทดสอบหลังเอาขึ้น servr

                                    // window.location.assign(`https://isns-project.web.app`)  // ทดสอบหลังเอาขึ้น servr
                                }.bind(this))
                            }
                        })
                    } catch (error) {
                    }
                }
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
    handleSubmitNoti = async () => {
        let { queueInfo, lstStatus, btnRadio, userInfo } = this.state;
        if (btnRadio.line_check !== undefined) {
            if (lstStatus !== null) {
                Swal.fire({
                    icon: 'warning',
                    title: 'ได้ขอรับการแจ้งเตือนแล้ว',
                    confirmButtonColor: '#218838',
                    confirmButtonText: 'ตกลง',
                })
            } else if (lstStatus === null) {
                const data = new FormData();
                data.append("prefix", userInfo.prefix)
                data.append("first_name", userInfo.first_name)
                data.append("last_name", userInfo.last_name)
                data.append("email", userInfo.email)
                data.append("phone_number", userInfo.phone_number)
                data.append("drescription", queueInfo.drescription)
                data.append("header", userInfo.header)
                data.append("status", "2")
                data.append("approve", "0")

                if (btnRadio.line_check === 2) {
                    try {
                        Swal.fire({
                            icon: 'question',
                            title: 'ยืนยันรับการแจ้งเตือนหรือไม่',
                            showCancelButton: true,
                            confirmButtonColor: '#218838',
                            cancelButtonColor: '#c82333',
                            confirmButtonText: 'ยืนยัน',
                            cancelButtonText: 'ยกเลิก'
                        }).then(async (result) => {
                            if (result.value) {
                                let url = API_URL + "/queue/save_queue"
                                Axios.post(url, data).then(function (res) {
                                    console.log('res.data.data', res.data.data)
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'รอพนักงานอนุมัติอีกครั้ง',
                                        confirmButtonColor: '#218838',
                                        confirmButtonText: 'ตกลง',
                                    }).then(() => {
                                        window.location.href = "/userqueue"
                                    })
                                }.bind(this))
                            }
                        })
                    } catch (error) {
                    }
                } else if (btnRadio.line_check === 1) {
                    try {
                        Swal.fire({
                            icon: 'question',
                            title: 'ยืนยันรับการแจ้งเตือนหรือไม่',
                            showCancelButton: true,
                            confirmButtonColor: '#218838',
                            cancelButtonColor: '#c82333',
                            confirmButtonText: 'ยืนยัน',
                            cancelButtonText: 'ยกเลิก'
                        }).then(async (result) => {
                            if (result.value) {
                                let url = API_URL + "/queue/save_queue"
                                Axios.post(url, data).then(function (res) {
                                    window.location.assign(`https://isns-project.web.app`)  // ทดสอบหลังเอาขึ้น servr
                                }.bind(this))
                            }
                        })
                    } catch (error) {
                    }
                }
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
    showModal = async (user_id) => {
        this.setState({
            show: !this.state.show,
        });
        const data = new FormData();
        data.append("user_id", user_id)
        try {
            let url = API_URL + "/user/list_user_by_id";
            Axios.post(url, data).then(function (res) {
                console.log(res.data.data)
                this.setState({
                    user_modal: {
                        first_name: res.data.data.first_name,
                        last_name: res.data.data.last_name,
                        email: res.data.data.email,
                        phone_number: res.data.data.phone_number,
                        address: res.data.data.address,
                        password: res.data.data.password,
                    }
                })
            }.bind(this))
        } catch (error) { }
    }
    handleChangeInModal(change, event) {
        var toChange = this.state.user_modal;
        toChange[change] = event.target.value;
        this.setState({ form: toChange });
    }
    handleSubmitEdit = async () => {
        const { user_modal } = this.state;
        const data = new FormData();
        let validationName = /^[ก-๙]+$/
        let validationEmail = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i
        let validationPhone = /^[0-9]+$/
        let validationAddress = /^[ก-๙/. 0-9]+$/
        let validationUser_Pass = /^[a-zA-Z0-9.]*$/
        if (validationName.test(user_modal.first_name) && validationName.test(user_modal.last_name)) {
            if (validationEmail.test(user_modal.email)) {
                if (validationPhone.test(user_modal.phone_number)) {
                    if (validationAddress.test(user_modal.address)) {
                        if (validationUser_Pass.test(user_modal.password)) {
                            if (user_modal.password === user_modal.confirm_password) {
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
                                }
                                if (user_modal.password) {
                                    data.append("password", user_modal.password);
                                } else {
                                    data.append("password", this.state.password);
                                }
                                data.append("username", this.state.username)

                                try {
                                    Swal.fire({
                                        title: 'ต้องการแก้ไขข้อมูลหรือไม่',
                                        icon: 'question',
                                        showCancelButton: true,
                                        confirmButtonColor: '#218838',
                                        cancelButtonColor: '#c82333',
                                        confirmButtonText: 'ยืนยัน',
                                        cancelButtonText: 'ยกเลิก'
                                    }).then(async (result) => {
                                        if (result.value) {
                                            let url = API_URL + "/user/update_user"
                                            Axios.post(url, data).then(function (res) {
                                                console.log(res.data.status)
                                                console.log(res.data.data)
                                                if (res.data.status == 1) {
                                                    this.setState({
                                                        // data_customer: res.data.data
                                                    })
                                                    Swal.fire({
                                                        icon: 'success',
                                                        title: 'แก้ไขข้อมูลสำเร็จ',
                                                        confirmButtonColor: '#218838',
                                                        confirmButtonText: 'ตกลง',
                                                    }).then(() => {
                                                        // localStorage.removeItem("first_name");
                                                        window.location.assign("/userqueue")

                                                    })
                                                } else if (res.data.status == 0) {
                                                    Swal.fire({
                                                        icon: 'warning',
                                                        title: 'แก้ไขข้อมูลไม่สำเร็จ',
                                                        confirmButtonColor: '#218838',
                                                        confirmButtonText: 'ตกลง',
                                                    })
                                                } else if (res.data.message == "email") {
                                                    Swal.fire({
                                                        icon: 'error',
                                                        title: 'Email มีผู้ใช้งานแล้ว',
                                                        confirmButtonColor: '#218838',
                                                        confirmButtonText: 'ตกลง',
                                                    })
                                                }
                                            }.bind(this))
                                        }
                                    })
                                } catch (error) {
                                }
                            } else {
                                Swal.fire({
                                    icon: 'warning',
                                    title: 'รหัสผ่านไม่ตรงกัน',
                                    confirmButtonColor: '#218838',
                                    confirmButtonText: 'ตกลง',
                                })
                            }
                        } else {
                            Swal.fire({
                                icon: 'warning',
                                title: 'รหัสผ่านควรเป็น a-z,A-Z,0-9',
                                confirmButtonColor: '#218838',
                                confirmButtonText: 'ตกลง',
                            })
                        }
                    } else {
                        Swal.fire({
                            icon: 'warning',
                            title: 'ที่อยู่ไม่ถูกต้อง',
                            confirmButtonColor: '#218838',
                            confirmButtonText: 'ตกลง',
                        })
                    }
                } else {
                    Swal.fire({
                        icon: 'warning',
                        title: 'เบอร์โทรไม่ถูกต้อง',
                        confirmButtonColor: '#218838',
                        confirmButtonText: 'ตกลง',
                    })
                }
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'อีเมลไม่ถูกต้อง',
                    confirmButtonColor: '#218838',
                    confirmButtonText: 'ตกลง',
                })
            }
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'ชื่อและนามสกุลควรเป็นภาษาไทย',
                confirmButtonColor: '#218838',
                confirmButtonText: 'ตกลง',
            })
        }

    };

    componentDidMount = async () => {
        const { user_id, username } = this.state;
        if (this.state.username === null && this.state.password === null) {
            window.location.href = "/";
        }


        /////////////// list user by id ////////////////////////////
        try {
            const data = new FormData();
            data.append("user_id", user_id)
            let url = API_URL + "/user/list_user_by_id";
            await Axios.post(url, data).then(function (res) {
                this.setState({
                    userInfo: res.data.data
                })
                console.log('userInfo', this.state.userInfo.header)

            }.bind(this))
        } catch (error) { }

        ///////////////// list queue มาดักจองได้ครั้งละ 1 ครั้ง ////////////////////
        try {
            const data = new FormData();
            data.append("email", this.state.userInfo.email)
            let url = API_URL + "/queue/list_queue_by_email";
            await Axios.post(url, data).then(function (res) {
                console.log('data', res.data.data)
                let data = res.data.data
                for (let i = 0; i < data.length; i++) {

                    if (data[i].status !== "0") {
                        this.setState({
                            lstStatus: data[i].status,
                            lstQueue_id: data[i].queue_id
                        })
                    }

                }

                this.setState({
                    historyQueue: res.data.data,
                })
            }.bind(this))
        } catch (error) { }

        /////////////// update line_uid user and queue /////////////////
        if (this.state.line_uid !== undefined) {
            let data = new FormData()
            data.append("username", username)
            data.append("email", this.state.userInfo.email)
            data.append("line_uid", this.state.line_uid)
            let url_queue = API_URL + "/queue/update_line";
            await Axios.post(url_queue, data)

            let url_users = API_URL + "/user/update_line";
            await Axios.post(url_users, data).then(function (res) {
                if (res.data === "Success") {
                    Swal.fire({
                        icon: 'success',
                        title: 'รอพนักงานอนุมัติอีกครั้ง',
                        confirmButtonColor: '#218838',
                        confirmButtonText: 'ตกลง',
                    }).then(() => {
                        window.location.assign("/userqueue")
                    })
                }
            })
        }

        ////////////// list noti by header ////////////////
        try {
            // console.log('first', localStorage.getItem("header"))
            let data_noti = new FormData;
            data_noti.append("header", this.state.userInfo.header)
            let url_noti = API_URL + "/other_noti/list_noti_by_header";
            await Axios.post(url_noti, data_noti).then(function (res) {
                this.setState({
                    lst_noti: res.data.data
                })
            }.bind(this))
            // console.log('lst_noti', this.state.lst_noti)
        } catch (error) { }
    }
    handleChangeRadio = (name, value) => {
        let { btnRadio } = this.state
        btnRadio[name] = value
        if (value === 1) {
            this.setState({ show_qr: true })
        }
        this.setState({
            btnRadio,
            // service
        })
        console.log(btnRadio)
    }

    // componentWillMount = async () => {
    //     await Axios.get(url)
    //         .then(response => response.data)
    //         .then(data => {
    //             let result = data.data
    //             // console.log(`result`, result)
    //             result = result.sort((end, start) => Date.parse(end.date) - Date.parse(start.date))
    //             let arr = []
    //             // for (let i in result) {
    //             //     if (result[i].end_time != null && result[i].status !== "0" && result[i].approve == "1") {
    //             //         result[i].end_time = (dayjs(result[i].date).format('HH:mm')) + " น. - " + (Number(result[i].end_time) + Number(dayjs(result[i].date).format('HH'))) + ":00 น."

    //             //         result[i].date = dayjs(result[i].date).format("DD/MM/YYYY")
    //             //     }

    //             // }
    //             this.setState({
    //                 posts: result
    //             })
    //         })
    //         .then(async () => {
    //             this.setState({ tableRows: this.assemblePosts(), isLoading: false })
    //         });
    // }
    // assemblePosts = () => {
    //     // let newPosts = posts?.filter((el) => el.status !== "0" && el.approve === "1")
    //     // console.log(newPosts)
    //     let posts = this.state.posts.map((index, i) => {
    //         if (index.status !== "0" && index.approve == "1" || index.status !== "0" && index.approve == "2" || index.status !== "0" && index.approve == "3") {
    //             return (
    //                 {
    //                     time: index.end_time,
    //                     date: index.date,
    //                     // name: index.prefix + " " + index.first_name + " " + index.last_name
    //                     order: i + 1
    //                 }

    //             )

    //         }
    //     });
    //     return posts;
    // }

    onLogout = async () => {
        localStorage.clear()
        window.location.href = ('/');

    }


    render() {
        let { userInfo } = this.state
        let path = window.location.pathname
        // const data = {
        //     columns: [
        //         {
        //             label: 'ลำดับคิว',
        //             field: 'order',
        //         },
        //         {
        //             label: 'วันที่',
        //             field: 'date',
        //         },
        //         {
        //             label: 'เวลา',
        //             field: 'time',
        //         },
        //     ],
        //     rows: this.state.tableRows,
        // }

        return (
            <div>
                {/* แสดงหน้าQR Code */}
                <Modal style={{ textAlign: "center" }} show={this.state.show_qr} onHide={() => this.setState({ show_qr: false })} size="md" aria-labelledby="contained-modal-title-vcenter" centered className="modal-style">
                    <div >
                        <Modal.Header closeButton style={{ fontSize: "1.4em" }}>
                            <b>แสกน QR-Code เพื่อรับการแจ้งเตือนผ่าน Line</b>
                        </Modal.Header>
                        <Modal.Body style={{ padding: "3%" }} >
                            <div>
                                <Image src={QR} />
                            </div>
                            <div style={{ fontSize: "1.2em" }}>
                                <b>ID Line: </b>@456upmlb
                            </div>
                            <div style={{ marginTop: "3%" }}>
                                <Button onClick={() => this.setState({ show_qr: false })} className="btn-confirm">ตกลง</Button>
                            </div>
                        </Modal.Body>
                    </div>
                </Modal>
                {/* แก้ไขข้อมูลส่วนตัว */}
                <Modal show={this.state.show} size="lg" aria-labelledby="contained-modal-title-vcenter" centered className="modal-style">
                    <Modal.Body>
                        <Form style={{ padding: "20px 10px" }}>
                            <Row >
                                <Col style={{ padding: "5px" }}>
                                    <Form.Group>
                                        <Form.Label>ชื่อ</Form.Label>
                                        <Form.Control
                                            onChange={this.handleChangeInModal.bind(this, "first_name")}
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
                                            onChange={this.handleChangeInModal.bind(this, "last_name")}
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
                                            onChange={this.handleChangeInModal.bind(this, "email")}
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
                                            onChange={this.handleChangeInModal.bind(this, "phone_number")}
                                            name="phone_number"
                                            value={this.state.user_modal.phone_number}
                                            type="text"
                                            placeholder="เบอร์โทรศัพท์" />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group style={{ padding: "5px" }}>
                                        <Form.Label>ที่อยู่</Form.Label>
                                        <Form.Control
                                            onChange={this.handleChangeInModal.bind(this, "address")}
                                            name="address"
                                            value={this.state.user_modal.address}
                                            type="text"
                                            placeholder="ที่อยู่" />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group style={{ padding: "5px" }}>
                                        <Form.Label>รหัสผ่าน</Form.Label>
                                        <Row>
                                            <Col style={{ marginRight: "5px" }}>
                                                <Form.Control
                                                    type={this.state.showPassword ? "text" : "password"}
                                                    placeholder="รหัสผ่าน" onChange={this.handleChangeInModal.bind(this, "password")}
                                                    name="password"
                                                    value={this.state.user_modal.password}
                                                // placeholder="รหัสผ่าน"
                                                />
                                            </Col>
                                            <Col style={{ marginLeft: "5px" }}>
                                                <Form.Control
                                                    type={this.state.showPassword ? "text" : "password"}
                                                    onChange={this.handleChangeInModal.bind(this, "confirm_password")}
                                                    name="confirm_password"
                                                    placeholder="ยืนยันรหัสผ่าน" />
                                                <div style={{ position: "absolute", right: "12px", top: "0px", color: "black", alignItems: "center", display: "flex", height: "calc(1.5em + .75rem + 2px)" }}
                                                    onClick={() => this.setState({ showPassword: !this.state.showPassword })}>
                                                    {this.state.showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                                                </div>
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                        <div style={{ justifyContent: 'center', display: 'flex' }}>

                            <Button onClick={() => this.handleSubmitEdit()} className="btn-confirm" style={{ marginRight: "5px" }}>
                                บันทึก
                            </Button>
                            <Button onClick={() => { this.showModal() }} className="btn-cancel">
                                ยกเลิก
                            </Button>
                        </div>
                    </Modal.Body>
                </Modal>
                <Desktop>
                    <div className="UserBG">
                        <Row >
                            <Col sm={2} className="infoUser" style={{ height: "auto" }}>
                                <NavLeftUser />
                            </Col>
                            <Col sm={10} style={{ color: "#212529" }}>
                                {userInfo.type_noti === "true" ?
                                    <div>
                                        <div style={{ padding: "2% 15%" }}>
                                            <CardBody className="styleTabUserQueue">
                                                <div >
                                                    <h1>{this.state.lst_noti.header}</h1>
                                                </div>
                                                <div >
                                                    <h5>{this.state.lst_noti.drescription}</h5>
                                                </div>
                                                <Form >
                                                    <Row >
                                                        <Col sm={2} style={{ padding: "5px" }}>
                                                            <Form.Group controlId="prefix">
                                                                <Form.Label>คำนำหน้า</Form.Label>
                                                                <Form.Control
                                                                    value={this.state.userInfo.prefix} disabled />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col sm={5} style={{ padding: "5px" }}>
                                                            <Form.Group controlId="name">
                                                                <Form.Label>ชื่อ</Form.Label>
                                                                <Form.Control
                                                                    value={this.state.userInfo.first_name} disabled />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col sm={5} style={{ padding: "5px" }}>
                                                            <Form.Group controlId="surname">
                                                                <Form.Label>นามสกุล</Form.Label>
                                                                <Form.Control
                                                                    value={this.state.userInfo.last_name} disabled />
                                                            </Form.Group>
                                                        </Col>
                                                    </Row>
                                                    <Row >
                                                        <Col sm={6} style={{ padding: "5px" }}>
                                                            <Form.Group controlId="email">
                                                                <Form.Label>อีเมล</Form.Label>
                                                                <Form.Control value={this.state.userInfo.email} disabled />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col sm={6} style={{ padding: "5px" }}>
                                                            <Form.Group controlId="phone_number">
                                                                <Form.Label>เบอร์โทร</Form.Label>
                                                                <Form.Control value={this.state.userInfo.phone_number} disabled />
                                                            </Form.Group>
                                                        </Col>
                                                    </Row>

                                                    {/* วันเวลาจองคิว */}
                                                    {this.state.lst_noti.send_message === "true" ?
                                                        <Row>
                                                            <Col sm={6} style={{ padding: "5px" }}>
                                                                <Form.Group>
                                                                    <Form.Label>วันที่จองคิว</Form.Label>
                                                                    <div>
                                                                        <DatePicker
                                                                            selected={this.state.start_date}
                                                                            onChange={this.handleChangeDate}
                                                                            dateFormat="d MMMM yyyy"
                                                                            minDate={new Date()}
                                                                            filterDate={date => date.getDay() != 6 && date.getDay() != 0}
                                                                            className="form-control"
                                                                            placeholderText="กำหนดการจองคิว"
                                                                        />
                                                                    </div>
                                                                </Form.Group>
                                                            </Col>
                                                            <Col sm={6} style={{ padding: "5px" }}>
                                                                <Form.Group >
                                                                    <Form.Label>เวลาจองคิว </Form.Label>
                                                                    <Form.Control as="select" onChange={e => this.handleChange('time', e.target.value)}>
                                                                        <option disabled selected>เลือกเวลา</option>
                                                                        {this.state.slc_hours.map((index, i) =>
                                                                            <option value={index}>{index} น.</option>
                                                                        )}
                                                                    </Form.Control>
                                                                </Form.Group>
                                                            </Col>
                                                        </Row>
                                                        : <></>}
                                                    {/* รายละเอียดเพิ่มเติม */}
                                                    {this.state.lst_noti.comment === "true" ?
                                                        <Row >
                                                            <Col sm={12} style={{ padding: "5px" }}>
                                                                <Form.Group >
                                                                    <Form.Label> รายละเอียดเพิ่มเติม </Form.Label>
                                                                    <Form.Control
                                                                        onChange={(e) => this.handleChange("drescription", e.target.value)}
                                                                        placeholder="รายละเอียดเพิ่มเติม" />
                                                                </Form.Group>
                                                            </Col>
                                                        </Row>
                                                        : <></>}

                                                    <Row>
                                                        <Col style={{ padding: "5px" }} >
                                                            <Form.Label>
                                                                ต้องการแจ้งเตือนผ่าน Line หรือไม่
                                                            </Form.Label>
                                                            <InputGroup.Prepend>
                                                                <InputGroup.Radio name={"line_check"} onChange={(e) => this.handleChangeRadio("line_check", 1)} />
                                                                <Form.Label style={{ alignItems: "center", display: "flex" }}>ต้องการ</Form.Label>
                                                                <InputGroup.Radio name={"line_check"} onChange={(e) => this.handleChangeRadio("line_check", 2)} />
                                                                <Form.Label style={{ alignItems: "center", display: "flex", }}>ไม่ต้องการ</Form.Label>
                                                            </InputGroup.Prepend>
                                                        </Col>
                                                        <Col style={{ padding: "1.5%", justifyContent: "flex-end", display: "flex" }} >
                                                            <Button onClick={this.handleSubmitQueueNoti} style={{ marginRight: "10px" }} className="btn-confirm">
                                                                ยืนยันจองคิว
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                </Form>
                                            </CardBody>
                                        </div>
                                    </div> :
                                    <div>
                                        <div style={{ padding: "2% 20%" }}>
                                            <Tabs defaultActiveKey="SelectNoti" style={{ borderBottom: "1px solid rgb(150,150,150)", fontSize: "1.2em" }} className="editTabsUserQueue">
                                                <Tab eventKey="SelectNoti" title="เลือกบริการ" className="styleTabUserQueue">
                                                    <SelectNoti />
                                                </Tab>
                                                <Tab eventKey="CreateNoti" title="สร้างบริการ" className="styleTabUserQueue">
                                                    <CreateNoti />
                                                </Tab>
                                            </Tabs>
                                        </div>
                                    </div>
                                }
                            </Col>
                        </Row >
                    </div >
                </Desktop >
            </div >

        )

    }
}