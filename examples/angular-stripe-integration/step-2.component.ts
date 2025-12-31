import { Component, inject, ViewChild } from '@angular/core';
import { environment } from '../../../../environments/environments.dev';
import { StripeElementsOptions, StripeElement, StripeElements, StripePaymentElementOptions } from '@stripe/stripe-js';
import { injectStripe, StripeElementsDirective, StripeService as NgxStripeService} from 'ngx-stripe';
import { CommonService } from '../../../core/services/common';
import { HttpService } from '../../../core/services/http';
import { StorageService } from '../../../core/services/storage';
import { Store } from '@ngrx/store';
import { bookingState, selectedCourse } from '../../../store/booking-states/booking.selectors';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-step-2',
  standalone: false,
  templateUrl: './step-2.html',
  styleUrl: './step-2.css',
})
export class Step2 {
  commonService = inject(CommonService);
  httpService = inject(HttpService);
  storageService = inject(StorageService);
  Store = inject(Store);
  stripeService = inject(NgxStripeService);
  
  paymentElementOptions: StripePaymentElementOptions = {
    layout: {
      type: 'tabs',
      defaultCollapsed: false,
      radios: false,
      spacedAccordionItems: false
    }
  };
  
  // ✅ FIXED: Initialize with undefined instead of using non-null assertion
  // This prevents the "Cannot convert undefined or null to object" error
  elementsOptions: StripeElementsOptions | undefined = undefined;
  
  bookingDetails: any;
  $destroy: Subject<void> = new Subject<void>();
  selectedTutorId: any;
  selectedCourse: any;
  currTimezoneAndOffset: { timezone: string; gmtOffset: string; };
  slotDuration: number;
  totalPayableAmount: any;
  tutorDetails: any;
  clientSecret: any;
  isStripeReady: boolean = false;
  stripeElement: StripeElements | undefined;
  
  constructor() {
    this.Store.select(bookingState).pipe(takeUntil(this.$destroy)).subscribe((res: any) => {
      this.selectedTutorId = res.selectedTutorId;
      this.bookingDetails = res;
    });
    this.Store.select(selectedCourse).pipe(takeUntil(this.$destroy)).subscribe((res: any) => {
      this.selectedCourse = res;
    })
    this.currTimezoneAndOffset = this.commonService.getUserTimezoneWithGMT();
    if (this.bookingDetails?.bookingType == 'TRIAL') {
      this.slotDuration = 30;
    }
    else {
      this.slotDuration = 60;
    }
  }

  ngOnInit() {
    this.calculatePaymentAmount();
    this.fetchTutorDetails();
    this.createCoursePaymentIntent();
  }
  
  fetchTutorDetails() {
    this.commonService.showPageLoader();
    this.httpService.get(`/student/user/teacher-details/${this.selectedTutorId}`).pipe(takeUntil(this.$destroy)).subscribe((res: any) => {
      this.commonService.hidePageLoader();
      this.tutorDetails = res.data;
    });
  }

  createToken() {
    // student_id,
    //   teacher_id,
    //   course_id,
    //   total_lessons,
    //   amount,
    //   currency = "gbp",
    //   lock_ids,
    //   booking_type,
    if (this.bookingDetails?.bookingType == "TRIAL") {
      // Handle trial booking
    }
    else {
      this.createCoursePaymentIntent();
    }
  }

  calculatePaymentAmount() {
    if (this.bookingDetails?.bookingType == "TRIAL") {
      this.totalPayableAmount = this.bookingDetails?.trialAmount
    }
    else {
      this.totalPayableAmount = this.selectedCourse.price;
    }
  }

  createCoursePaymentIntent() {
    const payload: any = {};
    console.log(this.selectedCourse.price)
    payload['teacher_id'] = this.selectedTutorId;
    payload['amount'] = 1400;
    payload['course_id'] = this.selectedCourse._id;
    payload['total_lessons'] = this.selectedCourse?.package?.package_lesson;
    payload['booking_type'] = this.bookingDetails.bookingType;
    
    this.commonService.showPageLoader();
    this.httpService.post("student/booking/create-course-payment-intent", payload).subscribe({
      next: (res: any) => {
        this.clientSecret = res.data.clientSecret;
        
        // ✅ FIXED: Properly initialize elementsOptions when client secret is received
        // Create a complete StripeElementsOptions object with all required properties
        this.elementsOptions = {
          locale: 'en',
          clientSecret: this.clientSecret,
          appearance: {
            theme: 'flat'
          }
        };
        
        this.commonService.hidePageLoader();
      },
      error: (error) => {
        // ✅ IMPROVEMENT: Added error handling
        console.error('Failed to create payment intent:', error);
        this.commonService.hidePageLoader();
        // You should show an error message to the user here
      }
    });
  }

  confirmPayment() {
    // Ensure stripe element is ready before confirming payment
    if (!this.stripeElement || !this.clientSecret) {
      console.error('Stripe elements not ready or client secret missing');
      return;
    }

    this.stripeService.confirmPayment({
      elements: this.stripeElement,
      clientSecret: this.clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
      redirect: 'always'
    }).subscribe((result: any) => {
      if (result.error) {
        console.error(result.error.message);
        return;
      }

      if (result.paymentIntent?.status === 'succeeded') {
        console.log('💰 PAYMENT SUCCESS');
      }
    });
  }

  stripeReady() {
    console.log("stripe ready ")
    this.isStripeReady = true;
  }

  onElementsReady(event: any) {
    console.log("STRIPE ELEMENT ::" , event);
    this.stripeElement = event;
  }

  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
