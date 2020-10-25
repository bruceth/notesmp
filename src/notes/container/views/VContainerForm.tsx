import { CContainer } from '../CContainer';
import { VNoteBaseEdit } from '../../../notes/noteBase';

export abstract class VContainerForm<T extends CContainer> extends VNoteBaseEdit<T> {
	header() {
		return this.t('noteFolder');
	}

	protected renderContent():JSX.Element {
		return this.controller.cContent.renderInput()
	}

}

/*
export abstract class VContainerForm<T extends CContainer> extends VNoteBaseView<T> {
	@observable private changed: boolean = false;
	private inputAdd: HTMLInputElement;

	header() {return this.t('notes')}

	protected onTitleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
		this.controller.title = evt.target.value.trim();
	}

	protected onContentChange = (evt:React.ChangeEvent<HTMLTextAreaElement>) => {
		this.controller.changedNoteContent = evt.target.value;
	}

	@computed protected get btnSaveDisabled():boolean {
		if (this.changed === true) return false;
		return this.getSaveDisabled();
	}

	protected abstract getSaveDisabled():boolean;

	protected abstract onButtonSave(): Promise<void>;

	protected async onDelete(): Promise<void> {
		let options: ConfirmOptions = {
			caption: '请确认',
			message: '真的要删除这个小单吗？',
			yes: '确认删除',
			no: '不删除'
		};
		if (await this.controller.confirm(options) === 'yes') {
			await this.controller.owner.hideNote(this.controller.noteItem.note, 1);
			this.closePage(2);
		}
	}

	protected renderDeleteButton() {
		return <button className="btn btn-outline-secondary mr-3" onClick={() => this.onDelete()}>
			删除
		</button>;
	}

	protected abstract renderExButtons():JSX.Element;

	protected renderEdit() {
		return <div className="m-2">
			<div className="border rounded">
				<div className="bg-white">
					<div className="py-1 px-1 border-bottom">
						<input type="text" className="w-100 border-0 form-control font-weight-bold" placeholder="标题" maxLength={80}
							onChange={this.onTitleChange}
							defaultValue={this.controller.title} />
					</div>
					<div className="py-1 px-1">
						{React.createElement(observer(() => this.renderContentTextArea()))}
					</div>
				</div>
				<div className="py-2 pl-3 bg-light border-top d-flex">
					<div className="mr-auto" />
					{React.createElement(observer(() => <>
						<button onClick={() => this.onButtonSave()}
							className="btn btn-primary mr-3" disabled={this.btnSaveDisabled}>
							保存
						</button>
					</>))}
					{this.renderExButtons()}
				</div>
			</div>
		</div>;
	}

	private renderContentTextArea() {
		return <textarea rows={10} 
			className="w-100 border-0 form-control" 
			placeholder={this.t('notes')} maxLength={20000}
			defaultValue={this.controller.noteContent}
			onChange={this.onContentChange} />;
	}
}
*/