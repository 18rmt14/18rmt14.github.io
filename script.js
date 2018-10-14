'use strict';

let localStream = null;
let peer = null;
let existingCall = null;

navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(function (stream) {
        //success
        $('#my-video').get(0).srcObject = stream;
        localStream = stream;
    }).catch(function (error) {
    //error
    console.error('mediaDevice.getUserMedia() error:', error);
    return;
});

//peerオブジェクトの作成
peer = new Peer({
    key:'97c45c5a-65b1-4daf-b4f2-0fbe158f5b28',
    debug: 3
});

//接続成功・失敗・切断時の処理
//openイベント
peer.on('open',function(){
    $('#my-id').text(peer.id);
});

//errorイベント
peer.on('error',function(err){
    alert(err.message);
});

//closeイベント
peer.on('close',function(){
});

//disconnectedイベント
peer.on('disconnected',function(){
});

//発信・切断・着信処理
//発信処理
$('#make-call').submit(function(e){
    e.preventDefault();
    const call = peer.call($('#callto-id').val());
    setupCallEventHandlers(call);
});

//切断処理
$('#end-call').click(function(){
    existingCall.close();
});

//着信処理
peer.on('call',function(call){
    call.answer(localStream);
    setupCallEventHandlers(call);
});

//callオブジェクトに必要なイベント
function setupCallEventHandlers(call){
    if(existingCall){
        existingCall.close();
    };

    existingCall = call;
    call.on('stream',function(stream){
        addVideo(call,stream);
        setupEndCallUI();
        $('#their-id').text(call.remoteId);
    });

    call.on('close',function(){
        removeVideo(calll.remoteId);
        setupMakeCallUI();
    });
}

//UIのセットアップ
//video要素の再生
function addVideo(call,stream){
    $('#their-video').get(0).srcObject = stream;
}

//video要素の削除
function removeVideo(peerId){
    $('#their-video').get(0).srcObject = undefined;
}

//ボタンの表示、非表示切替
function setupMakeCallUI(){
    $('#make-call').show();
    $('#end-call').hide();
}

function setupMakeCallUI(){
    $('#make-call').hide();
    $('#end-call').show();
}