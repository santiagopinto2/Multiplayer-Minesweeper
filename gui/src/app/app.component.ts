import { Component, OnInit } from '@angular/core';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {

    title = 'minesweeper';
    
    constructor() {}

    goToDiscord() {
        window.open('https://discord.gg/hW2r7Ssuaa', '_blank');
    }
}