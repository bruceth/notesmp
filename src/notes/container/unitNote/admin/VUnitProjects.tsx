import React from 'react';
import { VBasePage } from "../../../../notes/views/VBasePage";
import { CAdminBase } from "./CUnitAdmin";
import { FA, List, Page } from '../../../../tonva';
import { BookProject } from '../model';

export class VUnitProjects <C extends CAdminBase> extends VBasePage<C> {
	header() {return '显示科目'}
	right() {return <button className="btn btn-sm btn-success mr-2" onClick={this.onAddSub}>增减</button>}
	content() {
		return <div className="my-3">
			<List items={this.controller.unitedProjects} 
				item={{render: this.renderProject, onClick: this.onClickProject}} />
		</div>;
	}

	private renderProject = (project: BookProject, index: number) => {
		let {name, caption, memo, ratioX, ratioY, readUnit} = project;
		return <div className="px-3 py-2 align-items-center">
			<b>{caption ?? name}</b> <small className="ml-3 text-muted">{memo}</small>
			<span className="ml-auto">{name} = {ratioX} / {ratioY} {readUnit}</span>
		</div>;
	}

	private onClickProject = (project: BookProject) => {
	}

	private onAddSub = () => {
		this.openPageElement(<Page header="调整科目">
			<div className="mt-3 mb-1 small mx-3">已显示科目</div>
			<List items={this.controller.unitedProjects} 
				item={{render: this.renderUnitedProject}} />
			
			<div className="mt-3 mb-1 small mx-3">可显示科目</div>
			<List items={this.controller.unitableProjects} 
				item={{render: this.renderUnitableProject}} />
		</Page>);
	}

	private renderUnitedProject = (project: BookProject, index: number) => {
		let {name, caption, memo, ratioX, ratioY, readUnit} = project;
		let downVisible = index>=this.controller.unitedProjects.length-1? 'invisible' : '';
		let upVisible = index<=0? 'invisible' : '';
		return <div className="px-3 py-2 align-items-center">
			<b>{caption ?? name}</b> <small className="ml-3 text-muted">{memo}</small>
			<span className="ml-auto">{name} = {ratioX} / {ratioY} {readUnit}</span>
			<button className="btn btn-sm btn-outline-dark ml-3" 
				onClick={()=>this.controller.setProjectDisplay(project, false)}>
					<FA name="minus" />
			</button>
			<button className={'btn btn-sm btn-outline-info ml-3 ' + downVisible}
				onClick={()=>this.controller.setProjectDown(index)}>
					<FA name="arrow-down" />
			</button>
			<button className={'btn btn-sm btn-outline-info ml-3 ' + upVisible}
				onClick={()=>this.controller.setProjectUp(index)}>
					<FA name="arrow-up" />
			</button>
		</div>;
	}

	private renderUnitableProject = (project: BookProject, index: number) => {
		let {name, caption, memo, ratioX, ratioY, readUnit} = project;
		return <div className="px-3 py-2 align-items-center">
			<b>{caption ?? name}</b> <small className="ml-3 text-muted">{memo}</small>
			<span className="ml-auto">{name} = {ratioX} / {ratioY} {readUnit}</span>
			<button className="btn btn-sm btn-success ml-3"
				onClick={()=>this.controller.setProjectDisplay(project, true)}>
					<FA name="plus" />
				</button>
		</div>;
	}
}
