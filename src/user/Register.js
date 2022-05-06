import React, { Component } from 'react'
import { Form, Row, Col, Button, Image, Modal, InputGroup } from 'react-bootstrap'
import Axios from 'axios'
import { API_URL } from '../config/config'
import Swal from 'sweetalert2'
import { useMediaQuery } from 'react-responsive'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';


const Desktop = ({ children }) => {
    const isDesktop = useMediaQuery({ minWidth: 768 })
    return isDesktop ? children : null
}
const Mobile = ({ children }) => {
    const isMobile = useMediaQuery({ maxWidth: 767 })
    return isMobile ? children : null
}
const initialState = {
    name: "",
    email: "",
    password: "",
    nameError: "",
    emailError: "",
    passwordError: ""
};

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showPassword: false,
            line_uid: this.props.match.params.id,
            line_status: {},
            userInfo: {
                username: "",
                password: "",
                confirm_password: "",
                first_name: "",
                last_name: "",
                address: "",
                prefix: "",
                email: "",
                phone_number: "",
                user_type: "2"
            },
        };
    }

    handleSubmit = async () => {
        let { userInfo } = this.state;
        let validationUser_Pass = /^[a-zA-Z0-9.]*$/
        let validationName = /^[ก-๙]+$/
        let validationEmail = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i
        let validationPhone = /^[0-9]+$/
        let validationAddress = /^[ก-๙/. 0-9]+$/
        if (userInfo.username && userInfo.password && userInfo.first_name && userInfo.last_name && userInfo.address && userInfo.user_type && userInfo.prefix && userInfo.phone_number && userInfo.email) {
            if (userInfo.confirm_password === userInfo.password) {
                if (validationUser_Pass.test(userInfo.username) && validationUser_Pass.test(userInfo.password)) {
                    if (validationName.test(userInfo.first_name) && validationName.test(userInfo.last_name)) {
                        if (validationEmail.test(userInfo.email)) {
                            if (validationPhone.test(userInfo.phone_number)) {
                                if (validationAddress.test(userInfo.address)) {
                                    const data = new FormData();
                                    data.append("username", userInfo.username)
                                    data.append("password", userInfo.password)
                                    data.append("first_name", userInfo.first_name)
                                    data.append("last_name", userInfo.last_name)
                                    data.append("address", userInfo.address)
                                    data.append("user_type", userInfo.user_type)
                                    data.append("prefix", userInfo.prefix)
                                    data.append("email", userInfo.email)
                                    data.append("phone_number", userInfo.phone_number)

                                    try {
                                        Swal.fire({
                                            title: 'ต้องการสมัครสมาชิกหรือไม่',
                                            icon: 'question',
                                            showCancelButton: true,
                                            confirmButtonColor: '#218838',
                                            cancelButtonColor: '#c82333',
                                            confirmButtonText: 'ยืนยัน',
                                            cancelButtonText: 'ยกเลิก'
                                        }).then(async (result) => {
                                            if (result.value) {
                                                let url = API_URL + "/user/register"
                                                Axios.post(url, data).then(function (res) {
                                                    console.log(res.data.message)
                                                    console.log(res.data.status)
                                                    if (res.data.status == 1) {
                                                        Swal.fire({
                                                            icon: 'success',
                                                            title: 'สมัครสมาชิกสำเร็จ',
                                                            confirmButtonColor: '#218838',
                                                            confirmButtonText: 'ตกลง',
                                                        }).then(() => {
                                                            this.props.history.push("/");
                                                        })
                                                    } else if (res.data.status == 0) {
                                                        Swal.fire({
                                                            icon: 'warning',
                                                            title: 'ชื่อผู้ใช้งาน หรือ Email มีอยู่แล้ว  ',
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
                                        title: 'ที่อยู่ไม่ถูกต้อง',
                                        confirmButtonColor: '#218838',
                                        confirmButtonText: 'ตกลง',
                                    })
                                    console.log("ที่อยู่ไม่ถูกต้อง")
                                }
                            } else {
                                Swal.fire({
                                    icon: 'warning',
                                    title: 'เบอร์โทรศัพท์ควรเป็นตัวเลข 0-9',
                                    confirmButtonColor: '#218838',
                                    confirmButtonText: 'ตกลง',
                                })
                                console.log("เบอร์โทรศัพท์ไม่ถูกต้อง")
                            }
                        } else {
                            Swal.fire({
                                icon: 'warning',
                                title: 'อีเมลไม่ถูกต้อง',
                                confirmButtonColor: '#218838',
                                confirmButtonText: 'ตกลง',
                            })
                            console.log("อีเมลไม่ถูกต้อง")
                        }
                    } else {
                        Swal.fire({
                            icon: 'warning',
                            title: 'ชื่อควรเป็นภาษาไทย',
                            confirmButtonColor: '#218838',
                            confirmButtonText: 'ตกลง',
                        })
                        console.log("ชื่อควรเป็นภาษาไทย")
                    }
                } else {
                    Swal.fire({
                        icon: 'warning',
                        title: 'ชื่อผู้ใช้งานและรหัสผ่านควรเป็น a-z,A-Z,0-9',
                        confirmButtonColor: '#218838',
                        confirmButtonText: 'ตกลง',
                    })
                    console.log("ชื่อผู้ใช้งานหรือรหัสผ่านควรเป็น a-z,A-Z,0-9")
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
                title: 'กรุณากรอกข้อมูลให้ครบ',
                confirmButtonColor: '#218838',
                confirmButtonText: 'ตกลง',
            })
        }
    };

    handleChange = (action, value) => {
        let { userInfo } = this.state;
        userInfo[action] = value;
        this.setState({
            userInfo,
        });
    };





    render() {

        return (
            <div>
                <Desktop>
                    <div className="bg-register" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backdropFilter: "blur(5px)" }}>
                        <div className='Userform'>
                            <Form >
                                <div>
                                    <f50px>สมัครสมาชิก</f50px>
                                </div>
                                <Row >
                                    <Col style={{ padding: "5px" }}>
                                        <Form.Group >
                                            <Form.Label>ผู้ใช้งาน</Form.Label>
                                            <Form.Control maxLength={20} formNoValidate placeholder="ผู้ใช้งาน" onChange={(e) => this.handleChange("username", e.target.value)} value={this.state.userInfo.username} />

                                        </Form.Group>
                                    </Col>
                                    <Col style={{ padding: "5px" }}>
                                        <Form.Group >
                                            <Form.Label>รหัสผ่าน</Form.Label>
                                            <Row>
                                                <Col style={{ marginRight: "5px" }}>
                                                    <Form.Control maxLength={20}
                                                        type={this.state.showPassword ? "text" : "password"}
                                                        placeholder="รหัสผ่าน" onChange={(e) => this.handleChange("password", e.target.value)} />
                                                </Col>
                                                <Col style={{ marginLeft: "5px" }}>
                                                    <Form.Control
                                                        type={this.state.showPassword ? "text" : "password"}
                                                        placeholder="ยืนยันรหัสผ่าน" onChange={(e) => this.handleChange("confirm_password", e.target.value)} />
                                                    <div style={{ position: "absolute", right: "12px", top: "0px", color: "black", alignItems: "center", display: "flex", height: "calc(1.5em + .75rem + 2px)" }}
                                                        onClick={() => this.setState({ showPassword: !this.state.showPassword })}>
                                                        {this.state.showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row >
                                    <Col sm={3} style={{ padding: "5px" }}>
                                        <Form.Group>
                                            <Form.Label>คำนำหน้า</Form.Label>
                                            <Form.Control as="select" onChange={e => this.handleChange('prefix', e.target.value)} >
                                                <option disabled selected>คำนำหน้า</option>
                                                <option value="นาย">นาย</option>
                                                <option value="นาง">นาง</option>
                                                <option value="นางสาว">นางสาว</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col sm={5} style={{ padding: "5px" }}>
                                        <Form.Group >
                                            <Form.Label>ชื่อ</Form.Label>
                                            <Form.Control maxLength={50} placeholder="ชื่อ" onChange={(e) => this.handleChange("first_name", e.target.value)} value={this.state.userInfo.first_name} />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={4} style={{ padding: "5px" }}>
                                        <Form.Group >
                                            <Form.Label>นามสกุล</Form.Label>
                                            <Form.Control maxLength={50} placeholder="นามสกุล" onChange={(e) => this.handleChange("last_name", e.target.value)} value={this.state.userInfo.last_name} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={8} style={{ padding: "5px" }}>
                                        <Form.Group >
                                            <Form.Label>อีเมล</Form.Label>
                                            <Form.Control maxLength={50} placeholder="อีเมล" onChange={(e) => this.handleChange("email", e.target.value)} value={this.state.userInfo.email} />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={4} style={{ padding: "5px" }}>
                                        <Form.Group >
                                            <Form.Label>เบอร์โทร</Form.Label>
                                            <Form.Control maxLength={10} placeholder="เบอร์โทร" onChange={(e) => this.handleChange("phone_number", e.target.value)} value={this.state.userInfo.phone_number} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group style={{ padding: "5px" }} >
                                    <Form.Label>ที่อยู่</Form.Label>
                                    <Form.Control maxLength={100} placeholder="ที่อยู่" onChange={(e) => this.handleChange("address", e.target.value)} value={this.state.userInfo.address} />
                                </Form.Group>
                                <div style={{ justifyContent: 'flex-end', display: 'flex' }}>
                                    <Button style={{ marginRight: "10px" }} className="btn-confirm" onClick={this.handleSubmit} >
                                        {/* <div style={{ backgroundImage: "linear-gradient(rgb(0,255,0),rgb(0,155,0),rgb(0,155,0))", borderRadius: "15px", padding: "0 10px", color: "white", fontWeight: "bold" }}> */}
                                        สมัครสมาชิก
                                        {/* </div> */}
                                    </Button>
                                    <Button onClick={() => { window.location.assign("/") }} className="btn-cancel" >
                                        {/* <div style={{ backgroundImage: "linear-gradient(rgb(255,0,0),rgb(155,0,0),rgb(155,0,0))", borderRadius: "15px", padding: "0 10px", color: "white", fontWeight: "bold" }}> */}
                                        กลับไปหน้าหลัก
                                        {/* </div> */}
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </div >
                </Desktop>
                <Mobile>
                    <div className="bg-register" style={{ padding: "5% ", height: "100vh" }}>
                        <div className='Userform'>
                            <Form style={{ fontSize: "0.8em" }}>
                                <div style={{ fontSize: "1.2em" }}>
                                    สมัครสมาชิก
                                </div>
                                <Row >
                                    <Col style={{ padding: "5px" }}>
                                        <Form.Group >
                                            <Form.Label>ผู้ใช้งาน</Form.Label>
                                            <Form.Control maxLength={20} formNoValidate placeholder="ผู้ใช้งาน" onChange={(e) => this.handleChange("username", e.target.value)} value={this.state.userInfo.username} />

                                        </Form.Group>
                                    </Col>
                                    <Col style={{ padding: "5px" }}>
                                        <Form.Group >
                                            <Form.Label>รหัสผ่าน</Form.Label>
                                            <Row>
                                                <Col style={{ marginRight: "5px" }}>
                                                    <Form.Control maxLength={20}
                                                        type={this.state.showPassword ? "text" : "password"}
                                                        placeholder="รหัสผ่าน" onChange={(e) => this.handleChange("password", e.target.value)} />
                                                </Col>
                                                <Col style={{ marginLeft: "5px" }}>
                                                    <Form.Control
                                                        type={this.state.showPassword ? "text" : "password"}
                                                        placeholder="ยืนยันรหัสผ่าน" onChange={(e) => this.handleChange("confirm_password", e.target.value)} />
                                                    <div style={{ position: "absolute", right: "12px", top: "0px", color: "black", alignItems: "center", display: "flex", height: "calc(1.5em + .75rem + 2px)" }}
                                                        onClick={() => this.setState({ showPassword: !this.state.showPassword })}>
                                                        {this.state.showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row >
                                    <Col sm={3} style={{ padding: "5px" }}>
                                        <Form.Group>
                                            <Form.Label>คำนำหน้า</Form.Label>
                                            <Form.Control as="select" onChange={e => this.handleChange('prefix', e.target.value)} >
                                                <option disabled selected>คำนำหน้า</option>
                                                <option value="นาย">นาย</option>
                                                <option value="นาง">นาง</option>
                                                <option value="นางสาว">นางสาว</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col sm={5} style={{ padding: "5px" }}>
                                        <Form.Group >
                                            <Form.Label>ชื่อ</Form.Label>
                                            <Form.Control maxLength={50} placeholder="ชื่อ" onChange={(e) => this.handleChange("first_name", e.target.value)} value={this.state.userInfo.first_name} />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={4} style={{ padding: "5px" }}>
                                        <Form.Group >
                                            <Form.Label>นามสกุล</Form.Label>
                                            <Form.Control maxLength={50} placeholder="นามสกุล" onChange={(e) => this.handleChange("last_name", e.target.value)} value={this.state.userInfo.last_name} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={8} style={{ padding: "5px" }}>
                                        <Form.Group >
                                            <Form.Label>อีเมล</Form.Label>
                                            <Form.Control maxLength={50} placeholder="อีเมล" onChange={(e) => this.handleChange("email", e.target.value)} value={this.state.userInfo.email} />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={4} style={{ padding: "5px" }}>
                                        <Form.Group >
                                            <Form.Label>เบอร์โทร</Form.Label>
                                            <Form.Control maxLength={10} placeholder="เบอร์โทร" onChange={(e) => this.handleChange("phone_number", e.target.value)} value={this.state.userInfo.phone_number} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group style={{ padding: "5px" }} >
                                    <Form.Label maxLength={100}>ที่อยู่</Form.Label>
                                    <Form.Control placeholder="ที่อยู่" onChange={(e) => this.handleChange("address", e.target.value)} value={this.state.userInfo.address} />
                                </Form.Group>
                                <div style={{ justifyContent: 'flex-end', display: 'flex' }}>
                                    <Button style={{ marginRight: "10px" }} className="btn-confirm" onClick={this.handleSubmit} >
                                        {/* <div style={{ backgroundImage: "linear-gradient(rgb(0,255,0),rgb(0,155,0),rgb(0,155,0))", borderRadius: "15px", padding: "0 10px", color: "white", fontWeight: "bold" }}> */}
                                        สมัครสมาชิก
                                        {/* </div> */}
                                    </Button>
                                    <Button onClick={() => { window.location.assign("/") }} className="btn-cancel" >
                                        {/* <div style={{ backgroundImage: "linear-gradient(rgb(255,0,0),rgb(155,0,0),rgb(155,0,0))", borderRadius: "15px", padding: "0 10px", color: "white", fontWeight: "bold" }}> */}
                                        กลับไปหน้าหลัก
                                        {/* </div> */}
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </div >
                </Mobile>
            </div >

        )
    }
}
