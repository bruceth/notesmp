export interface TaskCheckItemBase {
	key: number;
	text: string;
	checked?: boolean;
}

export interface TaskCheckItem extends TaskCheckItemBase {
	checkInfo?: string;
	rateInfo?: string;
}
