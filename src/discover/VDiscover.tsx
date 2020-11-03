import React from 'react';
import { CDiscover } from './CDiscover';
import { VPage, LMR, FA } from '../tonva';

interface Item {
	icon: string;
	caption: string;
	onClick: () => void;
}

export class VDiscover extends VPage<CDiscover> {
	private onTaskReport = () => {
		alert('实现中');
	}

	private onOtherReport = () => {
		alert('实现中');
	}

	private items:(Item|string)[] = [
		{icon: undefined, caption: '任务报表', onClick: this.onTaskReport}, 
		{icon: undefined, caption: '其它报表', onClick: this.onOtherReport}, 
		'-',
		{icon: undefined, caption: '任务报表', onClick: this.onTaskReport}, 
		{icon: undefined, caption: '其它报表', onClick: this.onOtherReport}, 
	];

	header() {return this.t('discover')}
	content() {
		let cn = 'px-3 py-2 cursor-pointer bg-white mb-1';
		let right = <FA name="angle-right" />;
		return <div className="py-3">
			<div>
				<button className="btn btn-primary" onClick={this.testBus}>测试Bus</button>
			</div>

			{this.controller.cBook.renderBook()}

			{this.items.map((v, index) => {
				if (typeof v === 'string') {
					return <div key={index} className="pt-2" />;
				}
				let {icon, caption, onClick} = v;
				let left = <FA name={icon} />;
				return <LMR key={index} className={cn} onClick={onClick} left={left} right={right}>
					{caption}
				</LMR>
			})}
		</div>;
	}

	private testBus = async () => {
		await this.controller.testBus();
	}
}
