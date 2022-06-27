// import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { IconContext } from 'react-icons';

import React, { Component, useState } from 'react'
import NavLeftUser from './NavLeftUser';
import { Button } from 'react-bootstrap';

export default class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sidebar: false,
            setSidebar: false,
        }
    };

    showSidebar = () => {
        console.log('132', 132)
        this.setState({
            sidebar: !this.state.sidebar,
        });
    }

    render() {
        let path = window.location.pathname

        return (
            <>

                <IconContext.Provider value={{ color: '#000' }}>
                    <div className='navbar'>
                        ระบบแจ้งเตือนงานอัจฉริยะ

                        <Link to='#' className='menu-bars'>
                            <FaIcons.FaBars onClick={this.showSidebar} />
                        </Link>
                    </div>
                    <nav className={this.state.sidebar ? 'nav-menu active' : 'nav-menu'}>
                        <ul className='nav-menu-items' >
                            <li className='navbar-toggle'>
                                <Link to='#' className='menu-bars'>
                                    <AiIcons.AiOutlineClose onClick={this.showSidebar} />
                                </Link>
                            </li>
                            <li className='navbar-toggle'>
                                <NavLeftUser />
                            </li>
                        </ul>
                    </nav>
                </IconContext.Provider>
            </>
        )
    }
}
