import { CSub, CBase, CAppBase, IConstructor } from '../tonva';
import { UQs } from './uqs';
import { CApp } from './CApp';

export abstract class CUqBase extends CBase {
    get cApp(): CApp { return this._cApp; }
    protected get uqs(): UQs { return this._uqs as UQs };
}

export abstract class CUqSub<T extends CUqBase> extends CSub<T> {
    get cApp(): CApp { return this._cApp; }
    protected get uqs(): UQs { return this._uqs as UQs };
    get owner(): T { return this._owner as T }
}

export abstract class CUqApp extends CAppBase {
    get uqs(): UQs { return this._uqs };

    protected newC<T extends CUqBase>(type: IConstructor<T>): T {
		let c = new type(this);
		c.init();
		return c;
    }
}
