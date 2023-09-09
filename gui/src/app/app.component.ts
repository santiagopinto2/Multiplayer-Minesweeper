import { Component, HostListener, OnInit } from '@angular/core';
import { ColorSchemeService } from './services/color-scheme.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {

    title = 'minesweeper';
    windowSize;
    
    constructor(public colorSchemeService: ColorSchemeService) {
        this.colorSchemeService.load();
    }

    ngOnInit() {
        this.windowSize = window.screen.width;
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.windowSize = event.target.innerWidth;
    }

    goToDiscord() {
        window.open('https://discord.gg/hW2r7Ssuaa', '_blank');
    }

    toggleDarkMode() {
        this.colorSchemeService.update(this.colorSchemeService.currentActive() === 'dark' ? 'light' : 'dark');
    }
}