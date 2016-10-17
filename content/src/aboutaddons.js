"use strict";

Components.utils.import("resource://gre/modules/AddonManager.jsm");

const pt = React.PropTypes;

class AddonBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
    }
  }

  componentDidMount() {
    AddonManager.getAddonsByTypes(["extension"], arr => {
      let userAddons = arr.filter(addon => !addon.isSystem);
      this.setState({data: userAddons});
    });
  }

  render() {
    return (
      <table className="AddonBox">
        <thead>
          <tr>
            <td>Icon</td>
            <td>Name</td>
            <td>Version</td>
            <td>State</td>
            <td>Action</td>
          </tr>
        </thead>
        <AddonList data={this.state.data} />
      </table>
    );
  }
}

class AddonList extends React.Component {
  render() {
    let addonNodes = this.props.data.map(function(addon) {
      return (
        <Addon key={addon.id}
               id={addon.id}
               name={addon.name}
               version={addon.version}
               iconURL={addon.iconURL}
               userDisabled={addon.userDisabled} />
      );
    });
    return (
      <tbody className="addonList">
        {addonNodes}
      </tbody>
    );
  }
}

AddonList.propTypes = {
  data: pt.array.isRequired,
}

class Addon extends React.Component {
  constructor(props) {
    super(props);
    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.handleUninstall = this.handleUninstall.bind(this);
  }

  render() {
    let noIcon = "chrome://mozapps/skin/extensions/extensionGeneric.svg";
    return (
      <tr>
        <td>
          <img width="16" height="16"
           src={this.props.iconURL ? this.props.iconURL : noIcon} />
        </td>
        <td>{this.props.name}</td>
        <td>{this.props.version}</td>
        <td>
          <button id={this.props.id} onClick={this.handleStatusChange}>
            {this.props.userDisabled ? "enable" : "disable"}
          </button>
        </td>
        <td>
          <button id={this.props.id} onClick={this.handleUninstall}>
            uninstall
          </button>
        </td>
      </tr>
    );
  }

  handleStatusChange(e) {
    let addonID = e.target.id;
    AddonManager.getAddonByID(this.props.id, addon => {
      addon.userDisabled = !addon.userDisabled;
    });
    // TODO need to notify UI when state changed - probably need to listen
    // for the notification from AddonManager...
  }

  handleUninstall(e) {
    let addonID = e.target.id;
    AddonManager.getAddonByID(this.props.id, addon => {
      if (addon) {
        addon.uninstall();
      }
    });
    // TODO need to notify UI when state changed - probably need to listen
    // for the notification from AddonManager...
  }
}

Addon.propTypes = {
  name: pt.string.isRequired,
  version: pt.string.isRequired,
  userDisabled: pt.bool.isRequired,
  iconURL: pt.string
}

ReactDOM.render(
  <AddonBox />,
  document.getElementById("content")
);
