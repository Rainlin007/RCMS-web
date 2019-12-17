import React from 'react';
import 'antd/dist/antd.css';
import {
    Form,
    Input,
    Button,
    Popconfirm
} from 'antd';

import {useParams, useHistory, withRouter} from "react-router-dom"
import {fetchPost, fetchGet} from "../util/RFetchHelper";
import {showResult} from "../util/RCommon";

class ConfigCreateLayout extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
        data: {
            path: "",
            comment: "",
            value: "",
            id: "",
        },
        project_name: "",
        loading: false
    };

    createItem = (data) => {
        fetchPost('/rcms/item/create', data).then(result => {
            this.setState({
                loading: false
            });
            showResult(result);
        });
    };

    getProjectName = (id) => {
        fetchGet('/rcms/project/read', {'id': id}).then(
            result => {
                this.setState({
                    project_name: result.data.name
                })
            }
        )
    };

    constructor(props) {
        super(props);

    }

    componentWillMount() {
        this.getProjectName(parseInt(this.props.match.params.project_id));
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let param = {
                    'path': values.path,
                    'comment': values.comment,
                    'value': values.value,
                    'project_id': parseInt(this.props.match.params.project_id)
                };

                this.setState({
                    loading: true
                });
                this.createItem(param);
            }
        });
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
                <Form.Item label="project">
                    {this.state.project_name}
                </Form.Item>
                <Form.Item label="Path">
                    {getFieldDecorator('path', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input path!',
                            },
                        ],
                        initialValue: this.state.data.path
                    })(<Input/>)}
                </Form.Item>
                <Form.Item label="Comment">
                    {getFieldDecorator('comment', {
                        rules: [
                            {
                                required: false,
                                message: 'Please input comment',

                            },
                        ],
                        initialValue: this.state.data.comment
                    })(<Input.TextArea autoSize={{minRows: 1, maxRows: 4}}/>)}
                </Form.Item>
                <Form.Item label="value">
                    {getFieldDecorator('value', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input value!',

                            },
                        ],
                        initialValue: this.state.data.value
                    })(<Input.TextArea autoSize={{minRows: 4, maxRows: 15}}/>)}
                </Form.Item>
                <div style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                    <Form.Item wrapperCol={{span: 24}}>
                        <Popconfirm
                            title="Are you sure cancel create?"
                            onConfirm={() => {
                                this.props.history.goBack();
                            }}
                            placement="bottom"
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="primary" className="update_button">
                                Cancel
                            </Button>
                        </Popconfirm>
                        <Button type="primary" loading={this.state.loading} htmlType="submit"
                                className="update_button">
                            Create
                        </Button>
                    </Form.Item>
                </div>
            </Form>
        );
    }
}

const RConfigCreateLayout = Form.create({name: 'create'})(ConfigCreateLayout);

export default withRouter(RConfigCreateLayout);