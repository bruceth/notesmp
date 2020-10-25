import React from 'react';
import { CMe } from './CMe';
import { Image, VPage, nav, IconText, PropGrid, LMR, FA, Prop } from '../tonva';
import { observer } from 'mobx-react';
import { appConfig } from '../tapp';

export class VMe extends VPage<CMe> {
	header() {return this.t('me')}

	content() {
        const { user } = nav;
        let aboutRows: Prop[] = [
            '',
            {
                type: 'component',
                component: <div className="w-100 d-flex justify-content-between">
                    <IconText iconClass="text-info mr-2" icon="smile-o" text={this.t('aboutTheApp')} />
                    <div className="py-2 small">V{appConfig.version}</div>
                </div>,
            }
        ];

        let rows: Prop[];
        if (user === undefined) {
            rows = aboutRows;
            rows.push(
                {
                    type: 'component',
                    component: <button className="btn btn-success w-100 my-2" onClick={() => nav.logout()}>
                        <FA name="sign-out" size="lg" /> {this.t('pleaseLogin')}
                    </button>
                },
            );
        }
        else {
            let logOutRows: Prop[] = [
                '',
                {
                    type: 'component',
                    bk: '',
                    component: <button className="btn btn-danger w-100" onClick={this.onExit}>
                        <FA name="sign-out" size="lg" /> {this.t('logout')}
                </button>
                },
            ];

            rows = [
                '',
                {
                    type: 'component',
                    component: <this.meInfo />
                },
                '',
                {
                    type: 'component',
                    component: <IconText iconClass="text-info mr-2" icon="key" text={this.t('changePassword')} />,
                    onClick: this.changePassword
                },
            ]
            rows.push(...aboutRows, ...logOutRows);
        }
        return <PropGrid rows={[...rows]} values={{}} />;
	}

	private onExit = () => {
        nav.showLogout();
    }

    private changePassword = async () => {
        await nav.changePassword();
    }

    private meInfo = observer(() => {
        let { user } = nav;
        if (user === undefined) return null;
        let { id, name, nick, icon } = user;
        return <LMR className="py-2 cursor-pointer w-100"
            left={<Image className="w-3c h-3c mr-3" src={icon || '.user-o'} />}
            right={<FA className="align-self-end" name="angle-right" />}
            onClick={this.controller.showEditMe}>
            <div>
                <div>{userSpan(name, nick)}</div>
                <div className="small"><span className="text-muted">ID:</span> {id > 10000 ? id : String(id + 10000).substr(1)}</div>
            </div>
        </LMR>;
    });
}

function userSpan(name: string, nick: string): JSX.Element {
    return nick ?
        <><b>{nick} &nbsp; <small className="muted">{name}</small></b></>
        : <b>{name}</b>
}
