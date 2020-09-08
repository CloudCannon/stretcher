const stretcher = require('stretcher');
const fs = require('fs');
const path = require('path');

module.exports = function(url, prev, done) {
    let fileUrl = path.resolve(path.dirname(prev), url);
    fs.readFile(fileUrl, function(err, result) {
    	if (err) {
    		done({contents: `@warn "Loading ${url} failed."`});
    		return;
    	}

    	const {output, warnings} = stretcher(result.toString());

		if (warnings.length) {
			for (warning of warnings) {
				console.warn(`⚠️ WARN [${this.resourcePath}]: ${warning}`);
			}
		}

    	done({contents: output});
    	return;
    });

}