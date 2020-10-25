import React from "react";
import { CContact } from "./CContact";
import { VPage, UserView, Image, FA, Muted, User } from "../../tonva";
import { observer } from "mobx-react";

export class VContact extends VPage<CContact> {

	init(param:any) {
	}

	header() {
		return ' ';
	}

	private onEditAlias = () => {
		this.controller.onEditAssigned();
	}

	content() {
		let renderUser = (user:User) => {
			let {id, name, nick, icon} = user;
			let { assigned } = this.controller.contact;
			return <div className="p-3 d-flex">
				<Image className="w-3c h-3c mr-4" src={icon || '.user-o'} />
				<div>
					<div className="h6"><b>{assigned || nick || name}</b></div>
					<div><Muted>id: </Muted>{id}</div>
					<div><Muted>用户名: </Muted>{name}</div>
					{nick && <div><Muted>别名: </Muted>{nick}</div>}
				</div>
			</div>
		}
		let { contact } = this.controller.contact;
		let cn = 'px-3 py-2 bg-white d-flex align-items-center border-bottom cursor-pointer';
		return <div>
			<UserView user={contact as number} render={renderUser} />
			{
				React.createElement(observer(() =>
				<div className={cn}  onClick={this.onEditAlias}>
					<div className="text-muted mr-3 w-4c">备注名</div>
					<div className="flex-fill w-100 border-0 form-control mr-auto">{this.controller.contact.assigned || <Muted>[无]</Muted>}</div>
					<FA name="angle-right" />
				</div>))
			}
		</div>;
	}
}