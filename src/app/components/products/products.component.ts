import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { IProducts } from 'src/app/models/products';
import { ProductsService } from 'src/app/services/products.service';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  products: IProducts[];
  productsSubsciption: Subscription;
  basket: IProducts[];
  basketSubsciption: Subscription;

  canEdit: boolean = true;

  constructor(
    private ProductService: ProductsService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.productsSubsciption = this.ProductService.getProducts().subscribe(
      (data) => {
        this.products = data;
      }
    );
    this.basketSubsciption =
      this.ProductService.getProductsFromBasket().subscribe((data) => {
        this.basket = data;
      });
  }

  addToBasket(product: IProducts) {
    product.quantity = 1;
    let findItem;

    if (this.basket.length > 0) {
      findItem = this.basket.find((item) => item.id === product.id);
      if (findItem) this.updateToBasket(findItem);
      else this.postToBasket(product);
    } else this.postToBasket(product);
  }

  postToBasket(product: IProducts) {
    this.ProductService.postProductToBasket(product).subscribe((data) => {
      this.basket.push(data);
    });
  }

  updateToBasket(product: IProducts) {
    product.quantity += 1;
    this.ProductService.updateProductToBasket(product).subscribe((data) => {});
  }

  openDialog(product?: IProducts): void {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.disableClose = true;
    dialogConfig.data = product;

    const dialogRef = this.dialog.open(DialogBoxComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        if (data && data.id) this.updateData(data);
        else this.postData(data);
      }
    });
  }

  postData(data: IProducts) {
    this.ProductService.postProduct(data).subscribe((data) =>
      this.products.push(data)
    );
  }

  updateData(product: IProducts) {
    this.ProductService.updateProduct(product).subscribe((data) => {
      this.products = this.products.map((product) => {
        if (product.id === data.id) return data;
        else return product;
      });
    });
  }

  deleteItem(id: number) {
    this.ProductService.deleteProduct(id).subscribe(() =>
      this.products.find((item) => {
        if (id === item.id) {
          let idx = this.products.findIndex((data) => data.id === id);
          this.products.splice(idx, 1);
        }
      })
    );
  }

  ngOnDestroy() {
    if (this.productsSubsciption) this.productsSubsciption.unsubscribe();
    if (this.basketSubsciption) this.basketSubsciption.unsubscribe();
  }
}
