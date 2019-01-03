import React from "react";
import firebase from "../../firebase";
import { connect } from "react-redux";
import { setColors } from "../../actions";
import {
  Sidebar,
  Menu,
  Divider,
  Button,
  Modal,
  Icon,
  Label,
  Segment
} from "semantic-ui-react";
import { SliderPicker } from "react-color";
import * as Config from "../../Config";

class ColorPanel extends React.Component {
  state = {
    modal: false,
    primaryColor: "",
    secondaryColor: "",
    user: this.props.currentUser,
    usersRef: firebase.database().ref("users"),
    userColors: []
  };

  componentDidMount() {
    if (this.state.user) {
      this.addListener(this.state.user.uid);
    }
  }

  componentWillUnmount() {
    this.removeListener();
  }

  addListener = userId => {
    let userColors = [];
    userColors.unshift(Config.initialColors);
    this.state.usersRef.child(`${userId}/colors`).on("child_added", snap => {
      userColors.unshift(snap.val());
      this.setState({ userColors: userColors });
    });
  };

  removeListener = () => {
    this.state.usersRef.child(`${this.state.user.uid}/colors`).off();
  };

  handleChangePrimaryColor = color =>
    this.setState({ primaryColor: color.hex });

  handleChangeSecondaryColor = color =>
    this.setState({ secondaryColor: color.hex });

  handleSaveColors = () => {
    if (this.state.primaryColor && this.state.secondaryColor) {
      this.saveColors(this.state.primaryColor, this.state.secondaryColor);
    }
  };

  saveColors = (primaryColor, secondaryColor) => {
    this.state.usersRef
      .child(`${this.state.user.uid}/colors`)
      .push()
      .update({
        primaryColor,
        secondaryColor
      })
      .then(() => {
        // console.log("Colors added");
        this.closeModal();
      })
      .catch(err => console.log(err));
  };

  displayUserColors = colors =>
    colors.length > 0 &&
    colors.map((color, i) => (
      <React.Fragment key={i}>
        <Divider />
        <div
          className="color__container"
          onClick={() =>
            this.props.setColors(color.primaryColor, color.secondaryColor)
          }
        >
          <div
            className="color__square"
            style={{ background: color.primaryColor }}
          >
            <div
              className="color__overlay"
              style={{ background: color.secondaryColor }}
            />
          </div>
        </div>
      </React.Fragment>
    ));

  openModal = () => this.setState({ modal: true });

  closeModal = () => this.setState({ modal: false });

  render() {
    const { modal, primaryColor, secondaryColor, userColors } = this.state;

    return (
      <Sidebar
        as={Menu}
        icon="labeled"
        inverted
        vertical
        visible
        width="very thin"
      >
        <Divider />
        <Button icon="add" size="small" color="blue" onClick={this.openModal} />
        {userColors && this.displayUserColors(userColors)}

        {/* color picker Modal */}
        <Modal basic open={modal} onClose={this.closeModal}>
          <Modal.Header>Choose App Color</Modal.Header>
          <Modal.Content>
            <Segment inverted>
              <Label content="Primary Color" />
              <SliderPicker
                color={primaryColor}
                onChange={this.handleChangePrimaryColor}
              />
            </Segment>
            <Segment inverted>
              <Label content="SecondaryColor Color" />
              <SliderPicker
                color={secondaryColor}
                onChange={this.handleChangeSecondaryColor}
              />
            </Segment>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" inverted onClick={this.handleSaveColors}>
              <Icon name="checkmark" /> Add
            </Button>
            <Button color="red" inverted onClick={this.closeModal}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </Sidebar>
    );
  }
}

export default connect(
  null,
  { setColors }
)(ColorPanel);
