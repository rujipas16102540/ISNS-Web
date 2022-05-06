import React, { Component } from 'react'
import { VscError } from 'react-icons/vsc';

export default class MobileError extends Component {
    render() {
        return (
            <div style={{ backgroundImage: "linear-gradient(rgb(99, 99, 99), #F1F1F1, #F1F1F1, rgb(99, 99, 99))", height: "100vh", justifyContent: "center", alignItems: "center", display: "flex" }}>
                <div>
                    <div style={{ textAlign: "center" }}>
                        <VscError size={150} />
                    </div>
                    <div style={{ fontSize: "2em" }}>
                        ระบบไม่รองรับการช้งานผ่าน Mobile
                    </div>
                </div>
            </div>
        )
    }
}
