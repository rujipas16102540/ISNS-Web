import React, { Component } from 'react'
import Axios from 'axios'
import { API_URL } from '../../config/config'
import { Form, Row, Col, Button } from 'react-bootstrap'
import Swal from 'sweetalert2'

import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState, } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
// import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './News.css'
import parse from 'html-react-parser';



export default class SendToEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: EditorState.createEmpty(),
            newsInfo: {
                header: "",
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
        console.log(draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())))

    };

    handleSubmit = async () => {
        let { newsInfo } = this.state;
        console.log(newsInfo)
        if (newsInfo.header) {
            const data = new FormData();
            let body = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
            console.log("1", body)
            data.append("header", newsInfo.header)
            data.append("body", body)

            console.log(data.get('body'))

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
                        let url = API_URL + "/news/send_to_email"
                        Axios.post(url, data).then(function (res) {
                            console.log(res.data.status)
                            if (res.data.status == 1) {
                                Swal.fire(
                                    'ประชาสัมพันธ์ไปที่ Email สำเร็จ',
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
        let { editorState } = this.state;
        if (this.state.username === null && this.state.password === null) {
            window.location.href = "/";
        }
        return (
            <div >
                <Form style={{ padding: "20px 100px", backgroundImage: "rgba(255,255,255,0.6)", backdropFilter: "blur(5px)", borderRadius: "0 0 8px 8px" }}>
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
                            {/* <div style={{ backgroundImage: "linear-gradient(rgb(0,255,0),rgb(0,155,0),rgb(0,155,0))", borderRadius: "15px", padding: "0 10px", color: "white", fontWeight: "bold" }}> */}
                            ประชาสัมพันธ์
                            {/* </div> */}
                        </Button>
                    </div>
                </Form>
            </div>
        )
    }
}
