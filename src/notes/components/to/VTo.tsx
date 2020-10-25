import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { List, FA } from '../../../tonva';
import { Contact } from '../../../model';
import { VBasePage } from '../../views/VBasePage';
//import { VActions } from './VActions';
import { CTo } from './CTo';

export class VTo extends VBasePage<CTo> {
	//protected backPageCount = 2;
	/*
	init(param?:any):void {
		if (param) {
			this.backPageCount = Number(param);
		}	
	}
	*/

	@observable private anyChanged:boolean = false;
	private list: List;

	protected get back(): 'close' | 'back' | 'none' {return 'close'}

	header() {return '收件人'}
	right():any {
		let c = observer(() => <button className="btn btn-sm btn-primary mr-1" onClick={this.onNext} disabled={!this.anyChanged}>
			下一步 <FA name="angle-right" />
		</button>);
		return React.createElement(c);
	}
	content() {
		let items = this.controller.groupContacts; //.cApp.contacts;
		return <div className="">
			<List ref={v => this.list = v}
				items={items} 
				item={{render:this.renderContactItem, onSelect:this.onContactSelect}}
				isItemSelected={v => v.already} />
		</div>
	}

	private onContactSelect = (item:Contact, isSelected:boolean, anySelected:boolean):void => {
		let {already} = item;
		if (
				(isSelected === true && already === 0)
			 || (isSelected === false && already > 0)
			)
		{
			this.anyChanged = true;
		}
	}

	private onNext = async () => {
		let contacts = this.list.selectedItems;
		await this.controller.onContactsSelected(contacts);
		//this.controller.contacts = contacts;
		//this.openVPage(VActions, this.backPageCount + 1); //, {contacts, noteId: this.currentNoteId});
	}
}
