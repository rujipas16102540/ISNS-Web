import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import { API_URL } from '../../config/config'
import Axios from 'axios'
import Swal from 'sweetalert2'
import './StyleQueueNoti.css'

import { MDBDataTable, Card, CardBody } from 'mdbreact';

const urlListNoti = API_URL + '/other_noti/list_other_noti';
export default class ListOtherServices extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type_noti: "true",
            posts: [],
            isLoading: true,
            tableRows: [],
            show: false,
            username: localStorage.getItem("username"),
            password: localStorage.getItem("password"),
        };
    }

    componentWillMount = async () => {
        await Axios.get(urlListNoti)
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



    handleSubmit = (type_noti, header) => {
        localStorage.setItem("header", header)

        console.log(this.state.type_noti)
        console.log(header)
        console.log(this.state.username)
        Swal.fire({
            icon: 'question',
            title: 'ต้องการรับบริการหรือไม่',
            showCancelButton: true,
            confirmButtonColor: '#218838',
            cancelButtonColor: '#c82333',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก'
        }).then(async (result) => {
            if (result.value) {
                let data = new FormData()
                data.append("header", header)
                data.append("username", this.state.username)
                data.append("type_noti", this.state.type_noti)
                let url = API_URL + "/user/update_type_noti";
                await Axios.post(url, data).then(function (res) {
                    window.location.assign("/userqueue")
                    // if (res.data === "Success") {
                    // Swal.fire({
                    //     icon: 'success',
                    //     title: 'รอพนักงานอนุมัติอีกครั้ง',
                    //     confirmButtonColor: '#218838',
                    //     confirmButtonText: 'ตกลง',
                    // }).then(() => {
                    // window.location.assign("/userqueue")
                    // })
                    // }
                })
            }
        })
    }

    assemblePosts = () => {
        let posts = this.state.posts.map((index, i) => {
            // if (index.user_type !== 1) {
            return (
                {
                    header: index.header,
                    // handle: index.drescription,
                    // handle: <MdDragHandle size={20} onClick={() => { this.toHandleNoti(index.header) }} style={{ cursor: "pointer", color: "#212529" }} />,
                    button: <Button className="btn-confirm" onClick={() => { this.handleSubmit(index.type_noti, index.header) }}>รับบริการ</Button>,

                }
            )
            // }
        });
        return posts;
    }

    render() {
        if (this.state.username === null && this.state.password === null) {
            window.location.href = "/";
        }
        const SelectNoti = {
            columns: [
                {
                    label: 'หัวข้อบริการ',
                    field: 'header',
                },
                {
                    label: "รับบริการ",
                    field: "button",
                }
            ],
            rows: this.state.tableRows,
        }
        return (
            <div style={{ padding: "5%" }}>
                <MDBDataTable
                    className="data-table-select"
                    small
                    striped
                    bordered
                    hover
                    data={SelectNoti}
                />
            </div>
        )
    }
}
