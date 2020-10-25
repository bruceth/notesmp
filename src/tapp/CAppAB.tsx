import React from 'react';
import { CUqApp } from "./CBase";
import { navigo } from 'tonva/components/navigo';

export class CAppAB extends CUqApp {
	protected async internalStart() {
		this.openPage(<div>
			/a/b 
			<button onClick={this.onClick}>test</button>
		</div>)
	}

	private onClick = () => {
		//window.history.pushState({}, 'aaaa', '/bbbb/cccc');
		navigo.navigate('/bbbb/cccc');
	}
}

export class CAppCD extends CUqApp {
	protected async internalStart() {
		this.openPage(<div>/c/d</div>)
	}
}

export class CAppBBBBCCCC extends CUqApp {
	protected async internalStart() {
		this.openPage(<div>/bbbb/cccc</div>)
	}
}
