import React, { Component } from 'react'
import { AiFillWarning } from 'react-icons/ai';

export default class NotFound extends Component {
  render() {
    return (
      <div style={{
        backgroundImage: "linear-gradient(rgb(99, 99, 99), #F1F1F1, #F1F1F1, rgb(99, 99, 99))",
        // color: "white",
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <div style={{ textAlign: "center" }}>
          <AiFillWarning size={250} />
          <div style={{ fontSize: "5em", fontWeight: "bold" }}>Error 404</div>
          <div style={{ fontSize: "2em" }}>ไม่พบ URL ของหน้าเว็บไซต์นี้</div>
        </div>

      </div >
    )
  }
}
