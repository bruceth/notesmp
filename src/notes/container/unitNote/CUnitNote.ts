import { observable } from "mobx";
import { EnumNoteType } from "../../../notes/model";
import { renderIcon } from "../../../notes/noteBase";
import { Tuid } from "../../../tonva";
import { CContainer } from "../CContainer";
import { CRootAdmin, CUnitAdmin } from "./admin";
import { EnumPeriod, MemberItem, MemberProjectsSum, ProjectSum, UnitItem, UnitProjectsSum } from "./model";
import { VUnitNoteDir } from "./VUnitNoteDir";
import { VUnitNoteView } from "./VUnitNoteView";

export class CUnitNote extends CContainer {
	unit: UnitItem;
	@observable units:UnitItem[];
	@observable members:MemberItem[];
	cUnitAdmins: CUnitAdmin[] = [];
	curUnitAdmin: CUnitAdmin;
	isChanged: boolean = false;
	@observable unitProjectsSums: UnitProjectsSum[];
	@observable memberProjectsSums: MemberProjectsSum[];
	@observable myProjectsSum: MemberProjectsSum;

	get type():EnumNoteType { return EnumNoteType.unitNote }
	renderIcon(): JSX.Element {
		return renderIcon('sitemap', 'text-primary');
	}

	renderDirItem(index: number): JSX.Element {
		let vNoteItem = new VUnitNoteDir(this);
		return vNoteItem.render();
	}

	showAddPage() {
		//this.openVPage(VFolderMyAdd);
	}
	showEditPage() {
		//this.openVPage(VFolderMyEdit);
	}

	private async loadUnits() {
		let unitNote = this.noteItem.note;
		let result = await this.uqs.notes.GetUnit.query({unitNote});
		this.unit = result.ret[0];
		if (this.unit === undefined) {
			debugger;
			throw new Error('not unit for note=' + unitNote);
		}
		this.units = result.units;
		this.members = result.members;
	}

	async loadMySum(period: EnumPeriod) {
		let results = await this.uqs.notes.GetMySum.query({
			unit:this.unit.id,
			at: undefined,
			period, 			// 1=day, 2=week, 3=month, 4=year							
		});
		let {projects, sum} = results;
		this.myProjectsSum = this.buildMyProjectsSum(sum, projects);
	}

	private async loadProjectsSum(period: EnumPeriod) {
		let results = await this.uqs.notes.GetUnitSum.query({
			unit:this.unit.id,
			at: undefined,
			period, 			// 1=day, 2=week, 3=month, 4=year							
		});
		let {projects, subSum, memberSum} = results;
		this.unitProjectsSums = this.buildUnitProjectsSums(subSum, projects);
		this.memberProjectsSums = this.buildMemberProjectsSums(memberSum, projects);
	}

	private buildUnitProjectsSums(unitSums:any[], projects:any[]):UnitProjectsSum[] {
		let unitProjectsSum:UnitProjectsSum = undefined;
		let unitProjectsSums:UnitProjectsSum[] = [];
		for (let subRow of unitSums) {
			let {unit, project, debit, credit} = subRow;
			let projectSums: ProjectSum[];
			if (unitProjectsSum === undefined || unitProjectsSum.unit.id !== unit) {
				let unitItem = this.units.find(v => v.id === unit);
				if (unitItem === undefined) break;
				projectSums  = projects.map((v:any) => ({project:v, debit:undefined, credit:undefined}));
				unitProjectsSum = {
					unit: unitItem,
					projectSums
				}
				unitProjectsSums.push(unitProjectsSum);
			}
			else {
				projectSums = unitProjectsSum.projectSums;
			}
			let projectSum = projectSums.find(v => v.project.id === project);
			if (projectSum !== undefined) {
				projectSum.debit = debit;
				projectSum.credit = credit;
			}
		}
		return unitProjectsSums;
	}

	private buildMemberProjectsSums(memberSums:any[], projects:any[]):MemberProjectsSum[] {
		let memberProjectsSum:MemberProjectsSum = undefined;
		let memberProjectsSums = [];
		for (let memberSum of memberSums) {
			let {member, project, debit, credit} = memberSum;
			let projectSums: ProjectSum[];
			if (memberProjectsSum === undefined || Tuid.equ(memberProjectsSum.member.member, member) === false) {
				let memberItem = this.members.find(v => Tuid.equ(v.member, member));
				if (memberItem === undefined) break;
				projectSums  = projects.map((v:any) => ({project:v, debit:undefined, credit:undefined}));
				memberProjectsSum = {
					member: memberItem,
					projectSums
				}
				memberProjectsSums.push(memberProjectsSum);
			}
			else {
				projectSums = memberProjectsSum.projectSums;
			}
			let projectSum = projectSums.find(v => v.project.id === project);
			if (projectSum !== undefined) {
				projectSum.debit = debit;
				projectSum.credit = credit;
			}
		}
		return memberProjectsSums;
	}

	private buildMyProjectsSum(mySums:any, projects:any[]):MemberProjectsSum {
		let memberItem = this.members.find(v => Tuid.equ(v.member, this.user.id));
		let projectSums: ProjectSum[] = projects.map((v:any) => ({project:v, debit:undefined, credit:undefined}));
		let memberProjectsSum:MemberProjectsSum = {
			member: memberItem,
			projectSums
		}
		for (let sum of mySums) {
			let {project, debit, credit} = sum;
			let projectSum = projectSums.find(v => v.project.id === project);
			if (projectSum !== undefined) {
				projectSum.debit = debit;
				projectSum.credit = credit;
			}
		}
		return memberProjectsSum;
	}

	async showFolder() {
		await this.loadUnits();
		await this.loadMySum(EnumPeriod.day);
		await this.loadProjectsSum(EnumPeriod.day);
		this.openVPage(VUnitNoteView);
	}

	async showRootAdmin() {
		this.curUnitAdmin = new CRootAdmin(this.cApp);
		this.curUnitAdmin.init(this.unit, undefined, {
			id: -this.noteItem.note,
		} as any);
		await this.curUnitAdmin.showViewPage(() => {
			let {isChanged} = this.curUnitAdmin;
			if (isChanged) {
				this.units = undefined;
				this.loadUnits();
			}
		});
	}
}
