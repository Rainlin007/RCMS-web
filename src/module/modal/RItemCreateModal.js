import React from 'react';
import 'antd/dist/antd.css';
import {Modal, Form, Input} from 'antd';

class RItemCreateModal extends React.Component {
    constructor(props) {
        super(props);
        this.addForm = React.createRef();
        this.addFormPath = React.createRef();
        this.state = {
            confirmLoading: false
        }
    }

    handleOk = e => {
        console.log(e);
        let t = this.addFormPath.current;
        this.setState({
            confirmLoading: true,
        });
        if (this.props.onOk !== undefined) {
            this.props.onOk();
        }
        this.setState({
            confirmLoading: false
        });
    };

    handleCancel = e => {
        if (this.props.onCancle !== undefined) {
            this.props.onCancle();
        }
    };

    render() {
        return (
            <Modal
                title="Add Item"
                visible={this.props.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                confirmLoading={this.state.confirmLoading}
                destroyOnClose={true}
            >
                <Form className="login-form" ref={this.addForm}>
                    <Form.Item>
                        <Input
                            placeholder="Path"
                            ref={this.addFormPath}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

export default RItemCreateModal;