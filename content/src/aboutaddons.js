"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Components.utils.import("resource://gre/modules/AddonManager.jsm");

var pt = React.PropTypes;

var AddonBox = function (_React$Component) {
  _inherits(AddonBox, _React$Component);

  function AddonBox(props) {
    _classCallCheck(this, AddonBox);

    var _this = _possibleConstructorReturn(this, (AddonBox.__proto__ || Object.getPrototypeOf(AddonBox)).call(this, props));

    _this.state = {
      data: []
    };
    return _this;
  }

  _createClass(AddonBox, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      AddonManager.addAddonListener(this);
      this.updateAddonsList();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      AddonManager.removeAddonListener(this);
    }
  }, {
    key: "updateAddonsList",
    value: function updateAddonsList(addonID) {
      var _this2 = this;

      // TODO add support for only querying the modified ID
      //      not really worth it until we have a Map of {addonID -> addon}
      var type = this.props.type;
      AddonManager.getAddonsByTypes([type], function (arr) {
        var userAddons = arr.filter(function (addon) {
          return !addon.isSystem;
        });
        // again, would be nice to have a Map of {addonID -> addon}
        userAddons.sort(function (a, b) {
          if (a.name > b.name) {
            return 1;
          }
          if (a.name < b.name) {
            return -1;
          }
          return 0;
        });
        _this2.setState({ data: userAddons });
      });
    }
  }, {
    key: "onInstalled",
    value: function onInstalled(addon) {
      this.updateAddonsList(addon.id);
    }
  }, {
    key: "onUninstalled",
    value: function onUninstalled(addon) {
      this.updateAddonsList(addon.id);
    }
  }, {
    key: "onEnabled",
    value: function onEnabled(addon) {
      this.updateAddonsList(addon.id);
    }
  }, {
    key: "onDisabled",
    value: function onDisabled(addon) {
      this.updateAddonsList(addon.id);
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "table",
        { className: "AddonBox" },
        React.createElement(AddonList, { data: this.state.data })
      );
    }
  }]);

  return AddonBox;
}(React.Component);

var AddonList = function (_React$Component2) {
  _inherits(AddonList, _React$Component2);

  function AddonList() {
    _classCallCheck(this, AddonList);

    return _possibleConstructorReturn(this, (AddonList.__proto__ || Object.getPrototypeOf(AddonList)).apply(this, arguments));
  }

  _createClass(AddonList, [{
    key: "render",
    value: function render() {
      var addonNodes = this.props.data.map(function (addon) {
        return React.createElement(Addon, { key: addon.id,
          id: addon.id,
          name: addon.name,
          description: addon.description,
          iconURL: addon.iconURL,
          userDisabled: addon.userDisabled });
      });
      return React.createElement(
        "tbody",
        { className: "addonList" },
        addonNodes
      );
    }
  }]);

  return AddonList;
}(React.Component);

AddonList.propTypes = {
  data: pt.array.isRequired
};

var Addon = function (_React$Component3) {
  _inherits(Addon, _React$Component3);

  function Addon(props) {
    _classCallCheck(this, Addon);

    var _this4 = _possibleConstructorReturn(this, (Addon.__proto__ || Object.getPrototypeOf(Addon)).call(this, props));

    _this4.handleStatusChange = _this4.handleStatusChange.bind(_this4);
    _this4.handleUninstall = _this4.handleUninstall.bind(_this4);
    return _this4;
  }

  _createClass(Addon, [{
    key: "render",
    value: function render() {
      var noIcon = "chrome://mozapps/skin/extensions/extensionGeneric.svg";
      return React.createElement(
        "tr",
        null,
        React.createElement(
          "td",
          null,
          React.createElement("img", { width: "32", height: "32",
            src: this.props.iconURL ? this.props.iconURL : noIcon })
        ),
        React.createElement(
          "td",
          null,
          this.props.name
        ),
        React.createElement(
          "td",
          null,
          this.props.description
        ),
        React.createElement(
          "td",
          null,
          React.createElement(
            "button",
            { id: this.props.id, onClick: this.handleStatusChange },
            this.props.userDisabled ? "Enable" : "Disable"
          )
        ),
        React.createElement(
          "td",
          null,
          React.createElement(
            "button",
            { id: this.props.id, onClick: this.handleUninstall },
            "Remove"
          )
        )
      );
    }
  }, {
    key: "handleStatusChange",
    value: function handleStatusChange(e) {
      var addonID = e.target.id;
      AddonManager.getAddonByID(this.props.id, function (addon) {
        addon.userDisabled = !addon.userDisabled;
      });
    }
  }, {
    key: "handleUninstall",
    value: function handleUninstall(e) {
      var addonID = e.target.id;
      AddonManager.getAddonByID(this.props.id, function (addon) {
        addon.uninstall();
      });
    }
  }]);

  return Addon;
}(React.Component);

Addon.propTypes = {
  name: pt.string.isRequired,
  description: pt.string,
  userDisabled: pt.bool.isRequired,
  iconURL: pt.string
};

switch (window.location.hash) {
  case "#extension":
    ReactDOM.render(React.createElement(AddonBox, { type: "extension" }), document.getElementById("extension"));
    break;

  case "#theme":
    ReactDOM.render(React.createElement(AddonBox, { type: "theme" }), document.getElementById("theme"));
    break;

  case "#plugin":
    ReactDOM.render(React.createElement(AddonBox, { type: "plugin" }), document.getElementById("plugin"));
    break;

  case "#service":
    ReactDOM.render(React.createElement(AddonBox, { type: "service" }), document.getElementById("service"));
    break;
}