import React from 'react';
import 'antd/dist/antd.css';
import {
    Form,
    Input,
    Button,
    Popconfirm,
    Select, message
} from 'antd';

import {useParams, useHistory, withRouter} from "react-router-dom"
import {fetchPost, fetchGet} from "../util/RFetchHelper";
import {showResult} from "../util/RCommon";

const {Option} = Select;

class GroupConfigLayout extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
        data: {
            group_name: "",

        },
        groups: [],
        loading: false,
        loading_delete: false,
        loading_update: false,
        loading_create: false,
        group_selects: "",
        current_group_index: -1,
        default_select: ""
    };

    createGroup = (data) => {
        fetchPost('/rcms/group/create', data).then(result => {
            this.setState({
                loading: false
            });
            showResult(result);
            this.getAllGroupName();
            this.props.sider_update();
        });
    };
    updateGroup = (data) => {
        fetchPost('/rcms/group/update', data).then(result => {
            this.setState({
                loading: false
            });
            showResult(result);
            this.setState({default_select: ""});
            this.getAllGroupName()
            this.props.sider_update();
        });
    };
    deleteGroup = (data) => {
        fetchGet('/rcms/group/delete', data).then(result => {
            this.setState({
                loading: false
            });
            showResult(result);
            this.props.form.resetFields("groupSelect");
            this.getAllGroupName();
            this.props.sider_update();
        });
    };


    getAllGroupName = () => {
        fetchGet('/rcms/group/read_all').then(
            result => {
                let t = [];
                for (let index in result.data.groups) {
                    t.push(
                        <Option value={index}
                                key={index}
                                title={result.data.groups[index].name}>
                            {result.data.groups[index].name}
                        </Option>
                    );
                }
                this.setState({
                    group_selects: t,
                    groups: result.data.groups
                });
            }
        )
    };

    constructor(props) {
        super(props);

    }

    componentWillMount() {
        this.getAllGroupName()
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {

            }
        });
    };
    handleClick = (e) => {
        let newGroupName = this.props.form.getFieldValue("newGroupName");
        console.log(newGroupName);
        if (e.currentTarget.id === "create") {
            let data = {
                "name": newGroupName
            };
            this.createGroup(data)

        } else if (e.currentTarget.id === "update") {
            if (this.state.current_group_index === -1) {
                message.error("Current group not selected!");
                return;
            }
            let data = {
                "id": parseInt(this.state.groups[parseInt(this.state.current_group_index)].id),
                "name": newGroupName
            };
            this.updateGroup(data)
        }
    };

    handleSelectChange = (value) => {
        this.setState({
            current_group_index: value,
            data: {
                group_name: this.state.groups[value].name
            }
        })
    };

    render() {
        const {getFieldDecorator} = this.props.form;

        const formItemLayout = {
            labelCol: {
                span: 8
            },
            wrapperCol: {
                span: 8
            },
        };
        return (

            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                <Form.Item label="Group">
                    {getFieldDecorator('groupSelect', {
                        rules: [
                            {
                                required: false,
                                message: 'Please input newGroupName!',
                            },
                        ]
                    })(<Select onChange={this.handleSelectChange}>
                        {this.state.group_selects}
                    </Select>)}

                </Form.Item>
                <Form.Item label="New Group Name">
                    {getFieldDecorator('newGroupName', {
                        rules: [
                            {
                                required: false,
                                message: 'Please input new Group Name!',
                            },
                        ],
                        initialValue: this.state.data.group_name
                    })(<Input/>)}
                </Form.Item>
                <div style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                    <Form.Item wrapperCol={{span: 24}}>
                        <Button id={"cancel"} loading={this.state.loading_create}
                                onClick={() => {
                                    this.props.history.push("/");
                                }}
                                className="update_button">
                            Cancel
                        </Button>

                        <Button id={"create"} type="primary" loading={this.state.loading_create}
                                onClick={this.handleClick}
                                className="update_button">
                            Create
                        </Button>
                        <Button id={"update"} type="primary" loading={this.state.loading_update}
                                onClick={this.handleClick}
                                className="update_button">
                            Update
                        </Button>

                        <Popconfirm
                            title="Are you sure delete?"
                            onConfirm={() => {
                                if (this.state.current_group_index === -1) {
                                    message.error("Current group not selected!");
                                    return;
                                }
                                let data = {
                                    "id": parseInt(this.state.groups[parseInt(this.state.current_group_index)].id)
                                };
                                this.deleteGroup(data);
                            }}
                            placement="bottom"
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="primary" loading={this.state.loading_delete} className="update_button"
                                    htmlType="submit">
                                Delete
                            </Button>
                        </Popconfirm>

                    </Form.Item>
                </div>
            </Form>
        );
    }
}

const RGroupConfigLayout = Form.create({name: 'create'})(GroupConfigLayout);

export default withRouter(RGroupConfigLayout);