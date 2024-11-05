import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
    exports: [
        MatFormFieldModule,
        MatInputModule,
        MatSlideToggleModule,
        MatDividerModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatDialogModule
    ]
})
export class MaterialModule { }