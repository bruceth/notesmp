import { Contact } from 'model';
import { VBasePage } from '../../../notes/views/VBasePage';
import React from 'react';
import { List } from '../../../tonva';
import { CSpace } from './CSpace';

export class VContacts extends VBasePage<CSpace> {
	header() {return '选择成员'}
	content() {
		return <div>
			<List items={this.controller.contacts} 
				item={{render: this.renderContactItem, onSelect:this.onContactSelect}} 
				isItemSelected={v=> v.already > 0}/>
		</div>
	}

	private onContactSelect = (item:Contact, isSelected:boolean, anySelected:boolean):void => {
		this.controller.selectMember(item, isSelected);
	}

}