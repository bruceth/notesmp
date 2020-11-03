import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Edit, FA, Form, List, Schema, StringSchema, BoolSchema, UiSchema, UiTextItem, UiCheckItem, VPage, ItemSchema, Page } from '../../../../tonva';
import { CAdminBase, CUnitAdmin, CRootAdmin } from './CUnitAdmin';
import { VBasePage } from '../../../../notes/views/VBasePage';
import { VAddContact } from '../../../../tool';
import { EnumUnitRole, MemberItem, UnitItem } from '../model';

export abstract class VAdminBase<C extends CAdminBase> extends VBasePage<C> {
	content() {
		let {unit} = this.controller;
		let {content} = unit;
		return <div>
			{this.renderParent()}
			<div className="m-3">
				<div>
					{React.createElement(observer(()=><b>{unit.caption}</b>))}
					{this.renderEditUnitName()}
					{this.renderUnitID()}
				</div>
				{content && <div>content</div>}
			</div>

			<div className="my-5">
				{this.renderProjects()}
				{/*this.renderReportDesign()*/}
				{this.renderUnitProjects()}
			</div>

			{this.renderMembersAndUnits()}
		</div>
	}

	protected renderParent():JSX.Element {return;}
	protected renderEditUnitName():JSX.Element {return}
	protected renderUnitID():JSX.Element {return}
	protected renderProjects():JSX.Element {return;}
	protected renderReportDesign():JSX.Element {return;}

	protected renderUnitProjects():JSX.Element {
		return <div className="mt-3 px-3 py-2 d-flex bg-white cursor-pointer align-items-center"
			onClick={this.controller.showUnitProjects}>
			<span>科目显示</span>
			<FA className="ml-auto" name="angle-right" />
		</div>;
	}

	protected renderMembersAndUnits() {
		return <>
			{this.renderMembers()}
			<div className="mt-5" />
			{this.renderUnits()}
		</>
	}

	protected renderMembers() {
		return <>
				<div className="d-flex align-items-end px-3 my-2">
				<div className="small text-muted">成员</div>
				<button className="ml-auto btn btn-sm btn-primary" onClick={this.onNewMember}>
					<FA name="plus" /> 成员
				</button>
			</div>
			<List items={this.controller.members} item={{render:this.renderMemberRow, onClick:this.onClickMember}} />
		</>;
	}

	protected renderUnits() {
		return <>
				<div className="d-flex align-items-end px-3 my-2">
				<div className="small text-muted">下级单位</div>
				<button className="ml-auto btn btn-sm btn-primary" onClick={this.onNewUnit}>
					<FA name="plus" /> 单位
				</button>
			</div>
			<List items={this.controller.units} item={{render: this.renderUnitRow, onClick: this.onUnitRow}} />
		</>
	}

	private onNewUnit = () => {
		this.openVPage(VNewUnit);
	}

	private renderUnitRow = (unitItem: UnitItem, index: number) => {
		return React.createElement(observer(() => {
			let {caption, memberCount} = unitItem;
			return <div className="px-3 py-2 align-items-center d-flex">
				<div>
					<FA className="text-warning mr-3" name="sitemap" />
					<span>{caption}</span>
				</div>

				{<span className="ml-auto small"><FA name="user-o" className="small text-info mr-2" /> {memberCount}</span>}
			</div>;
		}));
	}

	private onUnitRow = (unitItem: UnitItem) => {
		this.controller.showUnitAdmin(unitItem);
	}

	private onNewMember = () => {
		this.openVPage(VNewMember);
	}

	private renderMemberRow = (item: MemberItem, index: number) => {
		let {member, assigned, role, discription} = item;
		let right: any[] = [];
		if ((role & EnumUnitRole.owner) === EnumUnitRole.owner) {
			right.push(<FA key="owner" className="text-danger ml-2" name="flag" />);
		}
		if ((role&EnumUnitRole.admin) === EnumUnitRole.admin) {
			right.push(<span key="admin" className="ml-2">管理员</span>)
		}
		return <div className="px-3 py-2 cursor-pointer align-items-center">
			<div className="mr-3">{this.renderContact(member, assigned)}</div>
			<div className="small text-muted">{discription}</div>
			<span className="ml-auto small">
				{right}
			</span>
		</div>;
	}

	private onClickMember = (item: MemberItem) => {
		this.openVPage(VEditMember, item);
	}	
}

export class VRootAdmin extends VAdminBase<CRootAdmin> {
	header() {return React.createElement(observer(()=><>机构 {this.controller.unit.caption}</>))};
	protected renderUnitID() {
		return <small className="text-muted ml-3">ID={this.controller.unit.id}</small>
	}

	protected renderReportDesign():JSX.Element {
		return <div className="px-3 py-2 d-flex bg-white cursor-pointer"
			onClick={this.controller.showDesignReports}>
			<span>报表设计</span>
			<FA className="ml-auto" name="angle-right" />
		</div>;
	}

	protected renderProjects():JSX.Element {
		return <div className="px-3 py-2 d-flex bg-white cursor-pointer border-bottom"
			onClick={this.controller.showRootProjects}>
			<span>机构科目</span>
			<FA className="ml-auto" name="angle-right" />
		</div>;
	}

	protected renderMembersAndUnits() {
		return <>
			{this.renderUnits()}
			<div className="mt-5" />
			{this.renderMembers()}
		</>;
	}
}

export class VUnitAdmin extends VAdminBase<CUnitAdmin> {
	header() {return React.createElement(observer(()=><>{this.controller.unit.caption}</>))};

	protected renderParent() {
		let {parent} = this.controller;
		return <div className="m-3 small">
			<span className="text-muted">上级：</span>
			<b className="text-primary">{parent.caption}</b>
		</div>;
	}

	protected renderUnitID() {
		return <small className="text-muted">ID={this.controller.unit.id}</small>
	}

	protected renderEditUnitName() {
		return <span className="cursor-pointer align-self-stretch" onClick={this.onEditUnitName}>
			<FA className="text-info mx-3" name="pencil-square-o" />
		</span>;
	}
	private onEditUnitName = () => {
		let right = <button className="btn btn-sm btn-success mr-1" onClick={this.onUnitNameSubmit}>提交</button>;
		this.openPageElement(<Page header="名称" right={right}>
			<div className="m-3">
				<input type="text" className="form-control" 
					defaultValue={this.controller.unit.caption}
					onChange={this.onUnitNameChange} maxLength={100}
					onKeyDown={this.onUnitNameKeyDown} />
			</div>
		</Page>)
	}

	private unitName:string;
	private onUnitNameChange = (evt:React.ChangeEvent<HTMLInputElement>) => {
		this.unitName = evt.target.value;
	}
	private onUnitNameKeyDown = (evt:React.KeyboardEvent<HTMLInputElement>) => {
		if (evt.keyCode === 13) this.onUnitNameSubmit();
	}

	private onUnitNameSubmit = async () => {
		await this.controller.setUnitName(this.unitName);
		this.controller.unit.caption = this.unitName;
		this.closePage();
	}
}

class VNewUnit<C extends CAdminBase> extends VPage<C> {
	@observable private input: string;
	@observable private error: string;

	header() {return '新增单位'}
	content() {
		return React.createElement(observer(() => {
			let vError:any;
			if (this.error)
			vError = <div className="my-3 text-danger">{this.error}</div>;
			return <div className="m-3">
				<div className="">
					<input type="text" className="form-control" maxLength={100}
						placeholder="单位名称" onChange={this.onChange} onKeyDown={this.onKeyDown}/>
				</div>
				{vError}
				<div className="my-2">
					<button className="btn btn-primary" disabled={this.input?.trim().length===0}
						onClick={this.onCreate}>新建单位</button>
				</div>
			</div>;
		}));
	}

	private onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
		this.input = evt.currentTarget.value;
	}

	private onKeyDown = async (evt: React.KeyboardEvent<HTMLInputElement>) => {
		if (evt.keyCode === 13) {
			await this.onCreate();
		}
	}

	private onCreate = async () => {
		let unitId = await this.controller.createUnit(this.input.trim());
		if (unitId > 0) {
			this.closePage();
			return;
		}
		switch (unitId) {
			default: this.error = '错误编号：' + unitId; break;
			case -1: this.error = '无建单位权限'; break;
			case -2: this.error = '单位重名'; break;
		}
	}
}

const adminSchema = {name: 'isAdmin', type: 'boolean', required: false} as BoolSchema;
const isAdminUI = {widget: 'checkbox',label: '管理员'} as UiCheckItem;

const schema: Schema = [
	{name: 'assigned', type: 'string', required: false, maxLength: 100} as StringSchema,
	{name: 'discription', type: 'string', required: false, maxLength: 100} as StringSchema,
];
const uiSchema: UiSchema = {
	items: {
		assigned: {
			widget: 'text',
			label: '赋予名字',
			placeholder: '成员的真实姓名'
		} as UiTextItem,
		discription: {
			widget: 'text',
			label: '说明',
			placeholder: '职称，职务或者岗位信息'
		} as UiTextItem,
		isAdmin: isAdminUI,
	}
};
class VNewMember<C extends CAdminBase> extends VAddContact<C> {
	private form: Form;

	protected renderFields() {
		return <Form ref={f => this.form=f} className="m-3" schema={schema} uiSchema={uiSchema} fieldLabelSize={2} />	
	}
	
	protected async addContact():Promise<void> {
		let {assigned, discription} = this.form.data;
		await this.controller.addMember(this.user.id, assigned, discription);
	}
}

class VEditMember<C extends CAdminBase> extends VBasePage<C> {
	@observable private item: MemberItem;
	init(item: MemberItem) {
		this.item = item;
		isAdminUI.readOnly = (this.item.role & EnumUnitRole.owner) === EnumUnitRole.owner;
	}
	header() {return '详情'}
	content () {
		return React.createElement(observer(() => {
			let {assigned, discription} = this.item;
			let data = {
				isAdmin: (this.item.role & (EnumUnitRole.admin | EnumUnitRole.unitAdmin)) !== 0,
				assigned, discription,
			};
			return <div>
				<Edit className="m-3" 
					data={data}
					schema={[adminSchema, ...schema]} 
					uiSchema={uiSchema}
					onItemChanged={this.onItemChanged} />
			</div>;
		}));
	}

	private onItemChanged = async (itemSchema: ItemSchema, newValue:any, preValue:any) => {
		let {name} = itemSchema;
		if (name === 'isAdmin') {
			await this.controller.setUnitMemberAdmin(this.item, newValue);
		}
		else {
			await this.controller.setUnitMemberProp(this.item, name, newValue);
		}
	}
}
