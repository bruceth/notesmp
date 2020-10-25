import { Controller } from "../vm";
import { IConstructor } from "./CAppBase";

export abstract class CBase extends Controller {
    protected readonly _uqs: any;
    protected readonly _cApp: any;

    constructor(cApp: any) {
        super(cApp.res);
        this._cApp = cApp;
        this._uqs = cApp && cApp.uqs;
	}

    protected get uqs(): any {return this._uqs}
	get cApp(): any {return this._cApp}

	internalT(str:string):any {
		let r = super.internalT(str);
		if (r!==undefined) return r;
		return this._cApp.internalT(str);
	}

    protected newC<T extends CBase>(type: IConstructor<T>, param?:any):T {
		let c = new type(this.cApp);
		c.init(param);
		return c;
    }

    protected newSub<O extends CBase, T extends CSub<O>>(type: IConstructor<T>, param?:any):T {
		let s = new type(this);
		s.init(param);
		return s;
    }
}

export abstract class CSub<T extends CBase> extends CBase {
    protected _owner: T;

    constructor(owner: T) {
        super(owner.cApp);
        this._owner = owner;
	}

	internalT(str:string):any {
		let r = super.internalT(str);
		if (r!==undefined) return r;
		return this._owner.internalT(str);
	}

    protected get owner(): CBase {return this._owner}
}
