import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "@nativescript/angular";
import { NativeScriptAnimationsModule } from "@nativescript/angular/animations";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { SupportComponent } from './support/support.component';

import { NativeScriptDebug } from "@nativescript/angular/trace";
import { setCategories, enable } from "@nativescript/core/trace";
setCategories(NativeScriptDebug.animationsTraceCategory);
enable();

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SupportComponent
  ],
  bootstrap: [AppComponent],
  imports: [
    NativeScriptModule,
    NativeScriptAnimationsModule,
    AppRoutingModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule { }
