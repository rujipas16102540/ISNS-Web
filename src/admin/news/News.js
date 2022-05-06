import React, { Component } from 'react'
import Header from "../../component/Header"
import Navleft from "../../component/NavLeft"
import { Col, Row, Tabs, Tab, Modal } from 'react-bootstrap'
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { API_URL } from '../../config/config'
import Axios from 'axios'
// import "../../component/NavLeft.css"
import "./News.css"
import parse from 'html-react-parser';

import { MDBDataTable, CardBody } from 'mdbreact';
import { useMediaQuery } from 'react-responsive'
import MobileError from '../../component/MobileError';
import SendToEmail from './SendToEmail';
import SendToLine from './SendToLine';

const Desktop = ({ children }) => {
    const isDesktop = useMediaQuery({ minWidth: 768 })
    return isDesktop ? children : null
}
const Mobile = ({ children }) => {
    const isMobile = useMediaQuery({ maxWidth: 767 })
    return isMobile ? children : null
}
const url = API_URL + '/news/list_news';



export default class news extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newsInfo: {
                body: "",
                header: "",
            },
            username: localStorage.getItem("username"),
            password: localStorage.getItem("password"),
            data_news: [],
            page_accept: true,

            posts: [],
            isLoading: true,
            tableRows: [],
        };
    }

    componentWillMount = async () => {
        console.log(url)
        await Axios.post(url)
            .then(response => response.data)
            .then(data => {
                console.log(data)

                this.setState({
                    posts: data.data
                })
                // console.log(this.state.posts)
            })
            .then(async () => {
                this.setState({ tableRows: this.assemblePosts(), isLoading: false })
                // console.log(this.state.tableRows);
            });
    }

    assemblePosts = () => {
        let posts = this.state.posts.map((index, i) => {
            return (
                {
                    header: parse(index.header),
                    body: parse(index.body),
                    // no: i + 1

                }
            )
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
                    label: 'หัวข้อ',
                    field: 'header',
                },
                {
                    label: 'เนื้อหา',
                    field: 'body',
                },
            ],
            rows: this.state.tableRows,
        }
        return (
            <div className=" bgAdmin">
                <Desktop>
                    <div className=" bgAdmin1">

                        <Row>
                            <Col sm={2} style={{ height: "100vh" }}>
                                <Navleft />
                            </Col>
                            <Col sm={10}>
                                <div style={{ margin: '1% 5%' }}>
                                    <div style={{ marginBottom: "15px", fontSize: "2em", fontWeight: "bold", padding: "10px 20px", color: "white", borderBottom: "2px solid white" }} >ข่าวสาร</div>
                                    <Tabs defaultActiveKey="news" className="editTabsCus">
                                        <Tab eventKey="news" title="ประวัติข่าวสาร" className="styleTabNews">
                                            {this.state.data_news.map((index, i) =>
                                                <div style={{
                                                    border: "1px solid white", margin: '0px 20px', fontSize: "16px", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                                                    borderRadius: "10px", marginTop: "5px"
                                                }}>
                                                    <Row>
                                                        <Col sm={2} style={{ alignItems: 'center', display: 'flex', wordBreak: 'break-all', padding: '5px 10px' }}>
                                                            {parse(index.header)}
                                                        </Col>
                                                        <Col sm={10} style={{ alignItems: 'center', display: 'flex', wordBreak: 'break-all', padding: '5px' }}>
                                                            {parse(index.body)}
                                                        </Col>
                                                    </Row>
                                                </div>
                                            )}

                                            <CardBody >
                                                <MDBDataTable
                                                    // entriesOptions={[5, 10]}
                                                    className="data-table-news"
                                                    small
                                                    striped
                                                    bordered
                                                    hover
                                                    data={data}
                                                />
                                            </CardBody>
                                        </Tab>
                                        <Tab eventKey="SendToEmail" title="ประชาสัมพันธ์ไปที่ Email" className="styleTabNews">
                                            <SendToEmail />
                                        </Tab>
                                        <Tab eventKey="SendToLine" title="ประชาสัมพันธ์ไปที่ Line" className="styleTabNews">
                                            <SendToLine />
                                        </Tab>
                                    </Tabs>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Desktop>
                <Mobile>
                    <MobileError />
                </Mobile>
            </div>
        )
    }
}
