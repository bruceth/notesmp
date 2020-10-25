import { CUqBase } from "../../../tapp";
import { VInputHours } from "./VInputHours";

export class CInputHours extends CUqBase {
	hourminutes: number;

	protected async internalStart():Promise<void> {
		this.openVPage(VInputHours);
	}

	async inputHours(h?:number) {
		this.hourminutes = h;
		return await this.vCall(VInputHours);
	}
}
