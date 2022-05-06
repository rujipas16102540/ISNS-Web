import React, { Component } from 'react'
import "./NavLeft.css"
import { Row, Col } from "react-bootstrap";
import Logo from '../user/image/LogoProject.png'

export default class Header extends Component {
    render() {
        return (
            <div style={{
                background: "#f5f5f5", height: '20vh', color: '#ff9f40',
                width: '100vw', zIndex: "100", alignItems: "center", padding: "0 2%", display: "flex"
            }}>
                <Row>
                    <Col sm={1}>
                        <img src={Logo} style={{ width: "100%", height: "auto", borderRadius: "15px" }} />
                    </Col>
                    <Col sm={10}>
                        <div className="nameProTh">  ระบบแจ้งเตือนกำหนดการอัจฉริยะ</div>
                        <div className="nameProEn">(Intelligent schedule notification system)</div>
                    </Col>
                </Row>

                {/* <Row>
                    <h4>(Intelligent schedule notification system)</h4>
                </Row> */}
            </div>
        )
    }
}
