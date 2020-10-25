import { VBasePage } from '../../../notes/views/VBasePage';
import React from 'react';
import { FA, List } from '../../../tonva';
import { CSpace } from './CSpace';

export class VSpaceMembers extends VBasePage<CSpace> {
	header() {return '空间成员'}
	right() {
		return <div className="cursor-pointer btn btn-lg text-white p-1 mr-1" onClick={this.controller.showAddMember}>
			<FA name="plus" />
		</div>;
	}
	content() {
		return <div>
			<div className="text-success px-3 py-2 bg-white border-bottom">[自己]</div>
			<List items={this.controller.members} item={{render: this.renderContactItem}} />
		</div>
	}
}