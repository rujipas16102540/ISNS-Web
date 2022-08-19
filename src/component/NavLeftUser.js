import React, { Component } from 'react'
import { Form, Row, Col, Button, Modal, InputGroup, FormControl, Image, Tabs, Tab } from 'react-bootstrap'
import { BiLeftIndent, BiUserCircle } from "react-icons/bi";
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Swal from 'sweetalert2'
import Axios from 'axios'
import { API_URL } from '../config/config'
export default class NavLeftUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lst_noti: {},
            lst_email: [],
            userInfo: {},
            user_modal: {},
            historyQueue: [],
            email: [],
            user_id: localStorage.getItem("user_id"),
            username: localStorage.getItem("username"),
            password: localStorage.getItem("password"),
            show: false,
            lstStatus: null,
            lstQueue_id: '',
            error: {
                errorname: '',
                errorsurname: ''
            },
        };
    }
    componentDidMount = async () => {
        let { lstStatus, lst_service } = this.state
        const { user_id, username } = this.state;
        if (this.state.username === null && this.state.password === null) {
            window.location.href = "/";
        }

        //////////////// list userInfo /////////////////////////
        try {
            const data = new FormData();
            data.append("user_id", user_id)
            let url = API_URL + "/user/list_user_by_id";
            await Axios.post(url, data).then(function (res) {
                // console.log("ข้อมูล : ", res.data.data)
                this.setState({
                    userInfo: res.data.data
                })
                // console.log('userInfo', this.state.userInfo)

            }.bind(this))
        } catch (error) { }

        ///////////////// list queue มาดักจองได้ครั้งละ 1 ครั้ง ////////////////////
        try {
            const data = new FormData();
            data.append("email", this.state.userInfo.email)
            let url = API_URL + "/queue/list_queue_by_email";
            await Axios.post(url, data).then(function (res) {
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

        ///////////////// list noti by header ////////////
        try {
            let data_noti = new FormData;
            data_noti.append("header", localStorage.getItem("header"))
            let url_noti = API_URL + "/other_noti/list_noti_by_header";
            await Axios.post(url_noti, data_noti).then(function (res) {
                this.setState({
                    lst_noti: res.data.data
                })
            }.bind(this))
        } catch (error) { }

        //////////////// list user all by header ///////////////
        try {
            let data_noti = new FormData;
            data_noti.append("header", localStorage.getItem("header"))
            let url_noti = API_URL + "/user/lst_user_by_header";
            await Axios.post(url_noti, data_noti).then(function (res) {
                let arr = []
                for (let i = 0; i <= res.data.data.length; i++) {
                    // arr.push(res.data.data[i].email)

                    this.setState({
                        lst_email: [...this.state.lst_email, res.data.data[i].email]
                    })
                }

                // this.setState({
                //     lst_email: arr
                // })


            }.bind(this))

        } catch (error) {
        }


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
    backToSelect = (username) => {
        Swal.fire({
            icon: 'question',
            title: 'ต้องการยกเลิกใช้บริการ?',
            showCancelButton: true,
            confirmButtonColor: '#218838',
            cancelButtonColor: '#c82333',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก'
        }).then(async (result) => {
            if (result.value) {
                let data1 = new FormData();
                data1.append("username", username)
                data1.append("header", null)
                data1.append("type_noti", null)
                let url = API_URL + "/user/update_type_noti";
                Axios.post(url, data1).then(function (res) {

                    let data_del = new FormData();
                    data_del.append("queue_id", this.state.lstQueue_id)
                    let url_del = API_URL + "/queue/cancel_queue"
                    Axios.post(url_del, data_del)

                    window.location.assign("/userqueue")
                }.bind(this))
            }
        })
    }
    delNoti = () => {
        console.log('test  ', this.state.userInfo.header)
        Swal.fire({
            icon: 'question',
            title: 'ต้องการลบบริการหรือไม่?',
            showCancelButton: true,
            confirmButtonColor: '#218838',
            cancelButtonColor: '#c82333',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก'
        }).then(async (result) => {
            if (result.value) {
                /////Update header type_noti user//////
                let data1 = new FormData();
                // data1.append("email", this.state.lst_email)
                data1.append("header", this.state.userInfo.header)
                // data1.append("type_noti", null)
                // data1.append("status", null)
                let url = API_URL + "/user/re_user";
                Axios.post(url, data1).then(function (res) {

                    //////Delete Noti/////////
                    let del_noti = new FormData
                    del_noti.append("other_noti_id", this.state.lst_noti.other_noti_id)
                    let url_del_noti = API_URL + "/other_noti/delete_noti"
                    Axios.post(url_del_noti, del_noti)

                    //////Delet Queue////////
                    let del_queue_user = new FormData
                    del_queue_user.append("header", localStorage.getItem("header"))
                    let url_del_queue = API_URL + "/queue/del_by_header"
                    Axios.post(url_del_queue, del_queue_user)


                    //////Delete Setting Noti By Header ////////////
                    let del_setting_noti = new FormData
                    del_setting_noti.append("header", localStorage.getItem("header"))
                    let url_del_Setting_noti = API_URL + "/setting_noti/del_by_header"
                    Axios.post(url_del_Setting_noti, del_setting_noti)

                    Swal.fire({
                        icon: 'success',
                        title: 'ลบบริการสำเร็จ',
                        confirmButtonColor: '#212529',
                        confirmButtonText: 'ตกลง',
                    }).then(() => {
                        window.location.assign("/userqueue")
                    })

                }.bind(this))


            }
        })
    }
    cancelHistory = async (queue_id) => {
        const data = new FormData();
        data.append("queue_id", queue_id)
        try {
            Swal.fire({
                title: 'ต้องการยกเลิกการจองคิวหรือไม่',
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
                        console.log(res.data.status)
                        console.log(res.data.data)
                        if (res.data.status == 1) {
                            Swal.fire({
                                icon: 'success',
                                title: 'ยกเลิกการจองคิวสำเร็จ',
                                confirmButtonColor: '#218838',
                                confirmButtonText: 'ตกลง',
                            }).then(() => {
                                window.location.href = "/userqueue"
                                this.setState({
                                    lstStatus: null
                                })
                            })
                        } else if (res.data.status == 0) {
                            Swal.fire({
                                icon: 'warning',
                                title: 'ยกเลิกการจองคิวไม่สำเร็จ',
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
    render() {
        let { userInfo } = this.state
        return (
            <div >
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
                <div style={{ height: "100vh" }}>
                    <div style={{ justifyContent: "center", display: "flex", paddingTop: "15px" }}><BiUserCircle size={100} /></div>
                    <div >
                        ชื่อ: {this.state.userInfo.prefix + " " + this.state.userInfo.first_name}
                    </div>
                    <div>
                        นามสกุล: {this.state.userInfo.last_name}
                    </div>
                    <div>
                        อีเมล: {this.state.userInfo.email}
                    </div>
                    <div>
                        เบอร์โทร: {this.state.userInfo.phone_number}
                    </div>
                    <div style={{ marginBottom: "15px" }}>
                        ที่อยู่: {this.state.userInfo.address}
                    </div>

                    <div style={{ justifyContent: "center", display: "flex", marginBottom: "5%" }}>
                        <Button className="btn-edit" onClick={() => { this.showModal(this.state.user_id) }}>
                            แก้ไขข้อมูล
                        </Button>
                    </div>
                    {userInfo.type_noti === "true" ? <div style={{ justifyContent: "center", display: "flex", marginBottom: "5%" }}>
                        <Button className="btn-cancel" onClick={() => { this.backToSelect(userInfo.username) }}>
                            ยกเลิกใช้บริการ
                        </Button>
                    </div> : <></>}
                    {userInfo.status === "creator" ? <div style={{ justifyContent: "center", display: "flex", marginBottom: "5%" }}>
                        <Button className="btn-cancel" onClick={() => { this.delNoti(userInfo.username) }}>
                            ลบบริการ
                        </Button>
                    </div> : <></>}
                    <div style={{ justifyContent: "center", display: "flex", marginBottom: "5%" }}>
                        <Button className="btn-cancel" onClick={() => { window.location.assign("/") }}>
                            ออกจากระบบ
                        </Button>
                    </div>
                    <div style={{ width: "100%", borderTop: "2px solid white" }}>
                        {this.state.historyQueue.length === 0 ?
                            <></> :
                            <>
                                {/* ////////// เช็คสาถนะว่าแอดมินอนุมัติยัง ///////////// */}
                                {this.state.historyQueue.map((e, i) => {
                                    if (e.status !== "0" && e.approve == "1" && userInfo.type_noti === "true") {
                                        return (
                                            <div style={{ textAlign: "center", marginTop: "5%", fontSize: "100%" }}>
                                                <f30px style={{ color: "green" }}>
                                                    ดำเนินการอยู่
                                                </f30px>
                                                <div style={{ marginTop: "5%" }}>
                                                    <Button className="btn-cancel" onClick={() => { this.cancelHistory(e.queue_id) }}>
                                                        ยกเลิกจองคิว
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                    } else if (e.status !== "0" && e.approve == "0" && userInfo.type_noti === "true") {
                                        return (
                                            <div style={{ textAlign: "center", marginTop: "5%" }}>
                                                <f30px style={{ color: "red" }}>
                                                    รอการอนุมัติ
                                                </f30px>
                                                <div style={{ marginTop: "5%" }}>
                                                    <Button className="btn-cancel" onClick={() => { this.cancelHistory(e.queue_id) }}>
                                                        ยกเลิกจองคิว
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                    }
                                }
                                )}
                            </>
                        }
                    </div>
                </div>
            </div>
        )
    }
}
