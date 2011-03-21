
test:
	@NODE_ENV=test expresso \
		-I lib \
		$(TESTFLAGS) \
		test/*.test.js

test-cov:
	@TESTFLAGS=--cov $(MAKE) test

docs: 
	@ echo "... generating DOC"
	@dox --ribbon "http://github.com/jjupiter/series" \
		--title "Series" \
		--desc "Syncable _Set_ for [node](http://nodejs.org).\
		Check out the [Github Repo](http://github.com/jjupiter/series) for the \
		source and installation guide." \
		--style plain lib/series.js > docs/index.html

docclean:
	rm -f docs/*.html



.PHONY: test docs