const request = require('superagent')
const EventEmitter = require('eventemitter3')

import Request from './Request'

// logged-in user is constructed from 
// 1. device 
// 2. useruuid and token
class LoggedInUser extends EventEmitter {

  constructor(address, userUUID, token) {

    super()  

    this.address = address
    this.userUUID = userUUID
    this.token = token

    this.state = {
      userUUID,
      request: this.request.bind(this),
    }
  }

  setState(name, nextState) {

    let state = this.state
    this.state = Object.assign({}, state, { [name]: nextState })
    this.emit('updated', state, this.state)
  }

  setRequest(name, props, f, next) {

    if (this[name]) {
      this[name].abort()
      this[name].removeAllListeners()
    }

    this[name] = new Request(props, f)
    this[name].on('updated', (prev, curr) => {

      this.setState(name, curr)

      console.log(`${name} updated`, prev, curr, 
        this[name].isFinished(), typeof next === 'function')

      if (this[name].isFinished() && next) {
        this[name].isRejected() 
          ? next(this[name].reason())  
          : next(null, this[name].value())
      }
    })

    // emit 
    this.setState(name, this[name].state)
  }

  clearRequest(name) {

    if (this[name]) {
      this[name].abort()
      this[name].removeAllListeners()
      this[name] = null
      this.setState(name, null)
    }
  }

  aget(ep) {
    return request
      .get(`http://${this.address}:3721/${ep}`)
      .set('Authorization', 'JWT ' + this.token)
  }

  apost(ep, data) {

    let r = request.post(`http://${this.address}:3721/${ep}`)
    if (data) r = r.send(data)
    return r.set('Authorization', 'JWT ' + this.token)
  }

  apatch(ep, data) {

    let r = request.patch(`http://${this.address}:3721/${ep}`)
    if (data) r = r.send(data)
    return r.set('Authorization', 'JWT ' + this.token)
  }

  adel(ep) {
    return request
      .del(`http://${this.address}:3721/${ep}`)
      .set('Authorization', 'JWT ' + this.token)
  }

  request(name, args, next) {

    let r

    switch(name) {
    case 'login':
      r = request.get(`http://${this.address}:3721/login`)
      break

    case 'account':
      r = this.aget('account')
      break

    case 'updateAccount':
      r = this.apost('account', args)
      break

    case 'users':
      r = this.aget('users')
      break

    case 'drives':
      r = this.aget('drives')
      break

    case 'adminUsers':
      r = this.aget('admin/users')
      break

    case 'adminDrives':
      r = this.aget('admin/drives')
      break

    /** File APIs **/
    case 'listDir':
      r = this.aget(`fruitmix/list/${args.dirUUID}`)
      break

    case 'listNavDir':
      r = this.aget(`fruitmix/list-nav/${args.dirUUID}/${args.rootUUID}`)
      break

    case 'downloadFile':
      r = this.aget(`fruitmix/download/${args.dirUUID}/${args.fileUUID}`)
      break

    case 'mkdir':
      r = this.apost(`fruitmix/mkdir/${args.dirUUID}/${args.dirname}`)
      break

    case 'uploadFile':
      r = null // TODO
      break

    case 'overwriteFile':
      r = null // TODO
      break

    case 'renameDirOrFile':
      r = this.apost(`fruitmix/rename/${args.dirUUID}/${args.nodeUUID}/${args.filename}`)
      break

    case 'deleteDirOrFile':
      r = this.adel(`fruitmix/${args.dirUUID}/${args.nodeUUID}`)
      break

    /** Ext APIs **/
    case 'extDrives':
      // r = this.aget TODO
      break

    case 'extListDir':
      break

    case 'extMkdir':
      break
    
    case 'extRenameDirOrFile':
      break

    case 'extDeleteDirOrFile':
      break

    /** File Transfer API **/
    // ????

    /** File Share API **/
    case 'fileShare':
      r = this.aget(`fileshare`)
      break

    /** Media Share API **/
    case 'mediaShare':
      r = this.aget(`mediashare`)
      break

    /** Media API **/
    case 'media':
      r = this.aget(`media`)
      break

    default:
      break
    }

    if (!r) return console.log(`no request handler found for ${name}`)
    this.setRequest(name, args, cb => r.end(cb), next) 
  }

  async requestAsync(name, args) {
    return Promise.promisify(this.request).bind(this)(name, args)
  }

  start() {

    this.requestAsync('account', null).asCallback((err, data) => {
      console.log('initial request for account: ', err || data) 
    })

    this.request('users')
    this.request('drives')
    this.request('fileShare')
    this.request('mediaShare')
    this.request('media')
  }
}

export default LoggedInUser