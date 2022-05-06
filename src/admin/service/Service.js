// import React, { Component } from 'react'
// import { Col, Row, Tabs, Tab, Form, Button, Modal } from 'react-bootstrap'
// import Navleft from "../../component/NavLeft"
// import Axios from 'axios'
// import { API_URL } from '../../config/config'
// import Swal from 'sweetalert2'
// import { FaRegEdit } from 'react-icons/fa';
// import { RiDeleteBin6Line } from 'react-icons/ri';
// import { useMediaQuery } from 'react-responsive'


// const Desktop = ({ children }) => {
//     const isDesktop = useMediaQuery({ minWidth: 768 })
//     return isDesktop ? children : null
// }
// const Mobile = ({ children }) => {
//     const isMobile = useMediaQuery({ maxWidth: 767 })
//     return isMobile ? children : null
// }

// export default class service extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             service: {
//                 service_name: "",
//                 price: "",
//                 time: ""
//             },
//             lst_service: [],
//             username: localStorage.getItem("username"),
//             password: localStorage.getItem("password"),
//         };
//     }

//     handleChangeService = (action, value) => {
//         let { service } = this.state;
//         service[action] = value;
//         this.setState({
//             service,
//         });
//     };


//     addService = async () => {
//         const { service } = this.state;
//         console.log(service);
//         const data = new FormData();
//         data.append("service_name", service.service_name)
//         data.append("price", service.price)
//         data.append("time", service.time)
//         try {
//             Swal.fire({
//                 title: 'ต้องการเพิ่มบริการหรือไม่',
//                 icon: 'question',
//                 showCancelButton: true,
//                 confirmButtonColor: '#3085d6',
//                 cancelButtonColor: '#d33',
//                 confirmButtonText: 'Yes',
//                 cancelButtonText: 'cancel'
//             }).then(async (result) => {
//                 if (result.value) {
//                     let url = API_URL + "/service/add_service";
//                     Axios.post(url, data).then(function (res) {
//                         if (res.data.status == 1) {
//                             Swal.fire(
//                                 'เพิ่มบริการสำเร็จ',
//                                 '',
//                                 'success'
//                             ).then(() => {
//                                 window.location.href = "/service"
//                             })
//                         } else if (res.data.status == 0) {
//                             Swal.fire(
//                                 'เพิ่มบริการไม่สำเร็จ',
//                                 '',
//                                 'warning'
//                             )
//                         } else if (res.data.status == -1) {
//                             Swal.fire(
//                                 'ไม่สามารถเพิ่มบริการได้มากกว่านี้ได้',
//                                 '',
//                                 'warning'
//                             )
//                         }
//                     }.bind(this))
//                 }
//             })
//         } catch (error) { }
//     }

//     deleteService = async (service_id) => {
//         const data = new FormData();
//         data.append("service_id", service_id)
//         Swal.fire({
//             title: 'ต้องการลบบริการหรือไม่',
//             icon: 'question',
//             showCancelButton: true,
//             confirmButtonColor: '#3085d6',
//             cancelButtonColor: '#d33',
//             confirmButtonText: 'Yes',
//             cancelButtonText: 'cancel'
//         }).then(async (result) => {
//             if (result.value) {
//                 let url = API_URL + "/service/delete_service";
//                 Axios.post(url, data).then(function (res) {
//                     if (res.data.status == 1) {
//                         Swal.fire(
//                             'ลบบริการสำเร็จ',
//                             '',
//                             'success'
//                         ).then(() => {
//                             window.location.href = "/service"
//                         })
//                     } else if (res.data.status == 0) {
//                         Swal.fire(
//                             'ลบบริการไม่สำเร็จ',
//                             '',
//                             'warning'
//                         )
//                     }
//                 }.bind(this))
//             }
//         })
//     }

//     componentDidMount = async () => {
//         let url = API_URL + "/service/list_service";
//         Axios.get(url).then(function (res) {
//             console.log(res.data.data)
//             this.setState({
//                 lst_service: res.data.data,
//             })
//         }.bind(this))
//     }
//     render() {

//         return (
//             <div className=" bgAdmin">
//                 <Desktop>
//                     <div lassName=" bgAdmin1" >
//                         <Row style={{ marginRight: "0px", height: "100%" }}>
//                             <Col md={2} style={{ height: 'auto' }}  >
//                                 <Navleft />
//                             </Col>
//                             <Col md={10} >
//                                 <div style={{ margin: '15px', fontSize: "2em", fontWeight: "bold", padding: "10px 20px", color: "#212529", borderBottom: "2px solid #212529" }} >
//                                     บริการของศูนย์
//                         </div>
//                                 <Col>
//                                     <div style={{ margin: "10px" }}>
//                                         <Row >
//                                             <Col sm={6} style={{ paddingRight: "15px" }}>
//                                                 <Form.Group>
//                                                     <Form.Label style={{ fontSize: "1.6em" }}>ชื่อบริการ</Form.Label>
//                                                     <Form.Control
//                                                         onChange={(e) => this.handleChangeService("service_name", e.target.value)}
//                                                         // value={this.state.message.header} 
//                                                         placeholder="ชื่อบริการ"
//                                                     />
//                                                 </Form.Group>
//                                             </Col>
//                                             <Col sm={3} style={{ paddingRight: "15px" }}>
//                                                 <Form.Group>
//                                                     <Form.Label style={{ fontSize: "1.6em" }}>ระยะเวลาซ่อม</Form.Label>
//                                                     <Form.Control
//                                                         onChange={(e) => this.handleChangeService("time", e.target.value)}
//                                                         // value={this.state.message.header} 
//                                                         placeholder="ระยะเวลาซ่อม (นาที)"
//                                                     />
//                                                 </Form.Group>
//                                             </Col>
//                                             <Col sm={3} >
//                                                 <Form.Group>
//                                                     <Form.Label style={{ fontSize: "1.6em" }}>ราคา</Form.Label>
//                                                     <Form.Control
//                                                         onChange={(e) => this.handleChangeService("price", e.target.value)}
//                                                         // value={this.state.message.header} 
//                                                         placeholder="ราคา"
//                                                     />
//                                                 </Form.Group>
//                                             </Col>
//                                         </Row>
//                                         <Row style={{ padding: "10px", justifyContent: "flex-end" }}>
//                                             <Button onClick={this.addService} className="btn-Nomal btn-Edit">
//                                                 บันทึก
//                             </Button>
//                                         </Row>
//                                     </div>
//                                 </Col>
//                                 <Col>
//                                     <div style={{ margin: "15px", fontSize: "1.6em" }}>บริการต่าง ๆ ของศูนย์</div>
//                                     {this.state.lst_service.map((index, i) =>
//                                         <div style={{ borderRadius: "10px", margin: " 10px 15px", padding: "10px", backgroundImage: "linear-gradient(rgb(150,150,150), #F1F1F1, #F1F1F1, rgb(150,150,150))" }}>
//                                             <Row >
//                                                 <Col sm={7} style={{ alignItems: 'center', display: 'flex', fontSize: "1.2em" }}>
//                                                     {index.service_name}
//                                                 </Col>
//                                                 <Col sm={2} style={{ alignItems: 'center', display: 'flex' }}>
//                                                     ราคา : {index.price} บาท
//                                         </Col>
//                                                 <Col sm={2} style={{ alignItems: 'center', display: 'flex' }}>
//                                                     เวลา : {index.time} นาที
//                                         </Col>
//                                                 {/* <Col sm={1} style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-around' }}>
//                                             <FaRegEdit size={20} style={{ cursor: "pointer", color: "#212529" }} onClick={() => {
//                                                 this.showModal(index.message_id)
//                                             }} />
//                                         </Col> */}

//                                                 <Col sm={1} style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-around' }}>
//                                                     {/*/////////////////// Delete /////////////// */}
//                                                     <RiDeleteBin6Line size={20} style={{ cursor: "pointer", color: "#212529" }}
//                                                         onClick={() => this.deleteService(index.service_id)}
//                                                     />
//                                                 </Col>
//                                             </Row>
//                                         </div>
//                                     )}
//                                 </Col>
//                             </Col>
//                         </Row>
//                     </div>
//                 </Desktop>
//             </div>
//         )
//     }
// }

