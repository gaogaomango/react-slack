import React from "react";
import Channels from "./Channels";
import UserPanel from "./UserPanel";
import DirectMessages from "./DirectMessages";
import Starred from "./Starred";
import { Menu } from "semantic-ui-react";

class SidePanel extends React.Component {
  render() {
    const { currentUser, primaryColor } = this.props;
    return (
      <Menu
        size="large"
        inverted
        fixed="left"
        vertical
        style={{ background: primaryColor, fontSize: "1.2rem" }}
      >
        <UserPanel primaryColor={primaryColor} currentUser={currentUser} />
        <Starred currentUser={currentUser} />
        <Channels currentUser={currentUser} />
        <DirectMessages currentUser={currentUser} />
      </Menu>
    );
  }
}

export default SidePanel;
