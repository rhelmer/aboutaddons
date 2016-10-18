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
    AddonManager.addAddonListener(this);

    AddonManager.getAddonsByTypes(["extension"], arr => {
      let userAddons = arr.filter(addon => !addon.isSystem);
      this.setState({data: userAddons});
    });
  }

  componentWillUnmount() {
    AddonManager.removeAddonListener(this);
  }

  updateAddonsList(addonID) {
    // TODO add support for only querying the modified ID
    AddonManager.getAddonsByTypes(["extension"], arr => {
      let userAddons = arr.filter(addon => !addon.isSystem);
      this.setState({data: userAddons});
    });
  }

  onInstalled(addon) {
    this.updateAddonsList(addon.id);
  }

  onUninstalled(addon) {
    this.updateAddonsList(addon.id);
  }

  onEnabled(addon) {
    this.updateAddonsList(addon.id);
  }

  onDisabled(addon) {
    this.updateAddonsList(addon.id);
  }

  render() {
    return (
      <table className="AddonBox">
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
               description={addon.description}
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
          <img width="32" height="32"
           src={this.props.iconURL ? this.props.iconURL : noIcon} />
        </td>
        <td>{this.props.name}</td>
        <td>{this.props.description}</td>
        <td>
          <button id={this.props.id} onClick={this.handleStatusChange}>
            {this.props.userDisabled ? "Enable" : "Disable"}
          </button>
        </td>
        <td>
          <button id={this.props.id} onClick={this.handleUninstall}>
            Remove
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
  }

  handleUninstall(e) {
    let addonID = e.target.id;
    AddonManager.getAddonByID(this.props.id, addon => {
      if (addon) {
        addon.uninstall();
      }
    });
  }
}

Addon.propTypes = {
  name: pt.string.isRequired,
  description: pt.string.isRequired,
  userDisabled: pt.bool.isRequired,
  iconURL: pt.string
}

ReactDOM.render(
  <AddonBox />,
  document.getElementById("content")
);
