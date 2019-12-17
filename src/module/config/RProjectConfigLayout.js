import React from 'react';
import 'antd/dist/antd.css';
import {
    Form,
    Input,
    Button,
    Popconfirm,
    Select, message
} from 'antd';

import {withRouter} from "react-router-dom"
import {fetchPost, fetchGet} from "../util/RFetchHelper";
import {showResult} from "../util/RCommon";

const {Option} = Select;

class ProjectConfigLayout extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
        data: {
            group_name: "",
            project_name: ""
        },
        groups: [],
        projects: [],

        loading: false,
        loading_delete: false,
        loading_update: false,
        loading_create: false,

        current_group_index: -1,
        current_project_index: -1,
        group_selects: "",
        project_selects: "",

        default_select: ""
    };

    createProject = (data) => {
        fetchPost('/rcms/project/create', data).then(result => {
            this.setState({
                loading: false
            });
            showResult(result);
            let data = {
                id: parseInt(this.state.groups[this.state.current_group_index].id)
            };
            this.getAllProjectName(data);
            this.props.sider_update();
        });
    };
    updateProject = (data) => {
        fetchPost('/rcms/project/update', data).then(result => {
            this.setState({
                loading: false
            });
            showResult(result);
            this.props.form.resetFields("projectSelect");
            let data = {
                id: parseInt(this.state.groups[this.state.current_group_index].id)
            };
            this.getAllProjectName(data);
            this.props.sider_update();
        });
    };
    deleteProject = (data) => {
        fetchGet('/rcms/project/delete', data).then(result => {
            this.setState({
                loading: false
            });
            showResult(result);
            this.props.form.resetFields("projectSelect");
            let data = {
                id: parseInt(this.state.groups[this.state.current_group_index].id)
            };
            this.getAllProjectName(data);
            this.props.sider_update();
            this.setState()
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

    getAllProjectName = (data) => {
        fetchGet('/rcms/project/read_all', data).then(
            result => {
                let t = [];
                for (let index in result.data.projects) {
                    t.push(
                        <Option value={index}
                                key={index}
                                title={result.data.projects[index].name}>
                            {result.data.projects[index].name}
                        </Option>
                    );
                }
                this.setState({
                    project_selects: t,
                    projects: result.data.projects
                });

            }
        )
    };

    constructor(props) {
        super(props);
        this.groupSelect = React.createRef();

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
        let newProjectName = this.props.form.getFieldValue("newProjectName");
        console.log(newProjectName);
        if (e.currentTarget.id === "create") {
            let data = {
                "name": newProjectName,
                "group_id": parseInt(this.state.groups[parseInt(this.state.current_group_index)].id)
            };
            this.createProject(data)
        } else if (e.currentTarget.id === "update") {
            if (this.state.current_group_index === -1) {
                message.error("Current Project not selected!");
                return;
            }
            let data = {
                "id": parseInt(this.state.projects[parseInt(this.state.current_project_index)].id),
                "name": newProjectName
            };
            this.updateProject(data)
        }
    };

    handleGroupSelectChange = (value) => {
        this.setState({
            current_group_index: value,
            data: {
                group_name: this.state.groups[value].name
            }
        });

        this.props.form.resetFields("projectSelect");
        this.props.form.resetFields("newGroupName");
        let data = {
            id: this.state.groups[value].id
        };
        this.getAllProjectName(data);
    };

    handleProjectSelectChange = (value) => {
        this.setState({
            current_project_index: value,
            data: {
                project_name: this.state.projects[value].name
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
                                required: false
                            },
                        ]
                    })(<Select onChange={this.handleGroupSelectChange}>
                        {this.state.group_selects}
                    </Select>)}

                </Form.Item>
                <Form.Item label="Project">
                    {getFieldDecorator('projectSelect', {
                        rules: [
                            {
                                required: false
                            },
                        ]
                    })(<Select onChange={this.handleProjectSelectChange}>
                        {this.state.project_selects}
                    </Select>)}

                </Form.Item>
                <Form.Item label="New Project Name">
                    {getFieldDecorator('newProjectName', {
                        rules: [
                            {
                                required: false
                            },
                        ],
                        initialValue: this.state.data.project_name
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
                                if (this.state.current_project_index === -1) {
                                    message.error("Not select project！")
                                    return;
                                }
                                let data = {
                                    "id": parseInt(this.state.projects[parseInt(this.state.current_project_index)].id)
                                };
                                this.deleteProject(data);
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

const RProjectConfigLayout = Form.create({name: 'create'})(ProjectConfigLayout);

export default withRouter(RProjectConfigLayout);