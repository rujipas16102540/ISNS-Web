import React, { Component, useState, useEffect } from 'react'
import { Col, Row, Tabs, Tab, Form, Button, Modal } from 'react-bootstrap'
import Axios from 'axios'
import { API_URL } from '../../config/config'
import "../../component/NavLeft.css"
import "./Customer.css"
import "../StyleAdmin.css"
import Navleft from "../../component/NavLeft"
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import { MDBDataTable, Card, CardBody } from 'mdbreact';

import { useMediaQuery } from 'react-responsive'
import MobileError from '../../component/MobileError';
import User from "./User"


const url = API_URL + '/customer/list_customer';

const Desktop = ({ children }) => {
  const isDesktop = useMediaQuery({ minWidth: 768 })
  return isDesktop ? children : null
}
const Mobile = ({ children }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 })
  return isMobile ? children : null
}





export default class Customer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      customerInfo: {
        first_name: "",
        last_name: "",
        address: "",
        email: "",
        line_id: "",
        phone_number: "",
      },
      customer_modal: {
        first_name: "",
        last_name: "",
        email: "",
        line_id: "",
        phone_number: "",
        address: "",
      },
      // first_name: "",
      username: localStorage.getItem("username"),
      password: localStorage.getItem("password"),
      show: false,
      data_customer: [],
      page_accept: true,

      posts: [],
      isLoading: true,
      tableRows: [],

    };
  }

  render() {
    if (this.state.username === null && this.state.password === null) {
      window.location.href = "/";
    }

    return (
      <div>
        <Desktop>
          <div className=" bgAdmin1" >
            <Row >
              <Col md={2} style={{ height: '100vh' }}  >
                <Navleft />
              </Col>
              <Col md={10} style={{ height: 'auto' }}>
                <div style={{ margin: '1% 5%' }}>
                  <div style={{ marginBottom: '15px', fontSize: "2em", fontWeight: "bold", padding: "10px 20px", color: "black", borderBottom: "2px solid black" }} >รายชื่อลูกค้า</div>
                  <Tabs defaultActiveKey="User" className="editTabsCus">
                    <Tab eventKey="User" title="รายชื่อสมาชิก" className="styleTabCus">
                      <User />
                    </Tab>
                  </Tabs>
                </div>
              </Col>
            </Row>
          </div >
        </Desktop>
        <Mobile>
          <MobileError />
        </Mobile>
      </div>
    )
  }
}
