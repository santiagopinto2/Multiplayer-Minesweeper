import { NgModule } from "@angular/core";

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from "@angular/material/button";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FormsModule } from "@angular/forms";
import { MatListModule } from "@angular/material/list";
import { MatCardModule } from "@angular/material/card";
import { MatSnackBarModule } from "@angular/material/snack-bar";


@NgModule({
    declarations: [
    ],
    imports: [
        MatTableModule,
        MatIconModule,
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatCheckboxModule,
        FormsModule,
        MatListModule,
        MatCardModule,
        MatSnackBarModule
    ],
    exports: [
        MatTableModule,
        MatIconModule,
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatCheckboxModule,
        FormsModule,
        MatListModule,
        MatCardModule,
        MatSnackBarModule
    ]
})

export class SharedMaterialModule { }
