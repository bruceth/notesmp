import React from 'react';
import { observer } from 'mobx-react';
import { DropdownActions, DropdownAction } from '../../../tonva';
import { VNoteBaseEdit } from '../../noteBase';
import { CNoteText } from "./CNoteText";
import { VTextHeader } from './VTextHeader';

export class VTextEdit extends VNoteBaseEdit<CNoteText> {
	header() {
		return this.renderVm(VTextHeader);
	}

	protected renderContent():JSX.Element {
		//return this.controller.cContent.renderInput();
		return React.createElement(observer(() =>{
			let {cType, cContent} = this.controller;
			return <>
				<span className="d-none">{cType}</span>
				{cContent.renderInput()}
			</>;
		}));
	}

	protected renderEditBottom():JSX.Element {
		return <div className="py-2 pl-3 bg-light border-top d-flex">
			{this.renderButtonLeft()}
			<div className="mr-auto" />
			{React.createElement(observer(() => <>
				<button onClick={() => this.onButtonSave()}
					className="btn btn-primary mr-3" disabled={!this.controller.isNoteChanged}>
					保存
				</button>
			</>))}
			{this.renderExButtons()}
		</div>;
	}

	protected renderExButtons():JSX.Element {
		return this.renderDeleteButton();
	}

	private dropdownActions: {[type: string]: DropdownAction} = {
		text: {
			icon:'file-o', 
			caption:this.t('noteText'), 
			action: this.controller.changeToText,
		},
		list: {
			icon:'list', 
			caption:this.t('noteList'), 
			action: this.controller.changeToList,
		},
		checkable: {
			icon:'check-square-o', 
			caption:this.t('noteCheckable'), 
			action: this.controller.changeToCheckable,
		},
	};

	protected renderButtonLeft():JSX.Element { 
		return <DropdownActions
			actions={this.controller.dropdowns.map(v => this.dropdownActions[v])} 
			icon="th-list" 
			itemIconClass="text-info" 
			isRight={false}
			className="cursor-pointer btn btn-lg p-1 mr-1"/>;
	}
}
