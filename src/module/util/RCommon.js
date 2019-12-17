import {message} from "antd";

export function showResult(result) {
    if (result.errcode === 0) {
        message.success('Success');
        return;
    }
    message.error("Failed!" +
        "\nerrcode:" + result.errcode +
        "\nerrmsg:" + result.errmsg);
};


export function showError(result) {
    if (result.errcode === 0) {
        return
    }
    message.error("Failed!" +
        "\nerrcode:" + result.errcode +
        "\nerrmsg:" + result.errmsg);
};