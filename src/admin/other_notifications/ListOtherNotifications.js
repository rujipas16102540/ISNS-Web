import React, { Component } from 'react'
import { Col, Row, Tabs, Tab, Form, Button, Modal } from 'react-bootstrap'
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { MdDragHandle } from 'react-icons/md';

import { API_URL } from '../../config/config'
import Axios from 'axios'
import Swal from 'sweetalert2'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { MDBDataTable, Card, CardBody } from 'mdbreact';
import './Othernoti.css'

const urlListNoti = API_URL + '/other_noti/list_other_noti';
export default class ListOtherServices extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            isLoading: true,
            tableRows: [],
            lst_email: [],
            show: false,
            username: localStorage.getItem("username"),
            password: localStorage.getItem("password"),
        };
    }

    handleDelete = (other_noti_id) => {
        let data = new FormData
        data.append("other_noti_id", other_noti_id)
        Swal.fire({
            icon: 'question',
            title: 'ลบการแจ้งเตือนหรือไม่',
            showCancelButton: true,
            confirmButtonColor: '#218838',
            cancelButtonColor: '#c82333',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก'
        }).then(async (result) => {
            if (result.value) {
                let url = API_URL + "/other_noti/delete_noti"
                Axios.post(url, data).then(function (res) {
                    // console.log("data", res.data.data)
                    // console.log("status", res.data.status)
                    Swal.fire({
                        icon: 'success',
                        title: 'ลบการแจ้งเตือน',
                        confirmButtonColor: '#212529',
                        confirmButtonText: 'ตกลง',
                    }).then(() => {
                        window.location.href = "/other_notifications"
                    })
                }.bind(this))
            }
        })
    }

    delNoti = async (other_noti_id, header) => {
        console.log('other_noti_id', other_noti_id)
        console.log('other_noti_id', header)
        try {
            let data_noti = new FormData;
            data_noti.append("header", header)
            let url_noti = API_URL + "/user/lst_user_by_header";
            await Axios.post(url_noti, data_noti).then(function (res) {
                for (let i = 0; i <= res.data.data.length; i++) {
                    this.setState({
                        lst_email: [...this.state.lst_email, res.data.data[i].email]
                    })
                }
            }.bind(this))

        } catch (error) {
        }

        console.log('this.state.lst_email :  ', this.state.lst_email)
        Swal.fire({
            icon: 'question',
            title: 'ต้องการลบบริการหรือไม่?',
            showCancelButton: true,
            confirmButtonColor: '#218838',
            cancelButtonColor: '#c82333',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก'
        }).then(async (result) => {
            if (result.value) {
                /////Update header type_noti status by user//////
                let data1 = new FormData();
                data1.append("email", this.state.lst_email)
                data1.append("header", null)
                data1.append("type_noti", null)
                data1.append("status", null)
                let url = API_URL + "/user/re_user";
                Axios.post(url, data1).then(function (res) {
                    //////Delete Noti By id/////////
                    let del_noti = new FormData
                    del_noti.append("other_noti_id", other_noti_id)
                    let url_del_noti = API_URL + "/other_noti/delete_noti"
                    Axios.post(url_del_noti, del_noti)
                    //////Delet Queue By header////////
                    let del_queue_user = new FormData
                    del_queue_user.append("header", header)
                    let url_del_queue = API_URL + "/queue/del_by_header"
                    Axios.post(url_del_queue, del_queue_user)
                    //////Delete Setting Noti By Header ////////////
                    let del_setting_noti = new FormData
                    del_setting_noti.append("header", header)
                    let url_del_Setting_noti = API_URL + "/setting_noti/del_by_header"
                    Axios.post(url_del_Setting_noti, del_setting_noti)

                    Swal.fire({
                        icon: 'success',
                        title: 'ลบบริการสำเร็จ',
                        confirmButtonColor: '#212529',
                        confirmButtonText: 'ตกลง',
                    }).then(() => {
                        window.location.assign("/other_notifications")

                    })
                }.bind(this))
            }
        })
    }

    componentWillMount = async () => {
        await Axios.get(urlListNoti)
            .then(response => response.data)
            .then(data => {
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
            // if (index.user_type !== 1) {
            return (
                {
                    header: index.header,
                    drescription: index.drescription,
                    name: index.name,
                    // handle: <MdDragHandle size={20} onClick={() => { this.toHandleNoti(index.header) }} style={{ cursor: "pointer", color: "#212529" }} />,
                    bin: <RiDeleteBin6Line onClick={() => this.delNoti(index.other_noti_id, index.header)} size={20} style={{ cursor: "pointer", color: "#212529" }} />,

                }
            )
            // }
        });
        return posts;
    }

    // toHandleNoti = (header) => {
    //     localStorage.setItem("header", header)
    //     window.location.href = "/other_notifications/handle_noti"
    //     // this.props.history.push("/other_notifications/handle_noti");

    // }

    render() {
        if (this.state.username === null && this.state.password === null) {
            window.location.href = "/";
        }
        const data = {
            columns: [
                {
                    label: 'หัวข้อบริการ',
                    field: 'header',
                },
                {
                    label: 'รายละเอียดบริการ',
                    field: 'drescription',
                },
                {
                    label: 'ผู้ให้บริการ',
                    field: 'name',
                },
                // {
                //     label: 'จัดการ',
                //     field: 'handle',
                // },
                {
                    label: "ลบ",
                    field: "bin",
                }
            ],
            rows: this.state.tableRows,
        }
        return (
            <div>
                <CardBody className="styleOtherNoti" >
                    <MDBDataTable
                        className="data-table-lst-oth"
                        small
                        striped
                        bordered
                        hover
                        data={data}
                    />
                </CardBody>
            </div>
        )
    }
}
