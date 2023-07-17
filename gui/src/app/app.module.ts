import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedMaterialModule } from './shared-material/shared-material.module';
import { GameComponent } from './components/game/game.component';
import { PlayComponent } from './components/play/play.component';
import { AboutComponent } from './components/about/about.component';
import { MatchComponent } from './components/play/match/match.component';
import { LobbyComponent } from './components/lobby/lobby.component';


@NgModule({
    declarations: [
        AppComponent,
        GameComponent,
        PlayComponent,
        AboutComponent,
        MatchComponent,
        LobbyComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        SharedMaterialModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})

export class AppModule { }
