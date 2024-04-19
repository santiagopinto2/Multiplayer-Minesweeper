import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SocketioService } from 'src/app/services/socketio/socketio.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent {

    gameId: string;
    /* messages = [{ id: 0, name: "Fable", text: "hahaha" }, { id: 1, name: "GOOSE!", text: "test" }]; */
    messages = [];
    newMessage = '';

    @Input() playerId = -1;
    @Input() playersInfo = [];



    constructor(
        private socketIoService: SocketioService,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.gameId = this.route.snapshot.paramMap.get('id');
        this.receiveMessage();
    }

    sendMessage() {
        if (this.newMessage === '' || this.newMessage.trim().length == 0) return;
        this.socketIoService.sendMessage(this.gameId, { id: this.playerId, name: this.playersInfo[this.playerId].name, message: this.newMessage });
        this.newMessage = '';
    }

    receiveMessage() {
        this.socketIoService.receiveMessage().subscribe(async (data: any) => {
            if (!environment.production) console.log('receiveMessage', data);
            this.messages.push(data);
            await this.sleep(1);
            let messageHistory = document.getElementById('messageHistory');
            messageHistory.scrollTop = messageHistory.scrollHeight;
        });
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
