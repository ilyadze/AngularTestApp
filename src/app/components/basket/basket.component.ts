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

  ngOnDestroy() {
    if (this.basketSubscription) this.basketSubscription.unsubscribe();
  }

  minusItemFromBasket(item: IProducts) {
    if (item.quantity === 1) {
      this.ProductsService.removeProductFromBasket(item.id).subscribe(
        (data) => {
          let idx = this.basket.findIndex((data) => data.id === item.id);
          this.basket.splice(idx, 1);
        }
      );
    } else {
      item.quantity -= 1;
      this.ProductsService.updateProductToBasket(item).subscribe((data) => {});
    }
  }

  plusItemFromBasket(item: IProducts) {
    item.quantity += 1;
    this.ProductsService.updateProductToBasket(item).subscribe((data) => {});
  }
}
