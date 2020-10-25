import { CRelation } from "./CRelation";
import { VAddContact } from "../tool";

export class VAdd extends VAddContact<CRelation> {
	protected async addContact():Promise<void> {
		await this.controller.AddContact(this.user.id);
	}
}
