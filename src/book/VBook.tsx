import React from 'react';
import { View, FA } from "../tonva";
import { CBook, ProjectSum } from './CBook';

export class VBook extends View<CBook> {
	render() {
		let {projectSums} = this.controller;
		if (projectSums.length === 0) return;
		return <div className="px-3 mb-3 border-top">
			{projectSums.map(v => { 
				//let {id, name, debitYear, creditYear, debitMonth, creditMonth, debitWeek, creditWeek, debitDay, creditDay} = v;
				let {id, name, debitMonth, debitWeek, debitDay} = v;
				return <div key={id} className="row py-3 align-items-end border-bottom bg-white cursor-pointer"
					onClick={() => this.onProject(v)}>
					<div className="col text-center">{name}</div>
					{this.renderNumber('今天', debitDay)}
					{this.renderNumber('本周', debitWeek)}
					{this.renderNumber('本月', debitMonth)}
					<div className="mx-3">
						<FA name="angle-right" />
					</div>
				</div>;
			})}
		</div>;
	}

	private renderNumber(caption:string, num:number) {
		return <div className="text-center col">
			<small className="text-muted">{caption}</small><br/>
			<span>{num ?? 0}</span>
		</div>
	}

	private onProject = async (projectSum:ProjectSum) => {
		await this.controller.showProjectFlow(projectSum);
	}
}
