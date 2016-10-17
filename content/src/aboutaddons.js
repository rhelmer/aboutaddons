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
      <div className="addonBox">
        <AddonList data={this.state.data} />
      </div>
    );
  }
});

const AddonList = React.createClass({
  render: function() {
    console.log(this.props);
    let addonNodes = this.props.data.map(function(addon) {
      return (
        <div className="addonList">
          <Addon name={addon.name} version={addon.version} />
        </div>
      );
    });
    return (
      <div className="addonList">
        {addonNodes}
      </div>
    );
  }
});

const Addon = React.createClass({
  render: function() {
    return (
      <div className="addon">
        {this.props.name},
        {this.props.version},
        <button>enable/disable</button>,
        <button>uninstall</button>,
      </div>
    );
  }
});

ReactDOM.render(
  <AddonBox />,
  document.getElementById("content")
);
