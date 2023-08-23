import EventBus from "./EventBus"
import fireBase from "firebase"

// import '@firebase/messaging';

const sound = require("@/assets/beep_sms.mp3")
export default async function firebaseInitialize(document) {

    var firebaseConfig = {
        apiKey: "AIzaSyDIhAKJkCDUpqyecAEZc3XscAfu_tGDZlE",
        authDomain: "accountingbot-3b1a3.firebaseapp.com",
        projectId: "accountingbot-3b1a3",
        storageBucket: "accountingbot-3b1a3.appspot.com",
        messagingSenderId: "462698867283",
        appId: "1:462698867283:web:e4729b62f9b05180deb4a6",
        measurementId: "G-DM9LK7FFGN"
    }
    firebase.initializeApp(firebaseConfig)
    const messaging = firebase.messaging()
    messaging
        .requestPermission()
    messaging.getToken({
        vapidKey: 'BJJPRA_1UdROBLcx7T_0He7rqqha9-h-qt5-tPKY2Cvos3lCuDe-1eTTQZktRZMMSIcaoAInq2WwCtMU4zqM1ms'
    }).then((currentToken) => {
        if (currentToken) {
            // console.log('currentToken', currentToken)
            localStorage.setItem('firebaseToken', currentToken)
        } else {
            console.log('No registration token  . Request permission to generate one.');
        }
    }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
    });


    messaging.onMessage(async function (payload) {
        try {
            let { title, body } = payload.notification
            body = JSON.parse(body)
            const { auth } = JSON.parse(await localStorage.getItem("vuex"))
            if (auth.authToken) {
                if (auth.workspaces.filter(workspace => workspace.workspace_id == body.workspace_id).length) {
                }
            }
        } catch (error) {
            console.log('error', error.message)
        }
    });
}