import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)

class Model {

  /**
   * Request
   * @returns {Object}
   */
  static Request() {
    return Vue.http
  }

  /**
   * 统一处理URL
   * @param {String} method 
   * @param {String} url 
   * @param {Any} rest 
   */
  static Http(method, url, ...rest) {
    // let preUrl = '/Rest/Lite/'
    // let reg = /\/Rest\/Lite\//i
    // if(url.indexOf('showGuide') !== -1){
    //   preUrl = '/Rest/'
    //   reg = /\/Rest\//i
    //   url = url.substr(url.indexOf('/')+1)
    // }
   
    // url = preUrl + url.replace(reg, '').trim()
    return Model.Request()[method](url, ...rest)
  }

  /**
   * Get
   * @param {String} url 
   * @param {Object} params 
   */
  static Get(url, params) {
    return Model.Http('get', url, { params })
  }

  /**
   * Post
   * @param {String} url 
   * @param {Object} data 
   * @param {Object} params 
   */
  static Post(url, data, params) {
    return Model.Http('post', url, data, params)
  }

  /**
   * Put
   * @param {String} url 
   * @param {Object} data 
   * @param {Object} params 
   */
  static Put(url, data, params) {
    return Model.Http('put', url, data, params)
  }

  /**
   * Delete
   * @param {String} url 
   * @param {Object} data 
   * @param {Object} params 
   */
  static Delete(url, params) {
    return Model.Http('delete', url, {params})
  }
}

export default Model