import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { qdtEnigma, qdtCapabilityApp, qdtCompose, QdtViz } from 'qdt-components';
import { JwtService } from '../core/services/jwt.service';

@Component({
  selector: 'app-qdt-component',
  template: `Loading...`,
  styles: []
})

export class QdtComponentsComponent implements OnInit {

  constructor(private elementRef: ElementRef, private jwtService: JwtService) { }

  static engineApiAppPromise: Promise<any>;
  static capabilityApiAppPromise: Promise<any>;

  @Input() component: any;
  @Input() properties: any;
  @Input() options: any;
  @Input() connection = 1;

  async init(): Promise<void> {
    const { component, properties, options, connection} = this;
    if (connection === 1) {
      const app = await QdtComponentsComponent.capabilityApiAppPromise;
      QdtViz({
        element: this.elementRef.nativeElement,
        app,
        options,
      });
    } else {
      const app = await QdtComponentsComponent.engineApiAppPromise;
      qdtCompose({
        element: this.elementRef.nativeElement,
        component,
        app,
        properties,
        options,
      });
    }
  }

  ngOnInit(): void {
    this.getQlik();
  }

  private getQlik(): void {
    this.jwtService.qlikConfig$.pipe().subscribe(config => {
      if (config) {
        QdtComponentsComponent.engineApiAppPromise = qdtEnigma(config);
        QdtComponentsComponent.capabilityApiAppPromise = qdtCapabilityApp(config);
        this.init();
      }
    });
    this.jwtService.GetQlikConfig();
  }
}
