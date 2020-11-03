import React from 'react';
import { VBasePage } from "../../../../notes/views/VBasePage";
import { CRootAdmin } from "./CUnitAdmin";
import { FA, Form, ItemSchema, List, Page, 
	ButtonSchema, UiButton, 
	StringSchema, IntSchema, UiTextItem, UiNumberItem, UiSchema, Context } from '../../../../tonva';
import { BookProject } from '../model';

export class VRootProjects extends VBasePage<CRootAdmin> {
	private projectFileds: ItemSchema[] = [
		{name: 'name', type: 'string', maxLength: 100, required: true} as StringSchema,
		{name: 'caption', type: 'string', maxLength: 100} as StringSchema,
		{name: 'memo', type: 'string', maxLength: 100} as StringSchema,
		{name: 'ratioX', type: 'integer', min: 1} as IntSchema,
		{name: 'ratioY', type: 'integer', min: 1} as IntSchema,
		{name: 'readUnit', type: 'string', maxLength: 20} as StringSchema,
		{name: 'submit', type: 'submit'} as ButtonSchema,
	];
	private projectUISchema: UiSchema= {
		items: {
			name: {
				label: '名称', placeholder: '科目名称'
			} as UiTextItem,
			caption: {
				label: '标题', placeholder: '科目显示标题'
			} as UiTextItem,
			memo: {
				label: '说明', placeholder: '科目说明'
			} as UiTextItem,
			ratioX: {
				label: '分子', defaultValue: 1, discription: '基本单位换算分子，默认1'
			} as UiNumberItem,
			ratioY: {
				label: '分母', defaultValue: 1, discription: '基本单位换算分母，默认1'
			} as UiNumberItem,
			readUnit: {
				label: '计量单位', placeholder: '显示出来的计量单位'
			} as UiTextItem,
			submit: {
				widget: 'button',
				label: '提交',
				className: 'btn btn-primary'
			} as UiButton
		}
	};
	header() {return '机构科目'}
	right() {
		return <button className="btn btn-sm btn-success mr-2" onClick={this.onClickAdd}>
			<FA name="plus" />
		</button>
	}

	private onClickAdd = () => {
		this.controller.project = undefined;
		this.openPageElement(<Page header="新增科目">
			<Form className="m-3"
				schema={this.projectFileds} 
				uiSchema={this.projectUISchema} 
				fieldLabelSize={2} onButtonClick={this.onSubmitNewProject} />
		</Page>);
	}

	private onSubmitNewProject = async (name:string, context: Context) => {
		await this.controller.saveBookProject(context.data);
		this.closePage();
	}

	content() {
		return <div className="my-3">
			<List items={this.controller.bookProjects} 
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
		this.controller.project = project;
		this.openPageElement(<Page header="编辑科目">
			<Form className="m-3"
				formData={this.controller.project}
				schema={this.projectFileds} 
				uiSchema={this.projectUISchema} 
				fieldLabelSize={2} onButtonClick={this.onSubmitNewProject} />
		</Page>);
	}
}
