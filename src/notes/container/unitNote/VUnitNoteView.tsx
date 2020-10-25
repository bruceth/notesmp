import React from 'react';
import { observer } from 'mobx-react';
import { FA, List } from '../../../tonva';
import { VNoteBase } from '../../noteBase';
import { CUnitNote, EnumUnitRole, UnitItem } from './CUnitNote';

export class VUnitNoteView extends VNoteBase<CUnitNote> {
	header() {return this.controller.noteItem.caption};
	right() {
		let {role} = this.controller.unit;
		if ((role & EnumUnitRole.admin) === EnumUnitRole.admin) {
			return <button className="btn btn-success btn-sm mr-2" onClick={this.onAdmin}>管理</button>;
		}
	}
	private onAdmin = () => {
		this.controller.showRootAdmin();
	}

	content() {
		return React.createElement(observer(() => {
			let {unit, units} = this.controller;
			let {id, caption, content} = unit;
			return <div>
				<div className="m-3">
					note: {id} <br/>
					caption: {caption} <br/>
					content: {content} <br/>
				</div>
				<div className="d-flex align-items-end px-3 my-2">
					<div className="small text-muted">单位</div>
				</div>
				<List items={units} item={{render: this.renderUnitRow, onClick: this.onUnitRow}} />
			</div>;
		}));
	}

	private renderUnitRow = (unitItem: UnitItem, index: number) => {
		return React.createElement(observer(() => {
			let {caption} = unitItem;
			return <div className="px-3 py-2 align-items-center">
				<FA className="text-warning mr-3" name="sitemap" />
				<span>{caption}</span>
			</div>;
		}));
	}

	private onUnitRow = () => {
		alert('unit')
	}
}
