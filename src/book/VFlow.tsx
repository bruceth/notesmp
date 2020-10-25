import React from 'react';
import { CBook, ProjectFlowItem, ProjectSum } from './CBook';
import { VPage, List, EasyTime, FA } from '../tonva';

export class VFlow extends VPage<CBook> {
	private projectSum: ProjectSum;
	init(param: ProjectSum) {
		this.projectSum = param;
	}

	header() {return '明细 - ' + this.projectSum.name}

	content() {
		return <div>
			<div className="px-3 py-2 d-flex">
				<div className="w-8c">日期</div>
				<div className="w-5c text-right"><FA name="plus"/></div>
				<div className="w-5c text-right"><FA name="minus"/></div>
			</div>
			<List
				items={this.controller.projectDetailPager}
				item={{render: this.renderFlowItem}}/>
		</div>;
	}

	private renderFlowItem = (flowItem:ProjectFlowItem) => {
		let {stamp, memo, debit, credit} = flowItem;
		return <div className="px-3 py-2 d-flex cursor-pointer" onClick={()=>this.controller.showFlowItem(flowItem)}>
			<div className="w-8c"><EasyTime date={stamp} /></div>
			<div className="w-5c text-right">{debit}</div>
			<div className="w-5c text-right">{credit}</div>
			<div className="ml-5">{memo}</div>
		</div>;
	}
}
