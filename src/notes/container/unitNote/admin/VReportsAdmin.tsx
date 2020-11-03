import React from 'react';
import { VBasePage } from "../../../../notes/views/VBasePage";
import { CRootAdmin } from "./CUnitAdmin";
import { FA, Form, ItemSchema, List, Page, 
	ButtonSchema, UiButton, 
	StringSchema, CStringEdit, UiTextItem, UiSchema, Context } from '../../../../tonva';
import { BookReport } from '../model';

export class VReportsAdmin extends VBasePage<CRootAdmin> {
	private projectFileds: ItemSchema[] = [
		{name: 'caption', type: 'string', maxLength: 100, required: true} as StringSchema,
		{name: 'submit', type: 'submit'} as ButtonSchema,
	];
	private projectUISchema: UiSchema= {
		items: {
			caption: {
				label: '名称', placeholder: '报表名称'
			} as UiTextItem,
			submit: {
				widget: 'button',
				label: '提交',
				className: 'btn btn-primary'
			} as UiButton
		}
	};
	header() {return '报表设计'}
	right() {
		return <button className="btn btn-sm btn-success mr-2" onClick={this.onClickAdd}>
			<FA name="plus" />
		</button>
	}

	private onClickAdd = () => {
		this.controller.report = undefined;
		this.openPageElement(<Page header="新增报表">
			<Form className="m-3"
				schema={this.projectFileds} 
				uiSchema={this.projectUISchema} 
				fieldLabelSize={2} onButtonClick={this.onSubmitNewReport} />
		</Page>);
	}

	private onSubmitNewReport = async (name:string, context: Context) => {
		await this.controller.saveBookReport(context.data);
		this.closePage();
	}

	content() {
		return <div className="my-3">
			<List items={this.controller.bookReports} 
				item={{render: this.renderProject, onClick: this.onClickReport}} />
		</div>;
	}

	private renderProject = (report: BookReport, index: number) => {
		let {caption} = report;
		return <div className="px-3 py-2 align-items-center">
			<b>{caption}</b>
		</div>;
	}

	private onClickReport = (report: BookReport) => {
		this.controller.report = report;
		let cNameEdit: CStringEdit = new CStringEdit(this.res);
		let props = {
			label: '报表名称', 
			onValueChange: this.controller.changeReportName,
		};
		this.openPageElement(<Page header="编辑报表">
			<div className="px-3 py-2 align-items-center">
				<small className="text-muted">报表名称:</small> &nbsp;
				{cNameEdit.render(report.caption, props)}
			</div>
		</Page>);
	}
/*
	<Form className="m-3"
	formData={this.controller.report}
	schema={this.projectFileds} 
	uiSchema={this.projectUISchema} 
	fieldLabelSize={2} onButtonClick={this.onSubmitNewReport} />
*/
}
