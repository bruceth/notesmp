import { CUqApp } from "./CBase";
import { VMain } from "./main";
import { CHome } from "home";
import { CRelation } from "relation";
import { CMe } from "me";
import { CDiscover } from "discover";
import { computed } from "mobx";
import { Contact } from "model";
import { VTestMe } from "./VTestMe";
import { VTestAB } from "./VTestAB";
import { res } from "./res";

const gaps = [10, 3,3,3,3,3,5,5,5,5,5,5,5,5,10,10,10,10,15,15,15,30,30,60];

export class CApp extends CUqApp {
	private timer:any;
	cHome: CHome;
	cRelation: CRelation;
	cDiscover: CDiscover;
	cMe: CMe;

	protected async internalStart(isUserLogin: boolean) {
		this.setRes(res);
		if (isUserLogin === true) await this.initMySetting();
		if (this.isRouting === false) await this.startHome();
	}

	protected async startHome() {
		this.cHome = this.newC(CHome);
		this.cRelation = this.newC(CRelation);
		this.cDiscover = this.newC(CDiscover);
		this.cMe = this.newC(CMe);
		this.cHome.load();
		this.showMain();

		this.timer = setInterval(this.callTick, 1000);
	}

	private async initMySetting() {
		let timezone:number = - (new Date()).getTimezoneOffset() / 60;
		await this.uqs.notes.InitMySetting.submit({timezone}, true);
	}

	protected onDispose() {
		clearInterval(this.timer);
		this.timer = undefined;
	}

	protected async startMe() {
		this.openVPage(VTestMe);
	}

	protected async startAB() {
		this.openVPage(VTestAB);
	}

	protected onRoute() {
		this.on({
			'/a/b': () => {
				// renderDom(<div>/a/b <button onClick={()=>nav.navigate('/c/d')}>test</button></div>)
				this.startAB();
			},
			'/c/d': () => {
				/*
				renderDom(<div>
					/c/d
					<button onClick={()=>nav.navigate('/eeee/a/1?c=1 & d=3')}>test</button>
				</div>)
				*/
			},
			'/eeee/:action/:id': (params:any, queryStr:any) => {
				/*
				let span:any;
				if (queryStr) {
					span = <span>{queryStr}</span>
				}
				renderDom(<div>/e query:{span}  params:{JSON.stringify(params)}</div>)
				*/
			},
			'/bbbb/cccc': () => {
				//renderCApp(new CAppBBBBCCCC());
				this.startMe();
			},
		});
		this.on(() => {
			//renderCApp(new CApp());
			this.startHome();
		});
	}


	@computed get contacts(): Contact[] {return this.cRelation.contacts;};

	async loadRelation() {
		await this.cRelation.load();
	}

    private showMain(initTabName?: string) {
        this.openVPage(VMain, initTabName, this.dispose);
	}

	private tick = 0;
	private gapIndex = 0;
	private callTick = async () => {
		try {
			if (!this.user) return;
			++this.tick;
			if (this.tick<gaps[this.gapIndex]) return;
			//console.error('tick ', new Date());
			this.tick = 0;
			if (this.gapIndex < gaps.length - 1) ++this.gapIndex;
			let ret = await this.uqs.notes.$Poked.query(undefined, false);
			let v = ret.ret[0];
			if (v === undefined) return;
			if (!v.poke) return;
			this.gapIndex = 1;

			// uq 里面加入这一句，会让相应的$Poked查询返回poke=1：
			// TUID [$User] ID (member) SET poke=1;
			// 这个地方重新调入的数据
			this.cHome.refresh();
		}
		catch {
		}
	}
}
