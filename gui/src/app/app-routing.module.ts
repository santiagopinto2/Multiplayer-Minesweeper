import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayComponent } from './components/play/play.component';
import { AboutComponent } from './components/about/about.component';
import { LobbyComponent } from './components/lobby/lobby.component';

const routes: Routes = [
    { path: 'play/:id', component: PlayComponent },
    { path: 'about', component: AboutComponent },
    { path: 'lobby', component: LobbyComponent },
    { path: '', redirectTo: '/about', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
