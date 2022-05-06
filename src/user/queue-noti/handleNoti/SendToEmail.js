import React, { Component } from 'react'
import Axios from 'axios'
import { Form, Row, Col, Button } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState, } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { API_URL } from '../../../config/config'


export default class SendToEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: EditorState.createEmpty(),
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

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
        // console.log(draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())))

    };

    handleSubmit = async () => {
        let { newsInfo, test } = this.state;
        let body = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
        if (newsInfo.header) {
            const data = new FormData();
            data.append("header", newsInfo.header)
            data.append("body", body)
            data.append("topic", localStorage.getItem('header'))
            console.log(data.get('header'))
            console.log(data.get('topic'))
            console.log(data.get('body'))

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
                        let url = API_URL + "/news/email_noti"
                        Axios.post(url, data).then(function (res) {
                            console.log(res.data.status)
                            if (res.data.status == 1) {
                                Swal.fire(
                                    'ประชาสัมพันธ์ไปที่ Email สำเร็จ',
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
        let { editorState } = this.state;
        if (this.state.username === null && this.state.password === null) {
            window.location.href = "/";
        }
        return (
            <div >
                <Form style={{ padding: "2% 10%" }}>
                    <Row >
                        <Col style={{ padding: "5px" }}>
                            <Form.Group>
                                <Form.Label>หัวข้อ</Form.Label>
                                <Form.Control
                                    onChange={(e) => this.handleChange("header", e.target.value)}
                                    placeholder="หัวข้อ" />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{ padding: "5px" }}>
                            <Form.Group>
                                <Form.Label>ข้อความ</Form.Label>
                                <Editor
                                    style={{ height: "150px" }}
                                    className="rdw-editor-main public-DraftStyleDefault-block"
                                    placeholder="ข้อความ"
                                    editorState={editorState}
                                    onEditorStateChange={this.onEditorStateChange}

                                />

                            </Form.Group>
                        </Col>
                    </Row>

                    <div style={{ justifyContent: 'center', display: 'flex' }}>
                        <Button onClick={this.handleSubmit} className="btn-confirm">
                            ประชาสัมพันธ์
                        </Button>
                    </div>
                </Form>
            </div>
        )
    }
}
