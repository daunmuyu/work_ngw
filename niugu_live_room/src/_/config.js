/**
 * 整个系统的配置
 */
const config = {
  scheme: 'beta',
  host: {
    beta: 'http://beta.com',
    release: 'http://release.com'
  },
  getAPIHost() {
    return this.host[this.scheme || 'beta'];
  }
};

module.exports = config;
