import React, { Component } from 'react'
import Axios from 'axios'
import { API_URL } from '../../config/config'
import { Form, Row, Col, Button } from 'react-bootstrap'
import Swal from 'sweetalert2'

import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState, } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './News.css'

export default class SendToLine extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: EditorState.createEmpty(),
            newsInfo: {
                header: "ประชาสัมพันธ์ไปที่ Line",
                body: "",
            },
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

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState
        });
    };

    handleSubmit = async () => {
        let { newsInfo } = this.state;
        console.log(newsInfo)
        if (newsInfo.body) {
            console.log(newsInfo)
            const data = new FormData();
            data.append("body", newsInfo.body)
            data.append("header", newsInfo.header)
            try {
                Swal.fire({
                    title: 'ต้องการเพิ่มข่าวหรือไม่',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'cancel'
                }).then(async (result) => {
                    if (result.value) {
                        let url = API_URL + "/news/news_to_line"
                        Axios.post(url, data).then(function (res) {
                            console.log(res.data.status)
                            if (res.data.status == 1) {
                                Swal.fire(
                                    'ประชาสัมพันธ์ไปที่ Line สำเร็จ',
                                    '',
                                    'success'
                                ).then(() => {
                                    this.setState({
                                        newsInfo: {
                                            header: "",
                                            body: "",
                                        }
                                    });

                                    window.location.assign("/news")
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
        // let { editorState } = this.state;
        if (this.state.username === null && this.state.password === null) {
            window.location.href = "/";
        }
        return (
            <div>
                <Form style={{ padding: "20px 100px", backgroundImage: "rgba(255,255,255,0.6)", backdropFilter: "blur(5px)", borderRadius: "0 0 8px 8px" }}>
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
