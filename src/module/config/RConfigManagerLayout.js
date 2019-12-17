import React from 'react';
import 'antd/dist/antd.css';
import {
    Form,
    Menu
} from 'antd';

import {withRouter, Link} from "react-router-dom"
import RGroupConfigLayout from "./RGroupConfigLayout";
import {Route, Switch} from "react-router";
import RProjectConfigLayout from "./RProjectConfigLayout";

class ConfigManagerLayout extends React.Component {
    state = {
        current: "group"
    };

    constructor(props) {
        super(props);

    }

    componentWillMount() {
        this.props.history.push("/config/group")
    }

    handleMenuClick = e => {
        this.setState({
            current: e.key,
        });
    };


    render() {
        return (
            <div>
                <Menu mode="horizontal" onClick={this.handleMenuClick} selectedKeys={[this.state.current]}
                      style={{marginBottom: "30px"}}>
                    <Menu.Item key="group">
                        <Link to={`/config/group`}>
                            Group
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="project">
                        <Link to={`/config/project`}>
                            Project
                        </Link>
                    </Menu.Item>
                </Menu>
                <Switch>
                    <Route path={`${this.props.match.url}/group`}>
                        <RGroupConfigLayout sider_update={this.props.sider_update}/>
                    </Route>
                    <Route path={`${this.props.match.url}/project`}>
                        <RProjectConfigLayout sider_update={this.props.sider_update}/>
                    </Route>
                    <Route path={`${this.props.match.url}`}>
                        <RGroupConfigLayout sider_update={this.props.sider_update}/>
                    </Route>
                </Switch>
            </div>
        );
    }
}

const RConfigManagerLayout = Form.create({name: 'create'})(ConfigManagerLayout);

export default withRouter(RConfigManagerLayout);