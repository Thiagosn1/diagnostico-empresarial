import { Component, OnInit } from '@angular/core';

interface SliderItem {
  title: string;
  description: string;
  color: string;
}

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
})
export class SliderComponent implements OnInit {
  items: SliderItem[] = [
    {
      title: 'Item 1',
      description: 'Descrição do Item 1',
      color: '#f44336',
    },
    {
      title: 'Item 2',
      description: 'Descrição do Item 2',
      color: '#4caf50',
    },
    {
      title: 'Item 3',
      description: 'Descrição do Item 3',
      color: '#2196f3',
    },
  ];

  currentIndex = 0;

  ngOnInit(): void {}

  voltar(): void {
    this.currentIndex =
      this.currentIndex === 0 ? this.items.length - 1 : this.currentIndex - 1;
  }

  avancar(): void {
    this.currentIndex =
      this.currentIndex === this.items.length - 1 ? 0 : this.currentIndex + 1;
  }
}
