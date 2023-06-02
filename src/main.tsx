import { createRoot } from 'react-dom/client';
import styled from 'styled-components';
import jsonp from 'jsonp';

const closeConnpass2GaroonPopup = () => {
    const popup = document.getElementById('connpass2garoon-popup') as HTMLElement;
    popup.ariaHidden = 'true';
    popup.style.display = 'none';
}

// ポップアップの処理
// 1. イベントURLからイベントIDを抽出する
// 2. connpass APIを叩いてイベント情報を取得する
// 3. garoon APIを叩いて予定を登録する
const handleRegister = () => {
    const eventUrl = document.getElementById('connpass-event-url') as HTMLInputElement;
    if (eventUrl.value === '') {
        alert('イベントURLを入力してください。');
        return;
    }
    const eventId = eventUrl.value.match(/https:\/\/.*\.?connpass.com\/event\/(\d+)\//)?.[1];
    if (! eventId) {
        alert('イベントURLが正しくありません。');
        return;
    }
    const connpassUrl = `https://connpass.com/api/v1/event/?event_id=${eventId}`;
    const token = garoon.base.request.getRequestToken();
    const loginUser = garoon.base.user.getLoginUser();
    jsonp(connpassUrl, {param: 'callback'}, (err, data) => {
        if (err) {
            alert('エラーが発生しました。: ' + err);
            return;
        }
        if (data.events.length === 0) {
            alert('Connpassイベントの取得に失敗しました。イベントURLが正しいか確認してください。');
            return;
        }

        data.events.forEach((event: any) => {
            const title = event.title;
            const eventUrl = event.event_url;
            const startedAt = event.started_at;
            const endedAt = event.ended_at;

            const body = {
                "__REQUEST_TOKEN___": token,
                "eventType": "REGULAR",
                "subject": title,
                "notes": eventUrl,
                "start": {
                    "dateTime": startedAt,
                    "timeZone": "Asia/Tokyo"
                },
                "end": {
                    "dateTime": endedAt,
                    "timeZone": "Asia/Tokyo"
                },
                attendees: [
                    {
                        "type": "USER",
                        "id": loginUser.garoonId,
                    }
                ]
            };

            garoon.api("/api/v1/schedule/events", "POST", body).then((res) => {
                alert('予定を登録しました。');
                closeConnpass2GaroonPopup();
            }).catch((err) => {
                alert('登録に失敗しました。: ' + err);
            });
        });
    });
}

const RegisterPopup = () => {
    return (
        <SPopup key='popup' id='connpass2garoon-popup' aria-hidden='true'>
            <p>ConnpassイベントをGaroonの予定に登録します。</p>
            <p>登録するConnpassイベントのURLを入力してください。</p>
            <div style={{paddingBottom: '16px'}}>
                <input type="text" style={{width: '350px'}} id="connpass-event-url" placeholder="https://connpass.com/.../"></input>
            </div>
            <Sbutton onClick={handleRegister}>登録する</Sbutton>
        </SPopup>
    );
}

const SPopup = styled.div`
    position: absolute;
    width: fit-content;
    padding: 8px 16px;
    display: none;
    background-color: white;
`;

const Sbutton = styled.button`
    color: #fff;
    background-color: #0e74dd;
    padding: 6px 12px;
    height: fit-content;
`;

// popup以外をクリックしたら閉じる
document.addEventListener('click', (e) => {
    const el = e.target as HTMLElement;
    if (! el.closest('.cloudHeader-connpass2garoon')) {
        closeConnpass2GaroonPopup();
    }
});

// ヘッダーアイコンの処理
// クリックしたらポップアップを表示する
const handleButtonClick = () => {
    const popup = document.getElementById('connpass2garoon-popup') as HTMLElement;
    popup.ariaHidden = 'false';
    popup.style.display = 'block';
}

const StyledButton = () => {
    return (
        <SButton key='connpass2garoon-button' onClick={handleButtonClick}>
            <span className="material-icons" style={{color: 'white', fontSize: '30px'}}>explore</span>
        </SButton>
    );
}

const SButton = styled.button`
    border: none;
    padding: 10px 12px;
    height: 48px;
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0);
    &:hover {
        border: none;
        background-color: #666;
    }
`;

// ヘッダーにアイコンを追加する
const header = document.getElementsByClassName('header_left_area_grn')[0] as HTMLElement;
const rootDiv = document.createElement('div');
rootDiv.className = 'cloudHeader-dropdownMenu-grn cloudHeader-connpass2garoon';
rootDiv.style.display = 'inline-block';
rootDiv.style.position = 'relative';
header.appendChild(rootDiv);

const root = createRoot(rootDiv);
const button = StyledButton();
const popup = RegisterPopup();
root.render([button, popup]);
