import { NgModule } from "@angular/core";

import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatLegacyCheckboxModule as MatCheckboxModule } from "@angular/material/legacy-checkbox";
import { FormsModule } from "@angular/forms";
import { MatLegacyListModule as MatListModule } from "@angular/material/legacy-list";
import { MatLegacyCardModule as MatCardModule } from "@angular/material/legacy-card";
import { MatLegacySnackBarModule as MatSnackBarModule } from "@angular/material/legacy-snack-bar";


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
