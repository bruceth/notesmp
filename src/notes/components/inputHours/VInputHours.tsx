import React from 'react';
import { CInputHours } from './CInputHours';
import { VBasePage } from '../../views/VBasePage';
import { checkHourMinutes, taskTimeToString } from '../../../notes/model';

export class VInputHours extends VBasePage<CInputHours> {
	protected get back(): 'close' | 'back' | 'none' {return 'close'}

	private hourminutes: number;
	header() {return '输入工时'}

	content() {
		let render = () => {
			return <div>
				<div className="flex-fill ml-2 mr-2 mt-2 "><input className="flex-fill form-control border-0"
					type="text" defaultValue={taskTimeToString(this.controller.hourminutes)}
					placeholder="2.5或者2:30表示两个半小时"
					autoFocus={true}
					onBlur={e=>this.onHoursBlur(e)}
					onChange={e=>this.onHoursChange(e)}/>
				</div>
				<button onClick={() => this.onNext()}
					className="btn btn-primary ml-2 mt-2" >
					确认
				</button>
			</div>
		}
		return React.createElement(render);
	}

	protected onHoursChange = (evt:React.ChangeEvent<HTMLInputElement>) => {
		let m = checkHourMinutes(evt.target.value);
		if (m < 0) {
			m = undefined;
		}
		this.hourminutes = m;
	}

	protected onHoursBlur = (evt: React.FocusEvent<HTMLInputElement>) => {
		if (checkHourMinutes(evt.target.value) < 0) {
			evt.target.value = '';
			this.hourminutes = undefined;
		}
	}

	private onNext = () => {
		let r = this.hourminutes !== undefined ? this.hourminutes : this.controller.hourminutes;
		this.returnCall(r);
	}
}
