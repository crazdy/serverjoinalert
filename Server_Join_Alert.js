registerPlugin({
 name: 'Server Join Alert Türkçe Versiyon',
 version: '1.0',
 description: 'Sunucuya yeni birisi giriş yaptığında yetkililere dm veya poke gönderilir.',
 author: 'Smorrebrod || Cedrik <crazdy@protonmail.com>',
vars:[{
        name: 'guestGroup',
        title: 'Guest Group',
        type: 'string'
    },
    {
        name: 'channel',
        title: 'Channel',
        type: 'channel'
    },
    {
        name: 'alertGroups',
        title: 'Admin Groups',
        type: 'strings'
    },
    {
        name: 'messageType',
        title: 'Kullanıcılara mesaj(pm) ya da poke'den hangisi gönderilsin?',
        type: 'select',
        options: [
            'PM',
            'Poke'
        ]
    }
]

}, function(sinusbot, config) {
    var engine = require('engine');
    var backend = require('backend');
    var event = require('event');
    event.on('clientMove', function(ev) {
        if (ev.client.isSelf()) {
            return;
        }
        if (ev.toChannel){
            if (ev.toChannel.id() == config.channel){
                if (checkIfInNoServerGroup(ev.client, config.guestGroup)){
                    var clients = backend.getClients();
                    clients.forEach(function(client) {
                        alertClient(client, config.alertGroups, ev.client);
                    });
                }
            }
        }
    });
   
    function alertClient(client, alertGroups, newClient){
        var serverGroups = client.getServerGroups();
        for (var serverGroup in serverGroups){
            for (var listenGroup in alertGroups){
                if (serverGroups[serverGroup].id() == alertGroups[listenGroup]){
                    if (config.messageType == 0){
                        client.chat(''+newClient.name()+' giriş yaptı!');
                    }else{
                        client.poke(''+newClient.name()+' giriş yaptı!');
                    }
                    return;
                }
            }
        }    
    }    
   
    function checkIfInNoServerGroup(client, guestGroup){
        var serverGroups = client.getServerGroups();
        for (var serverGroup in serverGroups){
            if (serverGroups[serverGroup].id() != guestGroup){
                return false;
            }else{
                return true;
            }
        }
        return true;
    }
    
});
