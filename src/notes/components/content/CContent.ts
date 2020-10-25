import { Controller } from "../../../tonva";
import { observable } from "mobx";

export abstract class CContent extends Controller {
	@observable changed: boolean = false;
	protected async internalStart() {}
	get isEmpty():boolean { return true; }

	//onContentChanged: () => Promise<void>;
	toString(): string {return};
	protected fromString(v:string):void {};
	
	startInput(): void {
		this.changed = false;
	}
	endInput(obj:any): void {this.buildObj(obj)}
	protected abstract buildObj(obj:any): void;

	abstract renderInput(): JSX.Element;
	abstract renderViewContent(): JSX.Element;
	renderDirContent(): JSX.Element {return this.renderViewContent();}

	reset(content:string) {
		this.fromString(content);
		this.startInput();
		this.changed = true;
	}
}
