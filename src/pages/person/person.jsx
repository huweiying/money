import React, { Component } from 'react'
import { renderRoutes } from 'react-router-config'
import { Input ,Button ,Menu ,Icon} from 'antd';
const Search = Input.Search;
const SubMenu = Menu.SubMenu;


class Sider extends React.Component {
    // submenu keys of first level
    rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];
    state = {
      openKeys: ['sub1'],
    };
    onOpenChange = (openKeys) => {
      const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.setState({ openKeys });
      } else {
        this.setState({
          openKeys: latestOpenKey ? [latestOpenKey] : [],
        });
      }
    }
    render() {
      return (
        <Menu
          mode="inline"
          openKeys={this.state.openKeys}
          onOpenChange={this.onOpenChange}
          style={{ width: 256 }}
        >
          <Menu.Item key="mail">总经理办公室</Menu.Item>
          <SubMenu key="sub1" title={<span>综合管理部</span>}>
            <Menu.Item key="1">Option 1</Menu.Item>
            <Menu.Item key="2">Option 2</Menu.Item>
            <Menu.Item key="3">Option 3</Menu.Item>
            <Menu.Item key="4">Option 4</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" title={<span>市场营销部</span>}>
            <Menu.Item key="5">Option 5</Menu.Item>
            <Menu.Item key="6">Option 6</Menu.Item>
            <SubMenu key="sub3" title="Submenu">
              <Menu.Item key="7">Option 7</Menu.Item>
              <Menu.Item key="8">Option 8</Menu.Item>
            </SubMenu>
          </SubMenu>
          <SubMenu key="sub4" title={<span>研发部</span>}>
            <Menu.Item key="9">Option 9</Menu.Item>
            <Menu.Item key="10">Option 10</Menu.Item>
            <Menu.Item key="11">Option 11</Menu.Item>
            <Menu.Item key="12">Option 12</Menu.Item>
          </SubMenu>
          <SubMenu key="sub5" title={<span>项目部</span>}>
            <Menu.Item key="9">Option 9</Menu.Item>
            <Menu.Item key="10">Option 10</Menu.Item>
            <Menu.Item key="11">Option 11</Menu.Item>
            <Menu.Item key="12">Option 12</Menu.Item>
          </SubMenu>
          <SubMenu key="sub6" title={<span>生产部</span>}>
            <Menu.Item key="9">Option 9</Menu.Item>
            <Menu.Item key="10">Option 10</Menu.Item>
            <Menu.Item key="11">Option 11</Menu.Item>
            <Menu.Item key="12">Option 12</Menu.Item>
          </SubMenu>
        </Menu>
      );
    }
  }

export default class Person extends Component {
  constructor(props) {
    super(props)
    
  }
  search=()=>{

  }
  render() {
    return (
      <div className = 'person'>
        <div className = 'top'>
            <Search
            placeholder="请输入搜索的职员"
            enterButton="查询"
            style={{ width: 240 }}
            onSearch={this.search}
            />
            <Button type="primary" className = 'fr'>导出表格</Button>
        </div>
        <div className = 'main'>
            <div className = 'fl left'>
                <p className = 'title'>部门列表</p>
                <Sider />
            </div>
        </div>
      </div>
    )
  }
}
