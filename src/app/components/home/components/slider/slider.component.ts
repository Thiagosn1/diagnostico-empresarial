import { Component, OnInit } from '@angular/core';

interface SliderItem {
  image: string;
}

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
})
export class SliderComponent implements OnInit {
  currentIndex = 0;
  private autoSlideInterval: any;
  private pauseDuration = 5000;

  items: SliderItem[] = [
    {
      image: 'assets/pexels.jpg',
    },
    {
      image: 'assets/freepik2.jpg',
    },
    {
      image: 'assets/freepik3.jpg',
    },
    {
      image: 'assets/unsplash3.jpg',
    },
  ];

  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  voltar(): void {
    this.currentIndex =
      this.currentIndex === 0 ? this.items.length - 1 : this.currentIndex - 1;
    this.resetAutoSlide();
  }

  avancar(): void {
    this.currentIndex =
      this.currentIndex === this.items.length - 1 ? 0 : this.currentIndex + 1;
    this.resetAutoSlide();
  }

  private startAutoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      this.avancar();
    }, 3000);
  }

  private stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  private resetAutoSlide(): void {
    this.stopAutoSlide();
    setTimeout(() => {
      this.startAutoSlide();
    }, this.pauseDuration);
  }
}
