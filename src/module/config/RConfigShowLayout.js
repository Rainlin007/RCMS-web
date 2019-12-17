import React from 'react';
import 'antd/dist/antd.css';
import './RConfigLayout.css';
import {Icon, Layout} from 'antd';
import {Link} from "react-router-dom"
import {Table, Divider, Button, Alert, Popconfirm, message} from 'antd';
import {useParams, useHistory, useRouteMatch} from "react-router-dom"
import {fetchGet} from "../util/RFetchHelper";
import {showResult} from "../util/RCommon";
import "../util/RGlobalConfig"

class ConfigShowLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: 'id',
                    dataIndex: 'id',
                    key: 'id',
                    size: 'small',
                    width: 50
                },
                {
                    title: 'path',
                    dataIndex: 'path',
                    key: 'path',
                    size: 'small'
                },
                {
                    title: 'comment',
                    dataIndex: 'comment',
                    key: 'comment',
                    size: 'small'
                },
                {
                    title: 'value',
                    dataIndex: 'value',
                    key: 'value',
                    ellipsis: true,
                    size: 'small'
                },
                {
                    title: 'Action',
                    key: 'action',
                    size: 'small',
                    width: 200,
                    render: (text, record) => (
                        <span>
                            <span><a href={global.constants.publish_base_url + record.path} target="_blank"
                                     rel="noopener noreferrer">View</a></span>
                            <Divider type="vertical"/>
                            <Link to={"/item/update/" + record.key}>
                                Update
                            </Link>
                            <Divider type="vertical"/>
                            <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDeleteItem(record.key)}>
                                <a>Delete</a>
                            </Popconfirm>
                        </span>
                    ),
                },
            ],
            data: [],
            tip_visiable: "none",
            addItemModalVisible: false
        };
    }

    getAllItems = (project_id) => {
        fetchGet('/rcms/item/read_all', {"id": project_id}).then(
            result => {
                if (result.errcode !== 0) {
                    return;
                }
                let items = result.data.items;
                let t = [];
                for (let i in items) {
                    let item = {
                        'id': items[i].id,
                        'path': items[i].path,
                        'comment': items[i].comment,
                        'key': items[i].id,
                        'value': items[i].value
                    };
                    t.push(item);
                }

                this.setState({data: t})
            }
        )
    };

    delItem = (item_id) => {
        fetch('/rcms/item/delete?id=' + item_id,
            {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(
            res => {
                return res.json()
            }).then(data => {
            showResult(data);
            this.getAllItems(this.props.id)
        })
    };


    componentWillMount() {
        // let id = this.props.id;
        // this.getAllItems(id);
    }

    componentDidMount() {
        let id = this.props.id;
        this.getAllItems(id);
    }

    componentWillReceiveProps(nextProps) {
        this.getAllItems(nextProps.id);
    }

    handleDeleteItem = (key) => {
        this.delItem(key);
    };

    render() {
        return (
            <Layout style={{margin: '0 16px'}}>
                <div style={{position: "relative"}}>
                    <Link to={`/item/create/${this.props.id}`}>
                        <Button style={{margin: '10px 10px 10px 10px'}} type="primary">
                            Create Item
                        </Button>
                    </Link>
                    <div style={{display: "inline", position: "absolute", right: 0}}>
                        <Link to={`/config`}>

                            <Button style={{margin: '10px 10px 10px 10px'}} shape="circle">
                                <Icon type="setting">

                                </Icon>
                            </Button>
                        </Link>
                    </div>
                </div>
                <Table columns={this.state.columns} dataSource={this.state.data} pagination={{pageSize: 100}}>
                </Table>

            </Layout>
        );
    }
}

function RConfigShowLayout() {

    let {project_id} = useParams();
    let history = useHistory();
    let {match} = useRouteMatch();
    return (
        <ConfigShowLayout id={project_id} history={history} match={match}>
        </ConfigShowLayout>
    )
}

export default RConfigShowLayout;