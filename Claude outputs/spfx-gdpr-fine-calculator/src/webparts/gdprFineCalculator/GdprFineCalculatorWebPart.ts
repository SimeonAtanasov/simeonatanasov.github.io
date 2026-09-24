/* GDPR Fine Calculator, SharePoint Framework web part.

   A no framework web part: no React, no external library, no network call.
   The enforcement data is bundled in the package, so the web part works on a
   tenant with no outbound access and nothing a user types is transmitted
   anywhere.

   The calculation itself lives in ./calculator/calculator.ts, which is a
   straight port of the file behind the public version of this tool. Keeping it
   separate from the web part shell means the two builds can be diffed against
   each other when the data is refreshed. */

import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import { mountCalculator } from './calculator/calculator';
import { ensureStyles } from './calculator/styles';

export interface IGdprFineCalculatorWebPartProps {
  heading: string;
  showIntro: boolean;
  showHowTo: boolean;
  showMethod: boolean;
  defaultTurnover: string;
}

/* Below this the three selectors stop being readable side by side. A web part
   in a one third column on a wide screen is just as narrow as a phone, so the
   switch is driven by the web part's own width, not the viewport's. */
const NARROW_AT = 700;

export default class GdprFineCalculatorWebPart extends BaseClientSideWebPart<IGdprFineCalculatorWebPartProps> {

  public render(): void {
    ensureStyles();

    this.domElement.className = 'fc-spfx';
    this._applyWidth(this.domElement.clientWidth);

    mountCalculator(this.domElement, {
      prefix: 'fc-' + this.instanceId,
      heading: this.properties.heading,
      showIntro: this.properties.showIntro !== false,
      showHowTo: this.properties.showHowTo !== false,
      showMethod: this.properties.showMethod !== false,
      defaultTurnover: this.properties.defaultTurnover
    });
  }

  protected onAfterResize(newWidth: number): void {
    this._applyWidth(newWidth);
  }

  private _applyWidth(width: number): void {
    if (!this.domElement) { return; }
    const narrow = width > 0 && width < NARROW_AT;
    this.domElement.className = narrow ? 'fc-spfx fc-narrow' : 'fc-spfx';
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: 'Benchmark a turnover figure against published GDPR enforcement decisions.' },
          groups: [
            {
              groupName: 'Display',
              groupFields: [
                PropertyPaneTextField('heading', {
                  label: 'Heading',
                  description: 'Leave empty to show no heading, for instance when the page already has one.'
                }),
                PropertyPaneToggle('showIntro', {
                  label: 'Show the opening paragraph',
                  checked: this.properties.showIntro !== false
                }),
                PropertyPaneToggle('showHowTo', {
                  label: 'Show "How to use this"',
                  checked: this.properties.showHowTo !== false
                }),
                PropertyPaneToggle('showMethod', {
                  label: 'Show "How the number is worked out"',
                  description: 'The method notes and the limits of the tool. Worth leaving on: the caveats are the part people most need to read.',
                  checked: this.properties.showMethod !== false
                })
              ]
            },
            {
              groupName: 'Defaults',
              groupFields: [
                PropertyPaneTextField('defaultTurnover', {
                  label: 'Turnover to start with',
                  description: 'Optional. Accepts 20bn, 450m or a plain number. Leave empty for an empty box.'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
