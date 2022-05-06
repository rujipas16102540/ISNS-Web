import React, { Component } from 'react'
import { Route, BrowserRouter, Switch } from 'react-router-dom'
import Customer from './admin/customer/Customer'
import Queue from './admin/queue/Queue'
import Register from './user/Register'
import UserQueue from './user/queue-noti/UserQueue'
import Login from './user/Login'
import News from './admin/news/News'
import OtherNotifications from './admin/other_notifications/OtherNotifications'
import Message from './admin/message/Message'
import Service from "./admin/service/Service"
import ApproveQueue from "./admin/queue/ApproveQueue"



import handle_noti_user from './user/queue-noti/handleNoti'
import NotFound from './NotFound'
import HandleNoti from './admin/other_notifications/handleNoti/HandleNoti'

export default class route extends Component {
    render() {
        return (
            <div>
                <BrowserRouter forceRefresh={false}>
                    <Switch>
                        <Route exact path='/register' component={Register} />


                        {/* <Route exact path='/usernoti:id?' component={UserNoti} /> */}
                        <Route exact path='/userqueue/:id?' component={UserQueue} />
                        <Route exact path='/creator/handle' component={handle_noti_user} />
                        <Route exact path='/' component={Login} />



                        <Route exact path='/customer' component={Customer} />
                        <Route exact path='/queue' component={Queue} />
                        {/* <Route exact path='/message' component={Message} /> */}
                        <Route exact path='/news' component={News} />
                        {/* <Route exact path='/service' component={Service} /> */}
                        {/* <Route exact path='/approve_queue' component={ApproveQueue} /> */}
                        <Route exact path='/other_notifications' component={OtherNotifications} />
                        <Route exact path='/other_notifications/handle_noti' component={HandleNoti} />



                        <Route path='*' component={NotFound} />

                    </Switch>
                </BrowserRouter>

            </div>
        )
    }
}
