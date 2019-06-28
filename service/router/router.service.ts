import { Injectable } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Injectable()
export class RouterService {

  constructor(protected router: Router) { }

  
  get url(): any {
    return this.router.url;
  }
  
  //fix angular bug
  navigateByUrl(link: string){
    this.router.routeReuseStrategy.shouldReuseRoute = function(){ return false; };

    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
          this.router.navigated = false;
          window.scrollTo(0, 0);
      }
    });

    this.router.navigateByUrl(link)
  }

}
