import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PixelManipulationComponent } from './components/pixel-manipulation/pixel-manipulation.component';
import {PixelManipulationRoutingModule} from "./pixel-manipulation-routing.module";



@NgModule({
  declarations: [
    PixelManipulationComponent
  ],
  imports: [
    CommonModule,
    PixelManipulationRoutingModule
  ]
})
export class PixelManipulationModule { }
