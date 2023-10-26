import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { IProducts } from 'src/app/models/products';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss'],
})
export class BasketComponent implements OnInit {
  constructor(private ProductsService: ProductsService) {}
  basket: IProducts[];
  basketSubscription: Subscription;
  ngOnInit(): void {
    this.basketSubscription =
      this.ProductsService.getProductsFromBasket().subscribe((data) => {
        this.basket = data;
      });
  }
}
