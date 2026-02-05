import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CabinetSettingsComponent } from './components/cabinet-settings/cabinet-settings.component';
import { PreferencesSettingsComponent } from './components/preferences-settings/preferences-settings.component';
import { SecuritySettingsComponent } from './components/security-settings/security-settings.component';

@Component({
  selector: 'app-parametres',
  standalone: true,
  imports: [CommonModule, CabinetSettingsComponent, PreferencesSettingsComponent, SecuritySettingsComponent],
  templateUrl: './parametres.component.html',
  styleUrls: ['./parametres.component.css'],
})
export class ParametresComponent {}
