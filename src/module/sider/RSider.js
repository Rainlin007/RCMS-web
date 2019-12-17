import React from 'react';
import 'antd/dist/antd.css';
import './RSider.css';
import {Layout, Menu} from 'antd';
import {Link, withRouter} from "react-router-dom"
import {fetchGet} from "../util/RFetchHelper";

const {Sider} = Layout;
const {SubMenu} = Menu;

class RSider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            list: []
        };
    }

    componentWillMount() {
        this.getData();
    }

    getData = () => {
        fetchGet('/rcms/group/read_all_projects').then(result => {
            if (result.errcode != 0) {
                return;
            }
            this.setState({list: result.data})
        });
    };

    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({collapsed});
    };

    genListItem = (props) => {
        let group_title = <span><span>{props.name}</span></span>;
        let items = [];
        for (let i = 0; i < props.projects.length; i++) {
            items.push(
                <Menu.Item key={props.projects[i].id}>
                    <Link to={"/item/show/" + props.projects[i].id}>{props.projects[i].name}</Link>
                </Menu.Item>);
        }
        return (
            <SubMenu key={props.id} title={group_title}>
                {items}
            </SubMenu>
        );

    };

    genList = (props) => {
        let listItem = [];
        for (let i = 0; i < props.length; i++) {
            listItem.push(this.genListItem(props[i]));
        }
        return (
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" onClick={this.onClick}>
                {listItem}
            </Menu>
        )
    };

    onClick = ({item, key, keyPath, domEvent}) => {
        if (this.props.onItemSelected !== undefined) {
            this.props.onItemSelected(key);
        }
    };

    render() {
        return (
            <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}
                   style={{minHeight: '100vh'}}>
                <div className="logo"/>
                {this.genList(this.state.list)}
            </Sider>
        );
    }
}

export default withRouter(RSider);