import { Component, OnInit } from '@angular/core';
import { ColorSchemeService } from 'src/app/services/color-scheme/color-scheme.service';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

    constructor(private colorSchemeService :ColorSchemeService) { }

    ngOnInit(): void {
    }

    getImage(imgCount) {
        let imagePath = `assets/images/about-page/${imgCount}-`;
        imagePath += this.colorSchemeService.currentActive();
        imagePath += window.screen.width >= 992 ? '-landscape' : '-vertical';
        imagePath += '.png';
        return imagePath;
    }
}
