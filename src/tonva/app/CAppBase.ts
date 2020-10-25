import { nav, t, setGlobalRes, RouteFunc, Hooks, Navigo, NamedRoute } from "../components";
import { Controller } from '../vm';
import { UQsMan, TVs } from "../uq";
import { appInFrame } from "../net";
import { centerApi } from "./centerApi";
import { VUnitSelect, VErrorsPage, VStartError, VUnsupportedUnit } from "./vMain";

export interface IConstructor<T> {
    new (...args: any[]): T;
}

export interface AppConfig {
    appName: string;        // 格式: owner/appName
    version: string;        // 版本变化，缓存的uqs才会重载
    tvs: TVs;
    uqNameMap?: {[uqName:string]: string};      // uqName='owner/uq' 映射到内存简单名字：uq, 可以注明映射，也可以自动。有可能重
    loginTop?: JSX.Element;
    oem?: string;               // 用户注册发送验证码的oem厂家，默认同花
	privacy?: string;
	noUnit?: boolean;			// app的运行，不跟unit绑定
	htmlTitle?: string;
}

export interface Elements {
	[id:string]: (element: HTMLElement)=>void,
}

export abstract class CAppBase extends Controller {
	private appConfig: AppConfig;
    protected _uqs: any;

    protected readonly name: string;
	//protected readonly version: string;
	protected readonly noUnit: boolean;

    //readonly uqsMan: UQsMan;
    appUnits:any[];

    // appName: owner/name
    constructor(config?: AppConfig) {
		super(undefined);
		this.appConfig = config || (nav.navSettings as AppConfig);
        let {appName, noUnit} = this.appConfig;
        this.name = appName;
        if (appName === undefined) {
            throw new Error('appName like "owner/app" must be defined in MainConfig');
        }
		this.noUnit = noUnit;
		//this._uqs = UQsMan._uqs;
		//this.version = version;
        //this.uqsMan = new UQsMan(this.name, tvs);
    }

    get uqs(): any {return this._uqs;}

	internalT(str:string):any {
		return t(str);
	}
	
	protected setRes(res:any) {
		setGlobalRes(res);
	}
	
	protected hookElements(elements: Elements) {
		if (elements === undefined) return;
		//nav.setSettings(appConfig);
		//let cApp:CApp = (await start(CApp, appConfig)) as CApp;
		for (let i in elements) {
			let el = document.getElementById(i);
			if (el) {
				elements[i](el);
			}
		}
	};
	
    protected async beforeStart():Promise<boolean> {
        try {
			this.onRoute();
			if (nav.isRouting === false) {
				//await nav.init();
				let {appName, version, tvs} = this.appConfig;
				await UQsMan.load(appName, version, tvs);
			}
			this._uqs = UQsMan._uqs;
		
            //let retErrors = await this.load();
            //let app = await loadAppUqs(this.appOwner, this.appName);
            // if (isDevelopment === true) {
			// 这段代码原本打算只是在程序员调试方式下使用，实际上，也可以开放给普通用户，production方式下
			let retErrors = UQsMan.errors;
            let {predefinedUnit} = appInFrame;
            let {user} = nav;
            if (user !== undefined && user.id > 0) {
				this.appUnits = await centerApi.userAppUnits(UQsMan.value.id);
				if (this.noUnit === true) return true;
                switch (this.appUnits.length) {
                    case 0:
                        this.showUnsupport(predefinedUnit);
						return false;
                    case 1:
                        let appUnit = this.appUnits[0].id;
                        if (appUnit === undefined || appUnit < 0 || 
                            (predefinedUnit !== undefined && appUnit !== predefinedUnit))
                        {
                            this.showUnsupport(predefinedUnit);
                            return false;
                        }
                        appInFrame.unit = appUnit;
                        break;
                    default:
                        if (predefinedUnit>0 && this.appUnits.find(v => v.id===predefinedUnit) !== undefined) {
                            appInFrame.unit = predefinedUnit;
                            break;
                        }
                        this.openVPage(VUnitSelect);
                        return false;
                }
            }
            if (retErrors !== undefined) {
                this.openVPage(VErrorsPage, retErrors);
                return false;
            }
            return true;
        }
        catch (err) {
            this.openVPage(VStartError, err);
            return false;
        }
    }
	protected async afterStart():Promise<void> {
		nav.resolveRoute();
	}

    async userFromId(userId:number):Promise<any> {
        return await centerApi.userFromId(userId);
    }

	protected on(routeFunc:RouteFunc, hooks?:Hooks):Navigo;
	protected on(url:string, routeFunc:RouteFunc, hooks?:Hooks):Navigo;
	protected on(regex:RegExp, routeFunc:RouteFunc, hooks?:Hooks):Navigo;
	protected on(options: {[url:string]: RouteFunc|NamedRoute}):Navigo;
	protected on(...args:any[]):Navigo {
		return nav.on(args[0], args[1], args[2]);
	}

	protected onRoute() {
	}

	/*
    private async load(): Promise<string[]> {
        let {appOwner, appName} = this.uqsMan;
        let {localData} = this.uqsMan;
        let uqAppData:UqAppData = localData.get();
        if (!uqAppData || uqAppData.version !== this.version) {
			uqAppData = await loadAppUqs(appOwner, appName);
			if (!uqAppData.id) {
				return [
					`${appOwner}/${appName}不存在。请仔细检查app全名。`
				];
			}
            uqAppData.version = this.version;
            localData.set(uqAppData);
            // 
            for (let uq of uqAppData.uqs) uq.newVersion = true;
        }
        let {id, uqs} = uqAppData;
        this.uqsMan.id = id;
        await this.uqsMan.init(uqs);
        let retErrors = await this.uqsMan.load();
        if (retErrors.length === 0) {
            retErrors.push(...this.uqsMan.setTuidImportsLocal());
            if (retErrors.length === 0) {
                this._uqs = this.uqsMan.buildUQs();
                return;
            }
        }
        return retErrors;
	}
	*/

    private showUnsupport(predefinedUnit: number) {
        nav.clear();
        this.openVPage(VUnsupportedUnit, predefinedUnit);
    }
}
