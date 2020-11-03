import { observable } from "mobx";
import _ from 'lodash';
import { EnumNoteType } from "../../../../notes/model";
import { renderIcon } from "../../../../notes/noteBase";
import { CUqBase } from "../../../../tapp";
import { VRootProjects } from "./VRootProjects";
import { VUnitProjects } from "./VUnitProjects";
import { VReportsAdmin } from "./VReportsAdmin";
import { VAdminBase, VUnitAdmin, VRootAdmin } from "./VUnitAdmin";
import { BookProject, BookReport, EnumUnitRole, MemberItem, UnitItem } from "../model";

export class CAdminBase  extends CUqBase {
	isChanged: boolean = false;
	root: UnitItem;
	parent: UnitItem;
	@observable unit: UnitItem;
	@observable units:UnitItem[];
	@observable members:MemberItem[];

	protected async internalStart() {}
	init(root:UnitItem, parent:UnitItem, unit:UnitItem) {
		this.root = root;
		this.parent = parent;
		this.unit = unit;
	}

	get type():EnumNoteType { return EnumNoteType.unitNote }
	renderIcon(): JSX.Element {return renderIcon('sitemap', 'text-primary');}
	renderDirItem(index: number): JSX.Element {return;}
	showAddPage() {}
	showEditPage() {}

	protected getVUnitAdmin(): new (controller: any) => VAdminBase<any> { return VUnitAdmin; }

	async showViewPage(afterBack: (isChanged:boolean) => void) {
		let unitNote = -this.unit.id;
		let result = await this.uqs.notes.GetUnit.query({unitNote});
		this.unit = result.ret[0];
		if (this.unit === undefined) {
			debugger;
			throw new Error('not unit for note=' + unitNote);
		}
		this.units = result.units;
		this.members = this.moveOwnerMemberToTop(result.members);
		this.openVPage(this.getVUnitAdmin(), undefined, afterBack);
	}

	private moveOwnerMemberToTop(members: MemberItem[]):MemberItem[] {
		let ret:MemberItem[] = [];
		let pOwner = 0, pAdmin = 0;
		for (let member of members) {
			let {role} = member;
			if ((role & EnumUnitRole.owner) === EnumUnitRole.owner) {
				ret.splice(pOwner, 0, member);
				pOwner++;
				pAdmin++;
				continue;
			}
			if ((role & EnumUnitRole.admin) === EnumUnitRole.admin) {
				ret.splice(pAdmin, 0, member);
				pAdmin++;
				continue;
			}
			ret.push(member);
		}
		return ret;
	}

	async showUnitAdmin(unitItem: UnitItem) {
		let cUnitAdmin = new CUnitAdmin(this.cApp);
		cUnitAdmin.init(this.root, this.unit, unitItem);
		await cUnitAdmin.showViewPage(() => {
			let {isChanged} = cUnitAdmin;
			if (isChanged) this.isChanged = isChanged;
		});
	}

	async createUnit(unitName: string):Promise<number> {
		let result = await this.uqs.notes.CreateUnit.submit({
			parent: this.parent.id, //.unitNoteId, 
			name: unitName,
			content: undefined,
		});
		let {id} = result;
		if (id > 0) {
			this.units.push({
				id,
				caption: unitName,
				content: undefined,
				role: 7,
				memberCount: 0,
			})
		}
		this.isChanged = true;
		return id;
	}

	async setUnitName(unitName:string) {
		await this.uqs.notes.SetUnitName.submit({unit: this.unit.id, name: unitName});
		this.parent.caption = unitName;
		this.isChanged = true;
	}

	async addMember(userId:number, assigned:string, discription:string) {
		await this.uqs.notes.AddUnitMember.submit({
			unit: this.unit.id,
			member: userId,
			assigned,
			discription
		});
		this.members.push({
			member: userId,
			assigned,
			discription,
			role: 0,
		});
		this.isChanged = true;
	}

	async setUnitMemberAdmin(member:MemberItem, isAdmin: boolean) {
		let roleMask = EnumUnitRole.admin | EnumUnitRole.unitAdmin;
		let role = isAdmin ? roleMask : 0;
		await this.uqs.notes.SetUnitMemberRole.submit({
			unit:this.unit.id, member:member.member, roleMask, role
		});
		member.role &= ~roleMask;
		member.role |= role;
		this.isChanged = true;
	}

	async setUnitMemberProp(member:MemberItem, prop:string, value:string) {
		await this.uqs.notes.SetUnitMemberProp.submit({
			unit:this.unit.id, member:member.member, prop, value
		});
		(member as any)[prop] = value;
		this.isChanged = true;
	}

	rootProjects: BookProject[];
	@observable unitedProjects: BookProject[];
	@observable unitableProjects: BookProject[];
	private async loadUnitProjects() {
		let results = await this.uqs.notes.GetUnitProjects.query({
			rootUnit: this.root.id, 
			unit:this.unit.id
		});
		let projects:BookProject[] = results.ret;
		this.rootProjects = projects;
		let unitedProjects:BookProject[] = [];
		let unitableProjects:BookProject[] = [];
		for (let project of projects) {
			let {orderNo} = project;
			if (orderNo > 0) {
				unitedProjects.push(project);
			}
			else {
				unitableProjects.push(project);
			}
		}
		if (unitedProjects.length === 0) {
			for (let i=0; i<projects.length; i++) {unitableProjects[i].orderNo = i+1};
			unitedProjects = unitableProjects;
			unitableProjects = [];
		}
		this.unitedProjects = unitedProjects;
		this.unitableProjects = unitableProjects;
	}
	showUnitProjects = async () => {
		await this.loadUnitProjects();
		this.openVPage<CAdminBase>(VUnitProjects);
	}

	setProjectDisplay = async (project: BookProject, display: boolean) => {
		let from: BookProject[], to: BookProject[];
		if (display === true) {
			from = this.unitableProjects;
			to = this.unitedProjects;
			project.orderNo = this.unitedProjects.length + 1;
		}
		else {
			from = this.unitedProjects;
			to = this.unitableProjects;
			project.orderNo = undefined;
		}
		let index = from.findIndex(v => v === project);
		if (index >= 0) {
			from.splice(index, 1);
			to.push(project);
		}
		await this.setUnitProjects();
	}
	setProjectDown = async (index: number) => {
		let arr = this.unitedProjects.splice(index, 1);
		this.unitedProjects.splice(index+1, 0, ...arr);
		await this.setUnitProjects();
	}
	setProjectUp = async (index: number) => {
		let arr = this.unitedProjects.splice(index, 1);
		this.unitedProjects.splice(index-1, 0, ...arr);
		await this.setUnitProjects();
	}

	private async setUnitProjects() {
		let param = {
			unit: this.unit.id, 
			projects: this.unitedProjects.map(v => ({project: v.id, orderNo: v.orderNo}))
		}
		await this.uqs.notes.SetUnitProjects.submit(param);
	}
}

export class CUnitAdmin extends CAdminBase {
}

export class CRootAdmin extends CAdminBase {
	project: BookProject;
	@observable bookProjects: BookProject[];
	report: BookReport;
	@observable bookReports: BookReport[];

	protected getVUnitAdmin(): new (controller: any) => VAdminBase<any> { return VRootAdmin; }

	private async loadBookProjects() {
		let results = await this.uqs.notes.GetRootUnitProjects.query({rootUnit: this.unit.id});
		this.bookProjects = results.ret;
	}
	showRootProjects = async () => {
		await this.loadBookProjects();
		this.openVPage(VRootProjects);
	}
	async saveBookProject(data: any) {
		let id = this.project?.id;
		data.rootUnit = this.unit.id;
		let ret = await this.uqs.notes.BookProject.save(id, data);
		data.id = ret.id;
		if (this.project) {
			_.merge(this.project, data);
		}
		else {
			this.bookProjects.push(data);
		}
	}

	private async loadBookReports() {
		let results = await this.uqs.notes.GetRootUnitReports.query({rootUnit: this.unit.id});
		this.bookReports = results.ret;
	}
	showDesignReports = async () => {
		await this.loadBookReports();
		this.openVPage(VReportsAdmin);
	}
	async saveBookReport(data: any) {
		let id = this.report?.id;
		data.rootUnit = this.unit.id;
		let ret = await this.uqs.notes.BookReport.save(id, data);
		data.id = ret.id;
		if (this.report) {
			_.merge(this.report, data);
		}
		else {
			this.bookReports.push(data);
		}
	}

	changeReportName = async (caption: string) => {
		this.report.caption = caption;
	}
}
