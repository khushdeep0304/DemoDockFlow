import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoCoreModule } from 'app/core/transloco/transloco.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgAisModule } from 'angular-instantsearch';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslocoCoreModule,
        DragDropModule,
        //NgAisModule,



    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslocoCoreModule,
        DragDropModule,
        // NgAisModule,

    ]
})
export class SharedModule {
}
