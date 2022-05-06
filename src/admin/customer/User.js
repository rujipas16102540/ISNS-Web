import React, { Component } from 'react'
import { Col, Row, Tabs, Tab, Form, Button, Modal } from 'react-bootstrap'
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

import { API_URL } from '../../config/config'
import Axios from 'axios'
import Swal from 'sweetalert2'

import { MDBDataTable, Card, CardBody } from 'mdbreact';

const urlUser = API_URL + '/user/list_user';



export default class User extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user_modal: {
                first_name: "",
                last_name: "",
                email: "",
                line_id: "",
                phone_number: "",
                address: "",
                username: "",
                password: "",
            },
            posts: [],
            isLoading: true,
            tableRows: [],
            show: false,
        };
    }

    handleSubmit = async () => {
        console.log(this.state.user_modal)
        const { user_modal } = this.state;
        const data = new FormData();
        data.append("user_id", localStorage.getItem("user_id"))
        if (user_modal.first_name) {
            data.append("first_name", user_modal.first_name);
        } else {
            data.append("first_name", this.state.first_name);
        }
        if (user_modal.last_name) {
            data.append("last_name", user_modal.last_name);
        } else {
            data.append("last_name", this.state.last_name);
        }
        if (user_modal.address) {
            data.append("address", user_modal.address);
        } else {
            data.append("address", this.state.address);
        }
        if (user_modal.email) {
            data.append("email", user_modal.email);
        } else {
            data.append("email", this.state.email);
        }
        if (user_modal.phone_number) {
            data.append("phone_number", user_modal.phone_number);
        } else {
            data.append("phone_number", this.state.phone_number);
        } if (user_modal.username) {
            data.append("username", user_modal.username);
        } if (user_modal.password) {
            data.append("password", user_modal.password);
        }
        try {
            Swal.fire({
                title: 'ต้องการแก้ไขข้อมูลหรือไม่',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes',
                cancelButtonText: 'cancel'
            }).then(async (result) => {
                if (result.value) {
                    let url = API_URL + "/user/update_user"
                    Axios.post(url, data).then(function (res) {
                        console.log(res.data.status)
                        console.log(res.data.data)
                        if (res.data.status == 1) {
                            Swal.fire(
                                'แก้ไขข้อมูลสำเร็จ',
                                '',
                                'success'
                            ).then(() => {
                                window.location.href = "/customer"
                            })
                        } else if (res.data.status == 0) {
                            Swal.fire(
                                'แก้ไขข้อมูลไม่สำเร็จกรุณาลองใหม่อีกครั้ง',
                                '',
                                'warning'
                            )
                        }
                    }.bind(this))
                }
            })
        } catch (error) {
        }
    };

    handleChange(change, event) {
        var toChange = this.state.user_modal;
        toChange[change] = event.target.value;
        this.setState({ form: toChange });
    }

    deleteUser = async (user_id) => {
        const data = new FormData();
        data.append("user_id", user_id)
        try {
            Swal.fire({
                title: 'ต้องการลบข้อมูลหรือไม่',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes',
                cancelButtonText: 'cancel'
            }).then(async (result) => {
                if (result.value) {
                    let url = API_URL + "/user/delete_user"
                    Axios.post(url, data).then(function (res) {
                        console.log(res.data.status)
                        console.log(res.data.data)
                        if (res.data.status == 1) {
                            Swal.fire(
                                'ลบข้อมูลสำเร็จ',
                                '',
                                'success'
                            ).then(() => {
                                window.location.href = "/customer"
                            })
                        } else if (res.data.status == 0) {
                            Swal.fire(
                                'ลบข้อมูลไม่สำเร็จกรุณาลองใหม่อีกครั้ง',
                                '',
                                'warning'
                            )
                        }
                    }.bind(this))
                }
            })
        } catch (error) {
        }
    };

    showModal = async (user_id) => {
        localStorage.setItem("user_id", user_id)
        this.setState({
            show: !this.state.show,
        });
        const data = new FormData();
        data.append("user_id", user_id)
        try {
            let url = API_URL + "/user/list_user_by_id";
            Axios.post(url, data).then(function (res) {
                this.setState({
                    user_modal: {
                        first_name: res.data.data.first_name,
                        last_name: res.data.data.last_name,
                        email: res.data.data.email,
                        // line_id: res.data.data.line_id,
                        phone_number: res.data.data.phone_number,
                        address: res.data.data.address,
                        username: res.data.data.username,
                        password: res.data.data.password,
                    }
                })
            }.bind(this))
        } catch (error) { }
        console.log(this.state.user_modal)
    };

    componentWillMount = async () => {
        await Axios.get(urlUser)
            .then(response => response.data)
            .then(data => {
                console.log("user", data)
                this.setState({
                    posts: data.data
                })
                console.log(this.state.postsUser)
            })
            .then(async () => {
                this.setState({ tableRows: this.assemblePosts(), isLoading: false })
                console.log(this.state.tableRows);
            });
    }

    assemblePosts = () => {
        let posts = this.state.posts.map((index, i) => {
            if (index.user_type !== 1) {
                return (
                    {
                        name: index.prefix + " " + index.first_name + "  " + index.last_name,
                        address: index.address,
                        email: index.email,
                        line_id: index.line_id,
                        phone_number: index.phone_number,
                        // no: i + 1,
                        // username: index.username,
                        // password: index.password,
                        bin: <RiDeleteBin6Line onClick={() => this.deleteUser(index.user_id)} size={20} style={{ cursor: "pointer", color: "#212529" }} />,
                        edit: <FaRegEdit size={20} onClick={() => { this.showModal(index.user_id) }} style={{ cursor: "pointer", color: "#212529" }} />,
                    }
                )
            }
        });
        return posts;
    }
    render() {
        const data = {
            columns: [
                // {
                //     label: 'ลำดับที่',
                //     field: 'no',
                // },
                {
                    label: 'ชื่อจริง',
                    field: 'name',
                },
                {
                    label: 'ที่อยู่',
                    field: 'address',
                },
                {
                    label: 'Email',
                    field: 'email',
                },
                // {
                //     label: 'Username',
                //     field: 'username',
                // },
                // {
                //     label: 'Password',
                //     field: 'password',
                // },
                {
                    label: 'เบอร์โทรศัพท์',
                    field: 'phone_number',
                },

                {
                    label: "แก้ไข",
                    field: "edit",
                },
                {
                    label: "ลบ",
                    field: "bin",
                }
            ],
            rows: this.state.tableRows,
        }
        return (
            <div>
                <CardBody >
                    <MDBDataTable
                        className="data-table-user"
                        small
                        striped
                        bordered
                        hover
                        data={data}
                    />
                </CardBody>

                <Modal show={this.state.show} size="lg" aria-labelledby="contained-modal-title-vcenter" centered className="modal-style">
                    <Modal.Body>
                        <Form style={{ padding: "20px 10px" }}>
                            <Row >
                                <Col style={{ padding: "5px" }}>
                                    <Form.Group>
                                        <Form.Label>ชื่อ</Form.Label>
                                        <Form.Control
                                            onChange={this.handleChange.bind(this, "first_name")}
                                            name="first_name"
                                            value={this.state.user_modal.first_name}
                                            type="text"
                                            placeholder="ชื่อ" />
                                    </Form.Group>
                                </Col>
                                <Col style={{ padding: "5px" }}>
                                    <Form.Group >
                                        <Form.Label>นามสกุล</Form.Label>
                                        <Form.Control
                                            onChange={this.handleChange.bind(this, "last_name")}
                                            name="last_name"
                                            value={this.state.user_modal.last_name}
                                            type="text"
                                            placeholder="นามสกุล" />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row >
                                <Col style={{ padding: "5px" }}>
                                    <Form.Group >
                                        <Form.Label>อีเมล</Form.Label>
                                        <Form.Control
                                            onChange={this.handleChange.bind(this, "email")}
                                            name="email"
                                            value={this.state.user_modal.email}
                                            type="text"
                                            placeholder="email" />
                                    </Form.Group>
                                </Col>
                                <Col style={{ padding: "5px" }}>
                                    <Form.Group >
                                        <Form.Label>เบอร์โทรศัพท์</Form.Label>
                                        <Form.Control
                                            onChange={this.handleChange.bind(this, "phone_number")}
                                            name="phone_number"
                                            value={this.state.user_modal.phone_number}
                                            type="text"
                                            placeholder="เบอร์โทรศัพท์" />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row >
                                <Col style={{ padding: "5px" }}>
                                    <Form.Group >
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control
                                            onChange={this.handleChange.bind(this, "username")}
                                            name="username"
                                            value={this.state.user_modal.username}
                                            type="text"
                                            placeholder="username" />
                                    </Form.Group>
                                </Col>
                                <Col style={{ padding: "5px" }}>
                                    <Form.Group >
                                        <Form.Label>Password</Form.Label>
                                        <Row>
                                            <Col sm={12}>
                                                <Form.Control
                                                    onChange={this.handleChange.bind(this, "password")}
                                                    name="password"
                                                    value={this.state.user_modal.password}
                                                    type={this.state.showPassword ? "text" : "password"}
                                                    placeholder="password" />
                                            </Col>
                                            <Col>
                                                <div style={{ position: "absolute", right: "12px", top: "0px", color: "black", alignItems: "center", display: "flex", height: "calc(1.5em + .75rem + 2px)" }}
                                                    onClick={() => this.setState({ showPassword: !this.state.showPassword })}>
                                                    {this.state.showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                                                </div>
                                            </Col>

                                        </Row>


                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group style={{ padding: "5px" }}>
                                <Form.Label>ที่อยู่</Form.Label>
                                <Form.Control
                                    onChange={this.handleChange.bind(this, "address")}
                                    name="address"
                                    value={this.state.user_modal.address}
                                    type="text"
                                    placeholder="ที่อยู่" />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => this.handleSubmit()} className="btn-confirm" style={{ marginRight: "5px" }}>
                            {/* <div style={{ backgroundImage: "linear-gradient(rgb(0,255,0),rgb(0,155,0),rgb(0,155,0))", borderRadius: "15px", padding: "0 10px", color: "white", fontWeight: "bold" }}> */}
                            บันทึก
                            {/* </div> */}
                        </Button>
                        <Button onClick={() => { this.showModal() }} className="btn-cancel">
                            {/* <div style={{ backgroundImage: "linear-gradient(rgb(255,0,0),rgb(155,0,0),rgb(155,0,0))", borderRadius: "15px", padding: "0 10px", color: "white", fontWeight: "bold" }}> */}
                            ยกเลิก
                            {/* </div> */}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}
