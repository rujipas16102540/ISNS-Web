import React, { Component } from 'react'
import Axios from 'axios'
import { Col, Row, Tabs, Tab, Form, Button, Modal } from 'react-bootstrap'
import { API_URL } from '../../config/config'
import Header from "../../component/Header"
import Navleft from "../../component/NavLeft"
import "./Queue.css"

import { MDBDataTable, CardBody } from 'mdbreact';
import dayjs from 'dayjs'
import { useMediaQuery } from 'react-responsive'
import MobileError from '../../component/MobileError';
import ApproveQueue from "./ApproveQueue"
import Progress from './Progress'
import Payment from './Payment'

const Desktop = ({ children }) => {
    const isDesktop = useMediaQuery({ minWidth: 768 })
    return isDesktop ? children : null
}
const Mobile = ({ children }) => {
    const isMobile = useMediaQuery({ maxWidth: 767 })
    return isMobile ? children : null
}

const url = API_URL + '/queue/list_queue';

export default class Queue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            queueInfo: {
                first_name: "",
                last_name: "",
                email: "",
                line_id: "",
                date: "",
                phone_number: "",
                consonant: "",
                number: "",
                province: "",
            },
            username: localStorage.getItem("username"),
            password: localStorage.getItem("password"),
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
                console.log(data.data)
                let result = data.data

                for (let i in result) {
                    // result[i].date = dayjs(result[i].date).format("HH:mm DD/MM/YYYY")
                    if (result[i].end_time != null) {
                        result[i].end_time = (dayjs(result[i].date).format('HH:mm')) + " น. - " + (Number(result[i].end_time) + Number(dayjs(result[i].date).format('HH'))) + ":00 น."
                        result[i].date = dayjs(result[i].date).format("DD/MM/YYYY")
                    }
                }

                this.setState({
                    posts: result
                })
            })
            .then(async () => {
                this.setState({ tableRows: this.assemblePosts(), isLoading: false })
            });
    }

    assemblePosts = () => {
        let posts = this.state.posts.map((index, i) => {
            if (index.approve == "5") {
                return (
                    {
                        name: index.prefix + " " + index.first_name + "  " + index.last_name,
                        details: index.details,
                        price: index.price,
                        phone_number: index.phone_number,
                        date: index.end_time + " " + index.date,
                        license_plate: index.consonant + " " + index.number + " " + index.province,
                        // no: i
                    }
                )
            }
        });
        return posts;
    }


    render() {

        if (this.state.username === null && this.state.password === null) {
            window.location.href = "/";
        }

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
                    label: 'ป้ายทะเบียน',
                    field: 'license_plate',
                },
                {
                    label: 'รายละเอียด',
                    field: 'details',
                },
                {
                    label: 'ราคา',
                    field: 'price',
                },
                {
                    label: 'วันที่รับบริการ',
                    field: 'date',
                },
            ],
            rows: this.state.tableRows,
        }

        return (
            <div className=" bgAdmin">
                <Desktop>
                    <div lassName=" bgAdmin1" >
                        <Row >
                            <Col md={2} style={{ height: '100vh' }} >
                                <Navleft />
                            </Col>
                            <Col md={10} style={{ height: 'auto' }}>
                                <div style={{ margin: '15px' }}>
                                    <div style={{ margin: '15px', fontSize: "2em", fontWeight: "bold", padding: "10px 20px", color: "white", borderBottom: "2px solid white" }} >ประวัติการจองคิว</div>
                                    <Tabs defaultActiveKey="approveQueue" className="editTabsCus">
                                        <Tab eventKey="approveQueue" title="รอการอนุมัติ" className="styleTabQueue">
                                            <ApproveQueue />
                                        </Tab>
                                        <Tab eventKey="progress" title="กำลังดำเนินการ" className="styleTabQueue">
                                            <Progress />
                                        </Tab>
                                        <Tab eventKey="payment" title="การชำระเงิน" className="styleTabQueue">
                                            <Payment />
                                        </Tab>
                                        <Tab eventKey="queue" title="ประวัติการดำเนินงาน" className="styleTabQueue">
                                            <CardBody >
                                                <MDBDataTable
                                                    className="data-table-queue data-table-queue-hidden"
                                                    small
                                                    striped
                                                    bordered
                                                    hover
                                                    data={data}
                                                />
                                            </CardBody>
                                        </Tab>
                                    </Tabs>
                                </div>
                            </Col>
                        </Row>
                    </div >
                </Desktop>
                <Mobile>
                    <MobileError />
                </Mobile>
            </div>
        )
    }
}
