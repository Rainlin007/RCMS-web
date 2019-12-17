import React from 'react';
import './App.css';
import {Button, Icon, Layout} from 'antd';
import RSider from './module/sider/RSider'
import RConfigShowLayout from './module/config/RConfigShowLayout';
import RConfigUpdateLayout from './module/config/RConfigUpdateLayout';
import {Switch, Route, useRouteMatch, Link} from 'react-router-dom';
import RConfigCreateLayout from "./module/config/RConfigCreateLayout";
import RConfigManagerLayout from "./module/config/RConfigManagerLayout";

const {Header, Content, Footer} = Layout;

class RApp extends React.Component {
    constructor(props) {
        super(props);
        this.match = this.props.match;

    }

    onMenuItemSelected = (key) => {
        console.log("menu item selected :" + key);
    };

    updateSider = () => {
        this.sider.getData();
    };

    render() {
        return (
            <Layout>
                <RSider onItemSelected={this.onMenuItemSelected} wrappedComponentRef={c => (this.sider = c)}/>
                <Layout>
                    <Header style={{padding: 0}}>
                        <div className="header">
                            <span style={{
                                fontSize: "xx-large",
                                fontWeight: "bold",
                                display: "inline"
                            }}>RCMS</span>
                            <span style={{position: "absolute", right: "20px"}}>
                                Welcome,{window.sessionStorage.getItem("account")}
                            </span>
                        </div>
                    </Header>
                    <Content style={{margin: '0 16px'}}>
                        <Switch>
                            <Route path={`${this.match.url}item/update/:item_id`} component={RConfigUpdateLayout}>
                            </Route>
                            <Route path={`${this.match.url}item/show/:project_id`} component={RConfigShowLayout}>
                            </Route>
                            <Route path={`${this.match.url}item/create/:project_id`} component={RConfigCreateLayout}>
                            </Route>
                            <Route path={`${this.match.url}config`}>
                                <RConfigManagerLayout sider_update={this.updateSider}/>
                            </Route>
                            <Route path={`${this.match.url}`}>
                                <div style={{position: "relative"}}>
                                    <div style={{display: "inline", position: "absolute", right: 0}}>
                                        <Link to={`/config`}>
                                            <Button style={{margin: '10px 10px 10px 10px'}} shape="circle">
                                                <Icon type="setting"/>
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                                <div className={"App-default-div-outside"}>
                                    <div className={"App-default-div-inner"}>
                                        <p className={"App-default-text"}>Welcome,choose one item to show please.</p>
                                    </div>
                                </div>
                            </Route>
                        </Switch>
                    </Content>
                    <Footer style={{textAlign: 'center'}}>RCMS by Rainlin</Footer>
                </Layout>
            </Layout>
        )
    }
}

function App() {
    let match = useRouteMatch();
    return (
        <RApp match={match}/>
    )
}

export default App;