import React from 'react'
import { TextField, Dialog } from 'material-ui'
import FlatButton from '../../common/FlatButton'
import Checkmark from '../../common/Checkmark'
import request from 'superagent'

class ChangePasswordButton extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    open: false,
    success: 0,
    errorText: null
    }

    this.validatePasswords = () => {
      return this.state.password && 
        this.state.passwordAgain &&
        this.state.password.length &&
        this.state.password === this.state.passwordAgain
    }

    this.changePassword = () => {
      request
        .patch(`http://${this.props.address}:${this.props.fruitmixPort}/users/${this.props.user.uuid}`)
        .set('Accept', 'application/json')
        .set('Authorization', 'JWT ' + this.props.user.token)
        .send({ password: this.state.password })
        .end((err, res) => {

          if (err)
            return this.setState(Object.assign({}, this.state, { err, busy: false }))

          if (!res.ok)
            return this.setState(Object.assign({}, this.state, { 
              err: Object.assign(new Error('res not ok'), { code: 'EHTTPFAIL' }),
              busy: false
            }))
      
          this.setState({ success: 1 })
          setTimeout(() => this.setState(Object.assign({}, this.state, { open: false, success: 0 })), 1000)
          this.props.onOK()
        })
    }
  }

  render() {
    return (
      <div style={this.props.style}>
        <FlatButton primary={true} style={{marginLeft: -8}} label='修改密码' onTouchTap={() => this.setState({ open: true})} />
        <Dialog
          titleStyle={{color: 'rgba(0, 0, 0, 0.87)', fontSize: 20}}
          contentStyle={{width:336}}
          title={this.state.success ? '修改成功':'修改密码'}
          modal={true}
          open={this.state.open}
          onRequestClose={() => this.setState({open: false})}
        >
          {/*add checkmark*/}
          {this.state.success === 0
            ? <div>
                <TextField 
                  hintText='' 
                  floatingLabelText='输入新密码' 
                  maxLength={40}
                  type='password'
                  fullWidth={true}
                  disabled={this.state.busy}
                  onChange={e => this.setState(Object.assign({}, this.state, {
                    password: e.target.value
                  }))}
                />
                <TextField 
                  hintText='' 
                  floatingLabelText='再次输入新密码' 
                  maxLength={40}
                  type='password'
                  fullWidth={true}
                  disabled={this.state.busy}
                  onChange={e => this.setState(Object.assign({}, this.state, {
                    passwordAgain: e.target.value
                  }))}
                />
                <div style={{width:'100%', marginTop: 56, display:'flex', justifyContent:'flex-end'}}>
                  <FlatButton label='取消' 
                    labelStyle={{
                      fontSize: 16, 
                      fontWeight: 500,
                    }}
                    primary={true}
                    disabled={this.state.busy}
                    onTouchTap={() => {
                      this.setState({ open: false })
                      this.props.onCancel()
                    }} />
                  <FlatButton label='确定' 
                    labelStyle={{
                      fontSize: 16, 
                      fontWeight: 500,
                    }}
                    primary={true}
                    disabled={this.state.busy || !this.validatePasswords()}
                    onTouchTap={this.changePassword} />
                </div> 
              </div>
            : <div style={{width: '100%', display:'flex', alignItems:'center', justifyContent: 'center'}}>
                <Checkmark primary={true} delay={300} />
              </div>
          }
        </Dialog>
      </div>
    )
  }
}

export default ChangePasswordButton

