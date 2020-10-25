import React from 'react';
import { VBasePage } from '../../views/VBasePage';
import { CTo } from './CTo';

export class VSent extends VBasePage<CTo> {
	protected get back(): 'close' | 'back' | 'none' {return 'close'}
	header() {return '已发送'}
	content() {
		return <div className="m-5 border rounded bg-white">
			<div className="p-5 text-center border-bottom">已发送</div>
			<div className="text-center py-3">
				<button className="btn btn-outline-info" onClick={()=>this.backPage()}>返回</button>
			</div>
		</div>;
	}
}
