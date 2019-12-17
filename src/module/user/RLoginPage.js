import React from 'react';
import 'antd/dist/antd.css';
import {Form, Input, Button, message} from 'antd';
import {useParams, useHistory, useRouteMatch, withRouter} from "react-router-dom"
import './RLoginPage.css';
import {fetchPost} from "../util/RFetchHelper";

class NormalLoginForm extends React.Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                let t = {
                    "account": values.username,
                    "password": values.password
                };
                this.login(t)
            }
        });
    };

    login = (data) => {
        fetchPost('/rcms/login', data).then(result => {
            if (result.errcode !== 0) {
                message.error("login error!");
                return;
            }
            window.sessionStorage.setItem("account", result.data.account);
            this.props.history.push("/")
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div className={"default-div-outside"}>
                <div className={"default-div-inner"}>
                    <h1 style={{color: "white", fontWeight: 800, fontSize: 40}}>RCMS</h1>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {getFieldDecorator('username', {
                                rules: [{required: true, message: 'Please input your username!'}],
                            })(
                                <Input
                                    placeholder="Username"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [{required: true, message: 'Please input your Password!'}],
                            })(
                                <Input
                                    type="password"
                                    placeholder="Password"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Log in
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        );
    }
}

const RLoginLayout = Form.create({name: 'normal_login'})(NormalLoginForm);


export default withRouter(RLoginLayout);