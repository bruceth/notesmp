import React from 'react';
import { CApp } from "./CApp";
import { VPage } from "../tonva";
import { VTestMe } from './VTestMe';

export class VTestAB extends VPage<CApp> {
	header() {return 'VTestAB'}
	content() {
		return <div>
			VTestAB
			<button onClick={()=>this.go(()=>this.openVPage(VTestMe), '/bbbb/cccc')}>To Me</button>
		</div>;
	}
}
