import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSliderModule} from '@angular/material/slider';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSnackBarModule} from '@angular/material/snack-bar';

@NgModule({
    imports: [
    BrowserAnimationsModule,
    // MatAutocompleteModule,
        // MatMenuModule,
        // MatNativeDateModule,
        // MatPaginatorModule,
        // MatProgressBarModule,
        // MatProgressSpinnerModule,
        // MatRadioModule,
        // MatRippleModule,
        MatSliderModule,
        // MatSlideToggleModule,
        // MatStepperModule,
        // MatSortModule,
        // MatTableModule,
        // MatTabsModule,
        // MatToolbarModule,
        MatTooltipModule,
        MatSnackBarModule
        // CdkTableModule
    ],
    exports: [
        // MatAutocompleteModule,
        // MatMenuModule,
        // MatNativeDateModule,
        // MatPaginatorModule,
        // MatProgressBarModule,
        // MatProgressSpinnerModule,
        // MatRadioModule,
        // MatRippleModule,
        // MatSelectModule,
        // MatSidenavModule,
        MatSliderModule,
        // MatSlideToggleModule,
        MatSnackBarModule,
        // MatStepperModule,
        // MatSortModule,
        // MatTableModule,
        // MatTabsModule,
        //  MatToolbarModule,
        MatTooltipModule,
        // CdkTableModule
    ],
    declarations: []
})

export class MaterialModule {}
