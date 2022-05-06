import React, { Component } from 'react'
import { Col, Row, Tabs, Tab, Form, Button, Modal, ModalBody, Label } from 'react-bootstrap'

import Axios from 'axios'
import { API_URL } from '../../config/config'
import dayjs from 'dayjs'
import { MDBDataTable, CardBody } from 'mdbreact';
import Swal from 'sweetalert2'

export default class Payment extends Component {
    constructor(prop) {
        super(prop);
        this.state = {
            posts: [],
            isLoading: true,
            tableRows: [],
        }
    }

    componentWillMount = async () => {
        await Axios.get(API_URL + '/payment/list_payment')
            .then(response => response.data)
            .then(data => {
                let result = data.data
                this.setState({
                    posts: result
                })
                console.log(this.state.posts)
            })
            .then(async () => {
                this.setState({ tableRows: this.assemblePosts(), isLoading: false })
                // console.log(this.state.tableRows);
            });
    }

    assemblePosts = () => {
        let posts = this.state.posts.map((index, i) => {
            if (index.approve == "4") {
                console.log(index)
                return (
                    {
                        // name: index.prefix + " " + index.first_name + "  " + index.last_name,
                        // name: `${index.prefix} ${index.first_name} ${index.last_name}`,
                        name: `${index.name}`,
                        payer_name: index.payer_name,
                        price: index.price,
                        date: index.date,
                        license_plate: index.license_plate,
                        reference_number: index.reference_number,
                        pay: <Button className="btn-confirm" onClick={() => { this.paymentConfirm(index.payment_id, index.email) }}> ชำระเงินแล้ว </Button >
                    }
                )
            }
        });
        return posts;
    }

    paymentConfirm = async (payment_id, email) => {
        console.log(email)
        let data = new FormData
        data.append("approve", "5")
        data.append("payment_id", payment_id)
        Swal.fire({
            title: 'ยืนยันดำเนินการสำเร็จ?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'cancel'
        }).then(async (result) => {
            if (result.value) {
                let url_update_approve_payment = API_URL + "/payment/update_approve"
                Axios.post(url_update_approve_payment, data).then(function (res) {
                    if (res.data.status == 1) {
                        // data.append("approve", "5")
                        data.append("email", email)
                        let url_update_approve_queue = API_URL + "/queue/update_approve_by_email"
                        Axios.post(url_update_approve_queue, data)

                        Swal.fire(
                            'ยืนยันการชำระเงินสำเร็จ',
                            '',
                            'success'
                        ).then(() => {
                            window.location.href = "/queue"
                        })
                    } else if (res.data.status == 0) {
                        Swal.fire(
                            'ยืนยันการชำระเงินไม่สำเร็จ',
                            '',
                            'warning'
                        )
                    }
                })
            }
        })
    }

    render() {

        const data = {
            columns: [
                {
                    label: 'ชื่อผู้รับบริการ',
                    field: 'name',
                },
                {
                    label: 'ป้ายทะเบียนรถ',
                    field: 'license_plate',
                },
                {
                    label: 'ชื่อผูชำระเงิน',
                    field: 'payer_name',
                },
                {
                    label: 'วันที่ชำระเงิน',
                    field: 'date',
                },
                {
                    label: 'ราคา',
                    field: 'price',
                },
                {
                    label: 'เลขที่บิล',
                    field: 'reference_number',
                },
                {
                    label: 'การชำระเงิน',
                    field: 'pay',
                },
            ],
            rows: this.state.tableRows,
        }
        return (
            <div>
                <CardBody >
                    <MDBDataTable
                        className="data-table-payment data-table-queue-hidden"
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
