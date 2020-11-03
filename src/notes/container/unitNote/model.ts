
export interface BookProject {
	id: number;
	name: string;
	caption: string;
	memo: string;
	ratioX: number;					// ratioX / ratioY 是显示内容值
	ratioY: number;
	readUnit: string;
	$create: Date;
	$update: Date;
	orderNo: number;
}
export interface ReportProject {
	owner: number;
	id: number;
	project: number;
	header: string;
	readUnit: string;
}
export interface BookReport {
	id: number;
	rootUnit: number;
	caption: string;
	projects: ReportProject[];
}

export enum EnumUnitRole {owner=1, admin=2, unitAdmin=4};
export enum EnumPeriod {day=1, week=2, month=3, year=4};
export interface UnitItem {
	id:number; 
	caption:string; 
	content:string;
	role: EnumUnitRole;
	memberCount: number;
}
export interface MemberItem {
	member: number;
	assigned: string;
	discription: string;
	role: EnumUnitRole;
}
export interface ProjectSum {
	project: BookProject;
	debit: number;
	credit: number;
}

export interface UnitProjectsSum {
	unit: UnitItem;
	projectSums: ProjectSum[];
}

export interface MemberProjectsSum {
	member: MemberItem;
	projectSums: ProjectSum[];
}
