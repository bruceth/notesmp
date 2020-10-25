import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { VPage, userApi, User, Image, Page, List, UserView, 
	Edit, ItemSchema, StringSchema, IntSchema, UiSchema, UiTextItem, UiNumberItem, BoolSchema, UiCheckItem } from "../tonva";
import { CMe, RootUnitItem } from "./CMe";

export class VAdmin extends VPage<CMe> {
	header() {return '管理员'}
	content() {
		return <div>
			<div className="px-3 py-3 bg-white border-bottom">
				<div><b className="text-info">为用户创建机构</b></div>
				<div>
					给指定用户创建机构。机构下面的部门和成员，由机构所有者创建。
				</div>
				<div className="my-2">
					<button className="btn btn-primary" onClick={()=>this.openVPage(VUser)}>创建</button>
				</div>
			</div>
			<List items={this.controller.rootUnits} item={{render: this.renderRootUnit, onClick: this.onClickRootUnit}} />
		</div>;
	}

	private renderRootUnit = (item: RootUnitItem, index: number) => {
		let {id, owner, name, tonvaUnit, x} = item;
		let renderUser = (user:User) => {
			let {name, nick, icon} = user;
			return <>
				<Image className="w-1-5c h-1-5c mr-2" src={icon || '.user-o'} />
				{nick || name}
			</>
		}
		let vId = <small className="text-muted">ID={id}</small>;
		let vName = (x !== 0)? 
			<del>{name} {vId}</del>
			:
			<><b>{name}</b> {vId}</>;
		return <div className={'px-3 py-2 align-items-center '}>
			<div className="mr-3">{vName}</div>
			<div className="small text-muted d-flex align-items-center"><UserView user={owner as number} render={renderUser} /></div>
			{tonvaUnit && <div className="ml-auto small text-muted">tonva={tonvaUnit}</div>}
		</div>;
	}

	private onClickRootUnit = (item: RootUnitItem) => {
		let {name} = item;
		let schema: ItemSchema[] = [
			{ name: 'name', type: 'string' } as StringSchema,
			{ name: 'tonvaUnit', type: 'integer' } as IntSchema,
			{ name: 'x', type: 'boolean' } as BoolSchema,
		];
		let uiSchema: UiSchema = {
			items: {
				name: { widget: 'text', label: '机构名称' } as UiTextItem,
				tonvaUnit: { widget: 'number', label: 'Tonva Unit' } as UiNumberItem,
				x: {widget: 'checkbox', label: '停用', trueValue: 1, falseValue: 0} as UiCheckItem,
			}
		}
		this.openPageElement(<Page header={name}>
            <Edit schema={schema} uiSchema={uiSchema}
                data={item}
                onItemChanged={async (itemSchema: ItemSchema, newValue: any, preValue: any) => {
					await this.onItemChanged(item, itemSchema, newValue, preValue);
				}} />
		</Page>);
	}

	private onItemChanged = async (item: RootUnitItem, itemSchema: ItemSchema, newValue: any, preValue: any) => {
		switch (itemSchema.name) {
			case 'name':
				let name = newValue.trim();
				if (name === preValue.trim()) break;
				await this.controller.changeRootUnitName(item, name);
				break;
			case 'tonvaUnit':
				await this.controller.changeRootUnitTonva(item, newValue);
				break;
			case 'x':
				await this.controller.changeRootUnitX(item, newValue);
				break;
		}
	}
}

class VUser extends VPage<CMe> {
	@observable private hasError = false;
	@observable private user:{id:number, name:string, nick:string, icon:string};
	@observable private inputName: string;

	header() {return '机构所有者'}
	content() {
		return React.createElement(observer(() => {
			let vError:any;
			if (this.hasError===true)
				vError = <div className="my-3 text-danger">用户不存在！</div>;
			return <div className="m-3">
				<div>
					<input type="text" className="form-control"  maxLength={100}
						placeholder="用户"
						onFocus={()=>this.hasError = false}
						onKeyDown={this.onKeyDown}
						onChange={this.onChange}/>
				</div>
				{vError}
				<div className="my-2">
					<button className="btn btn-primary" disabled={this.inputName?.trim().length===0}
						onClick={this.onNext}>下一步</button>
				</div>
			</div>;
		}));
	}

	private onKeyDown = async (evt: React.KeyboardEvent<HTMLInputElement>) => {
		this.hasError = false;
		if (evt.keyCode === 13) {
			await this.onNext();
		}
	}

	private onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
		this.inputName = evt.currentTarget.value;
	}

	private onNext = async () => {
		await this.search(this.inputName.trim());
		if (this.hasError === false) {
			this.controller.unitOwner = this.user as User;
			this.openVPage(VUnit);
		}
	}

	private search = async (key:string) => {
		let ret = await userApi.fromKey(key);
		if (!ret) {
			this.hasError = true;
			return;
		}
		// if (this.controller.isMe(ret.id)) {
		//	return;
		//}
		this.user = ret;
	}
}

class VUnit extends VPage<CMe> {
	@observable private input: string;

	header() {return '新建机构'}
	content() {
		return React.createElement(observer(() => {
			let {unitOwner} = this.controller;
			let {icon, name, nick} = unitOwner;
			return <div className="m-3">
				<div className="my-2">所有者: <Image className="w-2c h-2c" src={icon} /> {nick ?? name} </div>
				<div>
					<input type="text" className="form-control" maxLength={100}
						placeholder="机构名称" onChange={this.onChange} onKeyDown={this.onKeyDown}/>
				</div>
				<div className="my-2">
					<button className="btn btn-primary" disabled={this.input?.trim().length===0}
						onClick={this.onCreate}>创建机构</button>
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
		let unitId = await this.controller.createRootUnit({
			name: this.input.trim(),  
			content: undefined,
			owner: this.controller.user.id
		});
		let header:string = '错误', cn:string = 'text-danger', content:string;
		switch (unitId) {
			default:
				header = '成功';
				cn = 'text-success';
				content = '机构创建成功！';
				break;
			case -1:
				content = '无权创建机构';
				break;
			case -2:
				content = '机构名称已经被使用了';
				break;
		}
		this.openPageElement(<Page header={header} afterBack={()=>this.closePage(3)} back="close">
			<div className={'m-3 ' +  cn}>{content}</div>
		</Page>)
	}
}
