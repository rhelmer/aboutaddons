"use strict";

Components.utils.import("resource://gre/modules/AddonManager.jsm");

const AddonBox = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    AddonManager.getAddonsByTypes(["extension"], a => this.setState({data: a}));
  },
  render: function() {
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
});

const AddonList = React.createClass({
  render: function() {
    let addonNodes = this.props.data.map(function(addon) {
      return (
        <Addon name={addon.name}
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
});

const Addon = React.createClass({
  render: function() {
    return (
      <tr>
        <td><img width="16" height="16" src={this.props.iconURL} /></td>
        <td>{this.props.name}</td>
        <td>{this.props.version}</td>
        <td>
          <button id={this.props.userDisabled ? "enable" : "disable"}>
            {this.props.userDisabled ? "enable" : "disable"}
          </button>
        </td>
        <td>
          <button id="uninstall">uninstall</button>
        </td>
      </tr>
    );
  }
});

ReactDOM.render(
  <AddonBox />,
  document.getElementById("content")
);
