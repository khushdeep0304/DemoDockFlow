import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { Route, RouterModule } from '@angular/router';
import { NgAisModule } from 'angular-instantsearch';
import { SharedModule } from 'app/shared/shared.module';
import { VenuesComponent } from './venues.component';


const venuesRoutes: Route[] = [
    {
        path: '',
        component: VenuesComponent,
        data: {
            title: { fr: 'Salles', en: 'Venues' }
        }
    }
];

@NgModule({
    declarations: [
        VenuesComponent
    ],
    imports: [
        NgAisModule,
        RouterModule.forChild(venuesRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatRippleModule,
        MatSortModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatTooltipModule,
        MatTableModule,
        SharedModule,


    ]
})
export class VenuesModule {
}
