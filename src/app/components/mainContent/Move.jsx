/**
 * @component MoveDialog
 * @description MoveDialog
 * @time 2016-6-23
 * @author liuhua
**/
'use strict';
// require core module
import React, { findDOMNode, Component, PropTypes } from 'react';
import { connect } from 'react-redux';
//material
import { SvgIcon } from 'material-ui'
//import Action
import Action from '../../actions/action';
import svg from '../../utils/SVGIcon';

class Move extends Component {
	render() {
		let left = this.props.navigation.menu?this.props.isShow.move.x-220:this.props.isShow.move.x-20;
		let top = this.props.isShow.move.y-120;  
		const style = {
			display: this.props.isShow.move.open==false?'none':'block',
			top:top,
			left:left,
		}
		if (this.props.tree.tree.isNull) {
			return null
		}
		return (
			<div style={style} className='move-dialog'>
				<div className='move-title'>
					<SvgIcon style={{marginLeft:'14px',cursor:'pointer'}}>{svg['back']()}</SvgIcon>
					<span className='move-title-name'>this.props.tree.tree.name</span>
					<SvgIcon className='move-close'>{svg['close']()}</SvgIcon>
				</div>
				<div className='move-content'>
				
				</div>
			</div>
			)
	}
}

function mapStateToProps(state) {
	return {
		isShow: state.isShow,
		navigation: state.navigation,
		tree: state.tree
	}
}
export default connect(mapStateToProps)(Move);