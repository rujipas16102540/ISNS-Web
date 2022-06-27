import React, { Component } from 'react'
import { VscError } from 'react-icons/vsc';

export default class MobileError extends Component {
    render() {
        return (
            <div style={{ backgroundColor: "#FCF9C6", height: "100vh", justifyContent: "center", alignItems: "center", display: "flex" }}>
                <div>
                    <div style={{ textAlign: "center" }}>
                        <VscError size={150} />
                    </div>
                    <div style={{ fontSize: "2em" }}>
                        ระบบไม่รองรับการใช้งานผ่าน Mobile
                    </div>
                </div>
            </div>
        )
    }
}
