import { Component, OnInit } from '@angular/core';

// Interface para definir o formato dos itens do slider
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

  // Índice do item atual
  currentIndex = 0;

  ngOnInit(): void {}

  voltar(): void {
    // Se o índice atual for 0, voltamos ao último item
    this.currentIndex =
      this.currentIndex === 0 ? this.items.length - 1 : this.currentIndex - 1;
  }

  avancar(): void {
    // Se o índice atual for o último, voltamos para o primeiro item
    this.currentIndex =
      this.currentIndex === this.items.length - 1 ? 0 : this.currentIndex + 1;
  }
}
