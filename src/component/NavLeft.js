import React, { Component } from 'react'
// import Employee from '../employee/Employee'
// import Queue from '../queue/Queue'
// import News from '../news/News'
import './NavLeft.css'
import Logo from '../user/image/LogoProject.png';

import { Col, Nav, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'


export default class Left extends Component {
    onLogout = async () => {
        localStorage.clear()
        window.location.href = ('/');

    }

    render() {
        let path = window.location.pathname
        return (
            <div  >
                <Col md={2} className="left">
                    <div style={{ textAlign: "center", margin: "20px" }}>
                        {/* <img src={Logo} style={{ width: "50%", height: "auto", borderRadius: "50%", border: "3px solid rgb(100, 100, 100)" }} /> */}
                        <img src={Logo} style={{ width: "50%", height: "auto", borderRadius: "50%", border: "3px solid black" }} />
                    </div>
                    <div style={{ padding: "10px", fontSize: "1em", textAlign: "center", fontWeight: "bold" }}>
                        ระบบแจ้งเตือนตารางงานอัจฉริยะ
                    </div>
                    <div >
                        <ul style={{ padding: '10px', margin: '0px', fontSize: '1.5em', fontWeight: 'bold' }}>รายการ</ul>
                    </div>
                    <Link to="/customer">
                        <div className={Array.isArray(path.match(/customer/g)) ? "NavLeftActive" : "NavLeft"}>
                            รายชื่อลูกค้า
                        </div>
                    </Link>
                    {/* <Link to="/queue">
                        <div className={Array.isArray(path.match(/queue/g)) ? "NavLeftActive" : "NavLeft"}>
                            การดำเนินงาน
                        </div>
                    </Link> */}
                    <Link to="/news">
                        <div className={Array.isArray(path.match(/news/g)) ? "NavLeftActive" : "NavLeft"}>
                            ข่าวสาร
                        </div>
                    </Link>
                    <Link to="/other_notifications">
                        <div className={Array.isArray(path.match(/other_notifications/g)) ? "NavLeftActive" : "NavLeft"}>
                            การแจ้งเตือนอื่นๆ
                        </div>
                    </Link>
                    {/* <a href="/service">
                        <div className={Array.isArray(path.match(/service/g)) ? "NavLeftActive" : "NavLeft"}>
                            บริการของศูนย์
                    </div>
                    </a> */}
                    <a >
                        <div className="NavLeft" onClick={this.onLogout}>ออกจากระบบ</div>
                    </a>

                </Col>
            </div>

        )
    }
}
