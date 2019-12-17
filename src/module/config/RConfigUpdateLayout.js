import React from 'react';
import 'antd/dist/antd.css';
import {
    Form,
    Input,
    Button,
    Popconfirm
} from 'antd';
import {useParams, useHistory} from "react-router-dom"
import {fetchGet, fetchPost} from "../util/RFetchHelper";
import {showResult} from "../util/RCommon";

class ConfigUpdateLayout extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
        data: {
            path: "",
            comment: "",
            value: "",
            id: "",
        },
        loading: false
    };

    getItem = (item_id) => {
        fetchGet('/rcms/item/read', {"id": item_id}).then(result => {
                let item = result.data;
                this.setState({
                    data: {
                        path: item.path,
                        comment: item.comment,
                        value: item.value,
                        id: item.id
                    }
                });
            }
        );
    };
    updateItem = (data) => {
        fetchPost('/rcms/item/update', data).then(result => {
            this.setState({
                loading: false
            });
            showResult(result);
        });
    };

    constructor(props) {
        super(props);

    }

    componentWillMount() {
        this.getItem(this.props.id);
    }

    handleSubmit = e => {
        this.setState({
            loading: true
        });
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let data = {
                    'id': this.props.id,
                    'path': values.path,
                    'comment': values.comment,
                    'value': values.value
                };
                this.updateItem(data);
                console.log('Received values of form: ', values);
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
                <Form.Item label="id">
                    {this.props.id}
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
                            title="Are you sure cancel update ?"
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
                        <Button type="primary" loading={this.state.loading} htmlType="submit" className="update_button">
                            Update
                        </Button>
                    </Form.Item>
                </div>
            </Form>
        );
    }
}

const RConfigUpdateLayoutInner = Form.create({name: 'update'})(ConfigUpdateLayout);

function RConfigUpdateLayout() {

    let {item_id} = useParams();
    let history = useHistory();
    return (
        <RConfigUpdateLayoutInner id={item_id} history={history}>
        </RConfigUpdateLayoutInner>
    )
}

export default RConfigUpdateLayout;