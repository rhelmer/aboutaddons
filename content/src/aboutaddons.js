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
        <AddonList data={this.state.data} />
    );
  }
});

const AddonList = React.createClass({
  render: function() {
    let addonNodes = this.props.data.map(function(addon) {
      return (
        <Addon name={addon.name} version={addon.version}
         userDisabled={addon.userDisabled} />
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
    // FIXME look for a more concise way to do this
    if (this.props.userDisabled) {
      return (
        <div className="addon">
          {this.props.name},
          {this.props.version},
          <button>enable</button>,
          <button>uninstall</button>
        </div>
      );
    } else {
      return (
        <div className="addon">
          {this.props.name},
          {this.props.version},
          <button>disable</button>,
          <button>uninstall</button>
        </div>
      );
    }
  }
});

ReactDOM.render(
  <AddonBox />,
  document.getElementById("content")
);
