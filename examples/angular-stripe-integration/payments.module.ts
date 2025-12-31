import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxStripeModule } from 'ngx-stripe';
import { environment } from '../../../environments/environments.dev';
import { PaymentSteps } from './payment-steps.component';
import { Step1 } from './step-1/step-1.component';
import { Step2 } from './step-2/step-2.component';
import { Step3 } from './step-3/step-3.component';
import { PaymentsRoutingModule } from './payments-routing.module';
import { Stepper } from '../../shared/components/stepper.component';
import { TutorAvailability } from '../../shared/components/tutor-availability.component';

@NgModule({
  declarations: [
    PaymentSteps,
    Step1,
    Step2,
    Step3
  ],
  imports: [
    CommonModule,
    PaymentsRoutingModule,
    Stepper,
    TutorAvailability,
    // ✅ IMPORTANT: Ensure NgxStripeModule is properly configured with your publishable key
    NgxStripeModule.forRoot(environment.STRIPE_PUBLISH_KEY),
  ]
})
export class PaymentsModule { }
