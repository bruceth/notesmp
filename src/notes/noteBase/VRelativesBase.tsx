import React from 'react';
import { observer } from 'mobx-react';
import { User, Image, UserView, FA } from "../../tonva";
import { VNoteBase, CNoteBase } from '.';
import { none } from '../../tool';

export interface TabRelative {
	name: string;
	caption: (isAction:boolean) => JSX.Element;
	render: () => JSX.Element;
	visible: () => boolean;
}

export class VRelativesBase<T extends CNoteBase> extends VNoteBase<T> {

	protected tabShare:TabRelative = {
		name: 'share',
		visible: () => this.controller.noteItem.toCount>0,
		caption: (isAction:boolean) => {
			let {toCount} = this.controller.noteItem;
			let vCount:any;
			if (toCount > 0) vCount = <small>{toCount}</small>;
			return <>
				<FA className="mr-2" name="share" /> 
				{vCount}
			</>;
		},
		render: () => {
			let {to} = this.controller.noteModel;
			if (!to || to.length === 0) return;
			return <div className="px-3 py-2">
				<small className="text-muted mr-3">已分享给: </small>
				{to.map((t, index) => {
					let {user, assigned} = t;
					return <span key={index} className="mr-3">{this.renderContact(user, assigned)}</span>;
				})}
			</div>
		}
	}
	protected renderContact = (userId:number, assigned:string) => {
		let renderUser = (user:User) => {
			let {name, nick, icon} = user;
			return <>
				<Image className="w-1-5c h-1-5c mr-2" src={icon || '.user-o'} />
				{assigned || nick || name}
			</>
		}
		return <UserView user={userId as number} render={renderUser} />;
	}

	protected get tabs():TabRelative[] { return [this.tabShare] };

	protected renderTabs():JSX.Element {
		let render = observer(() => {
			let {activeRelativeTab} = this.controller;
			let tabs = this.tabs.filter(tab => tab.visible?.());
			if (tabs.length === 0) {
				return;
			}
			let tab = tabs.find(v => v.name === activeRelativeTab);
			if (!tab) tab = tabs[0];
			return <div className="bg-white">
				<div className="d-flex px-3 pt-3">
					{tabs.map(v => {
						let {name, caption} = v;
						let isActive = v === tab;
						return this.renderTab(isActive, name, caption(isActive));
					})}
				</div>
				<div className="border-top" style={{marginTop: '-1px'}}>
					{tab.render() || <div className="p-3">{none}</div>}
				</div>
			</div>
		});
		return React.createElement(render);
	}

	render():JSX.Element {
		return this.renderTabs();
	}

	private renderTab(isAction:boolean, tabName:string, tabContent:any) {
		let cn:string = isAction === true? ' bg-white' : ' bg-light text-muted border-bottom';
		return <div key={tabName}
			className={'border-left border-top border-right rounded-top px-3 py-2 cursor-pointer' + cn}
			onClick={()=>this.controller.activeRelativeTab = tabName}>
			{tabContent}
		</div>;
	}
}
