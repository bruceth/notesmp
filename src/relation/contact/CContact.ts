import { CUqSub } from "../../tapp"
import { observable } from "mobx";
import { Contact } from "model";
import { CRelation } from "../CRelation";
import { VContact } from "./VContact";
import { VEditAssigned } from "./VEditAssigned";

export class CContact extends CUqSub<CRelation> {
	protected async internalStart() {}
	@observable contact: Contact;

	init(param:Contact):void {
		this.contact = {...param};
	}

	async SaveContactAssign(value:string) {
		await this.owner.SaveContactAssign(this.contact, value);
		this.contact.assigned = value;
	}

	async showContact() {
		this.openVPage(VContact);
	}

	async onEditAssigned() {
		this.openVPage(VEditAssigned);
	}
}