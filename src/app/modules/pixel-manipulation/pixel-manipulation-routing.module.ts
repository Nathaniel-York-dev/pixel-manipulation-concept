import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {PixelManipulationComponent} from "./components/pixel-manipulation/pixel-manipulation.component";

const routes: Routes = [{
  path: '',
  component: PixelManipulationComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [],
})
export class PixelManipulationRoutingModule {}
