import React, { Component } from 'react'
import Axios from 'axios'
import { API_URL } from '../config/config'
import { Form, Button, Row, Col } from "react-bootstrap";
import './queue-noti/UserQueue'
import './StyleUser.css'
// import swal from 'sweetalert2';
import Swal from 'sweetalert2'
import { FaUser, FaLock } from 'react-icons/fa';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Logo from './image/LogoProject.png'
import { useMediaQuery } from 'react-responsive'
import '../component/Loader.css'


const Desktop = ({ children }) => {
  const isDesktop = useMediaQuery({ minWidth: 768 })
  return isDesktop ? children : null
}
const Mobile = ({ children }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 })
  return isMobile ? children : null
}
export default class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showPassword: false,
      login: {
        username: "",
        password: "",
      },
      loader: false
    };
  }

  login = async () => {
    let { login, loader } = this.state;
    this.setState({ loader: true })
    const data = new FormData()
    data.append("username", login.username)
    data.append("password", login.password)
    try {
      let url = API_URL + "/user/login"
      await Axios.post(url, data).then(function (res) {
        if (res.data.status == 1) {
          localStorage.setItem("username", res.data.data.username)
          localStorage.setItem("password", res.data.data.password)
          localStorage.setItem("user_id", res.data.data.user_id)
          localStorage.setItem("username", res.data.data.username)
          localStorage.setItem("password", res.data.data.password)
          localStorage.setItem("first_name", res.data.data.first_name)
          localStorage.setItem("last_name", res.data.data.last_name)
          localStorage.setItem("prefix", res.data.data.prefix)
          localStorage.setItem("address", res.data.data.address)
          localStorage.setItem("email", res.data.data.email)
          localStorage.setItem("phone_number", res.data.data.phone_number)
          localStorage.setItem("header", res.data.data.header)
          localStorage.setItem("type_noti", res.data.data.type_noti)
          localStorage.setItem("test", res.data.data)
          if (res.data.data.user_type == 1 && res.data.data.status !== "creator") {
            this.props.history.push("/customer");
          } else if (res.data.data.user_type == 2 && res.data.data.status !== "creator") {
            this.props.history.push("/userqueue");
          } else if (res.data.data.user_type == 2 && res.data.data.status == "creator") {
            this.props.history.push("/creator/handle");
          }
        } else if (res.data.status == 0) {
          Swal.fire({
            icon: 'error',
            title: 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง',
            // confirmButtonColor: "#28a745",
            confirmButtonText: 'ตกลง',
          })
        }
      }.bind(this))
      this.setState({ loader: false })
    } catch (error) {
      this.setState({ loader: false })
    }

  };

  handleChange = (action, value) => {
    let { login } = this.state;
    login[action] = value;
    this.setState({
      login,
    });
  };

  render() {
    return (
      <div>
        <Desktop>
          {this.state.loader &&
            <div className="bg-loader" >
              <div className='loader'></div>
            </div>
          }

          <div className="UserBG" style={{ height: "100vh" }}>
            <div className="UserLoginHeader">
              <Row>
                <Col sm={1}>

                  <img src={Logo} style={{ width: "100%", height: "auto", borderRadius: "50%", border: "3px solid #000" }} />
                </Col>
                <Col sm={11}>
                  <div className="nameProTh">  แพลตฟอร์มการแจ้งเตือนงานอัจฉริยะกรณีศึกษาการจองคิวเช็คสภาพยานพาหนะ</div>
                  <div className="nameProEn">(Smart schedule notification platform case studies queue booking vehicle condition monitoring)</div>
                </Col>
              </Row>
            </div>
            <div className='UserLoginform'>


              <Form>
                <div className="fontSizeForm">เข้าสู่ระบบ</div>
                <Form.Group >
                  <Form.Label style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}><FaUser size={20} /> &nbsp;ชื่อผู้ใช้งาน</Form.Label>
                  <Form.Control type="user" placeholder="ชื่อผู้ใช้งาน" onChange={e => this.handleChange("username", e.target.value)} />
                </Form.Group>
                <Form.Group >
                  <Form.Label style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}><FaLock size={20} />&nbsp;รหัสผ่าน</Form.Label>
                  <Row>
                    <Col sm={12}>
                      <Form.Control type={this.state.showPassword ? "text" : "password"} placeholder="รหัสผ่าน" onChange={e => this.handleChange("password", e.target.value)} />
                    </Col>
                    <Col>
                      <div style={{ position: "absolute", right: "12px", top: "0px", color: "black", alignItems: "center", display: "flex", height: "calc(1.5em + .75rem + 2px)" }}>
                        {this.state.showPassword ? <AiOutlineEye onClick={() => this.setState({ showPassword: !this.state.showPassword })} style={{ cursor: "pointer" }} /> :
                          <AiOutlineEyeInvisible onClick={() => this.setState({ showPassword: !this.state.showPassword })} style={{ cursor: "pointer" }} />}
                      </div>
                    </Col>
                  </Row>
                </Form.Group>
                <div style={{ justifyContent: 'center', display: 'flex' }}>
                  <Button className="btn-confirm" onClick={this.login} >
                    <div className="inside-btn-confirm">
                      เข้าสู่ระบบ
                    </div>
                  </Button>

                </div>
                <div style={{ justifyContent: "center", display: "flex", paddingTop: '10px', color: "f1f1f1" }}>
                  สมัครสามชิกเพื่อเข้าสู่ระบบ &nbsp;
                  <a href="/register" style={{ color: "#0082ff" }} >
                    สมัครสมาชิก
                  </a>
                </div>
              </Form>
            </div>
          </div>
        </Desktop>
        <Mobile>
          <div className="UserBG" style={{ height: "100vh" }}>
            <div className="UserLoginHeader">
              <Row>
                <Col sm={1} style={{ width: "20%" }}>
                  <img src={Logo} style={{ width: "100%", height: "auto", borderRadius: "50%" }} />
                </Col>
                <Col sm={11} style={{ width: "80%", alignItems: "center", display: "flex" }}>
                  <div style={{ paddingLeft: "5%" }}>
                    <div style={{ fontSize: "1.2em" }}>ระบบแจ้งเตือนกำหนดการอัจฉริยะ</div>
                    <div style={{ fontSize: "1em" }}>(Intelligent schedule notification system)</div>
                  </div>
                </Col>
              </Row>
            </div>

            <div className='UserLoginformMobile'>
              <Form style={{ fontSize: "0.8em" }}>
                <div className="fontSizeFormMobile">เข้าสู่ระบบ</div>
                <Form.Group >
                  <Form.Label style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}><FaUser size={20} /> &nbsp;ชื่อผู้ใช้งาน</Form.Label>
                  <Form.Control type="user" placeholder="ชื่อผู้ใช้งาน" onChange={e => this.handleChange("username", e.target.value)} />
                </Form.Group>
                <Form.Group >
                  <Form.Label style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}><FaLock size={20} />&nbsp;รหัสผ่าน</Form.Label>
                  <Row>
                    <Col sm={12}>
                      <Form.Control type={this.state.showPassword ? "text" : "password"} placeholder="รหัสผ่าน" onChange={e => this.handleChange("password", e.target.value)} />
                    </Col>
                    <Col>
                      <div style={{ position: "absolute", right: "12px", top: "0px", color: "black", alignItems: "center", display: "flex", height: "calc(1.5em + .75rem + 2px)" }}
                        onClick={() => this.setState({ showPassword: !this.state.showPassword })}>
                        {this.state.showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                      </div>
                    </Col>
                  </Row>

                </Form.Group>
                <div style={{ justifyContent: 'center', display: 'flex' }}>
                  <Button className="btn-confirm" onClick={this.login} >
                    {/* <div className="inside-btn-confirm"> */}
                    เข้าสู่ระบบ
                    {/* </div> */}
                  </Button>
                </div>
                <div style={{ justifyContent: "center", display: "flex", paddingTop: '10px', color: "f1f1f1" }}>
                  สมัครสามชิกเพื่อเข้าสู่ระบบ &nbsp;
                  <a href="/register" style={{ color: "#03407b" }} >
                    สมัครสมาชิก
                  </a>
                </div>
              </Form>
            </div>
          </div>
        </Mobile>
      </div>


    )
  }
}
