import { CUqBase } from "../tapp";
import { QueryPager, User } from "../tonva";
import { VAdmin } from "./VAdmin";
import { VEditMe } from "./VEditMe";
import { VMe } from "./VMe";

export interface RootUnitItem {
	id: number;					// root unit id
	owner: any;
	name: string;				// 唯一
	content: string;
	tonvaUnit: number;			// 跟tonva机构对应的值
	x: number;
}

export class CMe extends CUqBase {
	role: number;
	unitOwner: User;
	rootUnits: QueryPager<any>;

    protected async internalStart() {
	}

	tab = () => this.renderView(VMe);

	showEditMe = async () => {
		let result = await this.uqs.notes.GetSystemRole.query({});
		this.role = result.ret[0]?.role;
		this.openVPage(VEditMe);
	}

	showAdmin = async () => {
		this.rootUnits = new QueryPager<any>(this.uqs.notes.GetRootUnits, undefined, undefined, true);
		this.rootUnits.first({});
		this.openVPage(VAdmin);
	}

	async createRootUnit(param: {name:string; content:string; owner:number}): Promise<number> {
		let result = await this.uqs.notes.CreateRootUnit.submit(param);
		return result.id;
	}

	async changeRootUnitName(item:RootUnitItem, name:string) {
		await this.uqs.notes.ChangeRootUnitProp.submit({unit:item.id, prop:'name', value: name})
		item.name = name;
	}

	async changeRootUnitTonva(item:RootUnitItem, tonvaUnit:any) {
		await this.uqs.notes.ChangeRootUnitProp.submit({unit:item.id, prop:'tonvaUnit', value: tonvaUnit})
		item.tonvaUnit = tonvaUnit;
	}

	async changeRootUnitX(item:RootUnitItem, x:number) {
		await this.uqs.notes.ChangeRootUnitProp.submit({unit:item.id, prop:'x', value: x})
		item.x = x;
	}
}
