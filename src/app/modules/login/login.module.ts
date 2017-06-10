import { FormsModule } from '@angular/forms';
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { loginComponent } from "./login.component";

@NgModule({
    declarations: [loginComponent],
    imports: [BrowserModule, FormsModule],
})

export class LoginModule { }