import React, { Component } from 'react'
import Axios from 'axios'
import { Form, Row, Col, Button, Spinner } from 'react-bootstrap'
import Swal from 'sweetalert2'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { API_URL } from '../../../config/config'

// import './News.css'

export default class SendToLine extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newsInfo: {},
            username: localStorage.getItem("username"),
            password: localStorage.getItem("password"),
        };
    }

    handleChange = (action, value) => {
        let { newsInfo } = this.state;
        newsInfo[action] = value;
        this.setState({
            newsInfo,
        });
    };

    handleSubmit = async () => {
        let { newsInfo } = this.state;
        if (newsInfo.body) {
            console.log(localStorage.getItem("header"))
            const data = new FormData();
            data.append("body", newsInfo.body)
            data.append("topic", localStorage.getItem("header"))
            try {
                Swal.fire({
                    title: 'ประชาสัมพันธ์หรือไม่',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'cancel'
                }).then(async (result) => {
                    if (result.value) {
                        let url = API_URL + "/news/line_noti"
                        await Axios.post(url, data).then(function (res) {
                            if (res.data.status == 1) {
                                Swal.fire(
                                    'ประชาสัมพันธ์ไปที่ Line สำเร็จ',
                                    '',
                                    'success'
                                ).then(() => {
                                    window.location.assign("/creator/handle")
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
        // let { editorState } = this.state;
        if (this.state.username === null && this.state.password === null) {
            window.location.href = "/";
        }
        return (
            <div>
                <Form style={{ padding: "2% 10%" }}>
                    <Row >
                        <Col style={{ padding: "5px" }}>
                            <Form.Group>
                                <Form.Label>ข้อความ</Form.Label>
                                <Form.Control
                                    onChange={(e) => this.handleChange("body", e.target.value)}
                                    placeholder="ข้อความ" />
                            </Form.Group>
                        </Col>
                    </Row>


                    <div style={{ justifyContent: 'center', display: 'flex' }}>
                        <Button onClick={this.handleSubmit} className="btn-confirm">
                            ส่งข่าวสาร
                        </Button>

                    </div>
                </Form>


            </div>
        )
    }
}
