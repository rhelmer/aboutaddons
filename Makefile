package:
	@./node_modules/.bin/babel --presets es2015,react content/src/ --out-dir content/src/
	@zip -x \*.swp content/babel_core-\* content/dev.html content/src/aboutaddons.jsx -r ../aboutaddons-0.0.1.xpi bootstrap.js install.rdf chrome.manifest content/
