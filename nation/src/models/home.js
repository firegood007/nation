import Model from './model'
class ListModel extends Model {
  constructor () {
    super ()
  }
  static getList(param) {
    return this.Get('/api/players', param)
  }
  static getMediaInfo(param) {
    return this.Get('/api/players', param)
  }
  static terminal(param) {
  	return this.Post('/api/control/terminal', param)
  }
}

export default ListModel