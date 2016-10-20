Firefox Add-ons Manager
-----------------------

A React web app that powers the Add-ons Manager (about:addons) in Firefox.

![Image of about:addons](http://i.imgur.com/HIkGspf.png)

The following sections are supported:

- [x] Extensions
- [x] Appearance
- [x] Plugins
- [x] Services

Installing
----------

Now available as a Firefox extension:
https://addons.mozilla.org/en-US/firefox/addon/about-addons/

Hacking
-------

Git clone and load the source directory as a temporary addon via about:debugging.

Use chrome://aboutaddons/content/dev.html which uses babel at runtime to transpile
the JSX.

Building
--------

```
$ make package
```
