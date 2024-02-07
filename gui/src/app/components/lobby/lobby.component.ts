import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalService } from 'src/app/services/local/local.service';

@Component({
    selector: 'app-lobby',
    templateUrl: './lobby.component.html',
    styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {


    lobbyFormControl = new FormGroup({
        name: new FormControl('', Validators.required),
        code: new FormControl('', Validators.required)
    });
    name = this.lobbyFormControl.get('name');
    code = this.lobbyFormControl.get('code');


    constructor(private router: Router, private localStorage: LocalService) { }

    ngOnInit(): void {
        if (!!this.localStorage.getData('name')) this.name.setValue(this.localStorage.getData('name'));
    }

    goToGame() {
        this.localStorage.setData('name', this.name.value);
        this.router.navigate(['/play', this.code.value.toUpperCase()]);
    }
}
