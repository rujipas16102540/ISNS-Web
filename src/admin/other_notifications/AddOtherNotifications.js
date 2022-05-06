// import React, { Component } from 'react'
// import { Form, Row, Col, Button, InputGroup } from 'react-bootstrap'
// import Axios from 'axios'
// import { API_URL } from '../../config/config'
// import Swal from 'sweetalert2'

// export default class AddOtherServices extends Component {

//     constructor(props) {
//         super(props);
//         this.state = {
//             add_noti: {},
//             btnRadio: {},
//         };

//     }
//     handleChangeRadio = (name, value) => {
//         let { btnRadio } = this.state
//         btnRadio[name] = value
//         this.setState({
//             btnRadio
//         })
//     }

//     handleChange = (name, value) => {
//         let { add_noti } = this.state
//         add_noti[name] = value
//         this.setState({
//             add_noti
//         })
//     }

//     handleSubmit = () => {
//         let { add_noti, btnRadio } = this.state
//         let data = new FormData
//         if (add_noti.header && add_noti.drescription && btnRadio.type !== undefined) {
//             data.append("header", add_noti.header)
//             data.append("drescription", add_noti.drescription)
//             data.append("type_noti", btnRadio.type)
//             Swal.fire({
//                 icon: 'question',
//                 title: 'เพิ่มการแจ้งเตือนอื่นหรือไม่',
//                 showCancelButton: true,
//                 confirmButtonColor: '#218838',
//                 cancelButtonColor: '#c82333',
//                 confirmButtonText: 'ยืนยัน',
//                 cancelButtonText: 'ยกเลิก'
//             }).then(async (result) => {
//                 if (result.value) {
//                     let url = API_URL + "/other_noti/add_other_noti"
//                     Axios.post(url, data).then(function (res) {
//                         console.log("data", res.data.data)
//                         console.log("status", res.data.status)
//                         Swal.fire({
//                             icon: 'success',
//                             title: 'เพิ่มบริการสำเร็จ',
//                             confirmButtonColor: '#212529',
//                             confirmButtonText: 'ตกลง',
//                         }).then(() => {
//                             window.location.href = "/other_notifications"
//                         })
//                     }.bind(this))
//                 }
//             })
//         } else {
//             Swal.fire({
//                 icon: 'warning',
//                 title: 'กรุณากรอกข้อมูลให้ถูกต้อง',
//                 confirmButtonColor: '#212529',
//                 confirmButtonText: 'ตกลง',
//             })
//         }

//     }

//     render() {
//         return (
//             <div>
//                 <Form style={{ padding: "20px 100px" }}>
//                     <Row >
//                         <Col style={{ padding: "5px", width: "10%" }}>
//                             <Form.Group>
//                                 <Form.Label>ชื่อหัวข้อบริการ</Form.Label>
//                                 <Form.Control
//                                     onChange={(e) => this.handleChange("header", e.target.value)}
//                                     placeholder="ชื่อหัวข้อบริการ" />
//                             </Form.Group>
//                         </Col>
//                     </Row>
//                     <Row>
//                         <Col style={{ padding: "5px" }}>
//                             <Form.Group>
//                                 <Form.Label>รายละเอียดการแจ้งเตือน</Form.Label>
//                                 <Form.Control
//                                     onChange={(e) => this.handleChange("drescription", e.target.value)}
//                                     placeholder="รายละเอียดการแจ้งเตือน" />
//                             </Form.Group>
//                         </Col>
//                     </Row>
//                     <Row>
//                         <InputGroup.Prepend>
//                             <InputGroup.Radio name={"type"} onChange={(e) => this.handleChangeRadio("type", "queue_noti")} />
//                             <Form.Label style={{ alignItems: "center", display: "flex" }}>จองคิวและแจ้งเตือน</Form.Label>
//                             <InputGroup.Radio name={"type"} onChange={(e) => this.handleChangeRadio("type", "noti")} />
//                             <Form.Label style={{ alignItems: "center", display: "flex", }}>แจ้งเตือน</Form.Label>
//                         </InputGroup.Prepend>
//                     </Row>
//                     <div style={{ justifyContent: 'center', display: 'flex' }}>
//                         <Button className="btn-confirm" btn-Edit onClick={this.handleSubmit}>
//                             <div >
//                                 บันทึก
//                             </div>
//                         </Button>
//                     </div>


//                 </Form>

//             </div >
//         )
//     }
// }
