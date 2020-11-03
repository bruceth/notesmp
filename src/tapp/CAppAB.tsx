import React from 'react';
import { navigo, View, VPage, WebNav } from '../tonva';
import { CUqApp } from "./CBase";

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
		this.openVPage(VAppBBBBCCCC);
	}

	get webNav(): WebNav<any> {
		return {
			VNavHeader: VNavWebHeader, 
			VNavFooter: VNavWebFooter,
		}
	}
}

class VAppBBBBCCCC extends VPage<CAppBBBBCCCC> {
	header() {return 'VAppBBBBCCCC'}
	content() {
		return <div>
			<div>page content</div>
			/bbbb/cccc
		</div>;
	}
}

class VNavWebHeader extends View<CAppBBBBCCCC> {
	render() {
		return <div>VNavWebHeader</div>;
	}
}

class VNavWebFooter extends View<CAppBBBBCCCC> {
	render() {
		return <div>vNavWebFooter</div>;
	}
}
