import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-lobby',
    templateUrl: './lobby.component.html',
    styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {


    codeFormControl = new FormGroup({
        code: new FormControl('', Validators.required)
    });
    code = this.codeFormControl.get('code');


    constructor(private router: Router) { }

    ngOnInit(): void {
    }

    goToGame() {
        this.router.navigate(['/play', this.code.value.toUpperCase()]);
    }
}
