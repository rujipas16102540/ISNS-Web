import React, { Component } from 'react'
import { Form, Row, Col, Button } from 'react-bootstrap'
import Swal from 'sweetalert2'
import Axios from 'axios'
import { API_URL } from '../../config/config'
import Loader from 'react-loader-spinner';

export default class AddCustomer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customerInfo: {
                prefix: "",
                first_name: "",
                last_name: "",
                address: "",
                email: "",
                // line_id: "",
                phone_number: "",
                user_type: "2",
            },
            // loading: true,
            username: localStorage.getItem("username"),
            password: localStorage.getItem("password"),
        };
    }
    // async loadData() {
    //     const data = //asynchronous call to the API ;
    //         setState({
    //             loading: false,
    //         });

    handleChange = (action, value) => {
        let { customerInfo } = this.state;
        customerInfo[action] = value;
        this.setState({
            customerInfo,
        });
    };

    handleSubmit = async () => {
        let { customerInfo } = this.state;
        console.log(customerInfo.user_type)
        if (customerInfo.first_name && customerInfo.last_name && customerInfo.email
            && customerInfo.phone_number && customerInfo.address && customerInfo.prefix) {
            console.log(customerInfo)
            const data = new FormData();
            data.append("first_name", customerInfo.first_name)
            data.append("last_name", customerInfo.last_name)
            data.append("email", customerInfo.email)
            data.append("user_type", customerInfo.user_type)
            data.append("phone_number", customerInfo.phone_number)
            data.append("address", customerInfo.address)
            data.append("prefix", customerInfo.prefix)

            try {
                Swal.fire({
                    title: 'ต้องการเพิ่มลูกค้าหรือไม่',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'cancel'
                }).then(async (result) => {
                    if (result.value) {
                        let url = API_URL + "/customer/save_customer"
                        Axios.post(url, data).then(function (res) {
                            console.log(res.data.status)
                            if (res.data.status == 1) {
                                Swal.fire(
                                    'เพิ่มลูกค้าสำเร็จ',
                                    '',
                                    'success'
                                ).then(() => {
                                    this.setState = {
                                        customerInfo: {
                                            prefix: "",
                                            first_name: "",
                                            last_name: "",
                                            address: "",
                                            email: "",
                                            phone_number: "",
                                            user_type: "2",
                                        },
                                        loading: false,
                                    };
                                    window.location.assign("/customer")
                                    // this.props.history.push("/customer");
                                })
                            }
                        }.bind(this))
                    }
                })


            } catch (error) {
            }
        } else {
            Swal.fire(
                'กรุณากรอกข้อมูลให้ครบ',
                '',
                'warning'
            )
        }
    };


    render() {
        if (this.state.username === null && this.state.password === null) {
            window.location.href = "/";
        }

        return (
            <div>
                <Form style={{ padding: "20px 100px" }}>
                    <Row >
                        <Col style={{ padding: "5px", width: "10%" }}>
                            <Form.Group>
                                <Form.Label>คำนำหน้า</Form.Label>
                                <Form.Control as="select" onChange={e => this.handleChange('prefix', e.target.value)}>
                                    <option disabled selected>คำนำหน้า</option>
                                    <option value="นาย">นาย</option>
                                    <option value="นาง">นาง</option>
                                    <option value="นางสาว">นางสาว</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col style={{ padding: "5px" }} sm={5}>
                            <Form.Group>
                                <Form.Label>ชื่อ</Form.Label>
                                <Form.Control
                                    onChange={(e) => this.handleChange("first_name", e.target.value)}
                                    value={this.state.customerInfo.first_name} placeholder="ชื่อ" />
                            </Form.Group>
                        </Col>
                        <Col style={{ padding: "5px" }} sm={5}>
                            <Form.Group>
                                <Form.Label>นามสกุล</Form.Label>
                                <Form.Control
                                    onChange={(e) => this.handleChange("last_name", e.target.value)}
                                    value={this.state.customerInfo.last_name} placeholder="นามสกุล" />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row >
                        <Col style={{ padding: "5px" }}>
                            <Form.Group>
                                <Form.Label>อีเมล</Form.Label>
                                <Form.Control onChange={(e) => this.handleChange("email", e.target.value)}
                                    value={this.state.customerInfo.email} placeholder="อีเมล" />
                            </Form.Group>
                        </Col>
                        <Col style={{ padding: "5px" }}>
                            <Form.Group>
                                <Form.Label>เบอร์โทรศัพท์</Form.Label>
                                <Form.Control onChange={(e) => this.handleChange("phone_number", e.target.value)}
                                    value={this.state.customerInfo.phone_number} placeholder="เบอร์โทรศัพท์" />
                            </Form.Group>
                        </Col>
                        {/* <Col style={{ padding: "5px" }}>
                            <Form.Group>
                                <Form.Label>ไอดีไลน์</Form.Label>
                                <Form.Control onChange={(e) => this.handleChange("line_id", e.target.value)}
                                    value={this.state.customerInfo.line_id} placeholder="ไอดีไลน์" />
                            </Form.Group>
                        </Col> */}
                    </Row>
                    <Form.Group style={{ padding: "5px" }}>
                        <Form.Label>ที่อยู่</Form.Label>
                        <Form.Control onChange={(e) => this.handleChange("address", e.target.value)}
                            value={this.state.customerInfo.address} placeholder="ที่อยู่" />
                    </Form.Group>
                    <div style={{ justifyContent: 'center', display: 'flex' }}>
                        <Button className="btn-confirm" btn-Edit onClick={this.handleSubmit}>
                            <div >
                                บันทึก
                            </div>
                        </Button>
                    </div>

                </Form>


            </div >
        )
    }
}
