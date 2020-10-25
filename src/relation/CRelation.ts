import { CUqBase } from "../tapp";
import { VRelation } from "./VRelation";
import { observable } from "mobx";
import { Contact } from "model";
import { CContact } from "./contact";

export class CRelation extends CUqBase {
	private loaded: boolean = false;
	@observable contacts: Contact[] = [];

    protected async internalStart() {
	}

	tab = () => this.renderView(VRelation);

	load = async () => {
		if (this.loaded === true) return;
		let ret = await this.uqs.notes.GetMyContacts.page({}, 0, 500, true);
		this.contacts.push(...ret['$page']);
		this.loaded = true;
	}

	async AddContact(contact: number) {
		await this.uqs.notes.AddContact.submit({contact});
		this.contacts.unshift({contact, assigned:undefined});
	}

	async onShowContact(item:Contact) {
		let cc = this.newSub(CContact, item);
		cc.showContact();
	}

	async SaveContactAssign(item:Contact, value:string) {
		let param = {contact:item.contact, assigned:value};
		await this.uqs.notes.SetContactAssinged.submit(param);
		let c = this.contacts.find(v=>v.contact === item.contact);
		if (c !== undefined) {
			c.assigned = value;
		}
	}
}
