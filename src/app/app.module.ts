import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatButtonModule, MatButtonToggleModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatDatepickerModule, MatDialogModule, MatExpansionModule, MatIconModule, MatListModule, MatNativeDateModule, MatPaginatorModule, MatProgressSpinnerModule, MatRadioModule, MatRippleModule, MatSelectModule, MatSlideToggleModule, MatTableModule, MatTooltipModule, MatSnackBarModule, MatGridListModule, MatDividerModule, MatTabsModule } from '@angular/material';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,MatButtonModule, 
    MatButtonToggleModule, 
    MatCardModule, 
    MatCheckboxModule, 
    MatChipsModule, 
    MatDatepickerModule, 
    MatDialogModule, 
    MatExpansionModule, 
    MatIconModule, 
    MatListModule, 
    MatNativeDateModule, 
    MatPaginatorModule, 
    MatProgressSpinnerModule, 
    MatRadioModule, 
    MatRippleModule, 
    MatSelectModule, 
    MatSlideToggleModule, 
    MatTableModule, 
    MatTooltipModule, 
    MatSnackBarModule, 
    MatGridListModule, 
    MatDividerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
