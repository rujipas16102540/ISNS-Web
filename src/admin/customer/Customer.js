import React, { Component, useState, useEffect } from 'react'
import { Col, Row, Tabs, Tab, Form, Button, Modal } from 'react-bootstrap'
import AddCustomer from './AddCustomer'
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import Axios from 'axios'
import { API_URL } from '../../config/config'
import "../../component/NavLeft.css"
import "./Customer.css"
import "../StyleAdmin.css"
import Swal from 'sweetalert2'
import Header from "../../component/Header"
import Navleft from "../../component/NavLeft"
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from 'react-loader-spinner'
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

  // showModal = async (customer_id) => {
  //   localStorage.setItem("customer_id", customer_id)
  //   this.setState({
  //     show: !this.state.show,
  //   });
  //   const data = new FormData();
  //   data.append("customer_id", customer_id)
  //   try {
  //     let url = API_URL + "/customer/list_customer_by_id";
  //     Axios.post(url, data).then(function (res) {
  //       this.setState({
  //         customer_modal: {
  //           first_name: res.data.data.first_name,
  //           last_name: res.data.data.last_name,
  //           email: res.data.data.email,
  //           line_id: res.data.data.line_id,
  //           phone_number: res.data.data.phone_number,
  //           address: res.data.data.address,
  //         }
  //       })
  //     }.bind(this))
  //   } catch (error) { }
  //   console.log(this.state.customer_modal)
  // };

  // handleChange(change, event) {
  //   var toChange = this.state.customer_modal;
  //   toChange[change] = event.target.value;
  //   this.setState({ form: toChange });
  // }

  // deleteCustomer = async (customer_id) => {
  //   const data = new FormData();
  //   data.append("customer_id", customer_id)
  //   try {
  //     Swal.fire({
  //       title: 'ต้องการลบข้อมูลหรือไม่',
  //       icon: 'question',
  //       showCancelButton: true,
  //       confirmButtonColor: '#3085d6',
  //       cancelButtonColor: '#d33',
  //       confirmButtonText: 'Yes',
  //       cancelButtonText: 'cancel'
  //     }).then(async (result) => {
  //       if (result.value) {
  //         let url = API_URL + "/customer/delete_customer"
  //         Axios.post(url, data).then(function (res) {
  //           console.log(res.data.status)
  //           console.log(res.data.data)
  //           if (res.data.status == 1) {
  //             Swal.fire(
  //               'ลบข้อมูลสำเร็จ',
  //               '',
  //               'success'
  //             ).then(() => {
  //               window.location.href = "/customer"
  //             })
  //           } else if (res.data.status == 0) {
  //             Swal.fire(
  //               'ลบข้อมูลไม่สำเร็จกรุณาลองใหม่อีกครั้ง',
  //               '',
  //               'warning'
  //             )
  //           }
  //         }.bind(this))
  //       }
  //     })
  //   } catch (error) {
  //   }
  // };

  // handleSubmit = async () => {
  //   const { customer_modal } = this.state;
  //   const data = new FormData();
  //   data.append("customer_id", localStorage.getItem("customer_id"))
  //   if (customer_modal.first_name) {
  //     data.append("first_name", customer_modal.first_name);
  //   } else {
  //     data.append("first_name", this.state.first_name);
  //   }
  //   if (customer_modal.last_name) {
  //     data.append("last_name", customer_modal.last_name);
  //   } else {
  //     data.append("last_name", this.state.last_name);
  //   }
  //   if (customer_modal.address) {
  //     data.append("address", customer_modal.address);
  //   } else {
  //     data.append("address", this.state.address);
  //   }
  //   if (customer_modal.email) {
  //     data.append("email", customer_modal.email);
  //   } else {
  //     data.append("email", this.state.email);
  //   }
  //   if (customer_modal.phone_number) {
  //     data.append("phone_number", customer_modal.phone_number);
  //   } else {
  //     data.append("phone_number", this.state.phone_number);
  //   }
  //   try {
  //     Swal.fire({
  //       title: 'ต้องการแก้ไขข้อมูลหรือไม่',
  //       icon: 'question',
  //       showCancelButton: true,
  //       confirmButtonColor: '#3085d6',
  //       cancelButtonColor: '#d33',
  //       confirmButtonText: 'Yes',
  //       cancelButtonText: 'cancel'
  //     }).then(async (result) => {
  //       if (result.value) {
  //         let url = API_URL + "/customer/update_customer"
  //         Axios.post(url, data).then(function (res) {
  //           console.log(res.data.status)
  //           console.log(res.data.data)
  //           if (res.data.status == 1) {
  //             Swal.fire(
  //               'แก้ไขข้อมูลสำเร็จ',
  //               '',
  //               'success'
  //             ).then(() => {
  //               window.location.href = "/customer"
  //             })
  //           } else if (res.data.status == 0) {
  //             Swal.fire(
  //               'แก้ไขข้อมูลไม่สำเร็จกรุณาลองใหม่อีกครั้ง',
  //               '',
  //               'warning'
  //             ).then(() => {

  //               this.setState({
  //                 customerInfo: {
  //                   first_name: "",
  //                   last_name: "",
  //                   address: "",
  //                   email: "",
  //                   // line_id: "",
  //                   phone_number: "",
  //                 },
  //               });
  //             })
  //           }
  //         }.bind(this))
  //       }
  //     })
  //   } catch (error) {
  //   }
  // };


  // componentWillMount = async () => {
  //   await Axios.get(url)
  //     .then(response => response.data)
  //     .then(data => {
  //       console.log(data)

  //       this.setState({
  //         posts: data.data
  //       })
  //       console.log(this.state.posts)
  //     })
  //     .then(async () => {
  //       this.setState({ tableRows: this.assemblePosts(), isLoading: false })
  //       console.log(this.state.tableRows);
  //     });
  // }

  // assemblePosts = () => {
  //   let posts = this.state.posts.map((index, i) => {
  //     return (
  //       {
  //         name: index.prefix + " " + index.first_name + "  " + index.last_name,
  //         address: index.address,
  //         email: index.email,
  //         // line_id: index.line_id,
  //         phone_number: index.phone_number,
  //         // no: i + 1,
  //         bin: <RiDeleteBin6Line onClick={() => this.deleteCustomer(index.customer_id)} size={20} style={{ cursor: "pointer", color: "#212529" }} />,
  //         edit: <FaRegEdit size={20} onClick={() => { this.showModal(index.customer_id) }} style={{ cursor: "pointer", color: "#212529" }} />,
  //       }
  //     )
  //   });
  //   return posts;
  // }
  render() {
    if (this.state.username === null && this.state.password === null) {
      window.location.href = "/";
    }
    // const data = {
    //   columns: [
    //     {
    //       label: 'ชื่อจริง',
    //       field: 'name',
    //     },
    //     {
    //       label: 'ที่อยู่',
    //       field: 'address',
    //     },
    //     {
    //       label: 'Email',
    //       field: 'email',
    //     },
    //     {
    //       label: 'เบอร์โทรศัพท์',
    //       field: 'phone_number',
    //     },
    //     {
    //       label: "แก้ไข",
    //       field: "edit",
    //     },
    //     {
    //       label: "ลบ",
    //       field: "bin",
    //     }
    //   ],
    //   rows: this.state.tableRows,
    // }



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
