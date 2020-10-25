import { Entity } from "./entity";

interface TagValue {
	id: number;
	name: string;
	ext: string;
}

export class Tag extends Entity {
    get typeName(): string { return 'tag';}
	values: TagValue[];

	async loadValues():Promise<TagValue[]> {
		if (this.values !== undefined) return this.values;
		this.values = [];
		let ret = await this.uqApi.get('tag/values/' + this.name);
		if (ret === undefined) return;
		let lines = (ret as string).split('\n');
		for (let line of lines) {
			if (line.length === 0) continue;
			let parts = line.split('\t');
			this.values.push({
				id: Number(parts[0]),
				name: parts[1],
				ext: parts[2],
			})
		}
		return this.values;
	}
}
