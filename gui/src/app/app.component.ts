import { AfterViewInit, ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { ColorSchemeService } from './services/color-scheme/color-scheme.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {

    title = 'minesweeper';
    windowSize;
    
    constructor(public colorSchemeService: ColorSchemeService, private cdr: ChangeDetectorRef) {
        this.colorSchemeService.load();
    }

    ngAfterViewInit() {
        this.windowSize = window.screen.width;
        this.cdr.detectChanges();
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