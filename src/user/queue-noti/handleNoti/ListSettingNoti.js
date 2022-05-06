import React, { Component } from 'react'
import Axios from 'axios'
import { API_URL } from '../../../config/config'
import { MDBDataTable, CardBody } from 'mdbreact';
import { RiDeleteBin6Line } from 'react-icons/ri';
import Swal from 'sweetalert2'
import dayjs from 'dayjs'


const url = API_URL + '/setting_noti/lst_setting_noti';
export default class ListSettingNoti extends Component {
    constructor(props) {
        super(props);
        this.state = {

            username: localStorage.getItem("username"),
            password: localStorage.getItem("password"),
            header: localStorage.getItem("header"),
            data_queue: [],
            page_accept: true,
            posts: [],
            isLoading: true,
            tableRows: [],

        };
    }

    componentWillMount = async () => {
        await Axios.get(url)
            .then(response => response.data)
            .then(data => {
                let result = data.data
                for (let i in result) {
                    result[i].date = dayjs(result[i].date).format("DD/MM/YYYY")
                }

                this.setState({
                    posts: data.data,
                })
            })
            .then(async () => {
                this.setState({ tableRows: this.assemblePosts(), isLoading: false })
                // console.log(this.state.tableRows);
            });
    }

    assemblePosts = () => {
        let posts = this.state.posts.map((index, i) => {
            if (index.name_noti === this.state.header && index.status === "wait") {
                return (
                    {
                        header: index.header,
                        body: index.body,
                        date: index.date,
                        bin: <RiDeleteBin6Line onClick={() => this.handleDelete(index.setting_noti_id)} size={20} style={{ cursor: "pointer", color: "#212529" }} />,
                        // phone_number: index.phone_number,
                        // approve: <Button className="btn-confirm" onClick={() => { this.handleApprove(index.queue_id) }}>อนุมัติ</Button >,
                        // disapprove: <Button className="btn-cancel" onClick={() => { this.showModalDisapprove(index.queue_id) }}> ไม่อนุมัติ </Button >
                    }
                )
            }
        });
        return posts;
    }

    handleDelete = async (setting_noti_id) => {
        console.log('first', setting_noti_id)
        const data = new FormData();
        data.append("setting_noti_id", setting_noti_id)
        try {
            Swal.fire({
                title: 'ต้องการยกเลิกกำหนดการแจ้งเตือนหรือไม่',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes',
                cancelButtonText: 'cancel'
            }).then(async (result) => {
                if (result.value) {
                    let url = API_URL + "/setting_noti/cancel_setting_noti";
                    await Axios.post(url, data).then(function (res) {
                        if (res.data = "Success") {
                            Swal.fire(
                                'ยกเลิกกำหนดการแจ้งเตือนสำเร็จ',
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
        if (this.state.username === null && this.state.password === null) {
            window.location.href = "/";
        }

        const data = {
            columns: [
                {
                    label: 'หัวข้อ',
                    field: 'header',
                },
                {
                    label: 'เนื้อหา',
                    field: 'body',
                },
                {
                    label: 'วันที่แจ้งเตือน',
                    field: 'date',
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
                <CardBody >
                    <MDBDataTable
                        className="data-table-approve-queue data-table-queue-hidden"
                        small
                        striped
                        bordered
                        hover
                        data={data}
                    />
                </CardBody>
            </div >
        )
    }
}
