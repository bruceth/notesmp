import React from 'react';
import { VPage, User, Image, UserView, CBase } from "../../tonva";
import { Contact } from 'model';

export abstract class VBasePage<T extends CBase> extends VPage<T> {
	protected renderContact = (userId:number, assigned:string) => {
		let renderUser = (user:User) => {
			let {name, nick, icon} = user;
			return <>
				<Image className="w-1-5c h-1-5c mr-2" src={icon || '.user-o'} />
				{assigned || nick || name}
			</>
		}
		return <UserView user={userId as number} render={renderUser} />;
	}

	protected renderContactItem = (item:Contact, index:number) => {
		let {contact, assigned} = item;
		return <div className="px-3 py-2">
			{this.renderContact(contact, assigned)}
		</div>;
	}

	protected renderSelectedContact(contacts:Contact[]) {
		return contacts.map((c, index) => {
			let {contact, assigned} = c;
			return <span key={index} className="mr-3">{this.renderContact(contact, assigned)}</span>;
		});
	}
}
