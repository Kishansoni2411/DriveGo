
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from './features/layout/layout.component';
import { OnInit ,Component } from '@angular/core';
import { SignalRService } from './services/signal-r.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,LayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})


export class AppComponent implements OnInit {
  constructor(private signalRService: SignalRService) {}

  ngOnInit() {
    this.signalRService.startConnection(); // Start the SignalR connection when the component initializes
  }
}