import React, { Component } from 'react'
import { Col, Row, Tabs, Tab, Form, Modal } from 'react-bootstrap'
import { useMediaQuery } from 'react-responsive'
import Navleft from "../../component/NavLeft"
import MobileError from '../../component/MobileError';
import ListOtherNotifications from './ListOtherNotifications';
import AddOtherNotifications from './AddOtherNotifications';

const Desktop = ({ children }) => {
    const isDesktop = useMediaQuery({ minWidth: 768 })
    return isDesktop ? children : null
}
const Mobile = ({ children }) => {
    const isMobile = useMediaQuery({ maxWidth: 767 })
    return isMobile ? children : null
}

export default class Other_service extends Component {
    render() {
        return (
            <div className=" bgAdmin">
                <Desktop>
                    <div className=" bgAdmin1">
                        <Row>
                            <Col sm={2} style={{ height: "100vh" }}>
                                <Navleft />
                            </Col>
                            <Col sm={10}>
                                <div style={{ margin: '1% 5%' }}>
                                    <div style={{ marginBottom: "15px", fontSize: "2em", fontWeight: "bold", padding: "10px 20px", color: "white", borderBottom: "2px solid white" }}  >การแจ้งเตือนอื่น ๆ</div>
                                    {/* <Tabs defaultActiveKey="listOtherNoti" className="editTabsNews">
                                        <Tab eventKey="listOtherNoti" title="การแจ้งเตือนอื่น ๆ" className="styleTabNews"> */}
                                    <ListOtherNotifications />
                                    {/* </Tab> */}
                                    {/* <Tab eventKey="addOtherNoti" title="เพิ่มการแจ้งเตือน" className="styleTabNews">
                                            <AddOtherNotifications />
                                        </Tab> */}
                                    {/* </Tabs> */}
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
