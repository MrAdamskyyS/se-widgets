let fieldData;

const mainContainer = document.getElementById('main-container');
const jailed = document.getElementById('jailed');
const bars = document.getElementById('bars');
const sound = document.getElementById('sound');

const hideJail = () => {
    mainContainer.className = 'main-container hidden';
    bars.className = 'bars';
};

const jailUser = (user) => {
    hideJail();
    cooldownTimeout = setTimeout(() => {
        cooldownTimeout = undefined;
    },fieldData.cooldown * 1000);
    return new Promise((resolve) => {
        fetch(`https://decapi.me/twitch/avatar/${user}`)
            .then((data) => {
                data.text().then((img) => {
                    jailed.src = img;
                    mainContainer.className = 'main-container';
                    setTimeout(() => {
                        bars.className = 'bars animate';
                        sound.play();
                        setTimeout(() => {
                            hideJail();
                        }, fieldData.howLongSeconds * 1000);
                    }, 1000);
                }).catch(() => {
                    resolve();
                });
            })
            .catch(() => {
                resolve();
            });
    });

};

let cooldownTimeout;

const handleMessage = (obj) => {
    const jailWords = (fieldData.jailWords || '').split(',');
    const data = obj.detail.event.data;
    const {text, displayName} = data;
    const words = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,'').split(' ');
    const shouldGoToJail = words.some(word => jailWords.includes(word.toLowerCase()));
    if(!shouldGoToJail || cooldownTimeout){
        return;
    }
    jailUser(displayName);
};

window.addEventListener('onEventReceived', function (obj) {
    if (obj.detail.listener !== "message") {
        return;
    }
    handleMessage(obj);
});

window.addEventListener('onWidgetLoad', function (obj) {
    fieldData = obj.detail.fieldData;
});

