import React from 'react';
import { observer } from 'mobx-react';
import { FA, List } from '../../../tonva';
import { VNoteBase } from '../../noteBase';
import { CUnitNote } from './CUnitNote';
import { EnumUnitRole, MemberProjectsSum, ProjectSum, UnitProjectsSum } from './model';

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
			let {unit, myProjectsSum} = this.controller;
			let {id, caption, content} = unit;
			return <div className="pb-3">
				<div className="m-3">
					note: {id} <br/>
					caption: {caption} <br/>
					content: {content} <br/>
				</div>
				<div className="mb-1" />
				<div className="bg-white mb-4">
					{this.renderMemberRow(myProjectsSum, 0)}
				</div>
				{this.renderUnits()}
				<div className="mb-4" />
				{this.renderMembers()}
			</div>;
		}));
	}

	private renderProjectSums(projectSums:ProjectSum[]) {
		return <div className="d-flex flex-wrap">
			{projectSums.map(v => {
				let {project, debit} = v;
				let {name, caption} =project;
				return <div className="border p-2 mx-3 mb-3 text-center w-8c rounded border-info">
					<div className="mb-2 text-truncate text-dark small">{caption || name}</div>
					<div className="text-primary">{debit}</div>
				</div>;
			})}
		</div>;
	}

	protected renderUnits() {
		return <>
			<div className="d-flex align-items-end px-3 my-2">
				<div className="small text-muted">单位</div>
			</div>
			<List items={this.controller.unitProjectsSums} item={{render: this.renderUnitRow, onClick: this.onUnitRow}} />
		</>
	}

	private renderUnitRow = (unitProjectsSum: UnitProjectsSum, index: number) => {
		let {unit, projectSums} = unitProjectsSum;
		return React.createElement(observer(() => {
			let {caption} = unit;
			return <div className="d-block">
				<div className="d-flex px-3 py-2 align-items-center">
					<FA className="text-warning mr-3" name="sitemap" />
					<span>{caption}</span>
				</div>
				{this.renderProjectSums(projectSums)}
			</div>;
		}));
	}

	private onUnitRow = () => {
		alert('unit')
	}

	protected renderMembers() {
		return <>
				<div className="d-flex align-items-end px-3 my-2">
				<div className="small text-muted">成员</div>
			</div>
			<List items={this.controller.memberProjectsSums} item={{render:this.renderMemberRow, onClick:this.onMemberRow}} />
		</>;
	}

	private renderMemberRow = (memberProjectsSum: MemberProjectsSum, index: number) => {
		let {member:memberItem, projectSums} = memberProjectsSum;
		let {member, assigned, discription} = memberItem;
		let right: any[] = [];
		/*
		if ((role & EnumUnitRole.owner) === EnumUnitRole.owner) {
			right.push(<FA key="owner" className="text-danger ml-2" name="flag" />);
		}
		if ((role&EnumUnitRole.admin) === EnumUnitRole.admin) {
			right.push(<span key="admin" className="ml-2">管理员</span>)
		}
		*/
		return <div className="d-block">
			<div className="d-flex px-3 py-2 cursor-pointer align-items-center">
				<div className="mr-3">{this.renderContact(member, assigned)}</div>
				<div className="small text-muted">{discription}</div>
				<span className="ml-auto small">
					{right}
				</span>
			</div>
			{this.renderProjectSums(projectSums)}
		</div>;
	}

	private onMemberRow = () => {
		alert('member')
	}
}
