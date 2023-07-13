import { NgModule } from "@angular/core";

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from "@angular/material/button";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FormsModule } from "@angular/forms";
import { MatListModule } from "@angular/material/list";


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
        MatListModule
    ],
    exports: [
        MatTableModule,
        MatIconModule,
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatCheckboxModule,
        FormsModule,
        MatListModule
    ]
})

export class SharedMaterialModule { }
