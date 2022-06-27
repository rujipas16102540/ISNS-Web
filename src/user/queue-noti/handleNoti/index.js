import React, { Component } from 'react'
import { Col, Row, Tabs, Tab, Form, Button, Modal } from 'react-bootstrap'
import { useMediaQuery } from 'react-responsive'
import { RiDeleteBin6Line } from 'react-icons/ri';
import { MdDragHandle } from 'react-icons/md';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { MDBDataTable, Card, CardBody } from 'mdbreact';
import Axios from 'axios'
import Swal from 'sweetalert2'
import { API_URL } from '../../../config/config'
import SendToEmail from './SendToEmail';
import SendToLine from './SendToLine';
import Approve from './Approve';
import NavLeftUser from '../../../component/NavLeftUser';
import SettingNoti from './SettingNoti';
import ListSettingNoti from './ListSettingNoti';
import "./StyleHandleNoti.css"
import Navb from '../../../component/Navbar';
import MobileError from '../../../component/MobileError';

const Desktop = ({ children }) => {
    const isDesktop = useMediaQuery({ minWidth: 768 })
    return isDesktop ? children : null
}
const Mobile = ({ children }) => {
    const isMobile = useMediaQuery({ maxWidth: 767 })
    return isMobile ? children : null
}

const url = API_URL + '/queue/list_queue';
export default class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user_modal: {},
            lst_queue: [],
            lst_noti: {},
            userInfo: {},
            posts: [],
            isLoading: true,
            tableRows: [],
            show: false,
            user_id: localStorage.getItem("user_id"),
            header: localStorage.getItem("header"),
            test: localStorage.getItem("test"),
        };
    }


    componentDidMount = async () => {
        /////////////// list user by id ////////////////////////////
        try {
            const data = new FormData();
            data.append("user_id", this.state.user_id)
            let url = API_URL + "/user/list_user_by_id";
            await Axios.post(url, data).then(function (res) {
                this.setState({
                    userInfo: res.data.data
                })
            }.bind(this))
        } catch (error) { }


        try {
            let data = new FormData;
            data.append("header", this.state.userInfo.header)
            let url = API_URL + "/other_noti/list_noti_by_header";
            await Axios.post(url, data).then(function (res) {
                this.setState({
                    lst_noti: res.data.data
                })
            }.bind(this))
        } catch (error) { }
    }

    componentWillMount = async () => {
        await Axios.get(url)
            .then(response => response.data)
            .then(data => {
                this.setState({
                    posts: data.data
                })
            })
            .then(async () => {
                this.setState({ tableRows: this.assemblePosts(), isLoading: false })
                // console.log(this.state.tableRows);
            });
    }

    assemblePosts = () => {

        let posts = this.state.posts.map((index, i) => {
            if (index.header === this.state.header && index.approve === "1") {

                console.log('drescription', index.drescription)

                return (
                    {
                        name: index.prefix + " " + index.first_name + "  " + index.last_name,
                        drescription: index.drescription === "null" ? "-ไม่มีรายละเอียดเพิ่มเติม-" : index.drescription,
                        email: index.email,
                        phone_number: index.phone_number,
                        bin: <RiDeleteBin6Line onClick={() => this.handleDelete(index.queue_id)} size={20} style={{ cursor: "pointer", color: "#212529" }} />,
                    }
                )
            }
        });
        return posts;
    }

    handleDelete = async (queue_id) => {
        const data = new FormData();
        data.append("queue_id", queue_id)
        try {
            Swal.fire({
                title: 'ต้องการลบการจองคิวหรือไม่',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes',
                cancelButtonText: 'cancel'
            }).then(async (result) => {
                if (result.value) {
                    let url = API_URL + "/queue/cancel_queue";
                    await Axios.post(url, data).then(function (res) {
                        if (res.data = "Success") {
                            Swal.fire(
                                'ลบสำเร็จ',
                                '',
                                'success'
                            ).then(() => {
                                window.location.href = "/creator/handle"
                            })
                        } else if (res.data.status == 0) {
                            Swal.fire(
                                'ลบไม่สำเร็จ',
                                '',
                                'warning'
                            )
                        }
                    }.bind(this))
                }
            })
        } catch (error) { }
    }

    render() {
        const data = {
            columns: [
                {
                    label: 'ชื่อจริง',
                    field: 'name',
                },
                {
                    label: 'รายละเอียด',
                    field: 'drescription',
                },
                {
                    label: 'Email',
                    field: 'email',
                },
                {
                    label: 'เบอร์โทร',
                    field: 'phone_number',
                },

                {
                    label: 'ลบ',
                    field: 'bin',
                },
            ],
            rows: this.state.tableRows,
        }
        return (
            <div>
                <Desktop>
                    <div className="UserBG">
                        <Row >
                            <Col sm={2} className="infoUser" style={{ height: "auto" }}>
                                <NavLeftUser />
                            </Col>
                            <Col sm={10} style={{ padding: "2% 10%", color: "#212529" }}>
                                <div style={{ padding: "15px" }}>
                                    <div className='bg-header'>
                                        <h4>{this.state.userInfo.header}</h4>
                                    </div>
                                    <Tabs defaultActiveKey="st_user" style={{ borderBottom: "1px solid rgb(150,150,150)", fontSize: "1.2em" }} className="editTabsUserQueue">
                                        <Tab eventKey="st_user" title="รายชื่อทั้งหมด" className="styleTabUserQueue">
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
                                        </Tab>
                                        {this.state.lst_noti.send_message === "true" ? <Tab eventKey="news" title="ประชาสัมพันธ์" className="styleTabUserQueue">
                                            <SendToEmail />
                                            <SendToLine />
                                        </Tab> : <></>}
                                        {this.state.lst_noti.setting_noti === "true" ? <Tab eventKey="setting_noti" title="ตั้งเวลาแจ้งเตือน" className="styleTabUserQueue">
                                            <SettingNoti />
                                        </Tab> : <></>}
                                        {this.state.lst_noti.setting_noti === "true" ? <Tab eventKey="waiting_to_send_message" title="รายการแจ้งเตือนล่วงหน้า" className="styleTabUserQueue">
                                            <ListSettingNoti />
                                        </Tab> : <></>}

                                        <Tab eventKey="approve" title="การอนุมัติ" className="styleTabUserQueue">
                                            <Approve />
                                        </Tab>
                                    </Tabs>
                                </div>
                            </Col>
                        </Row >
                    </div >
                </Desktop >
                <Mobile>
                    <div className="UserBG">
                        <div>
                            <Navb />
                        </div>
                        <div>
                            <MobileError />

                        </div>

                        {/* <Row >
                            <Tabs defaultActiveKey="st_user" style={{ border: "unset" }} >
                                <Tab eventKey="st_user" title="รายชื่อทั้งหมด" className="styleTabUserQueue">
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
                                </Tab>
                                {this.state.lst_noti.send_message === "true" ? <Tab eventKey="news" title="ประชาสัมพันธ์" className="styleTabUserQueue">
                                    <SendToEmail />
                                    <SendToLine />
                                </Tab> : <></>}
                                {this.state.lst_noti.setting_noti === "true" ? <Tab eventKey="setting_noti" title="ตั้งเวลาแจ้งเตือน" className="styleTabUserQueue">
                                    <SettingNoti />
                                    <ListSettingNoti />
                                </Tab> : <></>}

                                <Tab eventKey="approve" title="การอนุมัติ" className="styleTabUserQueue">
                                    <Approve />
                                </Tab>
                            </Tabs>
                        </Row > */}
                    </div >
                </Mobile>

            </div>
        )
    }
}
