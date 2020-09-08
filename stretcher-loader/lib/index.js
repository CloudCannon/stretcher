const stretcher = require('stretcher');

module.exports = function(content, map, meta) {
	const logger = this.getLogger('stretcher-loader-logger');

	const { output, warnings } = stretcher(content);
	
	if (warnings.length) {
		for (warning of warnings) {
			logger.warn(`⚠️ WARN [${this.resourcePath}]: ${warning}`);
		}
	}

	return output;
};